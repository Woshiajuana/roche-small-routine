//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                         from 'plugins/http.plugin'
import SourceMixin                  from 'mixins/source.mixin'
import Router                       from 'plugins/router.plugin'
import Modal                        from 'plugins/modal.plugin'
import Mixin                        from 'utils/mixin.util'
import InputMixin                   from 'mixins/input.mixin'
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
    handleClick () {
        let Code = this.data.code;
        if (!Code) return Modal.toast('请输入10位服务码');
        return Http(Http.API.Do_setMemberInfo, {
            Code,
        }).then((res) => {
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
