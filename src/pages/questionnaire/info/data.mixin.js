
export default {
    data: {
        objInput: {
            Name: {
                label: '姓名',
                placeholder: '请输入您的姓名',
                value: '',
                mold: 'input',
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
                mold: 'input',
                useRadio: [
                    {
                        label: '男',
                        value: 1,
                    },
                    {
                        label: '女',
                        value: 2,
                    }
                ],
            },
            Brithday: {
                value: '',
                label: '出生年月',
                mold: 'picker',
                start: '1901-01-01',
                end: '',
                use: [
                    {
                        nonempty: true,
                        prompt: '请输入您的出生年月'
                    }
                ],
            },
            Mobile: {
                label: '手机号',
                placeholder: '请输入您的手机号',
                mold: 'input',
                type: 'number',
                value: '',
                max: 11,
                use: [
                    {
                        nonempty: true,
                        prompt: '请输入您的手机号'
                    }
                ]
            },
            SmsCode: {
                label: '验证码',
                placeholder: '请输入验证码',
                mold: 'input',
                value: '',
                type: 'number',
                max: 6,
                use: [
                    {
                        nonempty: true,
                        prompt: '请输入验证码'
                    }
                ],
                useCode: {
                    tel: 'Mobile',
                    count: 60,
                }
            },
            isAgree: {
                value: true,
                mold: 'agree',
                isPop: false,
                use: [
                    {
                        nonempty: true,
                        prompt: '请先同意协议'
                    }
                ]
            },
        },
    },
}
