//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                       from 'plugins/router.plugin'
import Mixin                        from 'utils/mixin.util'
import UserMixin                    from 'mixins/user.mixin'

Page(Mixin({
    mixins: [
        UserMixin,
    ],
    data: {

    },
    onLoad () {
        this.userGet();
    },
}));
