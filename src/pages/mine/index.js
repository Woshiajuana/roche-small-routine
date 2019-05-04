//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                         from 'plugins/http.plugin'
import Modal                        from 'plugins/modal.plugin'
import Router                       from 'plugins/router.plugin'
import Auth                         from 'plugins/auth.plugin'
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

const app = getApp();

Page(Mixin({
    mixins: [
        DataMixin,
        WebViewMixin,
        ShareMixin,
        UserMixin,
    ],
    onLoad () {
        wx.showShareMenu();
    },
    onShow () {
        this.getUserSugar();
    },
    // 个人中心血糖基本信息
    getUserSugar () {
        Http(Http.API.Req_mineSugar).then((res) => {
            let { IsPerfect } = res;
            this.setData({
                objUser: res || {},
                'objEntry.info.value': IsPerfect ? '已完善' : '待完善',
            });
            let {
                IsMember,
                IsExpire,  // 是否过期
                IsUseCode, // 是否核销
            } = res;
            Auth.updateToken({ IsMember, IsExpire, IsUseCode });
        }).toast();
    },
    // 跳转
    handleJump (e) {
        let { currentTarget } = e;
        let url = currentTarget.dataset.url;
        let { IsPerfect, IsMember, IsExpire, IsUseCode } = this.data.objUser;
        if ( ['mine_report_index', 'mine_month_index'].indexOf(url) > -1 && !IsPerfect ) {
            return Router.push('mine_info_index', { from: 'mine_index', to: url});
        }
        if (url === 'mine_programme_index' && IsMember) {
            if (IsExpire) {
                Modal.confirm({
                    content: '你的会员VIP已过期，是否续期？',
                }).then((res) => {
                    let { confirm } = res;
                    confirm && Router.push('mine_introduce_index');
                });
                return;
            }
            return this.jumpWebView(WEB_LINK.JKZD);
        }
        Router.push(url, {form: 'mine_index', IsMember, IsExpire});
    }
}));
