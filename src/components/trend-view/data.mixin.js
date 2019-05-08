
export default {
    data: {
        optionsHiddenData: {},
        optionsData: {
            Date: {
                label: '时间',
                mold: 'date',
                children: {
                    BeginDate: {
                        value: '',
                        key: 'optionsData.Date.children.BeginDate',
                        label: '开始时间',
                    },
                    EndDate: {
                        value: '',
                        class: 'last-child',
                        key: 'optionsData.Date.children.EndDate',
                        label: '结束时间',
                    },
                },
            },
            Reset: {
                mold: 'reset',
            },
        },
        tableHeadData: {
            AreaName: {
                text: '大区',
            },
            PatrolUser: {
                text: '城市级巡店员',
            },
            StoreNum: {
                text: '门店数量',
            },
            PlanNum: {
                text: '计划次数',
            },
            PassNum: {
                text: '完成次数',
            },
            PrimeGold: {
                text: '素金合金',
            },
            InlayGold: {
                text: '镶嵌合计',
            },
            OtherGold: {
                text: '其他总计',
            },
            Total: {
                text: '总计',
            },
        },
    }
}
