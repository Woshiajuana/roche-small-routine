//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                       from 'plugins/router.plugin'
import Mixin                        from 'utils/mixin.util'
import Store                        from 'plugins/store.plugin'
import WebViewMixin                 from 'mixins/webview.mixin'
import Auth                         from 'plugins/auth.plugin'
import Toast                        from 'plugins/toast.plugin'
import {
    $BLUE_TOOTH_DEVICE_ID_LIST,
    $BLUE_TOOTH_DATA,
}                               from 'config/store.config'
import {
    ARR_TIME_STEP,
    DAY_TEXT,
    GLS_TEXT,
    WEB_LINK,
}                               from 'config/base.config'

const app = getApp();

Page(Mixin({
    mixins: [
        WebViewMixin,
    ],
    data: {
        arrTimeStep: ARR_TIME_STEP,
        glsText: GLS_TEXT,
        $params: ''
    },
    onLoad() {
        Store.get($BLUE_TOOTH_DATA).then(($params) => {
            console.log($params)
            this.setData({$params})
        }).catch((err) => {

            console.log(err)
        })
    },
    // 跳转
    handleJump (e) {
        let { currentTarget } = e;
        let url = currentTarget.dataset.url;
        let { IsMember } = app.globalData.userInfo;
        if (!url) return Router.root('home_index');
        Auth.getToken().then((info) => {
            let {
                IsExpire,  // 是否过期
                IsUseCode, // 是否核销
            } = info;
            if (!IsMember) return Router.push(url);
            if (IsExpire) {
                Toast.confirm({
                    content: '你的会员VIP已过期，是否续期？',
                }).then((res) => {
                    let { confirm } = res;
                    confirm && Router.push('mine_introduce_index');
                });
                return;
            }
            this.jumpWebView(WEB_LINK.JKZD);
        });
    }
}));
