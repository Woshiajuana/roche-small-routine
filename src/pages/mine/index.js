//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'
import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import ShareMixin               from 'mixins/share.mixin'
import Auth                     from 'plugins/auth.plugin'
import WebViewMixin             from 'mixins/webview.mixin'
import {
    ARR_TIME_STEP,
    DAY_TEXT,
    GLS_TEXT,
    WEB_LINK,
}                               from 'config/base.config'

const app = getApp();

Page(Handle({
    mixins: [WebViewMixin, ShareMixin],
    data: {
        userInfo: '',
        objUser: {},
        objView: [
            {
                label: '我的控糖方案',
                url: 'mine_programme_index',
                value: '',
            },
            {
                label: '我的血糖周报',
                url: 'mine_report_index',
                value: '',
            },
            {
                label: '我的血糖月报',
                url: 'mine_month_index',
                value: '',
            },
            {
                label: '个人信息',
                url: 'mine_info_index',
                value: '',
            },
            {
                label: '更新疾病信息',
                url: 'questionnaire_two_index',
                value: '',
            },
            {
                label: '绑定Performa Connect血糖仪',
                url: 'bluetooth_index',
                value: '',
            }
        ]
    },
    onLoad(){
        wx.showShareMenu();
    },
    onShow () {
        this.setData({
            userInfo: app.globalData.userInfo,
        });
        this.getUserSugar();
    },
    // 个人中心血糖基本信息
    getUserSugar () {
        let options = {
            url: 'RocheApi/GetUserSugar',
            loading: true,
        };
        return Http(options).then((res) => {
            let { IsPerfect } = res;
            this.setData({
                objUser: res || {},
                'objView[3].value': IsPerfect ? '已完善' : '待完善',
            });
            let {
                IsMember,
                IsExpire,  // 是否过期
                IsUseCode, // 是否核销
            } = res;
            Auth.updateToken({ IsMember, IsExpire, IsUseCode });
        }).catch((err) => {
            Toast.error(err);
        });
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
                Toast.confirm({
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
