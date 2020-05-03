//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                       from 'plugins/router.plugin'
import Mixin                        from 'utils/mixin.util'
import Store                        from 'plugins/store.plugin'
import WebViewMixin                 from 'mixins/webview.mixin'
import UserMixin                    from 'mixins/user.mixin'
import Modal                        from 'plugins/modal.plugin'
import {
    $BLUE_TOOTH_DEVICE_ID_LIST,
    $BLUE_TOOTH_DATA,
}                               from 'config/store.config'
import {
    ARR_TIME_STEP,
    DAY_TEXT,
    GLS_TEXT,
    WEB_LINK,
}                               from 'config/base.config'

Page(Mixin({
    mixins: [
        UserMixin,
        WebViewMixin,
    ],
    data: {
        arrTimeStep: ARR_TIME_STEP,
        glsText: GLS_TEXT,
        params$: '',
        isPopup: false,
    },
    onLoad() {
        this.userGet();
        Store.get($BLUE_TOOTH_DATA).then((params$) => {
            console.log(params$)
            this.setData({params$})
        }).catch((err) => {
            console.log(err)
        })
    },
    // 跳转
    handleJump (e) {
        let { currentTarget } = e;
        let url = currentTarget.dataset.url;
        if (!url) return Router.root('home_index');
        let {IsExpire, IsUseCode, IsMember} = this.data.user$;
        if (!IsMember) return Router.push(url);
        if (IsExpire) {
            Modal.confirm({
                content: '你的会员VIP已过期，是否续期？',
            }).then((res) => {
                let { confirm } = res;
                confirm && Router.push('mine_introduce_index');
            });
            return;
        }
        if (!IsUseCode)  return this.setData({isPopup: true});
        this.jumpWebView(WEB_LINK.JKZD);
    },
    handlePopClose () {
        this.setData({isPopup: false});
    }
}));
