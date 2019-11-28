//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                       from 'plugins/router.plugin'
import Modal                        from 'plugins/modal.plugin'
import Mixin                        from 'utils/mixin.util'
import InputMixin                   from 'mixins/input.mixin'
import SourceMixin                  from 'mixins/source.mixin'
import BleMixin                     from 'mixins/ble.mixin'
import SDK                          from 'services/sdk.services'
import Loading                      from 'plugins/loading.plugin'
import Store                        from 'plugins/store.plugin'
import {
    $BLUE_TOOTH_DEVICE_ID_LIST
}                                   from 'config/store.config'
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
        SourceMixin,
    ],
    data: {
        blueTooth: '213',
        isPop: false,
    },
    onLoad () {
        // this.searchRoche();
        this.sourceGet(arrSrc);
    },

    searchRoche () {
        // 搜索蓝牙
        this.bleSearchRoche().then((e) => {
            console.log('搜索蓝牙结果', e);
            this.setData({ blueTooth: e });
            wx.stopBluetoothDevicesDiscovery();
        }).catch(this.errorHandle.bind(this));
    },
    errorHandle ({ errMsg, errCode }) {
        if (errMsg.indexOf('openBluetoothAdapter:fail') > -1 ) {
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
    // 跳转
    handleJump (e) {
        let { currentTarget } = e;
        let url = currentTarget.dataset.url;
        Router.push(url);
    },
    // 配对
    handlePairRoche(e) {
        const { deviceId } = e.currentTarget.dataset;
        if (!deviceId) {
            Modal.toast('没有发现设备，请先搜索设备');
            this.setData({ blueTooth: '' });
            return this.searchRoche();
        }
        Loading.showLoading();
        this.blePairRoche(deviceId).then((res) => {
            Router.push('bluetooth_synchronization_index', { from: 'bluetooth_add_index',deviceId, serviceId: res });
        }).catch((err) => {
            Modal.toast('绑定失败，请删除设备和手机链接后重新绑定');
        }).finally(() => {
            Loading.hideLoading();
        });
    },
    onUnload () {
        let {deviceId} = app.globalData.blueTooth;
        deviceId && SDK.disconnectDevice(deviceId).then((res) => {
            console.log('断开蓝牙链接成功',res);
        }).catch((err) => {
            console.log('断开蓝牙链接失败',err);
        });
    },
}));
