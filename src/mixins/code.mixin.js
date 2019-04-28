import Toast                    from 'plugins/toast.plugin'
import Regular                  from 'wow-cool/lib/regular.lib'
import Http                     from 'plugins/http.plugin'

export default {
    data: {
        count: 0,
    },
    handleCode (e) {
        let { currentTarget } = e;
        let key = currentTarget.dataset.tel;
        let count = currentTarget.dataset.count;
        let tel = this.data.objInput[key].value;
        if (!tel) return Toast.error('请输入您的手机号');
        if (!Regular.isPhone(tel)) return Toast.error('手机号输入错误');
        this.sendSms(tel, count);
    },
    // 获取验证码
    sendSms (Mobile, count) {
        let options = {
            url: 'WechatApi/SendSms',
            loading: true,
            data: {
                Mobile,
            }
        };
        return Http(options).then((res) => {
            Toast.error('发送验证码成功');
            this.countDown(count);
        }).catch((err) => {
            Toast.error(err);
        });
    },
    // 计数
    countDown (count) {
        this.setData({ count });
        if (count <= 0) return;
        setTimeout(() => {
            this.countDown(--count);
        },1000)
    },
}
