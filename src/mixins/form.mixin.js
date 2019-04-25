
import Image                        from 'plugins/image.plugin'
import Modal                        from 'plugins/modal.plugin'
import Http                         from 'plugins/http.plugin'
import Location                     from 'plugins/location.plugin'
import Authorize                    from 'plugins/authorize.plugin'
import Loading                      from 'plugins/loading.plugin'
import QQMap                        from 'utils/qqmap.util'

export default {
    data: {
        hidePop: true,
    },
    handleLabel (event) {
        let {
            item,
        } = event.detail;
        let {
            key,
            status,
        } = item;
        if (status !== false)
            return null;
        this.setData({
            [`${key}.status`]: true,
        });
    },
    handleSelectChange (event) {
        let {
            value,
            item,
        } = event.detail;
        let {
            key,
            options,
            rangeKey,
            contactKey,
            contactRangeKey,
        } = item;
        let data = {};
        let optItem = null;
        if (options) {
            optItem= options[value];
            if (options && !options[value])
                return null;
            data[`${key}.value`] = optItem[rangeKey];
            if (contactKey && contactRangeKey)
                data[`${contactKey}.value`] = optItem[contactRangeKey];
        } else {
            data[`${key}.value`] = value;
        }
        this.setData(data);
        this.formChange({type: 'select', item, optItem});
    },
    formChange (event) {
        this.formChangeCallback && this.formChangeCallback(event);
    },
    handleInput (event) {
        let {
            value,
            item,
        } = event.detail;
        let {
            type
        } = item;
        // if (['digit'].indexOf(type) > -1 && value !== '') {
        //     value = +value
        // }
        this.setData({
            [`${item.key}.value`]: value,
        });
    },
    handleCheck (event) {
        let {
            key,
            item,
            checkvalue,
        } = event.detail;
        let {
            value,
            checkbox,
        } = item;
        let checkItem = checkbox[checkvalue];
        let index = -1;
        value.forEach((item, i) => {
            if (checkItem.ID === item.ID) {
                index = i;
                value.splice(index, 1);
            }
        });
        if (index === -1)
            value.push(checkItem);
        this.setData({
            [`${key}.value`]: value,
        });
    },
    handleUpload (event) {
        let {
            currentTarget,
        } = event.detail;
        let {
            key,
            item,
        } = currentTarget.dataset;
        let {
            value,
        } = item;
        let sItem = `${key}.value`;
        Modal.actionSheet(['从手机相册选择', '拍照']).then((res) => {
            let sourceType = [['album'], ['camera']];
            if (res.cancel)
                return null;
            return Image.choose({sourceType: sourceType[res.tapIndex]});
        }).then((res) => {
            if (!res) return null;
            let data = {
                filePath: res.tempFilePaths[0],
                name: 'fileToUpload',
            };
            Http(Http.API.Do_uploadImage, data, {useUpLoad: true}).then((res) => {
                this.setData({
                    [sItem]: res,
                });
            }).toast();
        })
    },
    handleLinkageSure (event) {
        let [
            Area,
            province,
            city,
            county,
        ] = event.detail;
        console.log(event.detail)
        let {
            formHiddenData,
            formData,
        } = this.data;
        formHiddenData.AreaID.value = Area.Code;
        formHiddenData.ProviceID.value = province.Code;
        formHiddenData.CityID.value = city.Code;
        formHiddenData.CountyID.value = county.Code;

        formData.AreaName.value = Area.Name;
        formData.ProviceName.value = province.Name;
        formData.CityName.value = city.Name;
        formData.CountyName.value = county.Name;
        this.setData({
            formHiddenData,
            formData,
        })
    },
    handlePop (event) {
        let { hidePop } = event.detail;
        this.setData({
            hidePop,
        })
    },
    handleLocation (event) {
        let {
            item
        } = event.detail;
        let {
            latitudeKey,
            longitudeKey,
            key,
        } = item;
        let latitude, longitude;
        Authorize(Authorize.SCOPE.userLocation, '获取定位需要地理位置授权').then(() => {
            Loading.show();
            Location.getLocation().then((res) => {
                latitude = res.latitude;
                longitude = res.longitude;
                let location = { latitude, longitude };
                return QQMap().reverseGeocoder({ location })
            }).then((res) => {
                let { status, result, message } = res;
                if (status !== 0) throw message;
                let { address } = result;
                this.setData({
                    [`${key}.value`]: address,
                    [`${latitudeKey}.value`]: latitude,
                    [`${longitudeKey}.value`]: longitude,
                })
            }).toast().finally(() => {
                Loading.hide();
            });
        }).catch(() => {
            Modal.toast('获取定位需要地理位置授权哦')
        });
    },
    getDataItem (key){
        let keys = key.split('.');
        let data = this.data;
        keys.forEach((k) => {
            data = data[k]
        });
        return data;
    }
}
