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
        this.reqPosterData();
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
    reqActivityTimes () {
        let { sTime: Stime, eTime: Etime } = this.data;
        Http(Http.API.Req_GetActivitys, {
            Stime,
            Etime,
        }).then((res) => {
            this.setData({ numTimes: res });
        }).toast();
    },
    reqPosterData () {
        Http(Http.API.Req_GetPoster).then((res) => {
        }).toast();
    },
    handleShare () {
        this.getImageInfo({
            src: 'http://szimg.mukewang.com/5b4bfb7000019d2e10800600-360-202.jpg',
        }).then((res) => {

        }).toast();
        wx.getImageInfo({
            src: 'http://szimg.mukewang.com/5b4bfb7000019d2e10800600-360-202.jpg',
            success (res) {
                //res.path是网络图片的本地地址
                var qrCodePath = res.path;
                //2. canvas绘制文字和图片
                const ctx = wx.createCanvasContext('myCanvas');

                // var imgPath = that.data.localImageUrl;

                ctx.drawImage(qrCodePath, 0, 0, 200, 200);

                ctx.setFillStyle('white')
                ctx.fillRect(0, 520, 600, 280);

                ctx.draw()
                // that.setData({
                //   localImageUrl: qrCodePath
                // })
            },
            fail (res) {
                //失败回调
            }
        });
    },
    getImageInfo ({src}) {
        return new Promise((resolve, reject) => {
            wx.getImageInfo({
                src,
                success: resolve,
                fail: reject
            });
        });
    }

}));
