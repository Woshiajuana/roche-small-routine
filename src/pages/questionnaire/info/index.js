//index.js
import './index.json'
import './index.scss'
import './index.wxml'


import Mixin                        from 'utils/mixin.util'
import SourceMixin                  from 'mixins/source.mixin'
import RouterMixin                  from 'mixins/router.mixin'
import FormIdMixin                  from 'mixins/formid.mixin'
import Http                         from 'plugins/http.plugin'
import Valid                        from 'utils/valid.util'
import DateUtil                     from 'utils/date.util'
import DataMixin                    from './data.mixin'

const arrSrc = [
    { key: 'bg', value: 'mfjd-one-header-banner.jpg' },
    { key: 'vBg', value: 'v-mfjd-one-header-banner.jpg' },
    { key: 'icon', value: 'agreement-pop-icon.png' },
];

Page(Mixin({
    mixins: [
        DataMixin,
        FormIdMixin,
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
        console.log(console.log(event))
    },
    // 获取用户数据
    reqUserInfo () {
        let { formData } = this.data;
        Http(Http.API.Do_userInfo).then((res) => {
            if (res.Brithday)
                res.Brithday = DateUtil.formatTime(res.Brithday);
            Valid.assignment(this, res, formData);
        }).toast();
    },
    // 弹窗
    handlePop() {
        let { isPop } = this.data;
        this.setData({ isPop: !isPop });
    }
}));
