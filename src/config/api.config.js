

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
    Req_prizeList: 'RocheApi/GetLuckPrizes',

    // 获取血糖日志
    Req_journalList: 'RocheApi/GetBloodsugarTestRecordLogList',

    // 获取趋势图
    Req_sugarTrend: 'RocheApi/GetSugarTrend',

    // 获取蜘蛛图
    Req_sugarSpider: 'RocheApi/GetSpider',

    // 蓝牙传输数据
    Do_setTestSugarList: 'RocheApi/SetTestSugarList',


    // 2020-05-03 打卡活动
    // 是否绑定 GUIDE
    Req_GetActivityUser: 'ActivityRocheApi/GetActivityUser',
    // 绑定 GUIDE
    Do_BindActivityUser: 'ActivityRocheApi/BindActivityUser',
    // 获取打卡次数
    Req_GetActivitys: 'ActivityRocheApi/GetActivitys',
    // 获取打卡记录
    Req_GetTestRecord: 'ActivityRocheApi/GetTestRecord',
    // 同步数据
    Do_SetTestSugarListByActivity: 'ActivityRocheApi/SetTestSugarListByActivity',
    // 2.3	获取打卡奖励
    Req_GetSignInReward: 'ActivityRocheApi/GetSignInReward',
    // 2.4	打卡奖励详情
    // Req_GetSignInReward1: 'GetSignInReward',
    // 2.5	领取红包
    Do_ReceiveRedPackage: 'ActivityRocheApi/ReceiveRedPackage',
    // 获取省市
    Req_GetDistricts: 'ActivityRocheApi/GetDistricts',
    // 2.7	获取门店列表
    Req_GetStoreList: 'ActivityRocheApi/GetStoreList',
    // 2.8	绑定Guide完善信息
    Do_SetActivityUser: 'ActivityRocheApi/SetActivityUser',
    // 获取海报
    Req_GetPoster: 'ActivityRocheApi/GetPoster',
    // 活动是否开始
    Req_GetActivitySwitch: 'ActivityRocheApi/GetActivitySwitch',

    // 2020-08-29
    // 记录用户绑定设备信息
    Do_SetUserEquipment: 'ActivityRocheApi/SetUserEquipment',

    // 2020-11-22
    // 活动入口开关
    Req_GetUserActivityIn: 'ActivityRocheApi/GetUserActivityIn',

}
