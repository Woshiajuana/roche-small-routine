import SDK                          from 'utils/bleSDK.util'
import Authorize                    from 'plugins/authorize.plugin'
import Loading                      from 'plugins/loading.plugin'

export default {

    // 搜索蓝牙
    bleSearchRoche: () => new Promise((resolve, reject) => {
        Loading.showNavigationBarLoading();
        Authorize(Authorize.SCOPE.userLocation).then(() => {
            SDK.searchRoche(resolve, reject);
        }).catch((err) => {
            Loading.hideNavigationBarLoading();
            reject(err);
        });
    }).finally(() => Loading.hideNavigationBarLoading()),

    // 链接蓝牙
    blePairRoche: (deviceId) => new Promise((resolve, reject) => {
        Loading.showNavigationBarLoading();
        Authorize(Authorize.SCOPE.userLocation).then(() => {
            SDK.pair(deviceId, resolve, reject);
        }).catch((err) => {
            Loading.hideNavigationBarLoading();
            reject(err);
        });
    }).finally(() => Loading.hideNavigationBarLoading()),

    // 同步数据
    bleSyncData (deviceId, serviceId, callback, callback2, callback3) {
        SDK.syncData(deviceId, serviceId, callback, callback2, callback3);
    },


    // 取特征值
    bleGetStatus: (deviceId, serviceId) => new Promise((resolve, reject) => {
        Loading.showNavigationBarLoading();
        SDK.getBLEDeviceCharacteristics(deviceId, serviceId, resolve, reject);
    }).finally(() => Loading.hideNavigationBarLoading()),


}
