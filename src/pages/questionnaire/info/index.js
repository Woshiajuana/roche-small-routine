//index.js
import './index.json'
import './index.scss'
import './index.wxml'


import Mixin                        from 'utils/mixin.util'
import SourceMixin                  from 'mixins/source.mixin'
import RouterMixin                  from 'mixins/router.mixin'
import Http                         from 'plugins/http.plugin'
import Valid                        from 'utils/valid.util'
import DataMixin                    from './data.mixin'

const arrSrc = [
    { key: 'bg', value: 'mfjd-one-header-banner.jpg' },
    { key: 'vBg', value: 'v-mfjd-one-header-banner.jpg' },
    { key: 'icon', value: 'agreement-pop-icon.png' },
];

Page(Mixin({
    mixins: [
        DataMixin,
        SourceMixin,
        RouterMixin,
    ],
    onLoad (options) {
        this.sourceGet(arrSrc);
        this.routerGetParams(options);
        this.reqUserInfo();
    },
    // 初始化参数
    initData () {

    },
    // 提交下一步
    handleSubmit (event) {

    },
    // 获取用户数据
    reqUserInfo () {
        Http(Http.API.Do_userInfo).then(() => {

        }).toast();
    },
    // 弹窗
    handlePop() {
        let { isPop } = this.data;
        this.setData({ isPop: !isPop });
    }
}));
