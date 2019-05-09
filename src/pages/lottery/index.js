//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                       from 'plugins/router.plugin'
import Mixin                        from 'utils/mixin.util'
import SourceMixin                  from 'mixins/source.mixin'
import UserMixin                    from 'mixins/user.mixin'

const arrSrc = [
    { key: 'bg', value: 'luck-draw-bg.jpg' },
];

Page(Mixin({
    mixins: [
        UserMixin,
        SourceMixin,
    ],
    onLoad () {
        this.sourceGet(arrSrc);
        this.userGet();
    },
    handleJump () {
        Router.push('record_index');
    },
}));
