//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                         from 'plugins/http.plugin'
import Router                       from 'plugins/router.plugin'
import Auth                         from 'plugins/auth.plugin'
import Modal                        from 'plugins/modal.plugin'
import Mixin                        from 'utils/mixin.util'
import JumpMixin                    from 'mixins/jump.mixin'
import UserMixin                    from 'mixins/user.mixin'
import ShareMixin                   from 'mixins/share.mixin'
import WebViewMixin                 from 'mixins/webview.mixin'
import {
    ARR_TIME_STEP,
    DAY_TEXT,
    GLS_TEXT,
    WEB_LINK,
}                                   from 'config/base.config'
import DataMixin                    from './data.mixin'

Page(Mixin({
    mixins: [
        DataMixin,
        WebViewMixin,
        ShareMixin,
        UserMixin,
        JumpMixin,
    ],
    onLoad () {
        wx.showShareMenu();
    },
    onShow () {
        this.userGet().then(() => {
            this.assignmentData();
            this.getUserSugar();
        });
    },
    // 赋值判断
    assignmentData () {
        let { objEntry, user$ } = this.data;
        if (user$.IsMember) return null;
        delete objEntry.programme;
        this.setData({ objEntry });
    },
    // 个人中心血糖基本信息
    getUserSugar () {
        Http(Http.API.Req_mineSugar).then((res) => {
            let objUser = res || {};
            let { IsMember, IsExpire, IsUseCode, IsPerfect, IsArchives } = objUser;
            this.setData({
                objUser,
                'objEntry.info.value': IsPerfect ? '已完善' : '待完善',
            });
            return Auth.updateToken({ IsMember, IsExpire, IsUseCode, IsPerfect, IsArchives });
        }).then(() => {
            this.userGet();
        }).toast();
    },
    // 跳转
    handleJump (event) {
        let { nickName } = this.data.user$ || {};
        if (!nickName) {
            return Modal.confirm({
                content: '您还未登录，请先登录再进行操作',
                cancelText: '暂不登录',
                confirmText: '立即登录',
            }).then((res) => {
                let { confirm } = res;
                confirm && Router.push('login_index');
            }).null();
        }
        let { url, params } = event.currentTarget.dataset;
        let { IsPerfect, IsMember, IsExpire, IsUseCode, IsArchives } = this.data.user$;
        // 没有建档
        if (!IsArchives && ['questionnaire_programme_index', 'bluetooth_index'].indexOf(url) > -1) {
            return Modal.confirm({
                content: '为便于我们为您提供专业的测频建议，还请协助我们提供以下信息',
                confirmText: '去完成'
            }).then((res) => {
                let { confirm } = res;
                confirm && Router.push('questionnaire_info_index', { IsMember });
            });
        }
        if ( ['report_index', 'report_monthly_index'].indexOf(url) > -1 && !IsPerfect )
            return Router.push('mine_info_index', { from: 'mine_index', to: url});
        if (url !== 'mine_control_index') {
            !params && (params = {});
            return Router.push(url, { IsMember, ...params });
        }
        if (IsExpire)
            return Modal.confirm({
                content: '你的会员VIP已过期，是否续期？',
            }).then((res) => {
                let { confirm } = res;
                confirm && Router.push('mine_introduce_index');
            });
        if (!IsUseCode)
            return this.setData({isPopup: true});
        return this.jumpWebView(WEB_LINK.JKZD);
    },
    handlePopClose () {
        this.setData({isPopup: false});
    }
}));
