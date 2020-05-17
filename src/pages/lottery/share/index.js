//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                       from 'plugins/router.plugin'
import Mixin                        from 'utils/mixin.util'
import Modal                        from 'plugins/modal.plugin'
import Http                         from 'plugins/http.plugin'
import UserMixin                    from 'mixins/user.mixin'
import { getDate, formatData }      from 'wow-cool/lib/date.lib'
let type = false;

Page(Mixin({
    mixins: [
        UserMixin,
    ],
    data: {
        vSTime2: '',
        vETime2: '',
        curTime: '',
        isCurWeek: true,
        numTimes: 0,
        arrText: [ '第一次', '第二次', '第三次', '第四次', '第五次', '点击领取' ],
    },
    onLoad () {
        this.userGet().then((res) => console.log(res)).null();
        this.setData({ curTime: new Date().getTime() });
        this.getDay();
        this.reqActivityTimes();
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
        this.reqActivityTimes();
    },
    //
    reqActivityTimes () {
        let { sTime: Stime, eTime: Etime } = this.data;
        Http(Http.API.Req_GetActivitys, {
            Stime,
            Etime,
        }).then((res) => {
            this.setData({ numTimes: res });
        }).toast();
    },

    handleJump (e) {
        let {item} = e.currentTarget.dataset;
        if (item === '点击领取') {
            Router.push('lottery_reward_index');
        }
    }
}));
