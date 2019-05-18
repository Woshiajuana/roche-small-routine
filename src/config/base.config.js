
export const ARR_TIME_STEP = ['空腹', '早餐后', '午餐前', '午餐后', '晚餐前', '晚餐后', '睡前'];

export const CANVAS_X = ['空腹血糖', '餐后血糖', '餐前血糖', '餐后血糖', '餐前血糖', '餐后血糖','空腹血糖'];

export const ARR_TIME_STEP_KEY = [
    { start: '00:00', end: '08:00' },
    { start: '08:01', end: '10:30' },
    { start: '10:31', end: '12:00' },
    { start: '12:01', end: '16:00' },
    { start: '16:01', end: '18:30' },
    { start: '18:31', end: '21:00' },
    { start: '21:01', end: '23:59' },
];

export const ARR_TIME_X = [
    '00:00:00',
    '03:30:00',
    '07:00:00',
    '10:30:00',
    '14:00:00',
    '17:30:00',
    '21:00:00',
];


export const DAY_TEXT = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export const GLS_TEXT = ['', '低血糖', '血糖偏低', '健康', '高血糖'];

export const WEB_LINK = {
    ZXWZ: {
        title: '在线咨询',
        src: 'https://jkys-wechat.91jkys.com/user/third/login?pin=${pin{pin}&accessId=roche&page=DIAGNOSE_ONLINE',
    },
    JKZD: {
        title: '健康指导',
        src: 'https://jkys-wechat.91jkys.com/user/third/login?pin=${pin{pin}&accessId=roche&page=HEALTH_MANAGE',
    },
};

export const SHOP_APP = {
    appId: 'wxa3eefe9efc0fcfeb', // 要跳转的小程序的appid
    path: 'pages/goods/detail?id=11830530199', // 跳转的目标页面
    envVersion: 'release',
};
