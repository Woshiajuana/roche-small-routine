

import Http                     from 'plugins/http.plugin'

export default {
    getOrSetUserInfo (data = {}) {
        let options = {
            url: 'RocheApi/SetUserInfo',
            loading: true,
            data
        };
        return Http(options);
    }
}
