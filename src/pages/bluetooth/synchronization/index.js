//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Mixin                        from 'utils/mixin.util'
import SyncMixin                    from 'mixins/sync-data.mixin'
import RouterMixin                  from 'mixins/router.mixin'
import SourceMixin                  from 'mixins/source.mixin'

const arrSrc = [
    { key: 'bg', value: 'sjtb-explain-bg.jpg' },
];

Page(Mixin({
    mixins: [
        SyncMixin,
        RouterMixin,
        SourceMixin,
    ],
    onLoad (options) {
        this.sourceGet(arrSrc);
        this.routerGetParams(options);
    }
}));
