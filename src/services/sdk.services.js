
import SDK                      from 'utils/sdk.util'
import Loading                  from 'plugins/loading.plugin'
import Authorize, { SCOPE }     from 'plugins/authorize.plugin'

export default {
    // 搜索
    searchRoche: () => new Promise((resolve, reject) => {
        Loading.showNavigationBarLoading();
        Authorize(SCOPE.userLocation).then(() => {
            SDK.searchRoche({
                success: (res) => {
                    resolve(res);
                },
                fail: (err) => {
                    reject(err);
                },
                complete: () => {
                    Loading.hideNavigationBarLoading();
                }
            });
        }).catch((err) => {
            Loading.hideNavigationBarLoading();
            reject(err);
        });
    }),

    // 配对
    pairRoche: (deviceId) => new Promise((resolve, reject) => {
        Loading.showNavigationBarLoading();
        SDK.pair({
            deviceId,
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {
                Loading.hideNavigationBarLoading();
            }
        });
    }),

    // 同步数据
    syncData: (deviceId) => new Promise((resolve, reject) => {
        Loading.showNavigationBarLoading();
        SDK.syncData({
            deviceId,
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {
                Loading.hideNavigationBarLoading();
            }
        });
    }),

    // 断开与设备的链接
    disconnectDevice: (deviceId) => new Promise((resolve, reject) => {
        Loading.showNavigationBarLoading();
        SDK.disconnectDevice({
            deviceId,
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {
                Loading.hideNavigationBarLoading();
            }
        });
    }),

    // 监听事件
    on(event_name, callback) {
        SDK.on(event_name, callback);
        return this;
    },

    // 取消事件
    off(event_name, callback) {
        SDK.off(event_name, callback);
        return this;
    },
}

export const EVENT_NAME = {
    ERROR: 'EVENT\_BLE\_TRANSFER\_FAILED',          // 异常
    END: 'EVENT\_BLE\_TRANSFER\_END',               // 成功结束
    CHANGE: 'EVENT\_BLE\_STATE\_CHANGE',            // 连接状态的改变事件
    INFO: 'EVENT\_GLYCEMIA\_DATA\_RECEIVED',        // 详情
    CONTEXT: 'EVENT\_GLYCEMIA\_CONTEXT\_RECEIVED',  // 附加信息
};
