
import StoreConfig from 'config/store.config'

const handle = (fn, key, value) => new Promise((resolve, reject) => {
    key = StoreConfig[key];
    if (!key)
        return reject(`${key} is no register`);
    let result = wx[fn](key, value) || '';
    return resolve(result);
});

export default {
    // 注册的key值
    KEY: Object.assign({}, StoreConfig),

    // 获取
    get (key) {
        return handle('getStorageSync', key);
    },

    // 存储
    set (key, value) {
        return handle('setStorageSync', key, value);
    },

    // 删除
    remove (key) {
        return handle('removeStorageSync', key);
    },

    // 清除
    clear: () => new Promise((resolve, reject) => {
        wx.clearStorageSync();
        return resolve();
    }),
}
