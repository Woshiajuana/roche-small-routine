
import Http                     from 'plugins/http.plugin'

export default {
    doSubWechatFormId (form_id, remark) {
        return Http(Http.API.Do_subWeChatFormId, {
            form_id,
            remark,
        }).then((res) => {}).toast();
    }
}
