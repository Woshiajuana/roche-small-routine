//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Mixin                        from 'utils/mixin.util'
import Router                       from 'plugins/router.plugin'
import SourceMixin                  from 'mixins/source.mixin'
import DeviceMixin                  from 'mixins/device.mixin'
import RouterMixin                  from 'mixins/router.mixin'
import BleMixin                     from 'mixins/ble.mixin'

Page(Mixin({
    mixins: [
        SourceMixin,
        DeviceMixin,
        RouterMixin,
        BleMixin,
    ],
    data: {
        numIndex: 0,
        deviceId: '',
        isSyncPopup: false,
        isAddPopup: false,
    },
    onLoad (options) {
        this.routerGetParams(options);
    },
    // 选择
    handleSelect (event) {
        let { params$ } = this.data;
        let { index } = event.currentTarget.dataset;
        console.log(index, params$);
        if (index === 2 && params$.to === 'bluetooth_explain_index') {
            return this.setData({
                numIndex: index,
                isAddPopup: true,
            });
        }
        if (index === 1) {
            this.setData({
                numIndex: index,
                isSyncPopup: params$.to === 'bluetooth_synchronization_index',
                isAddPopup: params$.to === 'bluetooth_explain_index',
            });
            return null;
        }
        Router.push(this.data.params$.to, { index });
    },
    handleTap (event) {
        this.setData({
            isSyncPopup: false,
            isAddPopup: false,
        });
        let { params$, numIndex } = this.data;
        let { params } = event.currentTarget.dataset;
        if (numIndex === 2 && !params) {
            return this.setData({ isComplete: true });
        }
        Router.push(params$.to, { index: numIndex, result: params });
    },
    // 跳转
    handleJumpRecord (e) {
        Router.push('record_index');
    },
    handleComplete() {
        this.setData({ isComplete: false });
        Router.push('bluetooth_synchronization_index', { index: 2 });
    }
}));
