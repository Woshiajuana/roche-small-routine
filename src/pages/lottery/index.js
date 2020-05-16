//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                       from 'plugins/router.plugin'
import Mixin                        from 'utils/mixin.util'
import UserMixin                    from 'mixins/user.mixin'
import Http                         from 'plugins/http.plugin'
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
        Http(Http.API.Req_GetActivityUser).then((res) => {
            let { IsGuide } = res;
            Router.push(
                IsGuide ? 'bluetooth_synchronization_index' : 'bluetooth_explain_index',
                { index: 1, result: true, from: 'lottery_index' }
            );
        }).toast();
    },
}));
