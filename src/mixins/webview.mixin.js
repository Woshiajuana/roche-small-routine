import Router                   from 'plugins/router.plugin'
import Auth                     from 'plugins/auth.plugin'
export default {
    jumpWebView (params) {
        Auth.getToken().then((info) => {
            let { title, src } = params;
            let { UserID } = info;
            src = src.replace('${pin{pin}', UserID);
            src = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdb4ec24f4b3a5e19&redirect_uri=${encodeURIComponent(src)}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`;
            Router.push('web_index', {
                src,
                title,
            });
        });
    }
}
