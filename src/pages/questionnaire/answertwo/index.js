//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                       from 'plugins/router.plugin'
import Mixin                        from 'utils/mixin.util'
import InputMixin                   from 'mixins/input.mixin'
import RouterMixin                  from 'mixins/router.mixin'
import QueMixin                     from 'mixins/questionnaire.mixin'
import { formatData }               from 'wow-cool/lib/date.lib'

Page(Mixin({
    mixins: [
        InputMixin,
        QueMixin,
        RouterMixin,
    ],
    data: {
        arrData: [],
        start: '1901-01-01',
        end: formatData('yyyy-MM-dd'),
        type: true,
        arrParams: [],
    },
    // 生命周期回调—监听页面加载
    onLoad (options) {
        this.routerGetParams(options);
        this.initData();
        // 获取问题的答案
        this.reqSurveyDetails();
    },
    // 初始化数据
    initData () {
        let {arrData, arrResult} = this.data.params$;
        let arrParams = arrData.slice(1);
        arrData = arrData.slice(0,1);
        this.setData({
            arrData,
            arrResult,
            arrParams,
        })
    },
    // 提交下一步
    handleSubmit () {
        let result = this.checkData(this.data.arrData);
        if (!result.length) return;
        Router.push('questionnaire_three_index', {
            ...this.data.params$,
            arrResult: [...result, ...this.data.params$.arrResult],
            arrData: this.data.arrParams,
        }, true);
    },
}));
