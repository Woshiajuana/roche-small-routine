//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'
import Handle                   from 'mixins/mixin.handle'
import ShareMixin               from 'mixins/share.mixin'
import {
    getDate,
    formatData
}                               from 'wow-cool/lib/date.lib'
import {
    ARR_TIME_STEP,
    DAY_TEXT
}                               from 'config/base.config'
let type = false;
Page(Handle({
    mixins: [ShareMixin],
    data: {
        sTime: '',
        eTime: '',
        cTime: '',
        weekReport: {},
        isCurWeek: true,
    },
    onLoad () {
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
            return Toast.error('下一月还没开始哦');
        }
        this.initData(count);
        this.getMonthReport();
    },
    // 获取周报
    getMonthReport () {
        let Stime = this.data.sTime;
        let Etime = this.data.eTime;
        let options = {
            url: 'RocheApi/GetMonthReport',
            loading: true,
            data: {
                Stime,
                Etime,
            }
        };
        let weekReport;
        return Http(options).then((res) => {
            weekReport = res || {};
        }).catch((err) => {
            Toast.error(err);
            weekReport = {};
        }).finally(() => {
            this.setData({
                weekReport,
            })
        });
    },
}));
