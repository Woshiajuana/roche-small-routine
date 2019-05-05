import SDK, { EVENT_NAME }          from 'services/sdk.services'
import Loading                      from 'plugins/loading.plugin'
import Modal                        from 'plugins/modal.plugin'
import Http                         from 'plugins/http.plugin'
import { formatData }               from 'wow-cool/lib/date.lib'
import WowCool                      from 'wow-cool/lib/array.lib'
import Router                       from 'plugins/router.plugin'
import Auth                         from 'plugins/auth.plugin'
import Store                        from 'plugins/store.plugin'
import Authorize, { SCOPE }         from 'plugins/authorize.plugin'
import {
    $BLUE_TOOTH_DEVICE_ID_LIST,
    $BLUE_TOOTH_DATA,
}                                   from 'config/store.config'
import {
    ARR_TIME_STEP,
    ARR_TIME_STEP_KEY,
}                                   from 'config/base.config'

const EVENT_FUN = {};

export default {
    data: {
        infoList: [],
        contextList: [],
        result: [],
        tapType: false,
    },
    // 同步血糖
    handleSync () {
        if (this.data.tapType) return;
        this.setData({tapType: true});
        Authorize(SCOPE.userLocation, '同步数据需要地理位置授权').then(() => {
            return Store.get($BLUE_TOOTH_DEVICE_ID_LIST);
        }).then(() => {
            this.syncData();
        }).catch((err) => {
            let { errCode } = err;
            if (errCode === -999) return Modal.toast('您还未配对过设备，请先去配对设备');
            Modal.toast('同步数据需要地理位置授权哦')
        });
    },
    // 同步数据
    syncData () {
        Loading.showLoading();
        Store.get($BLUE_TOOTH_DEVICE_ID_LIST).then((res) => {
            let blueTooth = res[0];
            if(!blueTooth) return Modal.toast('您还未配对过设备，请先去配对设备');
            return SDK.syncData(blueTooth.deviceId)
        }).then((res) => {
            Loading.showLoading();
            this.monitorEvent();
        }).catch((e) => {
            console.log(e);
            let err = e || {};
            this.destroyEvent();
            Loading.hideLoading();
            this.errorHandle(err);
        })
    },
    errorHandle ({ errMsg, errCode }) {
        if (errMsg === 'openBluetoothAdapter:fail:ble not available') {
            Modal.confirm({
                content: '同步数据需要打开蓝牙，请确认手机蓝牙是否已打开？',
            }).then((res) => {
                let { confirm } = res;
                confirm && this.syncData();
            });
            return;
        }
        if (errCode === 10000) return Modal.toast('未初始化蓝牙适配器');
        if (errCode === 10001) return Modal.toast('当前蓝牙适配器不可用');
        if (errCode === 10002) return Modal.toast('没有找到指定设备');
        if (errCode === 10003) return Modal.toast('连接失败');
        if (errCode === 10004) return Modal.toast('没有找到指定服务');
        if (errCode === 10005) return Modal.toast('没有找到指定特征值');
        if (errCode === 10006) return Modal.toast('当前连接已断开');
        if (errCode === 10007) return Modal.toast('当前特征值不支持此操作');
        if (errCode === 10008) return Modal.toast('其余所有系统上报的异常');
        if (errCode === 10009) return Modal.toast('您的手机不支持设备');
        if (errCode === 10012) return Modal.toast('连接超时，请重新再试');
    },
    // 监听事件
    monitorEvent () {
        for (let key in EVENT_NAME) {
            let event = EVENT_NAME[key];
            let name = key.substring(0, 1) + key.substring(1).toLocaleLowerCase();
            EVENT_FUN[key] = this[`on${name}Handle`].bind(this);
            SDK.on(event, EVENT_FUN[key]);
        }
    },
    // 错误事件
    onErrorHandle (e) {
        Modal.toast(e);
        Loading.hideLoading();
        console.log('错误事件', e);
        this.destroyEvent();
    },
    // 成功结束
    onEndHandle (e) {
        console.log('成功结束', e);
        Loading.hideLoading();
        this.destroyEvent();
        this.processingData();
        this.setTestSugarList();
    },
    // 处理数据
    processingData() {
        let { infoList, contextList } = this.data;
        infoList.forEach((info) => {
            contextList.forEach((context) => {
                if (info.seqNum === context.seqNum) {
                    info.mealPoint = context.mealPoint;
                    info.flag = context.flag;
                }
            })
        });
        let result = [];
        infoList.forEach((info) => {
            let { date,
                mealPoint,
            } = info;
            let index;
            date = date.replace(/-/g, '\/');
            let cur = formatData('hh:dd', new Date(date));
            cur = +cur.replace(':', '');
            switch (mealPoint) {
                case 5:
                    index = 6;
                    break;
                case 3:
                    index = 0;
                    break;
                case 1:
                    if (cur >= 0 && cur <= 1430) index = 2;
                    else index = 4;
                    break;
                case 2:
                    if (cur >= 0 && cur <= 1200) index = 1;
                    else if (cur >= 1201 && cur <= 1700) index = 3;
                    else index = 5;
                    break;
                default:
                    index = WowCool.findFirstIndexForArr(ARR_TIME_STEP_KEY, (item) => {
                        let { start, end } = item;
                        start = +start.replace(':', '');
                        end = +end.replace(':', '');
                        return (cur >= start && cur <= end);
                    });
                    break;
            }
            result.push({
                BuleRecordId: info.seqNum,
                Bloodsugar: +info.data.toFixed(1),
                TimeStep: index + 1,
                TestDate: formatData('yyyy-MM-dd', new Date(date)),
                TestTime: formatData('hh:mm', new Date(date)),
                Remark: '',
                BuleBack: JSON.stringify(info),
            })
        });
        this.setData({result});
    },
    // 处理数据
    setTestSugarList() {
        let data = this.data.result;
        Auth.getToken().then((res) => {
            let { OpenId } = res;
            data.forEach((item) => {
                item.OpenId = OpenId
            });
            let options = {
                url: 'RocheApi/SetTestSugarList',
                loading: false,
                data,
                useOpenId: false,
                auth: false,
            };
            return Http(options)
        }).then((res) => {
            let data = res || [];
            data.forEach((item) => {
                if (item.TestDate) {
                    item.TestDate = item.TestDate.replace(/[^0-9]/ig, '');
                    item.TestDateShow = formatData('yyyy-MM-dd', new Date(+item.TestDate)) + ' ' + item.TestTime;
                    item.TestDate = formatData('yyyy-MM-dd', new Date(+item.TestDate));
                }
                if (item.Bloodsugar) {
                    item.Bloodsugar = item.Bloodsugar.toFixed(1);
                }
            });
            return Store.set($BLUE_TOOTH_DATA, data);
        }).then(() => {
            Modal.toast('页面数据传输成功');
            if (this.data.params$ && this.data.params$.from === 'bluetooth_add_index') return Router.pop(3);
            if (this.data.params$ && this.data.params$.from === 'bluetooth_index') return Router.pop();
            this.initData && this.initData();
        }).catch((err) => {
            Modal.toast(err);
        }).finally(() => {
            this.setData({
                infoList: [],
                contextList: [],
            })
        });
    },
    // 连接状态的改变事件
    onChangeHandle (e) {
        console.log('连接状态的改变事件', e);
    },
    // 详情事件
    onInfoHandle (e) {
        Loading.showLoading();
        let infoList = this.data.infoList;
        infoList.push(e);
        this.setData({infoList});
        console.log('详情事件', e);
    },
    // 附加信息事件
    onContextHandle (e) {
        Loading.showLoading();
        let contextList = this.data.contextList;
        contextList.push(e);
        this.setData({contextList});
        console.log('附加信息事件', e);
    },
    onUnload () {
        this.closeDevice();
        this.destroyEvent();
    },
    closeDevice () {
        Store.get($BLUE_TOOTH_DEVICE_ID_LIST).then((res) => {
            let blueTooth = res[0];
            SDK.disconnectDevice(blueTooth.deviceId);
        }).then((res) => {
            console.log('断开蓝牙链接成功',res);
        }).catch((err) => {
            console.log('断开蓝牙链接失败',err);
        });
    },
    // 销毁事件
    destroyEvent () {
        this.setData({tapType: false});
        for (let key in EVENT_FUN) {
            let eventName = EVENT_NAME[key];
            let eventFun = EVENT_FUN[key];
            console.log('调用了销毁事件',eventName,eventFun);
            SDK.off(eventName, eventFun);
        }
    }
}
