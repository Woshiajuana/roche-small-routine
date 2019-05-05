//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                       from 'plugins/router.plugin'
import Modal                        from 'plugins/modal.plugin'
import Mixin                        from 'utils/mixin.util'
import InputMixin                   from 'mixins/input.mixin'
import SourceMixin                  from 'mixins/source.mixin'
import SDK                          from 'services/sdk.services'
import Loading                      from 'plugins/loading.plugin'
import Store                        from 'plugins/store.plugin'
import {
    $BLUE_TOOTH_DEVICE_ID_LIST
}                                   from 'config/store.config'
const app = getApp();

const arrSrc = [
    { key: 'icon', value: 'lylj-ing-icon.jpg' },
    { key: 'null', value: 'lylj-null-icon.jpg' },
    { key: 'result', value: 'lylj-result-icon.jpg' },
];

Page(Mixin({
    mixins: [
        InputMixin,
        SourceMixin,
    ],
    data: {
        blueTooth: '',
        isPop: false,
    },
    onLoad () {
        // 搜索蓝牙
        this.searchRoche();
        this.sourceGet(arrSrc);
    },
    searchRoche () {
        let blueTooth = '';
        SDK.searchRoche().then((res) => {
            app.globalData.blueTooth = res;
            blueTooth = res || {};
        }).catch((e) => {
            let err = e || {};
            this.errorHandle(err);
        }).finally(() => {
            this.setData({ blueTooth });
        })
    },
    errorHandle ({ errMsg, errCode }) {
        if (errMsg === 'openBluetoothAdapter:fail:ble not available') {
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
    handlePairRoche() {
        let { deviceId } = this.data.blueTooth;
        if (!deviceId) {
            Modal.toast('没有发现设备，请先搜索设备');
            return this.searchRoche();
        }
        Loading.showLoading();
        let result = {};
        SDK.pairRoche(deviceId).then((res) => {
            result = {errCode: 0};
        }).catch((err) => {
            result = err;
            this.errorHandle(err);
        }).finally(() => {
            Loading.hideLoading();
            let { errCode } = result;
            if (errCode !== 0 && errCode !== -1) return Modal.toast(result);
            Modal.confirm({
                content: '是否配对成功？',
            }).then((res) => {
                let { confirm } = res;
                console.log(this.data.blueTooth)
                confirm && Store.set($BLUE_TOOTH_DEVICE_ID_LIST, [this.data.blueTooth]);
                confirm && Router.push('bluetooth_synchronization_index', { from: 'bluetooth_add_index'});
            });
        })
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
