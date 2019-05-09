//index.js
import './index.json'
import './index.scss'
import './index.wxml'


import Mixin                        from 'utils/mixin.util'
import SourceMixin                  from 'mixins/source.mixin'
import RouterMixin                  from 'mixins/router.mixin'
import Modal                        from 'plugins/modal.plugin'
import Router                       from 'plugins/router.plugin'

const arrSrc = [
    { key: 'bg', value: 'welcome-bg.jpg' },
];

Page(Mixin({
    mixins: [
        SourceMixin,
        RouterMixin,
    ],
    onLoad (options) {
        // 获取资源
        this.sourceGet(arrSrc);
        // 获取页面参数
        this.routerGetParams(options);
    },
    // 提交下一步
    handleJump (event) {
        Router.root('questionnaire_info_index', { IsMember: true }, true);
    },
}));
