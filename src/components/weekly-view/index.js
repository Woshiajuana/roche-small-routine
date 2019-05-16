//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                         from 'plugins/http.plugin'
import Modal                        from 'plugins/modal.plugin'
import Mixin                        from 'utils/mixin.component.util'
import ShareMixin                   from 'mixins/share.mixin'
import SourceMixin                  from 'mixins/source.mixin'
import UserMixin                    from 'mixins/user.mixin'
import { getDate, formatData }      from 'wow-cool/lib/date.lib'
import {
    ARR_TIME_STEP,
    DAY_TEXT
}                                   from 'config/base.config'
let type = false;
const arrSrc = [
    { key: 'icon1', value: 'xtbg-icon-5.png' },
    { key: 'icon2', value: 'xtbg-icon-1.png' },
    { key: 'icon3', value: 'xtbg-icon-2.png' },
    { key: 'icon4', value: 'xtbg-icon-3.png' },
    { key: 'icon5', value: 'xtbg-icon-9.png' },
    { key: 'icon6', value: 'xtbg-icon-8.png' },
    { key: 'icon7', value: 'xtbg-icon-6.png' },
    { key: 'icon8', value: 'xtbg-icon-7.png' },
    { key: 'icon9', value: 'xtbg-icon-4.png' },
    { key: 'icon10', value: 'xtbg-ewm-icon.jpg' },
];

Component(Mixin({
    mixins: [
        ShareMixin,
        SourceMixin,
        UserMixin,
    ],
    data: {
        arrTimeStep: ARR_TIME_STEP,
        result: '',
        DayCount: '',
        Desc: '',
        dayTime: [],
        dayText: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        sTime: '',
        eTime: '',

        vSTime2: '',
        vETime2: '',

        curTime: new Date().getTime(),
        weekReport: {},
        isCurWeek: true,
    },
    // 获取当前时间下一周

    lifetimes: {
        attached () {
            this.sourceGet(arrSrc);
            type = false;
            this.userGet();
            this.setData({ curTime: new Date().getTime() });
            this.getDay();
            this.initData();
            this.getRecommendSugar();
            this.getWeekReport();
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
            this.initData();
            this.getRecommendSugar();
            this.getWeekReport();
        },
        // 获取日期
        getDay (cTime) {
            console.log(cTime)
            let curTime = cTime || this.data.curTime;
            let date = new Date(curTime);
            let day = date.getDay();
            let result = '';
            switch (day){
                case 0:
                    result = {
                        sTime: getDate(-6, 'yyyy-MM-dd', new Date(curTime)),
                        eTime: getDate(0, 'yyyy-MM-dd', new Date(curTime)),
                    };
                    break;
                case 1:
                    result = {
                        sTime: getDate(0, 'yyyy-MM-dd', new Date(curTime)),
                        eTime: getDate(6, 'yyyy-MM-dd', new Date(curTime)),
                    };
                    break;
                case 2:
                    result = {
                        sTime: getDate(-1, 'yyyy-MM-dd', new Date(curTime)),
                        eTime: getDate(5, 'yyyy-MM-dd', new Date(curTime)),
                    };
                    break;
                case 3:
                    result = {
                        sTime: getDate(-2, 'yyyy-MM-dd', new Date(curTime)),
                        eTime: getDate(4, 'yyyy-MM-dd', new Date(curTime)),
                    };
                    break;
                case 4:
                    result = {
                        sTime: getDate(-3, 'yyyy-MM-dd', new Date(curTime)),
                        eTime: getDate(3, 'yyyy-MM-dd', new Date(curTime)),
                    };
                    break;
                case 5:
                    result = {
                        sTime: getDate(-4, 'yyyy-MM-dd', new Date(curTime)),
                        eTime: getDate(2, 'yyyy-MM-dd', new Date(curTime)),
                    };
                    break;
                case 6:
                    result = {
                        sTime: getDate(-5, 'yyyy-MM-dd', new Date(curTime)),
                        eTime: getDate(1, 'yyyy-MM-dd', new Date(curTime)),
                    };
                    break;
            }
            let {sTime, eTime} = result;
            console.log(result)
            if (!cTime) {
                this.setData( {
                    sTime,
                    eTime,
                    vSTime2: formatData('MM月dd日', new Date(sTime)),
                    vETime2: formatData('MM月dd日', new Date(eTime)),
                });
            }
            return result;
        },
        // 获取报告
        getRecommendSugar () {
            let Stime = this.data.sTime;
            let Etime = this.data.eTime;
            Http(Http.API.Req_recommendSugar, {
                Stime,
                Etime,
                Type: 2,
            }).then((res) => {
                let { DayCount, Desc, Steps } = res;
                this.setData({ DayCount, Desc });
                if (!Steps) return;
                this.initData(Steps)
            }).toast();
        },
        // 初始化数据
        initData (arr) {
            if (arr) {
                let result = {};
                let { dayTime } = this.data;
                arr.forEach((item) => {
                    let { Day, TimeStep, Bloodsugar, Gls} = item;
                    dayTime[TimeStep-1][Day] = {
                        ...item,
                        type: Gls === 3 ? 'nor' : Gls < 3 ? 'low' : 'up',
                        Bloodsugar: item.Bloodsugar && item.Bloodsugar.toFixed(1),
                    };
                    // this.data.dayTime.forEach((it, ind) => {
                    //     if (Day === 7) Day = 0;
                    //     if (it[0] === Day && TimeStep !== 0) {
                    //         let sItem = `dayTime[${ind}][${TimeStep}]`;
                    //         let key = `key_${ind}${TimeStep}`;
                    //         result[key] = {
                    //             sItem: sItem,
                    //             item: item,
                    //             type: Gls === 3 ? 'nor' : Gls < 3 ? 'low' : 'up',
                    //         };
                    //     }
                    // });
                });
                this.setData({dayTime});
                console.log('dayTime',this.data.dayTime)
                // console.log('result', result)
                // for (let key in result) {
                //     let {sItem, item, type} = result[key];
                //     this.setData({
                //         [sItem]: {
                //             ...item,
                //             Bloodsugar: item.Bloodsugar && item.Bloodsugar.toFixed(1),
                //             type,
                //         },
                //     });
                // }
                return;
            }
            let result = [];
            for(let x = 0; x < 7; x++){
                result[x] = [];
                for(let y = 0; y < 8; y++){
                    if (y === 0) {
                        result[x][y] = x % 7;
                    } else {
                        result[x][y] = -1;
                    }
                }
            }
            this.setData({
                dayTime: result
            });
        },
        // 获取周报
        getWeekReport () {
            let Stime = this.data.sTime;
            let Etime = this.data.eTime;
            let weekReport;
            Http(Http.API.Req_weekReport, {
                Stime,
                Etime,
            }).then((res) => {
                weekReport = res || {};
            }).catch((err) => {
                Modal.toast(err);
                weekReport = {};
            }).finally(() => {
                this.setData({ weekReport })
            });
        },
        handlePreviewImage() {}
    }
}));
