//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'
import Handle                   from 'mixins/mixin.handle'
import ShareMixin               from 'mixins/share.mixin'
import { getDate, formatData }  from 'wow-cool/lib/date.lib'
import {
    ARR_TIME_STEP,
    DAY_TEXT
}                               from 'config/base.config'
let type = false;
Page(Handle({
    mixins: [ShareMixin],
    data: {
        arrTimeStep: ARR_TIME_STEP,
        result: '',
        DayCount: '',
        Desc: '',
        dayTime: [],
        dayText: DAY_TEXT,
        sTime: '',
        eTime: '',

        vSTime2: '',
        vETime2: '',

        curTime: new Date().getTime(),
        weekReport: {},
        isCurWeek: true,
    },
    onLoad () {
        wx.showShareMenu();
        type = false;
        this.setData({
            curTime: new Date().getTime(),
        });
        this.getDay();
        this.initData();
        this.getRecommendSugar();
        this.getWeekReport();
    },
    // 获取当前时间下一周

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
        if (curTime > endTime) return Toast.error('下一周还没开始哦');
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
        let options = {
            url: 'RocheApi/GetRecommendSugar',
            loading: true,
            data: {
                Stime,
                Etime,
                Type: 2,
            }
        };
        return Http(options).then((res) => {
            let { DayCount, Desc, Steps } = res;
            this.setData({
                DayCount,
                Desc,
            });
            if (!Steps) return;
            this.initData(Steps)
        }).catch((err) => {
            Toast.error(err);
        });
    },
    // 初始化数据
    initData (arr) {
        if (arr) {
            let result = {};
            arr.forEach((item) => {
                let { Day, TimeStep, Bloodsugar, Gls} = item;
                this.data.dayTime.forEach((it, ind) => {
                    if (Day === 7) Day = 0;
                    if (it[0] === Day && TimeStep !== 0) {
                        let sItem = `dayTime[${ind}][${TimeStep}]`;
                        let key = `key_${ind}${TimeStep}`;
                        result[key] = {
                            sItem: sItem,
                            item: item,
                            type: Gls === 3 ? 'nor' : Gls < 3 ? 'low' : 'up',
                        };
                    }
                });
            });
            for (let key in result) {
                let {sItem, item, type} = result[key];
                this.setData({
                    [sItem]: {
                        ...item,
                        Bloodsugar: item.Bloodsugar && item.Bloodsugar.toFixed(1),
                        type,
                    },
                });
            }
            return;
        }
        let result = [];
        for(let x = 0; x < 7; x++){
            result[x] = [];
            for(let y = 0; y < 8; y++){
                if (y === 0) {
                    result[x][y] = (x+1) % 7;
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
        let options = {
            url: 'RocheApi/GetWeekReport',
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
    handlePreviewImage() {
        // wx.previewImage({
        //     current: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2854560059,552756199&fm=27&gp=0.jpg',
        //     urls: ['https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2854560059,552756199&fm=27&gp=0.jpg'] // 需要预览的图片http链接列表
        // });
        // wx.getImageInfo({// 获取图片信息（此处可不要）
        //     src: 'assets/images/xtbg-ewm-icon.png',
        //     success: function (res) {
        //         console.log(res.width)
        //         console.log(res.height)
        //     }
        // })

    }
}));
