//index.js
import './index.json'
import './index.scss'
import './index.wxml'


import Mixin                        from 'utils/mixin.util'
import SourceMixin                  from 'mixins/source.mixin'
import RouterMixin                  from 'mixins/router.mixin'
import FormIdMixin                  from 'mixins/formid.mixin'
import Http                         from 'plugins/http.plugin'
import Router                       from 'plugins/router.plugin'
import Valid                        from 'utils/valid.util'
import DateUtil                     from 'utils/date.util'
import DataMixin                    from './data.mixin'

const arrSrc = [
    { key: 'bg', value: 'mfjd-one-header-banner.jpg' },
    { key: 'vBg', value: 'v-mfjd-one-header-banner.jpg' },
    { key: 'icon', value: 'agreement-pop-icon.png' },
];

Page(Mixin({
    mixins: [
        DataMixin,
        FormIdMixin,
        SourceMixin,
        RouterMixin,
    ],
    onLoad (options) {
        // 获取资源
        this.sourceGet(arrSrc);
        // 获取页面参数
        this.routerGetParams(options);
        // 初始化参数数据
        this.initData();
        // 获取用户数据信息
        this.reqUserInfo();
    },
    // 初始化参数
    initData () {
        let { params$, formData } = this.data;
        if (params$.IsMember) {
            delete formData.Mobile;
            delete formData.SmsCode;
            formData.Brithday.end = formatData('yyyy-MM-dd');
        } else {
            delete formData.Name;
            delete formData.Sex;
            delete formData.Brithday;
        }
        this.setData({ formData });
    },
    // 提交下一步
    handleSubmit (event) {
        let { data, formId } = event.detail;
        console.log(event);
        this.doSubWeChatFormId(formId, 'questionnaire_one_index');
        Http(Http.API.Do_userInfo, data).then((res) => {
            Router.push(
                'questionnaire_answerone_index',
                this.data.params$,
                true
            );
        }).toast();
    },
    // 获取用户数据
    reqUserInfo () {
        let { formData } = this.data;
        Http(Http.API.Do_userInfo).then((res) => {
            if (res.Brithday)
                res.Brithday = DateUtil.formatTime(res.Brithday);
            Valid.assignment(this, res, formData);
        }).toast();
    },
    // 弹窗
    handlePop() {
        let { isPop } = this.data;
        this.setData({ isPop: !isPop });
    }
}));
