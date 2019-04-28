//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Mixin                        from 'utils/mixin.util'
import SourceMixin                  from 'mixins/source.mixin'
import RouterMixin                  from 'mixins/router.mixin'
import Http                         from 'plugins/http.plugin'
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
    // 生命周期回调—监听页面加载
    onLoad (options) {
        this.routerGetParams(options);
        this.getArchives();
    },
    // 获取文档
    getArchives () {
        return Http(Http.API.Req_getArchives).then((res) => {

        }).toast();
    },

    // 提交下一步
    handleSubmit () {

    },

}));
