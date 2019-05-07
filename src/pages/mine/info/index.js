//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Modal                        from 'plugins/modal.plugin'
import Router                       from 'plugins/router.plugin'
import Mixin                        from 'utils/mixin.util'
import SourceMixin                  from 'mixins/source.mixin'
import InputMixin                   from 'mixins/input.mixin'
import UserMixin                    from 'mixins/user.mixin'
import CodeMixin                    from 'mixins/code.mixin'
import FormIdMixin                  from 'mixins/formid.mixin'
import RouterMixin                  from 'mixins/router.mixin'
import Http                         from 'plugins/http.plugin'
import DateUtil                     from 'utils/date.util'
import Valid                        from 'utils/valid.util'
import { formatData }               from 'wow-cool/lib/date.lib'
import DataMixin                    from './data.mixin'

const arrSrc = [
    { key: 'banner', value: 'grzx-header-banner.jpg' },
    { key: 'normal', value: 'select-nor-icon.png' },
    { key: 'active', value: 'select-ative-icon.png' },
];

Page(Mixin({
    mixins: [
        DataMixin,
        InputMixin,
        UserMixin,
        RouterMixin,
        CodeMixin,
        FormIdMixin,
        SourceMixin,
    ],
    onLoad (options) {
        // 获取资源
        this.sourceGet(arrSrc);
        this.setData({ end: formatData('yyyy-MM-dd') });
        this.userGet().then(this.initData.bind(this));
        // 获取页面参数
        this.routerGetParams(options);
        // 获取用户数据信息
        this.reqUserInfo();
    },
    initData () {
        let {user$, formData} = this.data;
        if (!user$.IsMember) {
            delete formData.Mobile;
            delete formData.SmsCode;
        }
        this.setData({ formData })
    },
    // 提交下一步
    handleSubmit (e) {
        if (Valid.check(this.data.formData)) return;
        let { formId } = e.detail;
        this.doSubWeChatFormId(formId, 'mine_info_index');
        let from = this.data.params$.from || '';
        let url = this.data.params$.to || 'mine_report_index';
        Http(Http.API.Do_userInfo, data).then((res) => {
            !from && Modal.toast('保存成功');
            setTimeout(() => {
                from ? Router.push(url, {}, true) : Router.pop();
            }, 1000);
        }).toast();
    },
    // 获取用户数据
    reqUserInfo () {
        let { formData } = this.data;
        Http(Http.API.Do_userInfo).then((res) => {
            if (res.Brithday)
                res.Brithday = DateUtil.formatTime(res.Brithday);
            Valid.assignment(this, res, formData);
            console.log(this.data.formData)
        }).toast();
    },
}));
