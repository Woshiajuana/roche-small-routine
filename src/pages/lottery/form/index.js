//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                       from 'plugins/router.plugin'
import Mixin                        from 'utils/mixin.util'
import UserMixin                    from 'mixins/user.mixin'
import InputMixin                   from 'mixins/inputplus.mixin'
import Http                         from 'plugins/http.plugin'
import Modal                        from 'plugins/modal.plugin'

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
                isPicker: false,
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
                isPicker: false,
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
                options: [],
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
                options: [],
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
    handlePicker (event) {
        let { item } = this.inputParams(event);
        let { options, key } = item;
        if (options && options.length) {
            return this.setData({[`${key}.isPicker`]: true});
        }
        Http(Http.API.Req_GetDistricts, {
            Data: 0,
        }).then((res) => {
            this.setData({
                [`${key}.options`]: res || [],
                [`${key}.isPicker`]: true,
            });
        }).toast();
    },
    handlePickerSure (event) {
        let { item, value } = this.inputParams(event);
        let { rangeKey, key, contactKey, contactRangeKey } = item;
        if (value) {
            this.setData({
                [`${key}.value`]: value[rangeKey],
                [`${contactKey}.value`]: value[contactRangeKey]
            });
        }
    },
    handlePickerCancel (event) {
        let { item } = this.inputParams(event);
        this.setData({[`${item.key}.isPicker`]: false});
    },
}));
