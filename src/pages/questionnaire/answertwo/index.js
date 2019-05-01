//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Mixin                        from 'utils/mixin.util'
import Router                       from 'plugins/router.plugin'
import InputMixin                   from 'mixins/input.mixin'
import RouterMixin                  from 'mixins/router.mixin'
import SourceMixin                  from 'mixins/source.mixin'
import QueMixin                     from 'mixins/questionnaire.mixin'
import { formatData }               from 'wow-cool/lib/date.lib'

const arrSrc = [
    { key: 'normal', value: 'select-nor-icon.png' },
    { key: 'active', value: 'select-ative-icon.png' },
];

Page(Mixin({
    mixins: [
        InputMixin,
        QueMixin,
        RouterMixin,
        SourceMixin,
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
        this.sourceGet(arrSrc);
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
        Router.push('questionnaire_answerthree_index', {
            ...this.data.params$,
            arrResult: [...result, ...this.data.params$.arrResult],
            arrData: this.data.arrParams,
        }, true);
    },
}));
