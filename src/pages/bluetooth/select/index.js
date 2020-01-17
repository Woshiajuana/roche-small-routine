//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Mixin                        from 'utils/mixin.util'
import Source                       from 'utils/source.util'
import Router                       from 'plugins/router.plugin'
import Authorize                    from 'plugins/authorize.plugin'
import Modal                        from 'plugins/modal.plugin'
import SourceMixin                  from 'mixins/source.mixin'

const arrSrc = [
    { key: 's1', value: '20200117-s-1.png' },
    { key: 's2', value: '20200117-s-2.png' },
    { key: 's3', value: '20200117-s-3.png' },
];

Page(Mixin({
    mixins: [
        SourceMixin,
    ],
    data: {
        numIndex: 0,
        arrDevice: [
            {
                src: Source('20200117-s-1.png'),
            },
            {
                src: Source('20200117-s-2.png'),
            },
            {
                src: Source('20200117-s-3.png'),
            },
        ],
    },
    onLoad () {
        this.sourceGet(arrSrc);
    },
    // 选择
    handleSelect (event) {
        let { index } = event.currentTarget.dataset;
        this.setData({ numIndex: index });
    },
    // 跳转
    handleJump (e) {
        let { currentTarget } = e;
        let url = currentTarget.dataset.url;
        if (url === 'record_index') return Router.push(url);
        Authorize(Authorize.SCOPE.userLocation, '添加设备需要地理位置授权').then(() => {
            Router.push(url);
        }).catch(() => {
            Modal.toast('连接设备需要授权哦')
        });
    },
}));
