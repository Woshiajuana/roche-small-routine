//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Handle                   from 'mixins/mixin.handle'
import RouterMixin              from 'mixins/router.mixin'
import ShareMixin               from 'mixins/share.mixin'
import Router                   from 'plugins/router.plugin'
import { SHOP_APP }             from 'config/base.config'
import Toast                    from 'plugins/toast.plugin'

Page(Handle({
    mixins: [RouterMixin, ShareMixin],
    onLoad (options) {
        wx.showShareMenu();
        this.getParamsByUrl(options);
    },
    // 跳转
    handleJump (e) {
        let {
            IsMember,
            IsExpire,
        } = this.data.$params;
        if (!IsMember)
            return Router.push('questionnaire_one_index', { IsMember: true });
        if (IsExpire)
            return Router.push('questionnaire_activation_index', { IsMember: true });
        Toast.error('服务期间内，不可再次激活');
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
