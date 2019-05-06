//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Auth                         from 'plugins/auth.plugin'
import Http                         from 'plugins/http.plugin'
import Router                       from 'plugins/router.plugin'
import Mixin                        from 'utils/mixin.util'
import UserMixin                    from 'mixins/user.mixin'
import WebViewMixin                 from 'mixins/webview.mixin'
import ShareMixin                   from 'mixins/share.mixin'
import SourceMixin                  from 'mixins/source.mixin'
import DataMixin                    from './data.mixin'

import {
    ARR_TIME_STEP,
    DAY_TEXT,
    GLS_TEXT,
    WEB_LINK,
}                                   from 'config/base.config'

const arrSrc = [
    { key: 'norBg', value: 'home-nor-bg.png' },
    { key: 'vipBg', value: 'home-nor-bg.png' },
    { key: 'xtrz', value: 'home-icon-1.png' },
    { key: 'lylj', value: 'home-icon-2.png' },
    { key: 'jhb', value: 'home-icon-jhb.png' },
    { key: 'stepNor', value: 'home-step-icon-1.png' },
    { key: 'stepAct', value: 'home-step-icon-2.png' },
    { key: 'entryBg', value: 'home-entry-bg.png' },
];

Page(Mixin({
    mixins: [
        SourceMixin,
        WebViewMixin,
        ShareMixin,
        UserMixin,
        DataMixin,
    ],
    // 页面的初始数据
    data: {
        arrTimeStep: ARR_TIME_STEP,
        glsText: GLS_TEXT,
        userInfo: {},
        objUser: {},
        show: false,
        loading: true,
        arrClass: ['low', 'lit', 'lit', 'nor', 'up'],
        objWeb: WEB_LINK.ZXWZ,
    },
    onLoad () {
        this.sourceGet(arrSrc);
        this.userGet();
        wx.showShareMenu();
    },
    // 生命周期回调—监听页面显示
    onShow () {
        this.getIndexSugar();
    },
    // 首页个人血糖基本信息
    getIndexSugar () {
        Http(Http.API.Req_indexSugar, {}, {
            loading: false,
        }).then((res) => {
            let objUser = res || {};
            let { IsMember, IsExpire, IsUseCode, Bloodsugar } = objUser;
            this.setData({
                objUser,
                'objUser.Bloodsugar': Bloodsugar ? Bloodsugar.toFixed(1) : Bloodsugar,
                loading: false,
            });
            return Auth.updateToken({ IsMember, IsExpire, IsUseCode });
        }).then(() => {
            this.userGet();
        }).toast();
    },
    // 跳转
    handleJump (event) {
        let { url, params } = event.dataset;
        let { IsPerfect, IsMember, IsExpire } = this.data.objUser;
        if (url === 'report_weekly_index' && !IsPerfect)
            return Router.push('mine_info_index', { from: 'home_index', IsMember, to: url});
        !params && (params = {});
        Router.push(url, params);
    },
}));
