//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                         from 'plugins/http.plugin'
import Router                       from 'plugins/router.plugin'
import Modal                        from 'plugins/modal.plugin'
import Mixin                        from 'utils/mixin.util'
import SourceMixin                  from 'mixins/source.mixin'
import RouterMixin                  from 'mixins/router.mixin'
import UserMixin                    from 'mixins/user.mixin'
import DataMixin                    from './data.mixin'

const arrSrc = [
    { key: 'bg', value: 'ctjd-bg.jpg' },
    { key: 'icon', value: 'clock-icon.png' },
    { key: 'operate', value: 'clock-btn-icon.png' },
];

Page(Mixin({
    mixins: [
        UserMixin,
        RouterMixin,
        DataMixin,
        SourceMixin,
    ],
    data: {
        objData: {
            Item1: 0,
            Item2: 0,
        },
    },
    onLoad (options) {
        this.sourceGet(arrSrc);
        this.userGet();
        this.routerGetParams(options);
    },
    onReady () {
        this.drawProgressBg();
        this.reqCurSignIn();
    },
    reqCurSignIn () {
        Http(Http.API.Req_curSignIn).then((res) => {
            let objData = res || {};
            let { Item1, Item2 } = objData;
            this.setData({ objData });
            if (Item2 === 0) return this.drawRunStart(0);
            let progress = Item1 / Item2 * 2;
            this.drawRunStart(progress);
        }).toast();
    },
    drawRunStart (target, step = 0) {
        if (step >= target) return null;
        this.drawCircle(step);
        step += 0.1;
        setTimeout(this.drawRunStart.bind(this), 50 ,target, step);
    },
    drawCircle (step){
        let context = wx.createCanvasContext('canvasProgress');
        context.setLineWidth(8);
        context.setStrokeStyle('#b5a380'); // 设置圆环的颜色
        context.setLineCap('round');
        context.beginPath();
        context.arc(84, 84, 78, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
        context.stroke();
        context.draw()
    },
    drawProgressBg () {
        // 使用 wx.createContext 获取绘图上下文 context
        let context = wx.createCanvasContext('canvasProgressBg');
        context.setLineWidth(4);// 设置圆环的宽度
        context.setStrokeStyle('#adabad'); // 设置圆环的颜色
        context.setLineCap('round') // 设置圆环端点的形状
        context.beginPath();//开始一个新的路径
        context.arc(84, 84, 78, 0, 2 * Math.PI, false);
        //设置一个原点(110,110)，半径为100的圆的路径到当前路径
        context.stroke();//对当前路径进行描边
        context.draw();
    },
    // 跳转
    handleJump (event) {
        let { url, params } = event.currentTarget.dataset;
        !params && (params = {});
        Router.push(url, params);
    },
}));
