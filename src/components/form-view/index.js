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
        handle (event) {
            let {
                detail,
                currentTarget,
            } = event;
            let {
                value
            } = detail;
            let {
                key,
                item,
                checkvalue,
            } = currentTarget.dataset;
            let {
                disabled
            } = this.data.params;
            return {
                value,
                key,
                item,
                disabled,
                checkvalue,
            }
        },
        // 数据提交
        handleSubmit (event) {
            console.log(event)
        },

    }
}));
