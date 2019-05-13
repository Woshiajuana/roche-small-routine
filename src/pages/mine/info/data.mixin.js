
export default {
    data: {
        formData: {
            Height: {
                label: '身高',
                placeholder: '请输入您的身高',
                value: '',
                key: 'formData.Height',
                type: 'digit',
                max: 6,
                use: [
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
                key: 'formData.Weight',
                type: 'digit',
                max: 6,
                use: [
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
                key: 'formData.Mobile',
                max: 11,
                use: [
                    {
                        nonempty: true,
                        prompt: '请输入您的手机号'
                    }
                ]
            },
            // SmsCode: {
            //     label: '验证码',
            //     placeholder: '请输入验证码',
            //     type: 'number',
            //     value: '',
            //     key: 'formData.SmsCode',
            //     max: 6,
            //     use: [
            //         {
            //             nonempty: true,
            //             prompt: '请输入验证码'
            //         }
            //     ],
            //     use_code: {
            //         tel: 'Mobile',
            //         count: 60,
            //     },
            // },
            RedProtein: {
                label: '糖化血红蛋白值',
                placeholder: '请输入糖化血红蛋白值',
                type: 'digit',
                value: '',
                key: 'formData.RedProtein',
                // use: [
                //     {
                //         nonempty: true,
                //         prompt: '请输入糖化血红蛋白值'
                //     }
                // ]
            },
            LowSugar: {
                label: '是否有过低血糖',
                value: 1,
                key: 'formData.LowSugar',
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
                key: 'formData.Name',
                use: [
                    {
                        nonempty: true,
                        prompt: '请输入您的姓名'
                    }
                ]
            },
            Sex: {
                label: '性别',
                value: 1,
                key: 'formData.Sex',
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
                key: 'formData.Brithday',
                label: '出生年月',
                use: [
                    {
                        nonempty: true,
                        prompt: '请输入您的出生年月'
                    }
                ]
            },
        },
        start: '1901-01-01',
        end: '',
    }
}
