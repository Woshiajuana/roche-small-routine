//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Auth                         from 'plugins/auth.plugin'
import Http                         from 'plugins/http.plugin'
import Router                       from 'plugins/router.plugin'
import Modal                        from 'plugins/modal.plugin'
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
    { key: 'kf', value: 'home-ej-icon.png' },
    { key: 'norBg', value: 'home-nor-bg.png' },
    { key: 'vipBg', value: 'home-vip-bg.png' },
    { key: 'xtrz', value: 'home-icon-1.png' },
    { key: 'lylj', value: 'home-icon-2.png' },
    { key: 'jhb', value: 'home-icon-jhb.png' },
    { key: 'stepNor', value: 'home-step-icon-1.png' },
    { key: 'stepAct', value: 'home-step-icon-2.png' },
    { key: 'entryBg', value: 'home-entry-bg.png' },
    { key: 'entryVBg', value: 'home-entry-vip-bg.png' },
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
        wx.showShareMenu();
    },
    // 生命周期回调—监听页面显示
    onShow () {
        this.userGet();
        this.getIndexSugar();
    },
    // 首页个人血糖基本信息
    getIndexSugar () {
        Http(Http.API.Req_indexSugar, {}, {
            loading: false,
        }).then((res) => {
            let objUser = res || {};
            let { IsMember, IsExpire, IsUseCode, Bloodsugar, IsPerfect, IsArchives} = objUser;
            this.setData({
                objUser,
                'objUser.Bloodsugar': Bloodsugar ? Bloodsugar.toFixed(1) : Bloodsugar,
                loading: false,
            });
            return Auth.updateToken({ IsMember, IsExpire, IsUseCode, IsPerfect, IsArchives });
        }).then(() => {
            this.userGet();
        }).toast();
    },
    // 跳转
    handleJump (event) {
        let { url, params } = event.currentTarget.dataset;
        let { IsPerfect, IsMember, IsArchives, IsUseCode, IsExpire } = this.data.user$;
        if (url === 'consult_index') {
            if (IsExpire) {
                return Modal.confirm({
                    content: '你的会员VIP已过期，是否续期？',
                }).then((res) => {
                    let { confirm } = res;
                    confirm && Router.push('mine_introduce_index');
                });
            }
            return this.jumpWebView(WEB_LINK.ZXWZ);
        }
        if (url === 'report_index' && IsMember && !IsUseCode)
            return Modal.confirm({
                content: '您的服务包状态待激活！\n我们的控糖顾问将在1个工作日内与您联系请注意接听电话，谢谢',
                showCancel: false,
                confirmText: '知道了'
            }).then((res) => {});
        if (['record_index', 'clock_index'].indexOf(url) > -1 && !IsArchives)
            return Modal.confirm({
                content: '完成调查问卷才能测试血糖哦！',
                confirmText: '去完成'
            }).then((res) => {
                let { confirm } = res;
                confirm && Router.push('questionnaire_answerone_index', { IsMember });
            });
        if (url === 'report_index' && !IsPerfect)
            return Router.push('mine_info_index', { from: 'home_index', IsMember, to: url});
        if (url === 'clock_index')
            return this.reqCurSignIn();
        !params && (params = {});
        Router.push(url, params);
    },
    reqCurSignIn () {
        Http(Http.API.Req_curSignIn).then((res) => {
            let { Item1, Item2 } = res;
            if (Item2 && Item1 === Item2)
                Router.push('clock_index', { Bloodsugar: this.data.objUser.Bloodsugar });
            else
                Router.push('lottery_index');
        }).toast();
    },
}));
