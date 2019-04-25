
import File                         from 'plugins/file.plugin'
import Loading                      from 'plugins/loading.plugin'

export default {
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
            optItem = options[value];
            if (options && !options[value])
                return null;
            data[`${key}.value`] = optItem[rangeKey];
            if (contactKey && contactRangeKey)
                data[`${contactKey}.value`] = optItem[contactRangeKey];
        } else {
            data[`${key}.value`] = value;
        }
        this.setData(data);
        this.optionsChange({type: 'select', item, optItem});
    },
    handleConfirm (event) {
        let {
            item,
        } = event.detail;
        this.optionsChange({type: 'confirm', item});
    },
    handleInput (event) {
        let {
            value,
            item,
        } = event.detail;
        this.setData({
            [`${item.key}.value`]: value,
        });
    },
    handleInputClear (event) {
        let {
            value,
            item,
        } = event.detail;
        this.setData({
            [`${item.key}.value`]: '',
        });
        this.optionsChange({type: 'clear', item});
    },
    handleDate (event) {
        let {
            value,
            item,
        } = event.detail;
        this.setData({
            [`${item.key}.value`]: value,
        });
        this.optionsChange({type: 'date', item});
    },
    optionsChange (event) {
        this.optionsChangeCallback && this.optionsChangeCallback(event);
    },

    handleLinkageSure (event) {
        let {
            result,
            linkageNoUse,
        } = event.detail;
        let Area, province, city, county;
        if (linkageNoUse.indexOf('one') > -1)
            [province, city, county] = result;
        else
            [Area, province, city, county] = result;
        let {
            optionsHiddenData,
            optionsData,
        } = this.data;
        if (Area) {
            optionsHiddenData.AreaID.value = Area.Code;
            optionsData.AreaName && (optionsData.AreaName.value = Area.Name);
        }
        if (province) {
            optionsHiddenData.ProviceID.value = province.Code;
            optionsData.ProviceName && (optionsData.ProviceName.value = province.Name);
        }
        if (city) {
            optionsHiddenData.CityID.value = city.Code;
            optionsData.CityName && (optionsData.CityName.value = city.Name);
        }
        if (county) {
            optionsHiddenData.CountyID.value = county.Code;
            optionsData.CountyName && (optionsData.CountyName.value = county.Name);
        }
        this.setData({
            optionsHiddenData,
            optionsData,
        });
        this.optionsChange({type: 'linkage', result});
    },

    handleDown (event) {
        if (!this.reqExportTableFile) return null;
        this.reqExportTableFile().then((res) => {
            Loading.show();
            if (!res) throw '没有文件';
            return File.downloadFile({url: res});
        }).then((res) => {
            let { statusCode, errMsg, tempFilePath} = res;
            if (statusCode !== 200) throw errMsg;
            return File.openDocument({
                filePath: tempFilePath,
                fileType: 'xlsx',
            });
        }).then((res) => {
            console.log(res)
        }).toast().finally(() => {
            Loading.hide();
        });
    },

    // 重置
    handleReset () {
        let {
            optionsHiddenData,
            optionsData,
        } = this.data;
        if (optionsHiddenData) {
            for (let k in optionsHiddenData) {
                if (typeof optionsHiddenData[k].value !== 'undefined')
                    optionsHiddenData[k].value = '';
            }
        }
        if (optionsData) {
            for (let k in optionsData) {
                if (typeof optionsData[k].value !== 'undefined')
                    optionsData[k].value = '';
                if (optionsData[k].children) {
                    for (let ck in optionsData[k].children) {
                        optionsData[k].children[ck].value = '';
                    }
                }
            }
        }
        this.setData({
            optionsHiddenData,
            optionsData,
        });
        this.optionsChange({type: 'reset'});
    },
}
