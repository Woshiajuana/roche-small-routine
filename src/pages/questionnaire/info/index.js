//index.js
import './index.json'
import './index.scss'
import './index.wxml'


import Mixin                        from 'utils/mixin.util'
import SourceMixin                  from 'mixins/source.mixin'
import DataMixin                    from './data.mixin'

const arrSrc = [
    { key: 'bg', value: 'mfjd-one-header-banner.jpg' },
    { key: 'vBg', value: 'v-mfjd-one-header-banner.jpg' },
];

Page(Mixin({
    mixins: [
        DataMixin,
        SourceMixin,
    ],
    onLoad (options) {
        this.sourceGet(arrSrc);
    },
    // 初始化参数
    initData () {

    },
    // 提交下一步
    handleSubmit (e) {

    },
    // 设置用户信息
    setUserInfo () {

    },
    // 获取用户信息
    fetchUserInfo () {

    },
    // 协议
    handleAgree() {
        let type = this.data.objHidden.is_agree.value;
        this.setData({ 'objHidden.is_agree.value': !type })
    },
    // 弹窗
    handlePop(e) {
        let { currentTarget } = e;
        let is_pop = currentTarget.dataset.value;
        this.setData({ is_pop });
    }
}));
