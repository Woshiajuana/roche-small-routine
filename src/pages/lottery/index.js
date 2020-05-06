//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                       from 'plugins/router.plugin'
import Mixin                        from 'utils/mixin.util'
import UserMixin                    from 'mixins/user.mixin'
import Store                        from 'plugins/store.plugin'
import {
    $BLUE_TOOTH_DEVICE_ID_LIST,
}                                   from 'config/store.config'

Page(Mixin({
    mixins: [
        UserMixin,
    ],
    onLoad () {
        this.userGet();
    },
    // 打卡记录
    handleJumpRecord () {
        Router.push('lottery_record_index');
    },
    // 立即打卡
    handleJumpClockIn () {
        Store.get($BLUE_TOOTH_DEVICE_ID_LIST).then(() =>{
            Router.push('bluetooth_synchronization_index');
        }).catch(() => {
            Router.push('bluetooth_explain_index');
        });
    },
}));
