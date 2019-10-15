import Modal                        from 'plugins/modal.plugin'
import Router                       from 'plugins/router.plugin'

export default {
    handleJumpPage (event) {
        let { url, params = {}, auth, type = true } = event.currentTarget.dataset;
        let { nickName } = this.data.user$ || {};
        if (auth && !nickName) {
            return Modal.confirm({
                content: '您还未登录，请先登录再进行操作',
                cancelText: '暂不登录',
                confirmText: '立即登录',
            }).then((res) => {
                let { confirm } = res;
                confirm && Router.push('login_index');
            }).null();
        }
        type && Router.push(url, params);
    },
}
