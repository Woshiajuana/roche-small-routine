//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                         from 'plugins/http.plugin'
import Router                       from 'plugins/router.plugin'
import SourceMixin                  from 'mixins/source.mixin'
import Mixin                        from 'utils/mixin.util'
import ShareMixin                   from 'mixins/share.mixin'
import RouterMixin                  from 'mixins/router.mixin'
import UserMixin                    from 'mixins/user.mixin'
import { getDate }                  from 'wow-cool/lib/date.lib'
import {
    ARR_TIME_STEP,
    DAY_TEXT
}                                   from 'config/base.config'

const arrSrc = [
    { key: 'bg', value: 'plan-bg.jpg' },
    { key: 'icon', value: 'plan-active-icon.png' },
];

Page(Mixin({
    mixins: [
        ShareMixin,
        SourceMixin,
        UserMixin,
        RouterMixin,
    ],
    data: {
        arrTimeStep: ARR_TIME_STEP,
        result: '',
        DayCount: '',
        desc1: '',
        desc2: '',
        dayTime: [],
        dayText: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    onLoad (options) {
        this.routerGetParams(options);
        // 获取用户信息
        this.userGet();
        // 显示面板
        wx.showShareMenu();
        // 获取图片资源
        this.sourceGet(arrSrc);
        // 初始化数据
        this.initData();
        // 获取血糖计划
        this.reqRecommendSugar();
    },
    initData (arr) {
        if (arr) {
            let { dayTime } = this.data;
            console.log('dayTime', dayTime)
            console.log('arr', arr)
            arr.forEach((item) => {
                let { Day, TimeStep } = item;
                dayTime.forEach((it, ind) => {
                    if (Day === 7) Day = 0;
                    if (it[0] === Day) {
                        dayTime[TimeStep-1][ind] = 1;
                    }
                });
            });
            return this.setData({ dayTime });
        }
        let result = [];
        for(let x = 0; x < 7; x++){
            result[x] = [];
            for(let y = 0; y < 8; y++){
                if (y === 0) {
                    result[x][y] = x % 7;
                } else {
                    result[x][y] = 0;
                }
            }
        }
        this.setData({
            dayTime: result
        });
    },
    reqRecommendSugar () {
        let Stime = getDate(0, 'yyyy-MM-dd');
        let Etime = getDate(6, 'yyyy-MM-dd');
        return Http(Http.API.Req_recommendSugar, {
            Stime,
            Etime,
            Type: 1,
        }).then((res) => {
            let { DayCount, Desc, Steps } = res;
            let desc1 = '';
            let desc2 = '';
            if (Desc) {
                let arr = Desc.split('（');
                desc1 = arr[0];
                desc2 = '（' + arr[1];
            }
            this.setData({
                DayCount,
                desc1,
                desc2,
            });
            this.initData(Steps)
        }).toast();
    },
    // 立即开始测糖
    handleJump () {
        let { IsMember } = this.data.user$;
        this.data.params$.from
            ? Router.push('questionnaire_answerone_index', { IsMember }, true)
            : Router.root('home_index');
    }
}));
