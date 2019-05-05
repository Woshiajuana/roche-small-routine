export default {
    data: {
        objInput: {
            Height: {
                label: '身高',
                placeholder: '请输入您的身高',
                value: '',
                type: 'digit',
                max: 6,
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入您的身高'
                    }
                ],
                unit: 'cm',
            },
            Weight: {
                label: '体重',
                placeholder: '请输入您的体重',
                value: '',
                type: 'digit',
                max: 6,
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入您的体重'
                    }
                ],
                unit: 'kg',
            },
            Mobile: {
                label: '手机号',
                placeholder: '请输入您的手机号',
                type: 'number',
                value: '',
                max: 11,
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入您的手机号'
                    }
                ]
            },
            SmsCode: {
                label: '验证码',
                placeholder: '请输入验证码',
                type: 'number',
                value: '',
                max: 6,
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入验证码'
                    }
                ],
                use_code: {
                    tel: 'Mobile',
                    count: 60,
                },
            },
            RedProtein: {
                label: '糖化血红蛋白值',
                placeholder: '请输入糖化血红蛋白值',
                type: 'digit',
                value: '',
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入糖化血红蛋白值'
                    }
                ]
            },
            LowSugar: {
                label: '是否有过低血糖',
                value: 1,
                use_radio: [
                    {
                        label: '是',
                        value: 1,
                    },
                    {
                        label: '否',
                        value: 2,
                    }
                ]
            },
            Name: {
                label: '姓名',
                placeholder: '请输入您的姓名',
                value: '',
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入您的姓名'
                    }
                ]
            },
            Sex: {
                label: '性别',
                value: 1,
                use_radio: [
                    {
                        label: '男',
                        value: 1,
                    },
                    {
                        label: '女',
                        value: 2,
                    }
                ]
            },
            Brithday: {
                value: '',
                label: '出生年月',
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入您的出生年月'
                    }
                ]
            },
        },
        start: '1901-01-01',
        end: formatData('yyyy-MM-dd'),
    }
}
