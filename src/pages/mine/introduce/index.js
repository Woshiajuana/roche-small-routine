//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Mixin                        from 'utils/mixin.util'
import SourceMixin                  from 'mixins/source.mixin'
import ShareMixin                   from 'mixins/share.mixin'
import UserMixin                    from 'mixins/user.mixin'
import Router                       from 'plugins/router.plugin'
import { SHOP_APP }                 from 'config/base.config'
import Modal                        from 'plugins/modal.plugin'

const arrSrc = [
    { key: 'bg', value: 'hyfwjs.jpg' },
];

Page(Mixin({
    mixins: [
        ShareMixin,
        SourceMixin,
        UserMixin,
    ],
    onLoad () {
        wx.showShareMenu();
        this.sourceGet(arrSrc);
        this.userGet();
    },
    // 跳转
    handleJump () {
        let { IsMember, IsExpire} = this.data.user$;
        if (!IsMember) return null;
        if (IsExpire) return Router.push('activation_index', { IsMember });
        Modal.toast('服务期间内，不可再次激活');
    },
    handleJumpApp () {
        wx.navigateToMiniProgram({
            ...SHOP_APP,
            success(res) {},
            fail(){},
        })
    },
}));
