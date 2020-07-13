import './index.json'
import './index.wxml'
import './index.scss'

import Mixin                        from 'utils/mixin.component.util'
import InputMixin                   from 'mixins/input.mixin'
import ModalMixin                   from 'mixins/modal.mixin'

Component(Mixin({
    mixins: [
        InputMixin,
        ModalMixin,
    ],
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    properties: {
        pickerData: {
            type: Array,
            value: [],
        },
        pickerRangeKey: {
            type: String,
            value: '',
        },
        pickerShow: {
            type: Boolean,
            value: false,
            observer (value) {
                value ? this.resetSourceData() : this.setData({ value: [0] });
            },
        },
    },
    data: {
        arrData: [],
        isScrollEnd: true,
        value: [0],
    },
    lifetimes: {
        attached () {
            // 在组件实例进入页面节点树时执行
            this.resetSourceData();
        },
        detached () {
            // 在组件实例被从页面节点树移除时执行
            this.setData({ value: [0] });
        },
    },
    methods: {
        handleSure () {
            let { arrData, value, isScrollEnd } = this.data;
            console.log('确认 isScrollEnd => ', isScrollEnd)
            if (!isScrollEnd) return null;
            if (!arrData.length) return this.modalToast('没有数据哦');
            this.triggerEvent('sure', { value: arrData[value[0]] });
            this.handleCancel();
        },
        handleCancel () {
            this.triggerEvent('cancel');
        },
        resetSourceData () {
            let { pickerData, arrData } = this.data;
            arrData = JSON.parse(JSON.stringify(pickerData));
            this.setData({ arrData });
        },
        handlePickerStart (event) {
            this.setData({ isScrollEnd: false });
        },
        handlePickerChange (event) {
            let { value } = this.inputParams(event);
            this.setData({ value: value });
        },
        handlePickerEnd (event) {
            this.setData({ isScrollEnd: true });
        },
        handleInput (event) {
            let { value } = this.inputParams(event);
            let { pickerData, pickerRangeKey } = this.data;
            let arrData = pickerData.filter((item) => pickerRangeKey ? item[pickerRangeKey].indexOf(value) > -1 : item.indexOf(value) > -1);
            this.setData({ arrData });
        },
    },
}));
