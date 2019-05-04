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

import {
    ARR_TIME_STEP,
    DAY_TEXT,
    GLS_TEXT,
    WEB_LINK,
}                               from 'config/base.config'

const arrSrc = [
    { key: 'bg', value: 'activation-bg.jpg' },
];

const app = getApp();

Page(Mixin({
    mixins: [
        SourceMixin,
        WebViewMixin,
        ShareMixin,
        UserMixin,
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
    onLoad (options) {
        this.sourceGet(arrSrc);
        this.userGet();
        wx.showShareMenu();
        let scene = '';
        if (options.scene) scene = decodeURIComponent(options.scene);
        console.log(options);
        console.log(app.globalData.sceneid)
        scene && (app.globalData.sceneid = scene);
    },
    // 生命周期回调—监听页面显示
    onShow () {
        Auth.getToken().then((info) => {
            this.firFun(info);
        }).catch(() => {
            Router.push('login_index');
        });
    },
    // 用户登录执行的函数
    firFun (info) {
        // 获取用户数据
        this.getUserInfo().then(() => {
            let { IsArchives, IsMember} = info;
            if (!IsArchives)
                return Router.push('questionnaire_info_index', { IsMember });
            let {
                to,
            } = app.globalData;
            app.globalData.to = '';
            if  (to === 'ZXWZ' && IsMember)
                return this.jumpWebView(WEB_LINK.ZXWZ);
            this.getIndexSugar();
        }).catch((err) => {
            let { code } = err;
            if (code === -1) return Router.push('login_index');
            Modal.toast(err);
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
            app.globalData.userInfo.IsMember = res.IsMember;
            Auth.updateToken({ IsMember, IsExpire, IsUseCode });
        }).toast();
    },
    // 获取用户信息
    getUserInfo () {
        return Auth.getUserInfo().then((info) => {
            // 用户已经授权
            let {userInfo} = info;
            this.setData({
                userInfo: userInfo,
            });
            app.globalData.userInfo = userInfo;
        })
    },
    // 跳转
    handleJump (e) {
        let { currentTarget } = e;
        let url = currentTarget.dataset.url;
        let params = currentTarget.dataset.params;
        let { IsPerfect, IsMember, IsExpire, IsUseCode } = this.data.objUser;
        if ( url === 'mine_report_index' && !IsPerfect ) {
            return Router.push('mine_info_index', { from: 'home_index', IsMember: app.globalData.userInfo.IsMember});
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
