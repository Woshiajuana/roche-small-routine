//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                         from 'plugins/http.plugin'
import Router                       from 'plugins/router.plugin'
import Modal                        from 'plugins/modal.plugin'
import Mixin                        from 'utils/mixin.util'
import SourceMixin                  from 'mixins/source.mixin'
import UserMixin                    from 'mixins/user.mixin'

const arrSrc = [
    { key: 'bg', value: 'ctjd-bg.jpg' },
    { key: 'icon', value: 'clock-icon.png' },
    { key: 'operate', value: 'clock-btn-icon.png' },
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
}));
