// const ald = require('./utils/ald-stat.js')
import ald              from 'utils/ald-stat.js'
import './app.json'
import './app.scss'
import 'utils/es6-promise.util'

// app.js
App({
    // 生命周期函数--监听小程序初始化,
    // 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
    onLaunch (options) {
        // let { scene } = options;
        // this.globalData.sceneid = scene;
    },

    // 生命周期函数--监听小程序显示
    // 当小程序启动，或从后台进入前台显示，会触发 onShow
    onShow () {

    },
    // 生命周期函数--监听小程序隐藏
    // 当小程序从前台进入后台，会触发 onHide
    onHide () {

    },
    // 错误监听函数
    // 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
    onError (msg) {
        console.log(msg);
    },
    // 页面不存在监听函数
    // 当小程序出现要打开的页面不存在的情况，会带上页面信息回调该函数，详见下文
    onPageNotFound () {
        // 开发者可以在 onPageNotFound 回调中进行重定向处理，但必须在回调中同步处理，异步处理（例如 setTimeout 异步执行）无效。
    },
    globalData: {
        userInfo: null,
        sceneid: '',
        blueTooth: {},
        to: '',
    },
});
