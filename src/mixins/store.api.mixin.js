
import Http                         from 'plugins/http.plugin'

export default {
    // 获取门店类型
    reqStoreTypes (sItem = `formData.StoreTypeName.options`) {
        Http(Http.API.Req_storeTypes).then((res) => {
            this.setData({
                [sItem]: res,
            })
        }).toast();
    },
    // 获取门店品牌
    reqStoreBrands (sItem = `formData.StoreBrandName.options`) {
        Http(Http.API.Req_storeBrands).then((res) => {
            this.setData({
                [sItem]: res,
            })
        }).toast();
    },
    // 获取所有产品品牌
    reqProductBrands (sItem = `formData.ProductBases.checkbox`) {
        Http(Http.API.Req_productBrands).then((res) => {
            this.setData({
                [sItem]: res,
            })
        }).toast();
    },
    // 获取当前用户门店
    reqStoresByUser (sItem = `formData.StoreName.options`) {
        Http(Http.API.Req_storesByUser).then((res) => {
            this.setData({
                [sItem]: res,
            })
        }).toast();
    },
}
