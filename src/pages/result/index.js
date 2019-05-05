//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'
import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import RouterMixin              from 'mixins/router.mixin'
import UserMixin                from 'mixins/user.mixin'
import Calendar, {getMonthDay}  from 'utils/calendar.util'
import {
    ARR_TIME_STEP,
    DAY_TEXT,
    GLS_TEXT,
    WEB_LINK,
}                               from 'config/base.config'

const app = getApp();

Page(Handle({
    mixins: [
        RouterMixin,
        UserMixin,
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
        this.userGet();
        this.setData({ userInfo: app.globalData.userInfo });
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
        let options = {
            url: 'RocheApi/GetTestMonth',
            loading: true,
        };
        return Http(options).then((res) => {
            this.initData(res);
        }).catch((err) => {
            Toast.error(err);
        });
    },
    handleJump (e) {
        let { currentTarget } = e;
        let url = currentTarget.dataset.url;
        if (!url) return Router.root('home_index');
        if (url) return Router.root(url);
        // let {IsMember} = this.data.userInfo;
        // IsMember ? Router.push('web_index', WEB_LINK.JKZD) : Router.push(url);
    }
}));
