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

Page(Mixin({
    mixins: [
        DataMixin,
        WebViewMixin,
        ShareMixin,
        UserMixin,
    ],
    onLoad () {
        wx.showShareMenu();
        this.userGet();
    },
    onShow () {
        this.getUserSugar();
    },
    // 个人中心血糖基本信息
    getUserSugar () {
        Http(Http.API.Req_mineSugar).then((res) => {
            let objUser = res || {};
            let { IsMember, IsExpire, IsUseCode, IsPerfect } = objUser;
            this.setData({
                objUser,
                'objEntry.info.value': IsPerfect ? '已完善' : '待完善',
            });
            return Auth.updateToken({ IsMember, IsExpire, IsUseCode });
        }).then(() => {
            this.userGet();
        }).toast();
    },
    // 跳转
    handleJump (event) {
        let { url, params } = event.dataset;
        let { IsPerfect, IsMember, IsExpire, IsUseCode } = this.data.objUser;
        if ( ['mine_report_index', 'mine_month_index'].indexOf(url) > -1 && !IsPerfect )
            return Router.push('mine_info_index', { from: 'mine_index', to: url});
        !params && (params = {});
        Router.push(url, { form: 'mine_index', ...params });
    }
}));
