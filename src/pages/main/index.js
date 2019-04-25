//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Mixin                        from 'utils/mixin.util'
import Router                       from 'plugins/router.plugin'
import RouterConfig                 from 'config/router.config'
import AddressApiMixin              from 'mixins/address.api.mixin'
import Http                         from 'plugins/http.plugin'


const reqDistricts = (data) => {
    if (!data) data = 0;
    data = data.Code;
    return Http(Http.API.Req_districts, {Data: data});
};

const reqDistrictsAreas = (data) => {
    if (!data) data = 0;
    data = data.Code;
    return Http(Http.API.Req_districtAreas, {Data: data});
};
Page(Mixin({
    mixins: [
        AddressApiMixin,
    ],
    data: {
        dataList: RouterConfig,
        sourceData: {
            value: [0, 0, 0],
            children: {
                one: {
                    value: '',
                    key: 'sourceData.children.one.options',
                    source: reqDistrictsAreas,
                    rangeKey: 'Name',
                    contactKey: 'formHiddenData.StoreTypeID',
                    contactRangeKey: 'ID',
                    options: [],
                },
                two: {
                    value: '',
                    key: 'sourceData.children.two.options',
                    rangeKey: 'Name',
                    source: reqDistrictsAreas,
                    options: [],
                },
                three: {
                    value: '',
                    key: 'sourceData.children.three.options',
                    rangeKey: 'Name',
                    source: reqDistricts,
                    options: [],
                },
                four: {
                    value: '',
                    key: 'sourceData.children.four.options',
                    rangeKey: 'Name',
                    source: reqDistricts,
                    options: [],
                },
                five: {
                    value: '',
                    key: 'sourceData.children.five.options',
                    rangeKey: 'Name',
                    source: reqDistricts,
                    options: [],
                },
            }
        }
    },
    onShow() {

    },
    onLoad () {

    },
    onReady () {

    },
    // 导航条切换
    handleJump (event) {
        let {
            key,
        } = event.currentTarget.dataset;
        Router.push(key);
    }
}));
