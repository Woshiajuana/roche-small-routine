import './index.json'
import './index.wxml'
import './index.scss'

import Mixin                        from 'utils/mixin.component.util'
import Modal                        from 'plugins/modal.plugin'
import SourceMixin                  from 'mixins/source.mixin'
import Valid                        from 'utils/valid.util'
import Regular                      from 'utils/regular.util'
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


const data2 = [
    { "year": '2018-10', "type": "United States", "value": 11 },
    { "year": '2018-10', "type": "Florida", "value": 22 },
    { "year": '2018-10', "type": "xx", "value": 33 },
    { "year": '2018-11', "type": "United States", "value": 44 },
    { "year": '2018-11', "type": "Florida", "value": 55 },
    { "year": '2018-11', "type": "xx", "value": 66 },
    { "year": '2018-12', "type": "United States", "value": 77 },
    { "year": '2018-12', "type": "Florida", "value": 4.8 },
    { "year": '2018-12', "type": "xx", "value": 77 },
    { "year": '2019-01', "type": "United States", "value": 55 },
    { "year": '2019-01', "type": "Florida", "value": 66 },
    { "year": '2019-01', "type": "xx", "value": 444 },
    { "year": '2019-02', "type": "United States", "value": 66 },
    { "year": '2019-02', "type": "Florida", "value": 55 },
    { "year": '2019-02', "type": "xx", "value": 33 },
    { "year": '2019-03', "type": "United States", "value": 22 },
    { "year": '2019-03', "type": "Florida", "value": 11 },
    { "year": '2019-03', "type": "xx", "value": 33 },
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
            LineChart = getLineChart(data2, this.data.arrDate);
            // LineChart = getLineChart(data2, [
            //     '2018-10',
            //     '2018-11',
            //     '2018-12',
            //     '2019-01',
            //     '2019-02',
            //     '2019-03',
            // ]);
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
