//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                         from 'plugins/http.plugin'
import Router                       from 'plugins/router.plugin'
import Modal                        from 'plugins/modal.plugin'
import Mixin                        from 'utils/mixin.util'
import SourceMixin                  from 'mixins/source.mixin'
import RouterMixin                  from 'mixins/router.mixin'
import DataMixin                    from './data.mixin'

const arrSrc = [
    { key: 'bg', value: 'activation-bg.jpg' },
];

Page(Mixin({
    mixins: [
        DataMixin,
        RouterMixin,
        SourceMixin,
    ],
    onLoad (options) {
        this.sourceGet(arrSrc);
        this.routerGetParams(options);
        this.assignmentData();
    },
    assignmentData () {
        let { curKey } = this.data.params$;
        if (!curKey) return null;
        this.setData({ curKey });
    },
    handleSwitch (event) {
        let { key } = event.currentTarget.dataset;
        this.setData({ curKey: key });
    },
}));
