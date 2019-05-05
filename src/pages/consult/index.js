//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                       from 'plugins/router.plugin'
import Mixin                        from 'utils/mixin.util'
import WebViewMixin                 from 'mixins/webview.mixin'
import SourceMixin                  from 'mixins/source.mixin'
import {
    WEB_LINK,
}                                   from 'config/base.config'

const arrSrc = [
    { key: 'bg', value: 'zxzx-icon.png' },
];

Page(Mixin({
    mixins: [
        WebViewMixin,
        SourceMixin,
    ],
    onLoad () {
        this.sourceGet(arrSrc);
    },
    // 跳转
    handleJump (e) {
        let { currentTarget } = e;
        let url = currentTarget.dataset.url;
        if ( url === 'web_index') {
            return this.jumpWebView(WEB_LINK.ZXWZ);
        }
        Router.push(url);
    },
}));
