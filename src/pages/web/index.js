//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Mixin                        from 'utils/mixin.util'
import RouterMixin                  from 'mixins/router.mixin'

Page(Mixin({
    mixins: [
        RouterMixin,
    ],
    // 生命周期回调—监听页面加载
    onLoad (options) {
        this.routerGetParams(options);
        wx.setNavigationBarTitle({title: this.data.params$.title})
    },
}));
