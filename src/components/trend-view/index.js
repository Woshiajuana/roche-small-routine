import './index.json'
import './index.wxml'
import './index.scss'

import Mixin                        from 'utils/mixin.component.util'
import Http                         from 'plugins/http.plugin'
import Modal                        from 'plugins/modal.plugin'
import UserMixin                    from 'mixins/user.mixin'
import SourceMixin                  from 'mixins/source.mixin'
import { getDate, formatData }      from 'wow-cool/lib/date.lib'
import {
    getWeekLineChart,
}                                   from 'utils/chart.util'
import {
    ARR_TIME_STEP,
    DAY_TEXT,
    GLS_TEXT,
    WEB_LINK,
    CANVAS_X,
    ARR_TIME_X,
}                                   from 'config/base.config'

// const data1 = [
//     { "year": '05-06', "type": "早餐", "value": 6 },
//     { "year": '05-06', "type": "中餐", "value": 6 },
//     { "year": '05-06', "type": "晚餐", "value": 6 },
//     { "year": '05-07', "type": "早餐", "value": 6 },
//     { "year": '05-07', "type": "中餐", "value": 6 },
//     { "year": '05-07', "type": "晚餐", "value": 6 },
//     { "year": '05-08', "type": "早餐", "value": 6 },
//     { "year": '05-08', "type": "中餐", "value": 6 },
//     { "year": '05-08', "type": "晚餐", "value": 6 },
//     { "year": '05-09', "type": "早餐", "value": 6 },
//     { "year": '05-09', "type": "中餐", "value": 6 },
//     { "year": '05-09', "type": "晚餐", "value": 6 },
// ];

let LineChart = null;
let type = false;
const arrSrc = [
    { key: 'bg', value: 'mb-bg.jpg' },
];

Component(Mixin({
    mixins: [
        UserMixin,
        SourceMixin,
    ],
    data: {
        canvasOpts:  {
            onInit: '',
        },
        sTime: '',
        eTime: '',
        arrDate: [],

        vSTime2: '',
        vETime2: '',

        curTime: new Date().getTime(),
        isCurWeek: true,

        isNotData: false,
    },
    lifetimes: {
        attached () {
            this.sourceGet(arrSrc);
            type = false;
            this.userGet();
            this.setData({ curTime: new Date().getTime() });
            this.getDay();
            this.assignmentData();
            this.reqMonthlyTrend();
        },
    },
    methods: {
        // 上下周
        handlePreOrNext (e) {
            if (type) return;
            type = true;
            setTimeout(() => {type = false}, 1000);
            let { currentTarget } = e;
            let count = +currentTarget.dataset.count;
            let date = new Date(this.data.curTime);
            date.setDate(date.getDate() + count);
            let curTime = date.getTime();
            let { sTime, eTime } = this.getDay(new Date().getTime());
            let endTime = new Date(eTime.replace(/-/g, '\/') + ' 23:59:59').getTime();
            let strTime = new Date(sTime.replace(/-/g, '\/') + ' 00:00:00').getTime();
            if (curTime > endTime) return Modal.toast('下一周还没开始哦');
            this.setData({
                curTime,
                isCurWeek: (curTime < endTime && curTime > strTime),
            });
            this.getDay();
            this.reqMonthlyTrend();
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
                weekData = res || [];
                this.setData({
                    isNotData: weekData.length === 0
                });
                this.updateChartData(weekData);
            }).toast();
        },
        // 赋值
        assignmentData () {
            LineChart = getWeekLineChart([], this.data.arrDate);
            this.setData({
                ['canvasOpts.onInit']: LineChart.init,
            });
        },

        updateChartData (data) {
            let result = [];
            data.reverse();
            data.forEach((item) => {
                let time = item.TestDate.replace(/[^0-9]/ig, '');
                let year = formatData('MMdd', new Date(+time));
                let num = (+item.TimeStepExt*1.4).toFixed(1);
                if (item.Bloodsugar) {
                    result.push({
                        year: +`9${year}${num}`,
                        type: '血糖趋势',
                        // year: formatData('MM-dd', new Date(+time)),
                        // type: ARR_TIME_STEP[item.TimeStepExt - 1],
                        value: item.Bloodsugar,
                    })
                }

            });
            console.log(result)
            setTimeout(() => {
                LineChart && LineChart.update(result);
            }, 800);
        },

        // 获取日期
        getDay (cTime) {
            let curTime = cTime || this.data.curTime;
            let date = new Date(curTime);
            let day = date.getDay();
            let arrDate = [];
            let result = '';
            switch (day){
                case 0:
                    result = {
                        sTime: getDate(-6, 'yyyy-MM-dd', new Date(curTime)),
                        eTime: getDate(0, 'yyyy-MM-dd', new Date(curTime)),
                    };
                    arrDate = this.getDayArr(-6, 0);
                    break;
                case 1:
                    result = {
                        sTime: getDate(0, 'yyyy-MM-dd', new Date(curTime)),
                        eTime: getDate(6, 'yyyy-MM-dd', new Date(curTime)),
                    };
                    arrDate = this.getDayArr(0, 6);
                    break;
                case 2:
                    result = {
                        sTime: getDate(-1, 'yyyy-MM-dd', new Date(curTime)),
                        eTime: getDate(5, 'yyyy-MM-dd', new Date(curTime)),
                    };
                    arrDate = this.getDayArr(-1, 5);
                    break;
                case 3:
                    result = {
                        sTime: getDate(-2, 'yyyy-MM-dd', new Date(curTime)),
                        eTime: getDate(4, 'yyyy-MM-dd', new Date(curTime)),
                    };
                    arrDate = this.getDayArr(-2, 4);
                    break;
                case 4:
                    result = {
                        sTime: getDate(-3, 'yyyy-MM-dd', new Date(curTime)),
                        eTime: getDate(3, 'yyyy-MM-dd', new Date(curTime)),
                    };
                    arrDate = this.getDayArr(-3, 3);
                    break;
                case 5:
                    result = {
                        sTime: getDate(-4, 'yyyy-MM-dd', new Date(curTime)),
                        eTime: getDate(2, 'yyyy-MM-dd', new Date(curTime)),
                    };
                    arrDate = this.getDayArr(-4, 2);
                    break;
                case 6:
                    result = {
                        sTime: getDate(-5, 'yyyy-MM-dd', new Date(curTime)),
                        eTime: getDate(1, 'yyyy-MM-dd', new Date(curTime)),
                    };
                    arrDate = this.getDayArr(-5, 1);
                    break;
            }
            let { sTime, eTime } = result;
            console.log(result)
            if (!cTime) {
                this.setData({
                    sTime,
                    eTime,
                    arrDate,
                    vSTime2: formatData('MM月dd日', new Date(sTime)),
                    vETime2: formatData('MM月dd日', new Date(eTime)),
                });
            }
            return result;
        },
        getDayArr (index, max) {
            let result = [];
            while (max >= index) {
                result.push(+`9${getDate(index, 'MMdd')}0`);
                index++;
            }
            return result;
        },
    }
}));
