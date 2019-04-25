
export default {
    downloadFile: (options = {}) => new Promise((resolve, reject) => {
        wx.downloadFile({
            ...options,
            success: res => {
                resolve(res);
            },
            fail: err => {
                reject(err);
            },
        })
    }),
    saveFile: (tempFilePath) => new Promise((resolve, reject) => {
        wx.saveFile({
            tempFilePath,
            success: res => {
                resolve(res);
            },
            fail: err => {
                reject(err);
            },
        })
    }),
    openDocument: (options = {}) => new Promise((resolve, reject) => {
        wx.openDocument({
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
