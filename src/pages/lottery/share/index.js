//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                       from 'plugins/router.plugin'
import Mixin                        from 'utils/mixin.util'
import Modal                        from 'plugins/modal.plugin'
import Http                         from 'plugins/http.plugin'
import UserMixin                    from 'mixins/user.mixin'
import Loading                      from 'plugins/loading.plugin'
import SystemMixin                  from 'mixins/system.mixin'
import { getDate, formatData }      from 'wow-cool/lib/date.lib'
import Authorize                    from 'plugins/authorize.plugin'

Page(Mixin({
    mixins: [
        UserMixin,
        SystemMixin,
    ],
    data: {
        vSTime2: '',
        vETime2: '',
        curTime: '',
        isCurWeek: true,
        numTimes: 0,
        arrText: [ '第一次', '第二次', '第三次', '第四次', '第五次', '点击领取' ],

        strImageTempPath: '',

        isPopup: false,
    },
    onLoad () {
        this.userGet().then((res) => console.log(res)).null();
        this.systemGetRpx();
        this.initCanvas();
        this.setData({ curTime: new Date().getTime() });
        this.getDay();
        this.reqActivityTimes();

    },
    onReady () {
        // this.reqPosterData();
        this.canvasStart();
    },
    initCanvas () {
        let { rpx } = this.data.system$;
        this.setData({ width: 750 * rpx, height: 1334 * rpx });
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
    canvasStart () {
        let that = this;
        let { user$, system$, width, height, numTimes } = this.data;
        let { nickName, avatarUrl } = user$;
        let { rpx } = system$;
        let bgPath = '';
        Loading.show();
        return new Promise((resolve, reject) => {
            // that.getImageInfo({
            //     src: 'https://www.sugarmini.com/static/images/v1/home-nor-bg.png',
            // }).then((res) => {
                // bgPath = res.path;
            bgPath = '/assets/images/20200519-share-bg.jpg';
            that.getImageInfo({ src: avatarUrl }).then((res) => {
                let avatarPath = res.path;
                const ctx = wx.createCanvasContext('myCanvas');

                ctx.drawImage(bgPath, 0, 0, width, height); // 画背景

                ctx.save(); // 保存的绘图上下文
                ctx.beginPath(); // 开始创建一个路径
                ctx.arc(100 * rpx, 110 * rpx, 60 * rpx, 0, 2 * Math.PI, false); //画一个圆形裁剪区域
                // ctx.stroke();
                ctx.clip(); // 裁剪
                ctx.drawImage(avatarPath, 40 * rpx, 50 * rpx, 120 * rpx, 120 * rpx); // 画头像
                ctx.restore(); // 恢复之前保存的绘图上下文

                ctx.save(); // 保存的绘图上下文
                ctx.setFontSize(10); // 字体大小
                ctx.setFillStyle('#333'); // 设置填充色
                ctx.textAlign = 'left';
                ctx.fillText(nickName, 190 * rpx, 110 * rpx);
                ctx.setFontSize(16); // 字体大小
                ctx.fillText(`本周已测糖`, 40 * rpx, 220 * rpx);
                ctx.setFillStyle('#0075C2'); // 设置填充色
                ctx.fillText(`${numTimes}`, 240 * rpx, 220 * rpx);
                ctx.setFillStyle('#333'); // 设置填充色
                ctx.fillText(`次`, 270 * rpx, 220 * rpx);
                ctx.setFontSize(10); // 字体大小
                if (numTimes < 6) {
                    ctx.fillText(`再测`, 40 * rpx, 260 * rpx);
                    ctx.setFillStyle('#0075C2'); // 设置填充色
                    ctx.fillText(`${6-numTimes}`, 100 * rpx, 260 * rpx);
                    ctx.setFillStyle('#333'); // 设置填充色
                    ctx.fillText(`次就能领取红包啦`, 130 * rpx, 260 * rpx);
                } else {
                    ctx.fillText(`周打卡任务已完成!`, 40 * rpx, 260 * rpx);
                }
                ctx.restore(); // 恢复之前保存的绘图上下文

                ctx.draw();

                setTimeout(() => {
                    that.canvasToTempFilePath('myCanvas').then((res) => {
                        console.log(that.data.strImageTempPath)
                        that.setData({
                            strImageTempPath: res.tempFilePath
                        });
                        resolve();
                    }).catch((err) => {
                        reject(err);
                    });
                }, 300);
            }).catch((err) => {
                reject(err);
            });
        }).finally(() => {
            Loading.hide();
        });

    },
    handleShare (e) {
        let { params } = e.currentTarget.dataset;
        // if (params && !this.data.strImageTempPath) {
        if (params) {
            this.canvasStart().then(() => {
                this.setData({ isPopup: params });
            }).toast();
            return;
        }
        this.setData({ isPopup: params });
    },
    getImageInfo ({src}) {
        return new Promise((resolve, reject) => {
            wx.getImageInfo({
                src,
                success: resolve,
                fail: reject
            });
        });
    },
    canvasToTempFilePath: (options) => new Promise((resolve, reject) => {
        let canvasId = '';
        if (typeof options === 'string') {
            canvasId = options;
            options = {};
        }
        wx.canvasToTempFilePath({
            canvasId,
            ...options,
            success (res) {
                resolve(res);
            },
            fail (res) {
                reject(res);
            }
        });
    }),
    // 分享图片
    onShareAppMessage () {
        console.log(this.data.strImageTempPath)
        return {
            title: '分享',
            path: 'pages/home/index?scene=1', // 点击分享消息是打开的页面
            imageUrl: this.data.strImageTempPath,
            success (res) {
                console.log('分享成功', res);
            },
            fail (err) {
                console.log('分享失败', err);
            }
        };
    },
    handleSave () {
        let { strImageTempPath } = this.data;
        Authorize(Authorize.SCOPE.writePhotosAlbum, `保存相册需要授权哦...`).then(() => {
            return this.imageSave(strImageTempPath);
        }).then(() => {
            this.setData({ isPopup: false });
            Modal.toast('保存图片成功');
        }).toast();
    },
    imageSave: (options) => new Promise((resolve, reject) => {
        let filePath = '';
        if (typeof options === 'string') {
            filePath = options;
            options = {};
        }
        wx.saveImageToPhotosAlbum({
            filePath,
            ...options,
            success: res => {
                resolve(res);
            },
            fail: err => {
                reject('');
            },
        })
    }),
}));
