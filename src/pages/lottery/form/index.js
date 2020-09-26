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
import Valid                        from 'utils/valid.util'

Page(Mixin({
    mixins: [
        UserMixin,
        InputMixin,
    ],
    data: {
        disabled: '',
        storeName: '',
        arrStore: '',
        objHidden: {
            // 省份 ID
            ProviceID: { value: '' },
            // 城市 ID
            CityID: { value: '' },
            StoreId: { value: '' },
        },
        objInput: {
            SPName: {
                value: '',
                key: 'objInput.SPName',
                placeholder: '中文姓名',
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
                    },
                    { rule: (v) => /^1\d{10}$/.test(v), prompt: '手机号输入有误', },
                ]
            },
            ProviceName: {
                value: '',
                key: 'objInput.ProviceName',
                placeholder: '所在省份',
                rangeKey: 'Name',
                contactKey: 'objHidden.ProviceID',
                contactRangeKey: 'Code',
                options: [],
                use: [
                    {
                        nonempty: true,
                        prompt: '请选择所在省份'
                    }
                ]
            },
            CityName: {
                value: '',
                key: 'objInput.CityName',
                placeholder: '所在城市',
                rangeKey: 'Name',
                contactKey: 'objHidden.CityID',
                contactRangeKey: 'Code',
                options: [],
                use: [
                    {
                        nonempty: true,
                        prompt: '请选择所在城市'
                    }
                ]
            },
            StoreName: {
                value: '',
                key: 'objInput.StoreName',
                placeholder: '选择门店名称',
                disabled: true,
                use: [
                    {
                        nonempty: true,
                        prompt: '请选择门店名称'
                    }
                ]
            },
        },
        objStoreInfo: '',
    },
    onLoad () {
        this.userGet();
        this.reqActInfo();
    },
    reqActInfo() {
        Http(Http.API.Req_GetActivityUser).then((res) => {
            this.setData({ disabled: !!res.Mobile, objStoreInfo: res });
            if (res.Mobile) {
                let { objInput, objHidden } = this.data;
                Valid.assignment(this, res, objHidden, 'objHidden');
                Valid.assignment(this, res, objInput, 'objInput');
            }
        }).toast();
    },
    handleSubmit () {
        console.log(this.data);
        let { objHidden, objInput, arrStore } = this.data;
        let options = {};
        if (arrStore && !arrStore.length) {
            options = { StoreName: '', StoreId: 0 };
            objInput.StoreName.use[0].nonempty = false;
        } else {
            objInput.StoreName.use[0].nonempty = true;
        }
        if (Valid.check(objInput)) {
            return null
        }
        options = Object.assign({}, Valid.input(objInput, objHidden), options);
        Http(Http.API.Do_SetActivityUser, options).then((res) => {
            Modal.toast('提交成功');
            setTimeout(() => Router.pop(), 1500);
        }).toast();
    },
    handleSelectStore (event) {
        let { item } = this.inputParams(event);
        let { objHidden, objInput } = this.data;
        let { Name: StoreName, Id: StoreId } = item;
        Valid.assignment(this, { StoreId, StoreName }, objHidden, 'objHidden');
        Valid.assignment(this, { StoreId, StoreName }, objInput, 'objInput');
    },
    handlePicker (event) {
        if (this.data.disabled) return null;
        let { item } = this.inputParams(event);
        let { options, key } = item;
        if (options && options.length) {
            return this.setData({[`${key}.isPicker`]: true});
        }
        let code = 0;
        if (key === 'objInput.CityName') {
            let { objHidden } = this.data;
            let { ProviceID } = Valid.input(objHidden);
            if (!ProviceID) {
                return Modal.toast('请选择购买省份');
            }
            code = ProviceID
        }
        Http(Http.API.Req_GetDistricts, {
            Data: code,
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
        if (key === 'objInput.ProviceName'){
            this.setData({
                'objInput.CityName.options': [],
                'objInput.StoreName.value': '',
                'objInput.CityName.value': '',
                'objHidden.CityID.value': '',
                'objHidden.StoreId.value': '',
                arrStore: '',
            });
        }
        if (key === 'objInput.CityName') {
            this.setData({
                'objInput.StoreName.value': '',
                'objHidden.StoreId.value': '',
                arrStore: '',
                storeName: '',
            });
            // 获取门店
            this.reqStoreList();
        }
    },
    handleSearchStore () {
        this.reqStoreList('search');
    },
    inputCallback(item, value) {
        if (item === 'storeName' && !value) {
            this.reqStoreList();
        }
    },
    reqStoreList (type) {
        let { objInput, objHidden, storeName } = this.data;
        if (Valid.check({ x: objInput.ProviceName, x2: objInput.CityName })) {
            return null
        }
        let { ProviceID, CityID } = Valid.input(objInput, objHidden);
        Http(Http.API.Req_GetStoreList, {
            ProviceID,
            CityID,
            Name: storeName,
        }).then((res) => {
            let arrStore = res || [];
            if (type === 'search' && !arrStore.length) {
                arrStore = -1;
            }
            this.setData({ arrStore });
        }).toast();
    },
    handlePickerCancel (event) {
        let { item } = this.inputParams(event);
        this.setData({[`${item.key}.isPicker`]: false});
    },
}));
