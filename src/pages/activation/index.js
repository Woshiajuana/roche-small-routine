//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                         from 'plugins/http.plugin'
import Router                       from 'plugins/router.plugin'
import Toast                        from 'plugins/toast.plugin'
import Mixin                        from 'utils/mixin.util'
import InputMixin                   from 'mixins/input.mixin'

Page(Mixin({
    mixins: [
        InputMixin,
    ],
    data: {
        code: '',
        check: false,
    },
    onLoad (options) {
        // this.getParamsByUrl(options);
    },
    // 购买会员
    handleClick () {
        this.setMemberInfo();
    },
    // 购买会员
    setMemberInfo () {
        let Code = this.data.code;
        if (!Code) return Toast.error('请输入10位服务码');
        let options = {
            url: 'RocheApi/SetMemberInfo',
            data: {
                Code,
            },
            loading: true,
        };
        return Http(options).then((res) => {
            this.setData({
                check: true,
            })
        }).catch((err) => {
            Toast.error(err);
        })
    },
    // 跳转
    handleJump (e) {
        let { currentTarget } = e;
        let url = currentTarget.dataset.url;
        Router.root('home_index');
    }
}));
