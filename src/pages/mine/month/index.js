//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                         from 'plugins/http.plugin'
import Modal                        from 'plugins/modal.plugin'
import Mixin                        from 'utils/mixin.util'
import ShareMixin                   from 'mixins/share.mixin'
import SourceMixin                  from 'mixins/source.mixin'
import {
    getDate,
    formatData
}                                   from 'wow-cool/lib/date.lib'
import {
    ARR_TIME_STEP,
    DAY_TEXT
}                                   from 'config/base.config'
let type = false;
const arrSrc = [
    { key: 'icon1', value: 'xtbg-icon-9.png' },
    { key: 'icon2', value: 'xtbg-icon-8.png' },
    { key: 'icon3', value: 'xtbg-icon-6.png' },
    { key: 'icon4', value: 'xtbg-icon-7.png' },
    { key: 'icon5', value: 'xtbg-icon-4.png' },
    { key: 'icon6', value: 'xtbg-ewm-icon.jpg' },
];

Page(Mixin({
    mixins: [
        ShareMixin,
        SourceMixin,
    ],
    data: {
        sTime: '',
        eTime: '',
        cTime: '',
        weekReport: {},
        isCurWeek: true,
    },
    onLoad () {
        this.sourceGet(arrSrc);
        wx.showShareMenu();
        type = false;
        this.setData({
            cTime: formatData('yyyy-MM'),
        });
        this.initData('-1');
        this.getMonthReport();
    },
    // 获取当前时间下一周
    initData(type) {
        let { cTime, isCurWeek} = this.data;
        if (!cTime) {
            cTime = formatData('yyyy-MM')
        }

        let date = new Date(cTime);
        if (type === '1') {
            date = new Date(date.setMonth(date.getMonth() + 1));
            cTime = formatData('yyyy-MM', date);
        }
        if (type === '-1') {
            date = new Date(date.setMonth(date.getMonth() - 1));
            cTime = formatData('yyyy-MM', new Date(date));
        }
        let y = date.getFullYear();
        let m = date.getMonth();
        let sTime = formatData('yyyy-MM-dd', new Date(y, m, 1));
        let eTime = formatData('yyyy-MM-dd', new Date(y, m + 1, 0));
        this.setData({
            sTime,
            eTime,
            cTime,
            isCurWeek: cTime === formatData('yyyy-MM'),
        })
    },
    // 上下月
    handlePreOrNext (e) {
        if (type) return;
        type = true;
        setTimeout(() => {type = false}, 1000);
        let { count } = e.currentTarget.dataset;
        if (count === '1' && this.data.isCurWeek) {
            return Modal.toast('下一月还没开始哦');
        }
        this.initData(count);
        this.getMonthReport();
    },
    // 获取周报
    getMonthReport () {
        let Stime = this.data.sTime;
        let Etime = this.data.eTime;
        let weekReport;
        return Http(Http.API.Req_monthReport, {
            Stime,
            Etime,
        }).then((res) => {
            weekReport = res || {};
        }).catch((err) => {
            Modal.toast(err);
            weekReport = {};
        }).finally(() => {
            this.setData({weekReport})
        });
    },
}));
