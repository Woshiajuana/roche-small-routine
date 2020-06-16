//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                       from 'plugins/router.plugin'
import Mixin                        from 'utils/mixin.util'
import UserMixin                    from 'mixins/user.mixin'
import RouterMixin                  from 'mixins/router.mixin'
import Http                         from 'plugins/http.plugin'
import Modal                        from 'plugins/modal.plugin'

Page(Mixin({
    mixins: [
        UserMixin,
        RouterMixin,
    ],
    data: {
        Id: ''
    },
    onLoad (options) {
        console.log('options => ', options);
        this.routerGetParams(options);
        let { params$ = {} } = this.data;
        if (options.Id) {
            params$.Id = options.Id;
            params$.BeginDateStr = options.start || '';
            params$.EndDateStr = options.end || '';
            this.setData({ Id: options.Id, params$ });
        }
        this.userGet();
    },
    handleReward () {
        Http(Http.API.Do_ReceiveRedPackage, {
            Data: this.data.params$.Id || this.data.Id,
        }).then((res) => {
            Modal.confirm({
                content: '领取成功，请查看微信哦...',
                confirmText: '我知道了',
                showCancel: false,
            }).then(() => {
                Router.pop();
            }).null();
        }).toast();
    },
}));
