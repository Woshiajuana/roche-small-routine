//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                       from 'plugins/router.plugin'
import Mixin                        from 'utils/mixin.util'
import UserMixin                    from 'mixins/user.mixin'
import InputMixin                   from 'mixins/inputplus.mixin'

Page(Mixin({
    mixins: [
        UserMixin,
        InputMixin,
    ],
    data: {
        objHidden: {
            // 省份 ID
            ProviceID: { value: '' },
            // 城市 ID
            CityID: { value: '' },
        },
        objInput: {
            SPName: {
                value: '',
                key: 'objInput.SPName',
                placeholder: '姓名',
                use: [
                    {
                        nonempty: true,
                        prompt: '请输入姓名'
                    }
                ]
            },
            Mobile: {
                value: '',
                key: 'objInput.Mobile',
                placeholder: '手机号码',
                maxlength: 11,
                type: 'number',
                use: [
                    {
                        nonempty: true,
                        prompt: '请输入手机号码'
                    }
                ]
            },
            ProviceName: {
                value: '',
                key: 'objInput.ProviceName',
                placeholder: '购买省份',
                rangeKey: 'name',
                contactKey: 'objHidden.ProviceID',
                contactRangeKey: 'value',
                options: [
                    { name: '1', value: '1' }
                ],
                use: [
                    {
                        nonempty: true,
                        prompt: '请输入购买省份'
                    }
                ]
            },
            CityName: {
                value: '',
                key: 'objInput.CityName',
                placeholder: '购买城市',
                rangeKey: 'name',
                contactKey: 'objHidden.CityID',
                contactRangeKey: 'value',
                options: [
                    { name: '1', value: '1' }
                ],
                use: [
                    {
                        nonempty: true,
                        prompt: '请输入购买城市'
                    }
                ]
            },
            StoreName: {
                value: '',
                key: 'objInput.StoreName',
                placeholder: '门店名称',
                use: [
                    {
                        nonempty: true,
                        prompt: '请选择门店名称'
                    }
                ]
            },
        }
    },
    onLoad () {
        this.userGet();
    },
    handleSubmit () {

    },
}));
