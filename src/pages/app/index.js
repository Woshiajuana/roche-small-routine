//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Mixin                        from 'utils/mixin.util'
import Router                       from 'plugins/router.plugin'
import RouterConfig                 from 'config/router.config'

Page(Mixin({
    data: {
        dataList: RouterConfig,
    },
    onShow() {

    },
    onLoad () {

    },
    onReady () {

    },
    // 导航条切换
    handleJump (event) {
        let {
            key,
        } = event.currentTarget.dataset;
        Router.push(key);
    }
}));
