//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                         from 'plugins/http.plugin'
import Router                       from 'plugins/router.plugin'
import Mixin                        from 'utils/mixin.util'
import InputMixin                   from 'mixins/input.mixin'
import RouterMixin                  from 'mixins/router.mixin'
import QueMixin                     from 'mixins/questionnaire.mixin'
import SourceMixin                  from 'mixins/source.mixin'
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
        arrResult: [],
    },
    // 生命周期回调—监听页面加载
    onLoad (options) {
        this.sourceGet(arrSrc);
        this.routerGetParams(options);
        this.getArchives();
        this.getSurveyDetails();
    },
    // 获取文档
    getArchives () {
        let options = {
            url: 'RocheApi/GetArchives',
            loading: true,
        };
        return Http(options).then((res) => {
            let arr = res || [];
            this.setData({
                arrParams: arr.slice(2) || [],
                arrData:  arr.slice(0,2) || [],
            });
            this.assignmentData(this.data.arrData, this.data.arrResult);
        }).catch((err) => {
            Toast.error(err);
        });
    },

    // 提交下一步
    handleSubmit () {
        let result = this.checkData(this.data.arrData);
        if (!result.length) return;
        Router.push('questionnaire_copy_index', {
            ...this.data.$params,
            arrResult: result,
            arrData: this.data.arrParams,
        }, true);
    },

}));
