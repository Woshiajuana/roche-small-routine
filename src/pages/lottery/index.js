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
    data: {
        isPopup: false,
    },
    onLoad () {
        this.sourceGet(arrSrc);
        this.userGet();
    },
    handleJump () {
        this.setData({isPopup: true});
    },
    handleRoot () {
        Router.root('home_index');
    }
}));
