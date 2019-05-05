
export default {
    data: {
        objInput: {
            TestDate: {
                label: '测量日期',
                placeholder: '请输入',
                value: formatData('yyyy-MM-dd', new Date()),
                mode: 'date',
                end: formatData('yyyy-MM-dd', new Date()),
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入测量日期'
                    }
                ]
            },
            TestTime: {
                label: '测量时间',
                placeholder: '请输入',
                value: formatData('hh:mm', new Date()),
                mode: 'time',
                start: '',
                end: '',
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入测量时间'
                    }
                ]
            },
            Remark: {
                label: '备注',
                placeholder: '请输入',
                value: '',
            },
        },
        arrRuler: 151,
        arrTimeStep: ARR_TIME_STEP,
        timeStep: '',
        objHidden: {
            Bloodsugar: {
                value: '6.0',
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入当前血糖值'
                    }
                ]
            },
        },
        ruleWidth: 0,
        scrollLeft: 0,
        timeScrollLeft: 0,
        is_pop: false,
    },
}
