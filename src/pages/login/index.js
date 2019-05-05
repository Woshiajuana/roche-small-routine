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
    data: {
        sceneid: '',
        to: '',
        params: '',
        loading: true,
    },
    onLoad (options) {
        this.assignmentData(options);
        this.sourceGet(arrSrc);
        this.judgeUserStatus();
    },
    // 赋值
    assignmentData (options) {
        let { sceneid, to, params } = options;
        this.setData({ sceneid, to, params });
    },
    // 判断用户状态
    judgeUserStatus () {
        Auth.getToken().then(() => {
            let { to, params } = this.data;
            // to ? Router.push(to) : Router.push('home_index');
        }).catch(() => {
            this.setData({ loading: false });
        });
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
            return Http(Http.API.Do_userLogin, {
                code: result,
                sceneid: app.globalData.sceneid,
            }, {
                useAuth: false,
            });
        }).then((result) => {
            return Auth.updateToken({
                ...user,
                ...result,
            });
        }).then((user) => {
            return console.log(user);
            let { to, params } = this.data;
            to ? Router.push(to) : Router.push('home_index');
        }).toast();
    },
}));
