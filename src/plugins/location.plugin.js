
export default {
    getLocation: (options) => new Promise((resolve, reject) => {
        wx.getLocation({
            ...options,
            success: res => {
                resolve(res);
            },
            fail: err => {
                reject(err);
            },
        })
    }),
}
