//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                   from 'plugins/router.plugin'
import Auth                     from 'plugins/auth.plugin'
import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'

const app = getApp();

Page({
    // 授权并登录
    bindGetUserInfo (e){
        let { userInfo } = e.detail;
        if (!userInfo) return;
        this.userLogin();
    },
    // 用户登录
    userLogin () {
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
            return Auth.updateToken(result);
        }).then(() => {
            return Router.root('home_index');
        }).catch((err) => {
            Toast.error(err);
        })
    },
});
