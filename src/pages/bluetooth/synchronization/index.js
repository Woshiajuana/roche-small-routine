//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Mixin                        from 'utils/mixin.util'
import RouterMixin                  from 'mixins/router.mixin'
import DeviceMixin                  from 'mixins/device.mixin'
import BleMixin                     from 'mixins/ble.mixin'
import Modal                        from 'plugins/modal.plugin'
import Http                         from 'plugins/http.plugin'
import Loading                      from 'plugins/loading.plugin'
import Authorize                    from 'plugins/authorize.plugin'
import { formatData }               from "wow-cool/lib/date.lib";
import WowCool                      from "wow-cool/lib/array.lib";
import Auth                         from 'plugins/auth.plugin'
import Store                        from 'plugins/store.plugin'
import Router                       from 'plugins/router.plugin'

import {
    $BLUE_TOOTH_DEVICE_ID_LIST,
    $BLUE_TOOTH_DATA,
}                                   from 'config/store.config'
import {
    ARR_TIME_STEP,
    ARR_TIME_STEP_KEY,
}                                   from 'config/base.config'

Page(Mixin({
    data: {
        infoList: '',
        contextList: '',
        result: [],
        isPop: false,
        deviceId: '',
        blueTooth: '',
    },
    mixins: [
        BleMixin,
        DeviceMixin,
        RouterMixin,
    ],
    onLoad (options) {
        this.routerGetParams(options);
        // this.getStatus();
    },
    onShow () {
        if (this.data.isPop) {
            let { from, preFrom } = this.data.params$;
            if (preFrom === 'lottery_index') {
                return Router.pop(2);
            }
            if (from === 'lottery_index') {
                return Router.pop();
            }
            if (from === 'bluetooth_add_index')
                return Router.pop(4);
            return Router.pop(2);
        }
    },
    getStatus () {
        let { deviceId, serviceId } = this.data.params$;
        if (deviceId && serviceId) {
            this.bleGetStatus(deviceId, serviceId).then((res) => {
                console.log('取特征值成功', res);
            }).catch((err) => {
                console.log('取特征值失败', err);
            });
        }
    },
    handleSync () {
        Loading.showLoading({title: '正在同步数据...'});
        Authorize(Authorize.SCOPE.userLocation, '同步数据需要地理位置授权').then(() => {
            let { params$ } = this.data;
            let { deviceId, serviceId } = params$;
            if (deviceId && serviceId && false) {
                return this.syncDataByDeviceId(deviceId, serviceId);
            }
            let blueTooth = '';
            // 搜索蓝牙
            this.bleSearchRoche().then((res) => {
                console.log('蓝牙搜索结果', res);
                blueTooth = res[0] || '';
                // 链接蓝牙
                this.blePairRoche(blueTooth.deviceId).then((res) => {
                    console.log('链接成功 => ', res);
                    blueTooth.serviceId =  res;
                    this.setData({deviceId: blueTooth.deviceId, blueTooth});
                    return this.bleGetStatus(blueTooth.deviceId, res)
                }).then((res) => {
                    console.log('取特征值成功 => ', res);
                    this.syncDataByDeviceId(blueTooth.deviceId, blueTooth.serviceId);
                }).catch(() => {
                    Loading.hideLoading();
                    Modal.confirm({
                        content: '很抱歉同步数据失败，请确保是配对设备成功后，再来同步数据的哦...',
                        confirmText: '我知道了',
                        showCancel: false,
                    }).then().null();
                });
            }).catch(() => {
                Loading.hideLoading();
                Modal.confirm({
                    content: '需要打开蓝牙，请确认手机蓝牙是否已打开？',
                }).then((res) => {
                    let { cancel, confirm } = res;
                    confirm && this.handleSync();
                    cancel && Router.pop();
                });
            })
        }).catch((err) => {
            Loading.hideLoading();
            let { errCode } = err;
            if (errCode === -999) return Modal.toast('您还未配对过设备，请先去配对设备');
            Modal.toast('同步数据需要地理位置授权哦')
        });
    },
    syncDataByDeviceId (deviceId, serviceId) {
        this.bleSyncData(deviceId, serviceId, (res) => {
            this.setData({infoList: res || []});
            console.log('成功1', res);
            this.processingData();
        },(res) => {
            this.setData({contextList: res || []});
            console.log('成功2', res);
            this.processingData();
        },(err) => {
            Modal.toast('读取数据失败');
            console.log('失败', err);
        });
    },
    processingData() {
        let { infoList, contextList, params$, deviceId  } = this.data;
        if (!infoList || !contextList) return;
        infoList.forEach((info) => {
            contextList.forEach((context) => {
                if (info.sequence === context.sequence) {
                    info.mealData = context.mealData;
                }
            })
        });
        let result = [];
        infoList.forEach((info) => {
            let {
                mealData,
                year,
                month,
                day,
                hour,
                minute,
                second,
                timeOffset,
            } = info;
            let index;
            if (!timeOffset) timeOffset = 0;
            let date =`${year}/${month}/${day} ${hour}:${minute}:${second}`;
            date = new Date(date).getTime() + (timeOffset * 60 * 1000);
            let cur = formatData('hh:dd', new Date(date));
            cur = +cur.replace(':', '');
            switch (mealData) {
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
                BuleRecordId: `${ deviceId }_${ info.sequence }`,
                Bloodsugar: +info.glucoseConcentration.toFixed(1),
                TimeStep: index + 1,
                TestDate: formatData('yyyy-MM-dd', new Date(date)),
                TestTime: formatData('hh:mm', new Date(date)),
                Remark: '',
                BuleBack: JSON.stringify(info),
            });
        });
        this.setData({ result });
        this.setTestSugarList();
    },
    setTestSugarList() {
        let data = this.data.result;
        Loading.hideLoading();
        Loading.showLoading({title: '正在上传数据...'});
        let { blueTooth, params$ } = this.data;
        let { from, preFrom } = params$;
        Auth.getToken().then((res) => {
            let { OpenId } = res;
            data.forEach((item) => {
                item.OpenId = OpenId
            });
            let options = data;
            let url = Http.API.Do_setTestSugarList;
            if (preFrom === 'lottery_index' || from === 'lottery_index') {
                let { name, deviceId } = blueTooth;
                options = {
                    MachineCode: name,
                    MachineId: deviceId,
                    BloodSugars: data,
                };
                url = Http.API.Do_SetTestSugarListByActivity;
            }
            return Http(url, options, {
                useOpenId: false,
                useAuth: false,
                loading: false,
            });
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
            this.setData({ isPop: true });
            setTimeout(() => {
                if (preFrom === 'lottery_index' || from === 'lottery_index') {
                    return Router.push('lottery_share_index');
                }
                return Router.push('bluetooth_transfer_index');
                // if (this.data.params$ && this.data.params$.from === 'bluetooth_add_index')
                //     return Router.pop(4);
                // return Router.pop(2);
                // this.initData && this.initData();
            }, 1000);
        }).catch((err) => {
            Modal.toast(err);
        }).finally(() => {
            this.setData({
                infoList: [],
                contextList: [],
            });
        });
    }
}));
