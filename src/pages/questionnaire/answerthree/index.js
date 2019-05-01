//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Mixin                        from 'utils/mixin.util'
import Auth                         from 'plugins/auth.plugin'
import Http                         from 'plugins/http.plugin'
import Router                       from 'plugins/router.plugin'
import QueMixin                     from 'mixins/questionnaire.mixin'
import RouterMixin                  from 'mixins/router.mixin'
import SourceMixin                  from 'mixins/source.mixin'

const arrSrc = [
    { key: 'normal', value: 'select-nor-icon.png' },
    { key: 'active', value: 'select-ative-icon.png' },
];

Page(Mixin({
    mixins: [
        QueMixin,
        RouterMixin,
        SourceMixin,
    ],
    data: {
        arrData: [],
    },
    onLoad (options) {
        this.sourceGet(arrSrc);
        this.routerGetParams(options);
        this.initData();
        // 获取问题的答案
        this.reqSurveyDetails();
    },
    // 初始化数据
    initData() {
        let {arrData} = this.data.params$;
        this.setData({
            arrData,
        })
    },
    // 提交下一步
    handleSubmit () {
        let result = this.checkData(this.data.arrData);
        if (!result.length) return;
        let data = [
            ...this.data.params$.arrResult,
            ...result,
        ];
        Auth.getToken().then((res) => {
            let { OpenId } = res;
            data.forEach((item) => {
                item.OpenId = OpenId
            });
            return Http(Http.API.Do_setArchives, data);
        }).then(() => {
            return Auth.updateToken({IsArchives: true});
        }).then(() => {
            if (this.data.params$.form === 'mine_programme_index') Router.push('questionnaire_programme_index', {}, true);
            else if(this.data.params$.IsMember) Router.push('questionnaire_activation_index', {}, true);
            else Router.push('questionnaire_programme_index', {}, true);
        }).toast();
    },
}));
