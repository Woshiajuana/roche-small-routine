
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

export default {
    data: {
        sourceData: {
            value: [0, 0, 0, 0, 0],
            children: {
                one: {
                    value: '',
                    key: 'sourceData.children.one.options',
                    source: reqDistrictsAreas,
                    rangeKey: 'Name',
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
    }
}
