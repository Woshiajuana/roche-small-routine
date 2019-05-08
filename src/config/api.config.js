

export default {

    // 用户登录
    Do_userLogin: 'WechatApi/UserLogin',

    // 用户获取验证码
    Req_sendSms: 'WechatApi/SendSms',

    // 获取文档
    Req_getArchives: 'RocheApi/GetArchives',

    // 获取问题答案
    Req_surveyDetails: 'RocheApi/GetSurveyDetails',

    // 请求OR设置用户信息
    Do_userInfo: 'RocheApi/SetUserInfo',

    // 提交设置form id
    Do_subWeChatFormId: 'WechatApi/SetWechatFormId',
    // 保存用户建档信息
    Do_setArchives: 'RocheApi/SetArchives',

    // 获取血糖计划
    Req_recommendSugar: 'RocheApi/GetRecommendSugar',

    // 购买会员核销code
    Do_setMemberInfo: 'RocheApi/SetMemberInfo',

    // 首页个人血糖基本信息
    Req_indexSugar: 'RocheApi/GetIndexSugar',

    // 个人中心血糖基本信息
    Req_mineSugar: 'RocheApi/GetUserSugar',

    // 记录血糖，验证是否当前时间段是否有数据
    Req_testSugar: 'RocheApi/GetTestSugar',

    // 记录血糖，提交血糖记录
    Do_subTestSugar: 'RocheApi/SetTestSugar',

    // 获取血糖记录
    Req_testMonth: 'RocheApi/GetTestMonth',

    // 获取报告
    Req_monthReport: 'RocheApi/GetMonthReport',

    // 获取周报
    Req_weekReport: 'RocheApi/GetWeekReport',

    // VIP激活绑定判断
    Do_activeService: 'RocheApi/ActiveService',

    // VIP打卡查询
    Req_curSignIn: 'RocheApi/GetCurSignIn',

    // 抽取本周打卡奖励
    Do_luckDraw: 'RocheApi/LuckDraw',

    // 获取中奖列表
    Req_PrizeList: 'RocheApi/GetLuckPrizes',

}
