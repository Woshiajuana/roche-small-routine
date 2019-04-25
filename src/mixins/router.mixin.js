
import Router                   from 'plugins/router.plugin'

export default {
    data: {
        $params: '',
    },
    getParamsByUrl (opt) {
        let params = Router.getParams(opt);
        console.log(params);
        this.setData({
            $params: params,
        })
    },
}
