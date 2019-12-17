//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Mixin                        from 'utils/mixin.util'
// import SyncMixin                    from 'mixins/sync-data.mixin'
import RouterMixin                  from 'mixins/router.mixin'
import SourceMixin                  from 'mixins/source.mixin'
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

const arrSrc = [
    { key: 'bg', value: 'sjtb-explain-bg.jpg' },
];

Page(Mixin({
    data: {
        infoList: '',
        contextList: '',
        result: [],
    },
    mixins: [
        BleMixin,
        // SyncMixin,
        RouterMixin,
        SourceMixin,
    ],
    onLoad (options) {
        this.sourceGet(arrSrc);
        this.routerGetParams(options);
        this.getStatus();
    },
    getStatus () {
        let { deviceId, serviceId } = this.data.params$;
        this.bleGetStatus(deviceId, serviceId).then((res) => {
            console.log('取特征值成功', res);
        }).catch((err) => {
            console.log('取特征值失败', err);
        });
    },
    handleSync1 () {
        Loading.showLoading();
        Authorize(Authorize.SCOPE.userLocation, '同步数据需要地理位置授权').then(() => {
            let { deviceId, serviceId } = this.data.params$;
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
        }).catch((err) => {
            Loading.hideLoading();
            let { errCode } = err;
            if (errCode === -999) return Modal.toast('您还未配对过设备，请先去配对设备');
            Modal.toast('同步数据需要地理位置授权哦')
        });
    },
    processingData() {
        let { infoList, contextList } = this.data;
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
            } = info;
            let index;
            let date =`${year}/${month}/${day} ${hour}:${minute}:${second}`;
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
                BuleRecordId: info.sequence,
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
        Auth.getToken().then((res) => {
            let { OpenId } = res;
            data.forEach((item) => {
                item.OpenId = OpenId
            });
            return Http(Http.API.Do_setTestSugarList, data, {
                useOpenId: false,
                useAuth: false,
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
            setTimeout(() => {
                if (this.data.params$ && this.data.params$.from === 'bluetooth_add_index') return Router.pop(3);
                if (this.data.params$ && this.data.params$.from === 'bluetooth_index') return Router.pop(2);
                this.initData && this.initData();
            }, 1000);
        }).catch((err) => {
            Modal.toast(err);
        }).finally(() => {
            this.setData({
                infoList: [],
                contextList: [],
            })
        });
    }
}));
