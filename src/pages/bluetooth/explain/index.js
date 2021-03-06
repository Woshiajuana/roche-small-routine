//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Mixin                        from 'utils/mixin.util'
import Router                       from 'plugins/router.plugin'
import Authorize                    from 'plugins/authorize.plugin'
import Modal                        from 'plugins/modal.plugin'
import SourceMixin                  from 'mixins/source.mixin'
import DeviceMixin                  from 'mixins/device.mixin'
import RouterMixin                  from 'mixins/router.mixin'

const arrSrc = [
    { key: 'bg', value: 'bdly-explain-bg.jpg' },
];

Page(Mixin({
    mixins: [
        SourceMixin,
        DeviceMixin,
        RouterMixin,
    ],
    onLoad (options) {
        this.routerGetParams(options);
        this.sourceGet(arrSrc);
    },
    // 跳转
    handleJump (e) {
        let { currentTarget } = e;
        let url = currentTarget.dataset.url;
        if (url === 'record_index') return Router.push(url);
        Authorize(Authorize.SCOPE.userLocation, '添加设备需要地理位置授权').then(() => {
            Router.push(url, this.data.params$);
        }).catch(() => {
            Modal.toast('连接设备需要授权哦')
        });
    },
}));
