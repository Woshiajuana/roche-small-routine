

export default {

    // 2.29	企业微信用户登陆
    Do_qyUserLogin: 'WechatApi/QyUserLogin',

    // 2.30	微信小程序用户登陆
    Do_wxUserLogin: 'WechatApi/WxUserLogin',

    // 2.31	用户授权绑定
    Do_userAuthorize: 'WechatApi/UserAuthorize',

    // 2.32	查询可以切换的用户
    Req_changeUser: 'WechatApi/GetChangeUser',

    // 2.33	验证切换的新用户
    Do_checkChangeUser: 'WechatApi/CheckChangeUser',

    // 获取OpendId
    Req_userCode: 'WechatApi/UserCode',

    // 登录
    Do_userLogin: 'WechatApi/UserLogin',

    // 获取门店类型
    Req_storeTypes: 'home/GetStoreTypes',

    // 获取门店品牌
    Req_storeBrands: 'home/GetStoreBrands',

    // 获取所有产品品牌
    Req_productBrands: 'home/GetProductBrands',

    // 获取当前用户的门店
    Req_storesByUser: 'home/GetStoresByUser',

    // 创建 or 修改巡店计划
    Do_createPatrolStorePlan: 'home/CreatePatrolStorePlan',

    // 获取当前用户巡店页面基础数据
    // 城市巡店员和大区管理员
    Req_storesPlanIndex: 'home/GetStoresPlanIndex',

    // 获取当前用户巡店页面基础数据（超管）
    Req_storesPlanAdIndex: 'home/GetStoresPlanAdIndex',

    // 获取当前用户的所有巡店计划
    Req_storesPlanByUser: 'home/GetStoresPlanByUser',

    // 2.9	获取当前用户的所有巡店计划（大区管理员）
    Req_storesPlanByAreaUser: 'home/GetStoresPlanByAreaUser',

    // 查询单个巡店计划详情
    Req_storesPlanByID: 'home/GetStoresPlanByID',

    // 审核巡店计划
    Do_auditStorePlan: 'home/AuditStorePlan',

    // 创建门店
    Do_createStore: 'home/CreateStore',

    // 门店管理列表
    Req_storeList: 'home/GetStoreList',

    // 查询单个门店详情
    Req_storeById: 'home/GetStoreByID',

    // 审核门店
    Do_auditStore: 'home/AuditStore',

    // 超管设置门店
    Do_setStore: 'home/SetStore',

    // 2.16	查询当前用户-查看季度报告
    Req_storeReportList: 'home/GetStoreReportList',

    // 2.17	根据门店id查询单个季度报告详情
    Req_storeReportDetail: 'home/GetStoreReportDetail',

    // 2.18	根据报告id查询单个季度报告详情
    Req_storeReportByID: 'home/GetStoreReportByID',

    // 2.19	查看城市级巡店员
    Req_patrolStaff: 'home/GetPatrolStaff',

    // 2.20 发布消息
    Do_createNotice: 'home/CreateNotice',

    // 2.21	获取省份、城市、区县信息
    Req_districts: 'home/GetDistricts',

    // 2.22	获取大区与省份信息
    Req_districtAreas: 'home/GetDistrictAreas',

    // 2.22	获取超管首页搜索数据（请求只用到开始和结束时间）
    Req_planAdIndex: 'home/GetPlanAdIndex',

    // 2.23	获取超管查看巡店、门店统计明细（请求只用到大区、城市、开始和结束时间）
    Req_statistikDetailAd: 'home/GetStatistikDetailAd',

    // 上传图片
    Do_uploadImage: 'home/UploadImage',

    // 2.34	导出巡店计划
    Req_exportPlan: 'home/ExportPlan',

    // 2.35	导出门店
    Req_exportStore: 'home/ExportStore',

    // 2.36	导出季度报告
    Req_exportReport: 'home/ExportReport',
}
