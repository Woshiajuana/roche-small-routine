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
    data: {
        arrData: '',
    },
    onShow () {
        this.userGet();
        this.reqRewardData();
    },
    reqRewardData () {
        Http(Http.API.Req_GetSignInReward).then((res) => {
            this.setData({ arrData: res || [] });
        }).toast();
    },
    handleReward (e) {
        let { item } = e.currentTarget.dataset;
        let { IsReceive } = item;
        if (IsReceive) return null;
        Router.push('lottery_gift_index', item);
    },
    handleSee () {
        Router.push('lottery_form_index');
    },
}));
