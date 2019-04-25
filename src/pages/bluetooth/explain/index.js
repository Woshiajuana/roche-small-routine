//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import Authorize, { SCOPE }     from 'plugins/authorize.plugin'
import Toast                    from 'plugins/toast.plugin'

Page(Handle({
    // 跳转
    handleJump (e) {
        let { currentTarget } = e;
        let url = currentTarget.dataset.url;
        if (url === 'record_index') return Router.push(url);
        Authorize(SCOPE.userLocation, '添加设备需要地理位置授权').then(() => {
            Router.push(url);
        }).catch(() => {
            Toast.error('连接设备需要授权哦')
        });
    },
}));
