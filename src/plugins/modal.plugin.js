import Type                 from 'utils/type.util'

/**
 * @method
 * @param {Object|String} options -参数
 * @desc 微信小提示
 * */
const toast = (options) => {
    let title = options;
    let DEF = {
        duration: 3000,
        icon: 'none',
        mask: true,
    };
    if (Type.isObject(options)) {
        Object.assign(DEF, options);
        title = options.errMsg
            || options.Message
            || JSON.stringify(options);
    } else if(Type.isArray(options)) {
        title = JSON.stringify(options);
    }
    console.log(title);
    if (title === '') return;
    wx.showToast({
        ...DEF,
        title: title + '',
    })
};

/**
 * @method
 * @param {Object|String} options -参数
 * @desc 微信模态对话框
 * */
const confirm = (options) => new Promise((resolve, reject) => {
    if (typeof options !== 'object')
        options = { content: options + '' };
    wx.showModal({
        title: '温馨提示',
        ...options,
        success: res => {
            resolve(res);
        },
        fail: err => {
            reject(err);
        },
    });
});

/**
 * @method
 * @param {Object|Array} options -参数
 * @desc 微信操作菜单
 * */
const actionSheet = (options) => new Promise((resolve, reject) => {
    if (Type.isArray(options))
        options = { itemList: options };
    wx.showActionSheet({
        ...options,
        success: res => {
            resolve(res);
        },
        fail: err => {
            reject(err);
        },
    });
});

export default {
    toast,
    confirm,
    actionSheet,
};
