
export default {
    show (options = {title: '加载中'}) {
        wx.showLoading(options)
    },
    hide () {
        wx.hideLoading()
    },
    showLoading(options = {title: '加载中'}) {
        wx.showLoading(options)
    },
    hideLoading(){
        wx.hideLoading()
    },
    showNav () {
        wx.showNavigationBarLoading();
    },
    hideNav () {
        wx.hideNavigationBarLoading();
    },
    showNavigationBarLoading () {
        wx.showNavigationBarLoading();
    },
    hideNavigationBarLoading () {
        wx.hideNavigationBarLoading();
    },
}
