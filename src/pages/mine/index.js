//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                         from 'plugins/http.plugin'
import Router                       from 'plugins/router.plugin'
import Auth                         from 'plugins/auth.plugin'
import Modal                        from 'plugins/modal.plugin'
import Mixin                        from 'utils/mixin.util'
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
    ],
    onLoad () {
        wx.showShareMenu();
        this.assignmentData();
    },
    onShow () {
        this.userGet();
        this.getUserSugar();
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
        let { url, params } = event.currentTarget.dataset;
        let { IsPerfect, IsMember, IsExpire, IsUseCode } = this.data.user$;
        if ( ['mine_report_index', 'mine_month_index'].indexOf(url) > -1 && !IsPerfect )
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
                confirm && Router.push('introduce_index');
            });
        return this.jumpWebView(WEB_LINK.JKZD);
    }
}));
