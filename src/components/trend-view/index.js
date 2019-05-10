import './index.json'
import './index.wxml'
import './index.scss'

import Mixin                        from 'utils/mixin.component.util'
import Http                         from 'plugins/http.plugin'
import { getDate, formatData }      from 'wow-cool/lib/date.lib'
import {
    getLineChart,
}                                   from 'utils/chart.util'
import {
    ARR_TIME_STEP,
    DAY_TEXT,
    GLS_TEXT,
    WEB_LINK,
}                                   from 'config/base.config'

const data1 = [
    { "year": '05-06', "type": "早餐", "value": 6 },
    { "year": '05-06', "type": "中餐", "value": 6 },
    { "year": '05-06', "type": "晚餐", "value": 6 },
    { "year": '05-07', "type": "早餐", "value": 6 },
    { "year": '05-07', "type": "中餐", "value": 6 },
    { "year": '05-07', "type": "晚餐", "value": 6 },
    { "year": '05-08', "type": "早餐", "value": 6 },
    { "year": '05-08', "type": "中餐", "value": 6 },
    { "year": '05-08', "type": "晚餐", "value": 6 },
    { "year": '05-09', "type": "早餐", "value": 6 },
    { "year": '05-09', "type": "中餐", "value": 6 },
    { "year": '05-09', "type": "晚餐", "value": 6 },
];

let LineChart = null;

Component(Mixin({
    mixins: [

    ],
    data: {
        canvasOpts:  {
            onInit: '',
        },
        sTime: '',
        eTime: '',
        arrDate: [],
    },
    lifetimes: {
        attached () {
            this.getDay();
            this.assignmentData();
            this.getRecommendSugar();
        },
    },
    methods: {
        // 获取报告
        getRecommendSugar () {
            let Stime = this.data.sTime;
            let Etime = this.data.eTime;
            Http(Http.API.Req_recommendSugar, {
                Stime,
                Etime,
                Type: 2,
            }).then((res) => {
                let { Steps } = res;
                // ARR_TIME_STEP
                this.updateChartData(Steps);
            }).toast();
        },
        // 赋值
        assignmentData () {
            LineChart = getLineChart([], this.data.arrDate);
            this.setData({
                ['canvasOpts.onInit']: LineChart.init,
            });
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

        // 获取日期
        getDay () {
            let date = new Date();
            let day = date.getDay();
            let arrDate = [];
            let result = '';
            switch (day){
                case 0:
                    result = {
                        sTime: getDate(-6, 'MM-dd'),
                        eTime: getDate(0, 'MM-dd'),
                    };
                    arrDate = this.getDayArr(-6, 0);
                    break;
                case 1:
                    result = {
                        sTime: getDate(0, 'MM-dd'),
                        eTime: getDate(6, 'MM-dd'),
                    };
                    arrDate = this.getDayArr(0, 6);
                    break;
                case 2:
                    result = {
                        sTime: getDate(-1, 'yyyy-MM-dd'),
                        eTime: getDate(5, 'yyyy-MM-dd'),
                    };
                    arrDate = this.getDayArr(-1, 5);
                    break;
                case 3:
                    result = {
                        sTime: getDate(-2, 'yyyy-MM-dd'),
                        eTime: getDate(4, 'yyyy-MM-dd'),
                    };
                    arrDate = this.getDayArr(-2, 4);
                    break;
                case 4:
                    result = {
                        sTime: getDate(-3, 'yyyy-MM-dd'),
                        eTime: getDate(3, 'yyyy-MM-dd'),
                    };
                    arrDate = this.getDayArr(-3, 3);
                    break;
                case 5:
                    result = {
                        sTime: getDate(-4, 'yyyy-MM-dd'),
                        eTime: getDate(2, 'yyyy-MM-dd'),
                    };
                    arrDate = this.getDayArr(-4, 2);
                    break;
                case 6:
                    result = {
                        sTime: getDate(-5, 'yyyy-MM-dd'),
                        eTime: getDate(1, 'yyyy-MM-dd'),
                    };
                    arrDate = this.getDayArr(-5, 1);
                    break;
            }
            let { sTime, eTime } = result;
            this.setData({
                sTime,
                eTime,
                arrDate,
            });
            console.log(this.data);
        },
        getDayArr (index, max) {
            let result = [];
            while (max > index) {
                result.push(getDate(index, 'MM-dd'));
                index++;
            }
            return result;
        },
    }
}));
