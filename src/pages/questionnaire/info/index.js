//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Toast                    from 'plugins/toast.plugin'
import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import InputMixin               from 'mixins/input.mixin'
import RouterMixin              from 'mixins/router.mixin'
import UserMixin                from 'mixins/user.mixin'
import CodeMixin                from 'mixins/code.mixin'
import FormIdMixin              from 'mixins/formid.mixin'
import Data                     from 'utils/data.util'
import { formatData }           from 'wow-cool/lib/date.lib'
import {
    FREE_QUESTION,
    PAY_QUESTION,
}                               from 'config/questionnaire.config'

Page(Handle({
    mixins: [InputMixin, UserMixin, RouterMixin, CodeMixin, FormIdMixin],
    data: {
        objInput: {},
        is_pop: false,
        objHidden: {
            is_agree: {
                value: true,
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请先同意协议'
                    }
                ]
            },
        },

    },
    onLoad (options) {
        this.getParamsByUrl(options);
        this.initData();
        this.fetchUserInfo();
    },
    // 初始化参数
    initData () {
        let objInput = {};
        if (this.data.$params.IsMember) objInput = PAY_QUESTION;
        else objInput = FREE_QUESTION;
        this.setData({
            objInput,
        });
        this.setData({
            'objInput.Brithday.end': formatData('yyyy-MM-dd'),
        })
    },
    // 提交下一步
    handleSubmit (e) {
        if (Data.check(this.data.objInput)) return;
        if (Data.check(this.data.objHidden)) return;
        let {formId} = e.detail;
        this.setUserInfo();
        this.setWechatFormId(formId, 'questionnaire_one_index');
    },
    // 设置用户信息
    setUserInfo () {
        let data = Data.filter(this.data.objInput);
        this.getOrSetUserInfo(data).then(() => {
            Router.push('questionnaire_two_index', {
                ...this.data.$params,
            }, true,);
        }).catch((err) => {
            Toast.error(err);
        });
    },
    // 获取用户信息
    fetchUserInfo () {
        this.getOrSetUserInfo().then((res) => {
            res = res || {};
            if (res.Brithday) {
                res.Brithday = res.Brithday.replace(/[^0-9]/ig, '');
                res.Brithday = formatData('yyyy-MM-dd', new Date(+res.Brithday));
            }
            Data.assignment(this, res, this.data.objInput, 'objInput')
        }).catch((err) => {
            Toast.error(err);
        });
    },
    // 协议
    handleAgree() {
        let type = this.data.objHidden.is_agree.value;
        this.setData({
            'objHidden.is_agree.value': !type,
        })
    },
    // 弹窗
    handlePop(e) {
        let { currentTarget } = e;
        let is_pop = currentTarget.dataset.value;
        this.setData({
            is_pop
        })
    }
}));
