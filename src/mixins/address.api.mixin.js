
import Http                         from 'plugins/http.plugin'

export default {
    // 2.23	获取省份、城市、区县信息
    reqDistricts (data = {Data: 0}, sItem = `optionsData.ProviceName.options`) {
        Http(Http.API.Req_districts, data).then((res) => {
            this.setData({
                [sItem]: res,
            });
        }).toast();
    },

    // 2.24	获取大区与省份信息
    reqDistrictsAreas (data = {}, sItem = `optionsData.AreaName.options`) {
        Http(Http.API.Req_districtAreas, data).then((res) => {
            this.setData({
                [sItem]: res,
            });
        }).toast();
    },

    addressOptionsChange (item, optItem) {
        let { label, mold } = item;
        if (mold === 'linkage') return;
        let { Code } = optItem;
        let data = {};
        if (label === '大区') {
            data = {
                [`optionsData.ProviceName.value`]: '',
                [`optionsData.ProviceName.options`]: [],
                [`optionsHiddenData.ProviceID.value`]: '',

                [`optionsData.CityName.value`]: '',
                [`optionsData.CityName.options`]: [],
                [`optionsHiddenData.CityID.value`]: '',
            };
            this.reqDistrictsAreas({Data: Code}, 'optionsData.ProviceName.options')
        } else if (label === '省份') {
            data = {
                [`optionsData.CityName.value`]: '',
                [`optionsData.CityName.options`]: [],
                [`optionsHiddenData.CityID.value`]: '',
            };
            this.reqDistricts({Data: Code}, 'optionsData.CityName.options')
        }
        this.setData(data);
    },

    addressFormChange (item, optItem) {
        let { label, mold } = item;
        if (mold === 'linkage') return;
        let { Code } = optItem;
        let data = {};
        if (label === '大区') {
            data = {
                [`formData.ProviceName.value`]: '',
                [`formData.ProviceName.options`]: [],
                [`formHiddenData.ProviceID.value`]: '',

                [`formData.CityName.value`]: '',
                [`formData.CityName.options`]: [],
                [`formHiddenData.CityID.value`]: '',

                [`formData.CountyName.value`]: '',
                [`formData.CountyName.options`]: [],
                [`formHiddenData.CountyID.value`]: '',
            };
            this.reqDistrictsAreas({Data: Code}, 'formData.ProviceName.options')
        } else if (label === '省份') {
            data = {
                [`formData.CityName.value`]: '',
                [`formData.CityName.options`]: [],
                [`formHiddenData.CityID.value`]: '',

                [`formData.CountyName.value`]: '',
                [`formData.CountyName.options`]: [],
                [`formHiddenData.CountyID.value`]: '',
            };
            this.reqDistricts({Data: Code}, 'formData.CityName.options')
        } else if (label === '城市') {
            data = {
                [`formData.CountyName.value`]: '',
                [`formData.CountyName.options`]: [],
                [`formHiddenData.CountyID.value`]: '',
            };
            this.reqDistricts({Data: Code}, 'formData.CountyName.options')
        }
        this.setData(data);
    }
}
