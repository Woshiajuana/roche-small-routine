//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                       from 'plugins/router.plugin'
import Mixin                        from 'utils/mixin.util'
import WebViewMixin                 from 'mixins/webview.mixin'
import UserMixin                    from 'mixins/user.mixin'
import {
    ARR_TIME_STEP,
    DAY_TEXT,
    GLS_TEXT,
    WEB_LINK,
}                               from 'config/base.config'

Page(Mixin({
    mixins: [
        UserMixin,
        WebViewMixin,
    ],
    data: {
        arrTimeStep: ARR_TIME_STEP,
        glsText: GLS_TEXT,
        arrData: '',
    },
    onLoad() {
        this.userGet();
    },
    // 返回首页
    handleJumpHome () {
        Router.pop(2);
    },
    // 打开奖励
    handleJumpReward () {
        Router.push('lottery_reward_index');
    },
}));
