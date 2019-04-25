
import Router                   from 'plugins/router.plugin'

export default {
    data: {
        params$: {},
    },
    routerGetParams (opt) {
        let params$ = Router.getParams(opt);
        console.log(params$);
        this.setData({ params$ })
    },
}
