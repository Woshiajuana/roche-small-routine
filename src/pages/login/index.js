//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Mixin                        from 'utils/mixin.util'
import SourceMixin                  from 'mixins/source.mixin'
import Router                       from 'plugins/router.plugin'
import Auth                         from 'plugins/auth.plugin'
import Http                         from 'plugins/http.plugin'

const app = getApp();
const arrSrc = [
    { key: 'bg', value: 'login-bg-2.jpg' },
];

Page(Mixin({
    mixins: [
        SourceMixin,
    ],
    onLoad () {
        this.sourceGet(arrSrc);
    },
    // 授权并登录
    handleGetUser (e) {
        let { userInfo } = e.detail;
        if (!userInfo) return;
        this.userLogin(userInfo);
    },
    // 用户登录
    userLogin (user) {
        Auth.login().then((result) => {
            let options = {
                url: 'WechatApi/UserLogin',
                data: {
                    code: result,
                    sceneid: app.globalData.sceneid,
                },
                loading: true,
                auth: false,
            };
            return Http(options);
        }).then((result) => {
            return Auth.updateToken({
                ...user,
                ...result,
            });
        }).then(() => {
            return Router.root('home_index');
        }).toast();
    },
}));
