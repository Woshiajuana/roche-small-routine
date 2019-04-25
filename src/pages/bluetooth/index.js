//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Auth                     from 'plugins/auth.plugin'
import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'
import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import Store                    from 'plugins/store.plugin'
import SyncMixin                from 'mixins/sync-data.mixin'
import {
    $BLUE_TOOTH_DEVICE_ID_LIST,
    $BLUE_TOOTH_DATA,
}                               from 'config/store.config'
import {
    ARR_TIME_STEP,
    DAY_TEXT,
    GLS_TEXT,
}                               from 'config/base.config'

Page(Handle({
    mixins: [SyncMixin],
    // 页面的初始数据
    data: {
        arrTimeStep: ARR_TIME_STEP,
        glsText: GLS_TEXT,
        userInfo: {},
        objUser: {},
        objData: '',
        arrClass: ['low', 'lit', 'lit', 'nor', 'up']
    },
    // 生命周期回调—监听页面显示
    onShow () {
        this.getUserInfo();
        this.getIndexSugar();
        this.initData();
    },
    handleSubmit () {
        Store.remove($BLUE_TOOTH_DEVICE_ID_LIST)
    },
    handleSubmit1 () {
        Store.remove($BLUE_TOOTH_DATA)
    },
    initData() {
        Store.get($BLUE_TOOTH_DATA).then((res) => {
            let objData = res[0];
            this.setData({
                objData,
            });
            this.setData({
                'objUser.Bloodsugar': objData.Bloodsugar ? objData.Bloodsugar.toFixed(1) : objData.Bloodsugar,
            })
        }).catch(() => {})
    },
    // 首页个人血糖基本信息
    getIndexSugar () {
        let options = {
            url: 'RocheApi/GetIndexSugar',
            loading: false,
        };
        return Http(options).then((res) => {
            this.setData({
                objUser: res || {},
            })
        }).catch((err) => {
            Toast.error(err);
        });
    },
    // 获取用户信息
    getUserInfo () {
        return Auth.getUserInfo().then((info) => {
            // 用户已经授权
            let { userInfo } = info;
            this.setData({
                userInfo: userInfo,
            });
        })
    },
    // 跳转
    handleJump (e) {
        let { currentTarget } = e;
        let url = currentTarget.dataset.url;
        if (!url) {
            Store.get($BLUE_TOOTH_DEVICE_ID_LIST).then(() =>{
                this.handleSync();
            }).catch(() => {
                return Toast.confirm({
                    content: '您还未配对过设备，请先去配对设备',
                }).then((res) => {
                    let { confirm } = res;
                    confirm && Router.push('bluetooth_explain_index');
                });
            });
            return;
        }
        if (url === 'mine_index') return Router.root('mine_index');
        Router.push(url, {Bloodsugar: this.data.Bloodsugar, from: 'bluetooth_index'});
    },
}));
