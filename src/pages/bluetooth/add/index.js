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
                Modal.confirm({
                    content: '是否已配对成功？',
                    cancelText: '否',
                    confirmText: '是',
                }).then((result) => {
                    let { cancel, confirm } = result;
                    if (confirm) {
                        let { from } = params$;
                        if (from === 'lottery_index' && name.indexOf('meter+') > -1) {
                            Http(Http.API.Do_BindActivityUser, {
                                MachineCode: name,
                                MachineId: deviceId,
                                BindRemark: JSON.stringify(blueTooth),
                            }).null().finally(() => {
                                Router.push('bluetooth_synchronization_index', { ...this.data.params$, preFrom: 'lottery_index', from: 'bluetooth_add_index', deviceId, serviceId: res, });
                            });
                        } else {
                            Router.push('bluetooth_synchronization_index', { from: 'bluetooth_add_index', deviceId, serviceId: res, ...this.data.params$ });
                        }
                    }
                    cancel && this.handlePairRoche();
                });
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
}));
