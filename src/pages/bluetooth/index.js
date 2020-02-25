//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                         from 'plugins/http.plugin'
import Modal                        from 'plugins/modal.plugin'
import Router                       from 'plugins/router.plugin'
import Mixin                        from 'utils/mixin.util'
import Store                        from 'plugins/store.plugin'
import SyncMixin                    from 'mixins/sync-data.mixin'
import SourceMixin                  from 'mixins/source.mixin'
import UserMixin                    from 'mixins/user.mixin'
import Authorize                    from 'plugins/authorize.plugin'
import {
    $BLUE_TOOTH_DEVICE_ID_LIST,
    $BLUE_TOOTH_DATA,
}                                   from 'config/store.config'
import {
    ARR_TIME_STEP,
    DAY_TEXT,
    GLS_TEXT,
}                                   from 'config/base.config'

const arrSrc = [
    { key: 'refresh', value: 'tbxt-icon.png' },
    { key: 'lsctjl', value: 'home-icon-xtbg.png' },
    { key: 'fhgrzx', value: 'blue-tooth-mine-icon.png' },
];

Page(Mixin({
    mixins: [
        SyncMixin,
        UserMixin,
        SourceMixin,
    ],
    // 页面的初始数据
    data: {
        arrTimeStep: ARR_TIME_STEP,
        glsText: GLS_TEXT,
        userInfo: {},
        objUser: {},
        objData: '',
        arrClass: ['low', 'lit', 'lit', 'nor', 'up']
    },
    onLoad () {
        this.userGet();
        this.sourceGet(arrSrc);
    },
    // 生命周期回调—监听页面显示
    onShow () {
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
        console.log('initData')
        Store.get($BLUE_TOOTH_DATA).then((res) => {
            let objData = res[0];
            console.log('objData', objData)
            this.setData({
                objData,
                'objUser.Bloodsugar': objData.Bloodsugar ? (+objData.Bloodsugar).toFixed(1) : objData.Bloodsugar,
            });
        }).catch((e) => {
            console.log('initData', e)
        })
    },
    // 首页个人血糖基本信息
    getIndexSugar () {
        Http(Http.API.Req_indexSugar).then((res) => {
            this.setData({ objUser: res || {} })
        }).toast();
    },
    // 跳转
    handleJump (e) {
        let { url, to = '' } = e.currentTarget.dataset;
        if (url === 'mine_index') return Router.root('mine_index');
        Router.push(url, { Bloodsugar: this.data.Bloodsugar, from: 'bluetooth_index', to });
    },
    // 跳转
    handleJumpPlus (e) {
        let { currentTarget } = e;
        let url = currentTarget.dataset.url;
        if (url === 'record_index') return Router.push(url);
        Authorize(Authorize.SCOPE.userLocation, '添加设备需要地理位置授权').then(() => {
            Router.push(url, { from: 'bluetooth_index' });
        }).catch(() => {
            Modal.toast('连接设备需要授权哦')
        });
    },
}));
