//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Mixin                        from 'utils/mixin.util'
import Router                       from 'plugins/router.plugin'
import SourceMixin                  from 'mixins/source.mixin'
import DeviceMixin                  from 'mixins/device.mixin'
import RouterMixin                  from 'mixins/router.mixin'

const arrSrc = [
    { key: 's1', value: '20200117-s-1.png' },
    { key: 's2', value: '20200117-s-2.png' },
    { key: 's3', value: '20200117-s-3.png' },
];

Page(Mixin({
    mixins: [
        SourceMixin,
        DeviceMixin,
        RouterMixin,
    ],
    data: {
        numIndex: 0,
    },
    onLoad (options) {
        this.routerGetParams(options);
        this.sourceGet(arrSrc);
    },
    // 选择
    handleSelect (event) {
        let { index } = event.currentTarget.dataset;
        this.setData({ numIndex: index });
    },
    // 跳转
    handleJump () {
        Router.push(this.data.params$.to, { index: this.data.numIndex });
    },
}));
