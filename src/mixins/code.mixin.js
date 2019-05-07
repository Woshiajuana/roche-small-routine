import Modal                        from 'plugins/modal.plugin'
import Regular                      from 'wow-cool/lib/regular.lib'
import Http                         from 'plugins/http.plugin'

export default {
    data: {
        count: 0,
    },
    handleCode (e) {
        let { currentTarget } = e;
        let key = currentTarget.dataset.tel;
        let count = currentTarget.dataset.count;
        let tel = this.data.formData[key].value;
        if (!tel) return Modal.toast('请输入您的手机号');
        if (!Regular.isPhone(tel)) return Modal.toast('手机号输入错误');
        this.sendSms(tel, count);
    },
    // 获取验证码
    sendSms (Mobile, count) {
        return Http(Http.API.Req_sendSms,  {
            Mobile,
        }).then((res) => {
            Modal.toast('发送验证码成功');
            this.countDown(count);
        }).toast();
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
