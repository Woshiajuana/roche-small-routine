
import EnvConfig                from 'config/env.config'
import Toast                    from 'plugins/toast.plugin'
import Auth                     from 'plugins/auth.plugin'
import Router                   from 'plugins/router.plugin'

const DEFAULT = {
    method: 'POST',
    useOpenId: true,
    data: {},
    auth: true,
};

class Http {
    constructor (opt) {
        let options = Object.assign({}, DEFAULT, opt);
        this.method = options.method.toLocaleUpperCase();
        this.data = options.data;
        this.useOpenId = options.useOpenId;
        this.auth = options.auth;
        this.url = EnvConfig.API_URL + options.url;
        return this._fetch();
    }

    _fetch () {
        return new Promise((resolve, reject) => {
            Auth.getToken().then((res) => {
                this._log('userToken', res);
                let {
                    AccessToken,
                    OpenId,
                } = res;
                this.useOpenId && (this.data.OpenId = OpenId);
                this.url = `${this.url}?access_token=${AccessToken}`
            }).catch(() => {}).finally(() => {
                this._log('请求参数', this.data);
                if (this.auth && !this.data.OpenId) {
                    return Router.push('authorization_index');
                }
                wx.request({
                    url: this.url,
                    data: this.data,
                    method: this.method,
                    success: (response) => {
                        let {
                            data,
                            errMsg,
                            statusCode
                        } = response;
                        if (statusCode !== 200 || !data) {
                            return reject(errMsg);
                        }
                        let {
                            Status,
                            Message,
                            Data,
                            Id,
                            Extend,
                        } = data;
                        if (Status === 201) {
                            Auth.logout().finally(() => {
                                let pages = getCurrentPages();    //获取加载的页面
                                let first_url = pages[0].route;    //当前页面url
                                let cur_url = pages[pages.length-1].route;    //当前页面url
                                cur_url === first_url ? Router.push('authorization_index') : Router.root('home_index');
                            });
                            return;
                        }
                        if (Status !== 0) {
                            return reject(Message);
                        }
                        this._log('请求返回', Data);
                        resolve(Data);
                    },
                    fail: (error) => {
                        this._log('请求失败', error);
                        reject(error);
                        Toast.error(error);
                    }
                });
            });
        })
    }

    _log (str, data) {
        console.log(`${this.url} ${str} => `, data)
    }
}


export default (options = {}) => {
    let { loading, navLoading } = options;
    if (typeof loading === 'undefined' || loading) wx.showLoading({title: '加载中'});
    if (typeof navLoading === 'undefined' || navLoading) wx.showNavigationBarLoading();
    return new Http(options).finally(() => {
        if (typeof loading === 'undefined' || loading) wx.hideLoading();
        if (typeof navLoading === 'undefined' || navLoading) wx.hideNavigationBarLoading();
    })
}
