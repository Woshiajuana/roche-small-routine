//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Mixin                        from 'utils/mixin.util'
import RouterMixin                  from 'mixins/router.mixin'
import SourceMixin                  from 'mixins/source.mixin'
import ShareMixin                   from 'mixins/share.mixin'
import Router                       from 'plugins/router.plugin'
import { SHOP_APP }                 from 'config/base.config'
import Modal                        from 'plugins/modal.plugin'

const arrSrc = [
    { key: 'bg', value: 'hyfwjs.jpg' },
];

Page(Mixin({
    mixins: [
        RouterMixin,
        ShareMixin,
        SourceMixin,
    ],
    onLoad (options) {
        wx.showShareMenu();
        this.sourceGet(arrSrc);
        this.routerGetParams(options);
    },
    // 跳转
    handleJump (e) {
        let {
            IsMember,
            IsExpire,
        } = this.data.params$;
        if (!IsMember)
            return Router.push('questionnaire_one_index', { IsMember: true });
        if (IsExpire)
            return Router.push('activation_index', { IsMember: true });
        Modal.toast('服务期间内，不可再次激活');
    },
    handleJumpApp () {
        wx.navigateToMiniProgram({
            ...SHOP_APP,
            success(res) {
                // 打开成功
            }
        })
    }
}));
