
import './project.config.json'
import './app.json'
import './app.scss'
import './wxs/filter.wxs'
import './sitemap.json'

import ald                          from 'utils/ald-stat.js'
import Mixin                        from 'utils/mixin.util'
import F2                           from 'utils/wx-f2.min'
import Router                       from 'plugins/router.plugin'

// app.js
App(Mixin({
    onError (msg) {
        console.log(msg);
    },
    onPageNotFound () {
        Router.push('login_index');
    },
    globalData: {
        userInfo: null,
        sceneid: '',
        blueTooth: {},
        to: '',
        F2,
    },
}));
