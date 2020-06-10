//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                         from 'plugins/http.plugin'
import Router                       from 'plugins/router.plugin'
import Modal                        from 'plugins/modal.plugin'
import Mixin                        from 'utils/mixin.util'
import UserMixin                    from 'mixins/user.mixin'
import { formatData, getDate }      from 'wow-cool/lib/date.lib'


Page(Mixin({
    mixins: [
        UserMixin,
    ],
    data: {
        TestDate: '',
        TestTime: '',
        numSize: '',
        BuleRecordId: '',
    },
    onLoad () {
        this.setData({ TestTime: formatData('hh:mm', new Date()) });
        this.userGet();
    },
    handleInput (event) {
        let { key } = event.currentTarget.dataset;
        let { value } = event.detail;
        this.setData({
            [key]: value,
        });
    },
    handleBind () {
        let { BuleRecordId } = this.data;
        if (!BuleRecordId)
            return Modal.toast('请输入设备 id');
        Http(Http.API.Do_BindActivityUser, {
            MachineCode: `test_${BuleRecordId}`,
            MachineId: BuleRecordId,
            BindRemark: `test_${BuleRecordId}`,
        }).then(() => {
            Modal.toast('绑定成功，可以同步数据了')
        }).catch((err) => {
            Modal.toast(err);
        });
    },
    handleSync () {
        let { BuleRecordId, TestDate, TestTime, user$, numSize } = this.data;
        if (!BuleRecordId)
            return Modal.toast('请输入设备 id');
        if (!numSize) {
            return Modal.toast('请输入传输数据的个数');
        }
        if (!TestDate) {
            return Modal.toast('请选择传输时间');
        }
        let { OpenId } = user$;
        let BloodSugars = [];
        for (let i = 0; i < numSize; i++ ) {
            BloodSugars.push({
                OpenId,
                BuleRecordId: `${ BuleRecordId }_${ Math.ceil(Math.random()*1000000) }`,
                Bloodsugar: 6.0,
                TimeStep: 3,
                TestDate,
                TestTime,
                Remark: '',
                BuleBack: 'testtesttesttesttesttest',
            })
        }
        Http(Http.API.Do_SetTestSugarListByActivity, {
            MachineCode: `test_${BuleRecordId}`,
            MachineId: BuleRecordId,
            BloodSugars,
        }, {
            useOpenId: false,
            useAuth: false,
        }).then(() => {
            Router.push('lottery_share_index');
        }).catch((err) => {
            Modal.toast(err);
        });
    }
}));
