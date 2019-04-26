
import './project.config.json'
import './app.json'
import './app.scss'
import './wxs/filter.wxs'

import Mixin                        from 'utils/mixin.util'

// app.js
App(Mixin({
    onError (msg) {
        console.log(msg);
    },
    globalData: {
        userInfo: null,
        sceneid: '',
        blueTooth: {},
        to: '',
    },
}));
