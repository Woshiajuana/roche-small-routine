
const System = require('../plugins/system.plugin');

module.exports = {
    data: {
        system$: wx.getSystemInfoSync(),
    },
    systemGetInfo: System.getSystemInfo,
    systemGetRpx (w = 750) {
        let { system$ } = this.data;
        system$.rpx = system$.windowWidth / w;
        this.setData({ system$ });
    }
};
