import Modal                        from 'plugins/modal.plugin'
import Router                       from 'plugins/router.plugin'

export default {
    handleJumpPage (event) {
        let { url, params = {}, auth, type = true } = event.currentTarget.dataset;
        let { nickName } = this.data.user$ || {};
        if (auth && !nickName) {
            return Modal.confirm('使用该功能，请先登录哦').then((res) => {
                let { confirm } = res;
                confirm && Router.push('login_index');
            }).null();
        }
        type && Router.push(url, params);
    },
}
