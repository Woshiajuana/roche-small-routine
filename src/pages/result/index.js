//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                         from 'plugins/http.plugin'
import Router                       from 'plugins/router.plugin'
import RouterMixin                  from 'mixins/router.mixin'
import UserMixin                    from 'mixins/user.mixin'
import SourceMixin                  from 'mixins/source.mixin'
import Mixin                        from 'utils/mixin.util'
import Calendar, {getMonthDay}      from 'utils/calendar.util'
import {
    ARR_TIME_STEP,
    DAY_TEXT,
    GLS_TEXT,
    WEB_LINK,
}                               from 'config/base.config'

const arrSrc = [
    { key: 'bg', value: 'jgym-header-bg.jpg' },
];

Page(Mixin({
    mixins: [
        RouterMixin,
        UserMixin,
        SourceMixin,
    ],
    data: {
        glsText: GLS_TEXT,
        userInfo: '',
        resultData: [],
        preDay: 0,
        nextDay: 0,
        months: 0,
        progress: 0,
        records: [],
        count: 0,
    },
    onLoad (options) {
        this.sourceGet(arrSrc);
        this.userGet();
        this.routerGetParams(options);
        this.getCalendar();
        this.getTestMonth();
    },
    initData(data){
        if (!data) return;
        let { Speed, Records, PlanCount, TestSugarCount, TestDays } = data;
        let records = [];
        Records.forEach((item) => {
            let time = +item.replace(/[^0-9]/ig, '');
            let day = new Date(time).getDate();
            records.indexOf(day) === -1 && records.push(day);
        });
        let resultData = this.data.resultData;
        resultData.forEach((item) => {
            item.forEach((ite) => {
                records.forEach((it) => {
                    ite.num === it && (ite.value = 1)
                })
            })
        });
        this.setData({
            progress: Speed,
            records,
            count: TestDays,
            resultData,
        });
    },
    // 获取页面数据
    getCalendar() {
        let {
            preDay,
            resultData,
            nextDay,
            months,
        } = Calendar();
        this.setData({
            preDay,
            resultData,
            nextDay,
            months,
        })
    },
    // 获取血糖记录
    getTestMonth() {
        return Http(Http.API.Req_testMonth).then((res) => {
            this.initData(res);
        }).toast();
    },
    handleJump (e) {
        let { currentTarget } = e;
        let url = currentTarget.dataset.url;
        if (!url) return Router.root('home_index');
        if (url) return Router.root(url);
    }
}));
