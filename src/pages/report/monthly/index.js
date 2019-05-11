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
import DataMixin                    from './data.mixin'

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


var rpx;
//获取屏幕宽度，获取自适应单位
wx.getSystemInfo({
    success: function(res) {
        rpx = res.windowWidth/750;
    },
})


var numCount = 4;
var numSlot = 20;
var mW = 365*rpx;
var mH = 300*rpx;
var mCenter = mW / 2; //中心点
var mCenterY = mH / 2; //中心点
var mAngle = Math.PI * 2 / numCount; //角度
var mRadius = mCenterY - 45*rpx; //半径(减去的值用于给绘制的文本留空间)
//获取Canvas
var radCtx = wx.createCanvasContext("radarCanvas")


Page(Mixin({
    mixins: [
        DataMixin,
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
        this.initRadar();
    },

    initRadar () {
        let result = {
            data: {
                data: {
                    stateValueD: 82,
                    stateValueC: 82,
                    stateValueB: 96,
                    stateValueA: 100,
                }
            }
        }
        var arr = new Array(
            new Array("健康",result.data.data.stateValueD),
            new Array("桃花运",result.data.data.stateValueC),
            new Array("职场",result.data.data.stateValueB),
            new Array("颜值",result.data.data.stateValueA)
        );


        this.setData({
            stateValueA: result.data.data.stateValueA,
            stateValueB: result.data.data.stateValueB,
            stateValueC: result.data.data.stateValueC,
            stateValueD: result.data.data.stateValueD,
            // isStateA: result.data.data.isStateA,
            // isStateB: result.data.data.isStateB,
            // isStateC: result.data.data.isStateC,
            // isStateD: result.data.data.isStateD,
            chanelArray1:arr,
            // activityUrl:result.data.data.activityUrl,
            // avatar:result.data.data.avatar,
            // isSuccess:result.data.data.isSuccess,
            // isReceive:result.data.data.isReceive,
            // drawType:result.data.data.drawType,
            // nickName:result.data.data.nickName,
            // uploadavatar:result.data.data.activityUrl
        });

        //雷达图
        this.drawRadar();
    },



    // 雷达图
    drawRadar:function(){
        var sourceData1 = this.data.chanelArray1
        // var sourceData2 = this.data.chanelArray2

        //调用
        //this.drawEdge() //画六边形
        this.drawArcEdge() //画圆
        // this.drawLinePoint()
        //设置数据
        this.drawRegion(sourceData1,'rgba(255, 255, 255, 0.5)') //第一个人的
        //this.drawRegion(sourceData2, 'rgba(255, 200, 0, 0.5)') //第二个人
        //设置文本数据
        //this.drawTextCans(sourceData1)
        //设置节点
        this.drawCircle(sourceData1,'white')
        //this.drawCircle(sourceData2,'yellow')
        //开始绘制
        radCtx.draw()
    },
    // 绘制6条边
    drawEdge: function(){
        radCtx.setStrokeStyle("white")
        radCtx.setLineWidth(2)  //设置线宽
        for (var i = 0; i < numSlot; i++) {
            //计算半径
            radCtx.beginPath()
            var rdius = mRadius / numSlot * (i + 1)
            //画6条线段
            for (var j = 0; j < numCount; j++) {
                //坐标
                var x = mCenter + rdius * Math.cos(mAngle * j);
                var y = mCenter + rdius * Math.sin(mAngle * j);
                radCtx.lineTo(x, y);
            }
            radCtx.closePath()
            radCtx.stroke()
        }
    },
    // 第一步：绘制6个圆，你可以通过修改numSlot的数的大小，来确定绘制几个圆
    drawArcEdge: function(){
        radCtx.setStrokeStyle("white")  //设置线的颜色
        radCtx.setLineWidth(1)  //设置线宽
        for (var i = 0; i < numSlot; i++) {  //需要几个圆就重复几次
            // //计算半径
            radCtx.beginPath()
            var rdius = mRadius / numSlot * (i + 1)  //计算每个圆的半径
            radCtx.arc(mCenter, mCenterY, rdius, 0, 2 * Math.PI) //开始画圆
            radCtx.stroke()
        }
    },
    // 绘制连接点
    drawLinePoint:function(){
        radCtx.beginPath();
        for (var k = 0; k < numCount; k++) {
            var x = mCenter + mRadius * Math.cos(mAngle * k);
            var y = mCenterY + mRadius * Math.sin(mAngle * k);

            radCtx.moveTo(mCenter, mCenterY);
            radCtx.lineTo(x, y);
        }
        radCtx.stroke();
    },
    //绘制数据区域(数据和填充颜色)
    drawRegion: function (mData,color){

        radCtx.beginPath();
        for (var m = 0; m < numCount; m++){
            var x = mCenter + mRadius * Math.cos(mAngle * m) * mData[m][1] / 100;
            var y = mCenterY + mRadius * Math.sin(mAngle * m) * mData[m][1] / 100;

            radCtx.lineTo(x, y);
        }
        radCtx.closePath();
        radCtx.setFillStyle(color)
        radCtx.fill();
    },

    //绘制文字
    drawTextCans: function (mData){

        radCtx.setFillStyle("white")
        radCtx.font = 'bold 12px cursive'  //设置字体
        for (var n = 0; n < numCount; n++) {
            var x = mCenter + mRadius * Math.cos(mAngle * n);
            var y = mCenterY + mRadius * Math.sin(mAngle * n);
            // radCtx.fillText(mData[n][0], x, y);
            //通过不同的位置，调整文本的显示位置
            if (mAngle * n >= 0 && mAngle * n <= Math.PI / 2) {
                radCtx.fillText(mData[n][1], x-25, y+15);
            } else if (mAngle * n > Math.PI / 2 && mAngle * n <= Math.PI) {
                radCtx.fillText(mData[n][0], x - radCtx.measureText(mData[n][0]).width-7, y+5);
            } else if (mAngle * n > Math.PI && mAngle * n <= Math.PI * 3 / 2) {
                radCtx.fillText(mData[n][0], x - radCtx.measureText(mData[n][0]).width-5, y);
            } else {
                radCtx.fillText(mData[n][0], x+7, y+2);
            }

        }
    },
    //画点
    drawCircle: function(mData,color){
        var r = 1.5; //设置节点小圆点的半径
        for(var i = 0; i<numCount; i ++){
            var x = mCenter + mRadius * Math.cos(mAngle * i) * mData[i][1] / 100;
            var y = mCenterY + mRadius * Math.sin(mAngle * i) * mData[i][1] / 100;

            radCtx.beginPath();
            radCtx.arc(x, y, r, 0, Math.PI * 2);
            radCtx.fillStyle = color;
            radCtx.fill();
        }

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
            let time = item.TestDate(/[^0-9]/ig, '');
            console.log(111)
            result.push({
                year: formatData('dd', new Date(+time)),
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
            console.log('执行了')
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
