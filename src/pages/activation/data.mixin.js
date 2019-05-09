
export default {
    data: {
        arrData: ['', '', '', '', '', ''],
        formData: {
            Code:  {
                placeholder: '请输入您的核销码',
                value: '',
                key: 'formData.Code',
                use: [
                    {
                        nonempty: true,
                        prompt: '请输入您的核销码'
                    }
                ]
            },
        },
        isPopup: false,
    }
}
