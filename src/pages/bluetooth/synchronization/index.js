//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Handle                   from 'mixins/mixin.handle'
import SyncMixin                from 'mixins/sync-data.mixin'
import RouterMixin              from 'mixins/router.mixin'

Page(Handle({
    mixins: [SyncMixin,RouterMixin],
    onLoad (options) {
        this.getParamsByUrl(options);
    }
}));
