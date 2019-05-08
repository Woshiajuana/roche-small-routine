//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                         from 'plugins/http.plugin'
import Router                       from 'plugins/router.plugin'
import Modal                        from 'plugins/modal.plugin'
import Mixin                        from 'utils/mixin.util'
import SourceMixin                  from 'mixins/source.mixin'
import UserMixin                    from 'mixins/user.mixin'
import { formatData, getDate }      from 'wow-cool/lib/date.lib'

const arrSrc = [
    { key: 'bg', value: 'ctjd-bg.jpg' },
    { key: 'icon', value: 'clock-icon.png' },
    { key: 'operate', value: 'clock-btn-icon.png' },
];

Page(Mixin({
    mixins: [
        UserMixin,
        SourceMixin,
    ],
    data: {
        arrList: [],
        curDate: '',
        today: '',
    },
    onLoad () {
        this.sourceGet(arrSrc);
        this.userGet();
        this.initData();
        this.reqPrizeList();
    },
    initData () {
        let curDate = formatData('yyyy-MM-dd');
        this.setData({ curDate });
    },
    handlePrev () {
        let { curDate } = this.data;
        curDate = getDate(-1, 'yyyy-MM-dd', new Date(curDate));
        this.setData({ curDate });
        this.reqPrizeList();
    },
    handleNext () {
        let { curDate } = this.data;
        curDate = getDate(1, 'yyyy-MM-dd', new Date(curDate));
        this.setData({ curDate });
        this.reqPrizeList();
    },
    reqPrizeList () {
        let { curDate } = this.data;
        Http(Http.API.Req_PrizeList, {
            Data: curDate
        }).then((res) => {
            let arrList = res || {};
            this.setData({ arrList });
        }).toast();
    },
}));
