//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                       from 'plugins/router.plugin'
import Modal                        from 'plugins/modal.plugin'
import Mixin                        from 'utils/mixin.util'
import InputMixin                   from 'mixins/input.mixin'
import SourceMixin                  from 'mixins/source.mixin'
import RouterMixin                  from 'mixins/router.mixin'
import BleMixin                     from 'mixins/ble.mixin'
import Loading                      from 'plugins/loading.plugin'
import DeviceMixin                  from 'mixins/device.mixin'
import Http                         from 'plugins/http.plugin'
import Store                        from 'plugins/store.plugin'
const app = getApp();

const arrSrc = [
    { key: 'icon', value: 'lylj-ing-icon.jpg' },
    { key: 'nIcon', value: 'lylj-null-icon.jpg' },
    { key: 'result', value: 'lylj-result-icon.jpg' },
];

Page(Mixin({
    mixins: [
        BleMixin,
        InputMixin,
        RouterMixin,
        SourceMixin,
        DeviceMixin,
    ],
    data: {
        blueTooth: '',
        isPop: false,
        isPopup: false, // 弹窗
        isComplete: false, // 弹窗
    },
    onLoad (options) {
        this.routerGetParams(options);
        this.searchRoche();
        this.sourceGet(arrSrc);
    },
    searchRoche () {
        this.setData({ blueTooth: '' });
        let blueTooth = '';
        // 搜索蓝牙
        this.bleSearchRoche().then((e) => {
            blueTooth = e[0] || '';
            if (blueTooth && this.data.params$.from === 'lottery_index' && blueTooth.name.indexOf('meter+') === -1) {
                blueTooth = '';
            }
            console.log('搜索蓝牙结果', e);
        }).catch(this.errorHandle.bind(this)).finally(() => {
            this.setData({ blueTooth });
            setTimeout( () => {
                wx.stopBluetoothDevicesDiscovery();
            }, 1000);
        });
    },
    errorHandle ({ errMsg, errCode }) {
        setTimeout(() => {
            Modal.confirm({
                content: '链接设备需要打开蓝牙，请确认手机蓝牙是否已打开？',
            }).then((res) => {
                let { cancel, confirm } = res;
                confirm && this.searchRoche();
                cancel && Router.pop();
            });
            this.setData({
                blueTooth: null,
            })
        }, 1000);
    },
    // 跳转
    handleJump (e) {
        let { currentTarget } = e;
        let url = currentTarget.dataset.url;
        Router.push(url);
    },
    // 配对
    handlePairRoche(e) {
        let { blueTooth, params$ } = this.data;
        let { deviceId,  name } = blueTooth || {};
        if (!deviceId) {
            Modal.toast('没有发现设备，请先搜索设备');
            this.setData({ blueTooth: '' });
            return this.searchRoche();
        }
        Loading.showLoading({title: '正在绑定设备...'});
        this.blePairRoche(deviceId).then((res) => {
            console.log('链接成功 => ', res);
            this.bleGetStatus(deviceId, res).then((res) => {
                console.log('取特征值成功', res);
            }).catch((err) => {
                console.log('取特征值失败', err);
            });
            setTimeout(() => {
                this.setData({ isPopup: true });
            }, 10000);
        }).catch((err) => {
            Modal.confirm({
                content: '绑定失败，请删除设备和手机链接后重新绑定',
                confirmText: '我知道了',
                showCancel: false,
            }).then().null();
        }).finally(() => {
            Loading.hideLoading();
        });
    },
    onUnload () {
        wx.closeBluetoothAdapter();
    },
    handlePopupTap (e) {
        let { params } = e.currentTarget.dataset;
        if (params) {
            let { blueTooth, params$ } = this.data;
            if (blueTooth.name.indexOf('meter+') === -1) {
                console.log('存储起来');
                Store.set('$BLUE_TOOTH_DEVICE_ID_OLD', [blueTooth]);
            }
            let { from } = params$;
            if (from === 'lottery_index' && name.indexOf('meter+') > -1) {
                Http(Http.API.Do_BindActivityUser, {
                    MachineCode: name,
                    MachineId: blueTooth.deviceId,
                    BindRemark: JSON.stringify(blueTooth),
                }).null().finally(() => {
                    this.setData({ isComplete: true, isPopup: false });
                });
                return;
            }
            this.setData({ isComplete: true, isPopup: false });
        } else {
            this.handlePairRoche();
            this.setData({ isPopup: false });
        }
    },
    handleComplete () {
        this.setData({ isComplete: false });
        Router.push('bluetooth_synchronization_index', { from: 'bluetooth_add_index', ...this.data.params$ });
    }
}));
