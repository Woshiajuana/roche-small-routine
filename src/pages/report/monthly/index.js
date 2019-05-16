//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                         from 'plugins/http.plugin'
import Modal                        from 'plugins/modal.plugin'
import Mixin                        from 'utils/mixin.util'
import ShareMixin                   from 'mixins/share.mixin'
import SourceMixin                  from 'mixins/source.mixin'
import UserMixin                    from 'mixins/user.mixin'
import {
    formatData
}                                   from 'wow-cool/lib/date.lib'
import {
    ARR_TIME_STEP,
    DAY_TEXT,
    CANVAS_X,
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
var mW = 680*rpx;
var mH = 680*rpx;
var mCenter = mW / 2; //中心点
var mCenterY = mH / 2; //中心点
var mAngle = Math.PI * 2 / numCount; //角度
var mRadius = mCenterY - 120*rpx; //半径(减去的值用于给绘制的文本留空间)
//获取Canvas
var radCtx = wx.createCanvasContext("radarCanvas")


Page(Mixin({
    mixins: [
        DataMixin,
        ShareMixin,
        SourceMixin,
        UserMixin,
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
        objRadar: {},

        isNotData: false,
    },
    onLoad () {
        this.sourceGet(arrSrc);
        this.userGet();
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
    // 雷达图
    updateRadarData (data) {
        let arr = [data.AvgVal, data.AvgAfterVal, data.AvgLowVal, data.AvgFastingBeforeVal ];
        data = [
            ['餐后血糖', data.AvgAfterVal || 0],
            ['低血糖状况', data.AvgLowVal || 0],
            ['空腹餐前血糖', data.AvgFastingBeforeVal || 0],
            ['血糖波动', data.AvgVal || 0],
        ];
        let max = Math.max.apply(null, arr) + 1;
        this.drawArcEdge();
        //设置数据
        this.drawRegion(data,'rgba(52, 157, 255, 0.2)', max);
        //设置文本数据
        // this.drawTextCans(data);
        //设置节点
        this.drawCircle(data, '#349dff', max);
        //开始绘制
        radCtx.draw()
    },
    // 第一步：绘制6个圆，你可以通过修改numSlot的数的大小，来确定绘制几个圆
    drawArcEdge () {
        radCtx.setStrokeStyle('#eeeeee'); //设置线的颜色
        radCtx.setLineWidth(1);  //设置线宽
        for (var i = 0; i < numSlot; i++) {  //需要几个圆就重复几次
            // //计算半径
            radCtx.beginPath();
            var rdius = mRadius / numSlot * (i + 1);  //计算每个圆的半径
            radCtx.arc(mCenter, mCenterY, rdius, 0, 2 * Math.PI); //开始画圆
            radCtx.stroke()
        }
    },
    //绘制数据区域(数据和填充颜色)
    drawRegion (mData, color, max){
        radCtx.beginPath();
        for (var m = 0; m < numCount; m++){
            var x = mCenter + mRadius * Math.cos(mAngle * m) * mData[m][1] / max;
            var y = mCenterY + mRadius * Math.sin(mAngle * m) * mData[m][1] / max;

            radCtx.lineTo(x, y);
        }
        radCtx.closePath();
        radCtx.setFillStyle(color);
        radCtx.fill();
    },
    //画点
    drawCircle (mData, color, max){
        var r = 3; //设置节点小圆点的半径
        for(var i = 0; i<numCount; i ++){
            var x = mCenter + mRadius * Math.cos(mAngle * i) * mData[i][1] / max;
            var y = mCenterY + mRadius * Math.sin(mAngle * i) * mData[i][1] / max;
            radCtx.beginPath();
            radCtx.arc(x, y, r, 0, Math.PI * 2);
            radCtx.fillStyle = color;
            radCtx.fill();
        }
    },
    // 赋值
    assignmentData () {
        LineChart = getLineChart([], []);
        // LineChart = getLineChart([], this.data.arrDate);
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
    updateChartData (data) {
        let result = [];
        data.reverse();
        data.forEach((item) => {
            let time = item.TestDate.replace(/[^0-9]/ig, '');
            let type = CANVAS_X[item.TimeStepExt - 1] || '';
            let year = formatData('dd', new Date(+time));
            if (item.Bloodsugar) {
                result.push({
                    year: year + item.TimeStepExt,
                    // type: type,
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
            weekData = res || [];
        }).catch((err) => {
            Modal.toast(err);
            weekData = [];
        }).finally(() => {
            this.setData({
                isNotData: weekData.length === 0,
            });
            this.updateChartData(weekData);
        });
    },
    // 获取血糖蜘蛛图
    reqSugarSpider () {
        let Stime = this.data.sTime;
        let Etime = this.data.eTime;
        let objRadar;
        return Http(Http.API.Req_sugarSpider, {
            Stime,
            Etime,
        }).then((res) => {
            objRadar = res || {};
        }).catch((err) => {
            Modal.toast(err);
            objRadar = {};
        }).finally(() => {
            this.setData({objRadar});
            this.updateRadarData(objRadar);
        });
    },
}));
