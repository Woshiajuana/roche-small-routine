//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                         from 'plugins/http.plugin'
import Router                       from 'plugins/router.plugin'
import Modal                        from 'plugins/modal.plugin'
import Mixin                        from 'utils/mixin.util'
import Valid                        from 'utils/valid.util'
import InputMixin                   from 'mixins/input.mixin'
import SourceMixin                  from 'mixins/source.mixin'

const arrSrc = [
    { key: 'bg', value: 'activation-bg.jpg' },
];

Page(Mixin({
    mixins: [
        InputMixin,
        SourceMixin,
    ],
    onLoad () {
        this.sourceGet(arrSrc);
    },
}));
