//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                         from 'plugins/http.plugin'
import SourceMixin                  from 'mixins/source.mixin'
import Router                       from 'plugins/router.plugin'
import Toast                        from 'plugins/toast.plugin'
import Mixin                        from 'utils/mixin.util'
import InputMixin                   from 'mixins/input.mixin'

const arrSrc = [
    { key: 'bg', value: 'login-bg-2.jpg' },
];

Page(Mixin({
    mixins: [
        InputMixin,
        SourceMixin,
    ],
    data: {
        code: '',
        check: false,
    },
    onLoad () {
        this.sourceGet(arrSrc);
    },
    // 购买会员
    handleClick () {
        let Code = this.data.code;
        if (!Code) return Toast.error('请输入10位服务码');
        return Http(Http.API.Do_setMemberInfo, {
            Code,
        }).then((res) => {
            this.setData({
                check: true,
            })
        }).toast();
    },
    // 跳转
    handleJump (e) {
        let { currentTarget } = e;
        let url = currentTarget.dataset.url;
        Router.root('home_index');
    }
}));
