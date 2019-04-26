
const fn = (scope, content) => new Promise((resolve, reject) => {
    wx.authorize({
        scope,
        success: (res) => {
            resolve(res);
        },
        fail: () => {
            wx.getSetting({
                success: (res) => {
                    if (res.authSetting[scope]) return resolve(res);
                    wx.showModal({
                        title: '温馨提示',
                        content: content,
                        success: res=>{
                            if (res.confirm) {
                                wx.openSetting({
                                    success: (res) => {
                                        if (res.authSetting[scope]) return resolve(res);
                                        else reject(res);
                                    },
                                    fail: (err) => {
                                        reject(err);
                                    },
                                });
                            }
                        }
                    });
                },
                fail: err => {
                    reject({code: -1, errMsg: '您未授权'})
                }
            });
        }
    });

});


fn.SCOPE = {
    userInfo: 'scope.userInfo',
    userLocation: 'scope.userLocation',
    address: 'scope.address',
    invoiceTitle: 'scope.invoiceTitle',
    werun: 'scope.werun',
    record: 'scope.record',
    writePhotosAlbum: 'scope.writePhotosAlbum',
    camera: 'scope.camera',
};

/***
 * scope.userInfo	wx.getUserInfo	用户信息
 scope.userLocation	wx.getLocation, wx.chooseLocation, wx.openLocation	地理位置
 scope.address	wx.chooseAddress	通讯地址
 scope.invoiceTitle	wx.chooseInvoiceTitle	发票抬头
 scope.werun	wx.getWeRunData	微信运动步数
 scope.record	wx.startRecord	录音功能
 scope.writePhotosAlbum	wx.saveImageToPhotosAlbum, wx.saveVideoToPhotosAlbum	保存到相册
 scope.camera	<camera />	摄像头
 */

export default fn;



