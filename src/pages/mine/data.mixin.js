
export default {
    data: {
        objUser: {},
        objEntry: {
            plan: {
                label: '我的测糖计划',
                url: 'questionnaire_programme_index',
                value: '',
                params: {
                    from: 'mine_index'
                }
            },
            programme: {
                label: '我的控糖方案',
                url: 'mine_control_index',
                value: '',
            },
            weekly: {
                label: '我的血糖周报',
                url: 'report_weekly_index',
                value: '',
            },
            monthly: {
                label: '我的血糖月报',
                url: 'report_monthly_index',
                value: '',
            },
            info: {
                label: '个人信息',
                url: 'mine_info_index',
                value: '',
            },
            questionnaire: {
                label: '更新疾病信息',
                url: 'questionnaire_two_index',
                value: '',
            },
            bluetooth: {
                label: '绑定Performa Connect血糖仪',
                url: 'bluetooth_index',
                value: '',
            },
        }
    }
}
