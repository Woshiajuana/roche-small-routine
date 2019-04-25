export default {
    showLoading(title = '加载中') {
        wx.showLoading({title})
    },
    hideLoading(){
        wx.hideLoading()
    },
    showNavigationBarLoading() {
        wx.showNavigationBarLoading();
    },
    hideNavigationBarLoading() {
        wx.hideNavigationBarLoading();
    }
}
