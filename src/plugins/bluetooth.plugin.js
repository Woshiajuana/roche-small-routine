
export default {
    //
    openBlueToothAdapter: (options) => new Promise((resolve, reject) => {
        wx.openBluetoothAdapter({
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        });
    }),
}
