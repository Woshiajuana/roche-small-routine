import './index.json'
import './index.wxml'
import './index.scss'

import Mixin                        from 'utils/mixin.component.util'
import Modal                        from 'plugins/modal.plugin'
import SourceMixin                  from 'mixins/source.mixin'
import Valid                        from 'utils/valid.util'
import Regular                      from 'wow-cool/lib/regular.lib'
import Http                         from 'plugins/http.plugin'

const arrSrc = [
    { key: 'normal', value: 'select-nor-icon.png' },
    { key: 'active', value: 'select-ative-icon.png' },
];

Component(Mixin({
    mixins: [
        SourceMixin,
    ],
    properties: {
        // 这里定义了innerText属性，属性值可以在组件使用时指定
        formData: {
            type: Object,
            value: {},
        },
    },
    data: {
        count: 0,
    },
    lifetimes: {
        attached () {
            this.sourceGet(arrSrc);
        },
    },
    methods: {
        formatData (event) {
            let { detail, currentTarget } = event;
            let { item, value } = currentTarget.dataset;
            if (typeof value === 'undefined') value = detail.value;
            return { value, item };
        },
        handleFormInput (event) {
            let { value, item } = this.formatData(event);
            this.setData({[`${item.key}.value`]: value});
        },
        // 数据提交
        handleSubmit (event) {
            if (Valid.check(this.data.formData)) return null;
            let data = Valid.input(this.data.formData);
            console.log(data);
            this.triggerEvent('submit', data);
        },
        // 弹窗声明
        handleFormPop () {
            this.triggerEvent('pop');
        },
        // 获取验证码
        handleFormCode (event) {
            let { value, item } = this.formatData(event);
            if (!value) return Modal.toast('请输入您的手机号');
            if (!Regular.isPhone(value)) return Modal.toast('手机号输入错误');
            this.reqSendSms(value, item.useCode.count);
        },
        // 获取验证码
        reqSendSms (Mobile, count) {
            return Http(Http.API.Req_sendSms, {
                Mobile,
            }).then((res) => {
                Modal.toast('发送验证码成功');
                this.countDown(count);
            }).toast();
        },
        // 计数
        countDown (count) {
            this.setData({ count });
            if (count <= 0) return;
            setTimeout(() => {
                this.countDown(--count);
            },1000)
        },
    }
}));
