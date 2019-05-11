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
        console.log('options', options)
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
        Auth.logout().finally(() => {
            Auth.getToken().then((res) => {
                this.judgeUserStatus(res);
            }).catch(() => {
                this.setData({ loading: false });
            });
        })
    },
    // 判断用户状态
    judgeUserStatus (user) {
        console.log(user);
        let {
            IsArchives, // 是否建档
            IsExpire, // 是否过期
            IsMember, // 是否vip
            IsOldUser, // 是否老用户
            IsUseCode, // 掌糖是否核销
            IsVipFlow, // 是否走VIP流程
            IsBindCode, // 平台是否核销
        } = user;
        // 先判断是否是会员
        if (IsMember) {
            if (IsOldUser || IsBindCode)
                return this.judgeToPage();
            Router.root('questionnaire_info_index', { IsMember: true }, true);
        } else {
            if (IsOldUser) {
                if (!IsArchives)
                    return Router.root('questionnaire_info_index', { IsMember }, true);
                return this.judgeToPage();
            } else {
                if (IsVipFlow) {
                    Router.root('questionnaire_info_index', { IsMember: true }, true);
                } else {
                    if (!IsArchives)
                        return Router.root('questionnaire_info_index', { IsMember }, true);
                    this.judgeToPage();
                }
            }
        }
    },
    judgeToPage () {
        let { to } = this.data;
        return to ? Router.root(to, true) : Router.root('home_index');
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
            // return console.log(result)
            return Http(Http.API.Do_userLogin, {
                NickName: user.nickName,
                AvatarUrl: user.avatarUrl,
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
