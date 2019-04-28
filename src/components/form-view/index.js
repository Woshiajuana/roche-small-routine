import './index.json'
import './index.wxml'
import './index.scss'

import Mixin                        from 'utils/mixin.component.util'
import Modal                        from 'plugins/modal.plugin'
import SourceMixin                  from 'mixins/source.mixin'

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
        handleSelectChange (event) {
            if (this.data.params.disabled) return null;
            let data = this.handle(event);
            this.triggerEvent('select', data);
        },
        handleInput (event) {
            if (this.data.params.disabled) return null;
            let data = this.handle(event);
            this.triggerEvent('input', data);
        },
        handleCheck (event) {
            if (this.data.params.disabled) return null;
            let data = this.handle(event);
            this.triggerEvent('check', data);
        },
        handleLabel (event) {
            if (this.data.params.disabled) return null;
            let data = this.handle(event);
            this.triggerEvent('label', data);
        },
        handleUpload (event) {
            if (this.data.params.disabled) return null;
            this.triggerEvent('upload', event);
        },
        handleLinkage (event) {
            if (this.data.params.disabled) return null;
            this.setData({
                isShowLinkage: true,
            });
            this.triggerEvent('pop', {hidePop: false});
        },
        handleLinkageCancel () {
            this.setData({
                isShowLinkage: false,
            });
            this.triggerEvent('pop', {hidePop: true});
        },
        handleLinkageError (err) {
            Modal.toast(err);
            this.setData({
                isShowLinkage: false,
            });
            this.triggerEvent('pop', {hidePop: true});
        },
        handleLinkageSure (event) {
            let {
                value,
                result,
            } = event.detail;
            this.setData({
                ['sourceData.value']: value,
            });
            this.triggerEvent('linkage', result);
            this.triggerEvent('pop', {hidePop: true});
            this.setData({
                isShowLinkage: false,
            });
        },
        handleLocation (event) {
            if (this.data.params.disabled) return null;
            let data = this.handle(event);
            this.triggerEvent('location', data);
        },
    }
}));
