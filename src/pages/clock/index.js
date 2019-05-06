//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                         from 'plugins/http.plugin'
import Router                       from 'plugins/router.plugin'
import Modal                        from 'plugins/modal.plugin'
import Mixin                        from 'utils/mixin.util'
import Valid                        from 'utils/valid.util'
import InputMixin                   from 'mixins/input.mixin'
import SourceMixin                  from 'mixins/source.mixin'
import DataMixin                    from './data.mixin'

const arrSrc = [
    { key: 'bg', value: 'activation-bg.jpg' },
];

Page(Mixin({
    mixins: [
        DataMixin,
        InputMixin,
        SourceMixin,
    ],
    onLoad () {
        this.sourceGet(arrSrc);
    },
    inputCallback () {
        let { formData, arrData } = this.data;
        let Code = formData.Code.value;
        Code = Code.split('');
        let arr = ['', '', '', '', '', ''];
        arrData = [...Code, ...arr];
        arrData = arrData.slice(0, 6);
        this.setData({arrData});
    },
    // 购买会员
    handleSubmit () {
        if (Valid.check(this.data.formData)) return null;
        let data = Valid.input(this.data.formData);
        return Http(Http.API.Do_setMemberInfo, data).then((res) => {
            Modal.confirm({
                content: '恭喜您，您的服务已开通！',
                showCancel: false,
                confirmText: '返回首页',
            }).then(() => {
                Router.root('home_index');
            });
        }).toast();
    },
}));
