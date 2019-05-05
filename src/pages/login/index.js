//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Mixin                        from 'utils/mixin.util'
import SourceMixin                  from 'mixins/source.mixin'
import Router                       from 'plugins/router.plugin'
import Auth                         from 'plugins/auth.plugin'
import Http                         from 'plugins/http.plugin'

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
        this.judgeUserLoginStatus();
    },
    // 赋值
    assignmentData (options) {
        let { sceneid, to, params } = options;
        typeof sceneid === 'undefined' && (sceneid = '');
        typeof to === 'undefined' && (to = '');
        typeof params === 'undefined' && (params = '');
        this.setData({ sceneid, to, params });
    },
    // 判断用户登录状态
    judgeUserLoginStatus () {
        Auth.getToken().then((res) => {
            this.judgeUserStatus(res);
        }).catch(() => {
            this.setData({ loading: false });
        });
    },
    // 判断用户状态
    judgeUserStatus (user) {
        console.log(user);
        let {
            IsArchives, // 是否建档
            IsExpire, // 是否过期
            IsMember, // 是否vip
            IsOldUser, // 是否老用户
            IsUseCode, // 是否使用核销
        } = user;
        if (IsMember) {
            if ( IsOldUser )
                return Router.root('home_index');
            if ( IsUseCode )
                return Router.root('home_index');
            Router.push('questionnaire_info_index', { IsMember }, true);
        } else {
            console.log(1)
            // return Router.push('questionnaire_info_index', { IsMember: false }, true);
            if (!IsArchives)
                return Router.push('questionnaire_info_index', { IsMember }, true);
            Router.root('home_index');
        }
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
                sceneid: this.data.sceneid,
            }, {
                useAuth: false,
            });
        }).then((result) => {
            return Auth.updateToken({
                ...user,
                ...result,
            });
        }).then((res) => {
            this.judgeUserStatus(res);
        }).toast();
    },
}));
