//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                         from 'plugins/http.plugin'
import Router                       from 'plugins/router.plugin'
import Modal                        from 'plugins/modal.plugin'
import Mixin                        from 'utils/mixin.util'
import SourceMixin                  from 'mixins/source.mixin'
import UserMixin                    from 'mixins/user.mixin'
import DataMixin                    from './data.mixin'

const arrSrc = [
    { key: 'bg', value: 'ctjd-bg.jpg' },
];

Page(Mixin({
    mixins: [
        UserMixin,
        DataMixin,
        SourceMixin,
    ],
    onLoad () {
        this.sourceGet(arrSrc);
        this.userGet();
        this.drawCircle();
    },
    drawCircle (step){
        let context = wx.createCanvasContext('canvasProgress');
        let gradient = context.createLinearGradient(200, 100, 100, 200);
        gradient.addColorStop("0", "#2661DD");
        gradient.addColorStop("0.5", "#40ED94");
        gradient.addColorStop("1.0", "#5956CC");
        context.setLineWidth(10);
        context.setStrokeStyle(gradient);
        context.setLineCap('round');
        context.beginPath();
        context.arc(110, 110, 100, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
        context.stroke();
        context.draw()
    },
}));
