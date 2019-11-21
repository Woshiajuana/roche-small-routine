//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Mixin                        from 'utils/mixin.util'
import SyncMixin                    from 'mixins/sync-data.mixin'
import RouterMixin                  from 'mixins/router.mixin'
import SourceMixin                  from 'mixins/source.mixin'
import BleMixin                     from 'mixins/ble.mixin'

const arrSrc = [
    { key: 'bg', value: 'sjtb-explain-bg.jpg' },
];

Page(Mixin({
    mixins: [
        BleMixin,
        SyncMixin,
        RouterMixin,
        SourceMixin,
    ],
    onLoad (options) {
        this.sourceGet(arrSrc);
        this.routerGetParams(options);
        this.getStatus();
    },
    getStatus () {
        let { deviceId, serviceId } = this.data.params$;
        this.bleGetStatus(deviceId, serviceId).then((res) => {
            console.log('取特征值成功', res);
        }).catch((err) => {
            console.log('取特征值失败', err);
        });
    },
    handleSync1 () {
        let { deviceId, serviceId } = this.data.params$;
        this.bleSyncData(deviceId, serviceId, (res) => {
            console.log('成功1', res);
        },(res) => {
            console.log('成功2', res);
        },(err) => {
            console.log('失败', err);
        });
    }
}));
