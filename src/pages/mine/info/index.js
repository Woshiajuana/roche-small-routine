//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Toast                    from 'plugins/toast.plugin'
import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import InputMixin               from 'mixins/input.mixin'
import UserMixin                from 'mixins/user.mixin'
import CodeMixin                from 'mixins/code.mixin'
import FormIdMixin              from 'mixins/formid.mixin'
import RouterMixin              from 'mixins/router.mixin'
import Data                     from 'utils/data.util'
import { formatData }           from 'wow-cool/lib/date.lib'

Page(Handle({
    mixins: [InputMixin, UserMixin, RouterMixin, CodeMixin, FormIdMixin],
    data: {
        objInput: {
            Height: {
                label: '身高',
                placeholder: '请输入您的身高',
                value: '',
                type: 'digit',
                max: 6,
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入您的身高'
                    }
                ],
                unit: 'cm',
            },
            Weight: {
                label: '体重',
                placeholder: '请输入您的体重',
                value: '',
                type: 'digit',
                max: 6,
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入您的体重'
                    }
                ],
                unit: 'kg',
            },
            Mobile: {
                label: '手机号',
                placeholder: '请输入您的手机号',
                type: 'number',
                value: '',
                max: 11,
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入您的手机号'
                    }
                ]
            },
            SmsCode: {
                label: '验证码',
                placeholder: '请输入验证码',
                type: 'number',
                value: '',
                max: 6,
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入验证码'
                    }
                ],
                use_code: {
                    tel: 'Mobile',
                    count: 60,
                },
            },
            RedProtein: {
                label: '糖化血红蛋白值',
                placeholder: '请输入糖化血红蛋白值',
                type: 'digit',
                value: '',
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入糖化血红蛋白值'
                    }
                ]
            },
            LowSugar: {
                label: '是否有过低血糖',
                value: 1,
                use_radio: [
                    {
                        label: '是',
                        value: 1,
                    },
                    {
                        label: '否',
                        value: 2,
                    }
                ]
            },
            Name: {
                label: '姓名',
                placeholder: '请输入您的姓名',
                value: '',
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入您的姓名'
                    }
                ]
            },
            Sex: {
                label: '性别',
                value: 1,
                use_radio: [
                    {
                        label: '男',
                        value: 1,
                    },
                    {
                        label: '女',
                        value: 2,
                    }
                ]
            },
            Brithday: {
                value: '',
                label: '出生年月',
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入您的出生年月'
                    }
                ]
            },
        },
        start: '1901-01-01',
        end: formatData('yyyy-MM-dd'),
    },
    onLoad (options) {
        this.setData({
            end: formatData('yyyy-MM-dd'),
        });
        this.getParamsByUrl(options);
        this.initData();
        this.fetchUserInfo();
    },
    initData () {
        let type = !this.data.$params.IsMember;
        let objInput = {...this.data.objInput};
        if (type) {
            delete objInput.Mobile;
            delete objInput.SmsCode;
        }
        this.setData({
            objInput,
        })
    },
    // 提交下一步
    handleSubmit (e) {
        if (Data.check(this.data.objInput)) return;
        let { formId } = e.detail;
        this.setWechatFormId(formId, 'mine_info_index');
        this.setUserInfo();
    },
    // 设置用户信息
    setUserInfo () {
        let data = Data.filter(this.data.objInput);
        let from = this.data.$params.from || '';
        let url = this.data.$params.to || 'mine_report_index';
        this.getOrSetUserInfo(data).then((res) => {
            !from && Toast.error('保存成功');
            setTimeout(() => {
               from ? Router.push(url, {}, true) : Router.pop();
            }, 1000);
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
            res.LowSugar = res.LowSugar ? 1 : 0;
            Data.assignment(this, res, this.data.objInput, 'objInput')
        }).catch((err) => {
            Toast.error(err);
        });
    },
}));
