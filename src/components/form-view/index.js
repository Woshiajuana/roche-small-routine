import './index.json'
import './index.wxml'
import './index.scss'

import Mixin                        from 'utils/mixin.component.util'
import Modal                        from 'plugins/modal.plugin'
import SourceMixin                  from 'mixins/source.mixin'
import Valid                        from 'utils/valid.util'

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
            // let options = Valid.
            console.log(event);

        },
        // 弹窗声明
        handleFormPop () {

        },
    }
}));
