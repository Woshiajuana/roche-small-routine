//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Auth                         from 'plugins/auth.plugin'
import Http                         from 'plugins/http.plugin'
import Modal                        from 'plugins/modal.plugin'
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
}                               from 'config/base.config'

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
        Auth.getToken().then((info) => {
            this.getIndexSugar();
        }).catch(() => {
            Router.push('login_index');
        });
    },
    // 首页个人血糖基本信息
    getIndexSugar () {
        Http(Http.API.Req_indexSugar, {}, {
            loading: false,
        }).then((res = '') => {
            this.setData({
                objUser: res || {},
                'objUser.Bloodsugar': res.Bloodsugar ? res.Bloodsugar.toFixed(1) : res.Bloodsugar,
                loading: false,
            });
            let {
                IsMember,
                IsExpire,  // 是否过期
                IsUseCode, // 是否核销
            } = res;
            return Auth.updateToken({ IsMember, IsExpire, IsUseCode });
        }).then(() => {
            this.userGet();
        }).toast();
    },
    // 跳转
    handleJump (e) {
        let { currentTarget } = e;
        let url = currentTarget.dataset.url;
        let params = currentTarget.dataset.params;
        let { IsPerfect, IsMember, IsExpire, IsUseCode } = this.data.objUser;
        if ( url === 'mine_report_index' && !IsPerfect ) {
            return Router.push('mine_info_index', { from: 'home_index', IsMember});
        }
        if ( url === 'web_index' || url === 'consult_index' ) {
            if (IsExpire) {
                Modal.confirm({
                    content: '你的会员VIP已过期，是否续期？',
                }).then((res) => {
                    let { confirm } = res;
                    confirm && Router.push('mine_introduce_index');
                });
                return;
            }
            return this.jumpWebView(params);
        }
        Router.push(url, params);
    },
}));
