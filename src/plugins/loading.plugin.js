
export default {
    show (options = {title: '加载中'}) {
        wx.showLoading(options)
    },
    hide () {
        wx.hideLoading()
    },
    showNav () {
        wx.showNavigationBarLoading();
    },
    hideNav () {
        wx.hideNavigationBarLoading();
    }
}
