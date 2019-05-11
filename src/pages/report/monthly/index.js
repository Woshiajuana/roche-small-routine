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
    formatData
}                                   from 'wow-cool/lib/date.lib'
import {
    ARR_TIME_STEP,
    DAY_TEXT
}                                   from 'config/base.config'

import {
    getLineChart,
    F2
}                                   from 'utils/chart.util'
let type = false;

let LineChart = null;

const arrSrc = [
    { key: 'bg', value: 'yb-bg.jpg' },
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
        lineChartOpts:  {
            onInit: '',
        },
        arrDate: [],
    },
    onLoad () {
        this.sourceGet(arrSrc);
        wx.showShareMenu();
        type = false;
        this.setData({
            cTime: formatData('yyyy-MM'),
        });
        this.initData('-1');
        this.getArrDate();
        this.assignmentData();
        this.getMonthReport();
        this.reqSugarSpider();
        this.reqMonthlyTrend();
    },
    // 赋值
    assignmentData () {
        LineChart = getLineChart([], this.data.arrDate);
        this.setData({
            ['lineChartOpts.onInit']: LineChart.init,
        });
    },
    // 获取当前月分
    getArrDate () {
        let { sTime, eTime, arrDate} = this.data;
        sTime = +formatData('dd', new Date(sTime));
        eTime = +formatData('dd', new Date(eTime));
        while (sTime <= eTime) {
            arrDate.push(sTime);
            sTime++;
        }
        this.setData({ arrDate });
        console.log(arrDate)
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
    updateRadarData (data) {
        let result = [
            {
                item: '血糖波动',
                user: '血糖',
                score: data.AvgVal,
            },
            {
                item: '餐后血糖',
                user: '血糖',
                score: data.AvgAfterVal,
            },
            {
                item: '低血糖状况',
                user: '血糖',
                score: data.AvgLowVal,
            },
            {
                item: '空腹餐前血糖',
                user: '血糖',
                score: data.AvgFastingBeforeVal,
            }
        ];
        let max = 0;
        result.forEach((item) => {
            if (item.score > max)
                max = item.score;
        });
        setTimeout(() => {
            this.f2Chart = this.selectComponent('#canvas-dom');
            if (!this.f2Chart) return null;
            // 获取组件后调用 init 方法
            this.f2Chart.init((canvas, width, height) => {
                let chart = new F2.Chart({
                    el: canvas,
                    width,
                    height,
                    padding: ['auto'],
                });
                chart.coord('polar');
                chart.source(result, {
                    score: {
                        min: 0,
                        max,
                        nice: false,
                        tickCount: 4
                    }
                });
                chart.area().position('item*score').color('user').animate({
                    appear: {
                        animation: 'groupWaveIn'
                    }
                });
                chart.line().position('item*score').color('user').animate({
                    appear: {
                        animation: 'groupWaveIn'
                    }
                });
                chart.point().position('item*score').color('user').style({
                    stroke: '#fff',
                    lineWidth: 1
                }).animate({
                    appear: {
                        delay: 300
                    }
                });
                chart.render();
                return chart;
            });
        }, 300);
    },
    updateChartData (data) {
        let result = [];
        data.forEach((item) => {
            result.push({
                year: this.data.arrDate[item.Day],
                type: ARR_TIME_STEP[item.TimeStep - 1],
                value: item.Bloodsugar,
            })
        });
        console.log(result)
        setTimeout(() => {
            LineChart && LineChart.update(result);
        }, 800);
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
        this.reqSugarSpider();
        this.reqMonthlyTrend();
    },
    // 获取
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
    // 获取血糖趋势图
    reqMonthlyTrend () {
        let Stime = this.data.sTime;
        let Etime = this.data.eTime;
        let weekData;
        return Http(Http.API.Req_sugarTrend, {
            Stime,
            Etime,
        }).then((res) => {
            weekData = res || {};
        }).catch((err) => {
            Modal.toast(err);
            weekData = {};
        }).finally(() => {
            this.updateChartData(weekData);
        });
    },
    // 获取血糖蜘蛛图
    reqSugarSpider () {
        let Stime = this.data.sTime;
        let Etime = this.data.eTime;
        let weekData;
        return Http(Http.API.Req_sugarSpider, {
            Stime,
            Etime,
        }).then((res) => {
            weekData = res || {};
        }).catch((err) => {
            Modal.toast(err);
            weekData = {};
        }).finally(() => {
            this.updateRadarData(weekData);
        });
    },
}));
