//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                         from 'plugins/http.plugin'
import Router                       from 'plugins/router.plugin'
import InputMixin                   from 'mixins/input.mixin'
import RouterMixin                  from 'mixins/router.mixin'
import FormIdMixin                  from 'mixins/formid.mixin'
import SourceMixin                  from 'mixins/source.mixin'
import UserMixin                    from 'mixins/user.mixin'
import Valid                        from 'utils/valid.util'
import Mixin                        from 'utils/mixin.util'
import { formatData }               from 'wow-cool/lib/date.lib'
import WowCool                      from 'wow-cool/lib/array.lib'
import {
    ARR_TIME_STEP,
    ARR_TIME_STEP_KEY,
}                                   from 'config/base.config'
import DataMixin                    from './data.mixin'

let deltaX = 0;
const arrSrc = [
    { key: 'reduce', value: 'jrxt-j-icon.png' },
    { key: 'vReduce', value: 'v-jrxt-j-icon.png' },
    { key: 'add', value: 'jrxt-jf-icon.png' },
    { key: 'vAdd', value: 'v-jrxt-jf-icon.png' },
    { key: 'rule', value: 'rule-type-icon2.png' },
    { key: 'pop', value: 'jlxt-pop-icon.png' },
];

Page(Mixin({
    mixins: [
        UserMixin,
        DataMixin,
        RouterMixin,
        InputMixin,
        FormIdMixin,
        SourceMixin,
    ],
    onLoad () {
        this.userGet();
        this.sourceGet(arrSrc);
    },
    onReady () {
        deltaX = 0;
        let query = wx.createSelectorQuery();
        query.select('.rule-item').boundingClientRect((rect) => {
            let {width} = rect;
            this.setData({ ruleWidth: width });
            this.countScrollLeft();
        }).exec();
    },
    onShow() {
        this.setData({
            'objInput.TestDate.value': formatData('yyyy-MM-dd'),
            'objInput.TestDate.end': formatData('yyyy-MM-dd'),
            'objInput.TestTime.value': formatData('hh:mm'),
            'objInput.TestTime.end': formatData('hh:mm'),
        });
        this.initData();
    },
    handleChange(e){
        this.bindChange(e);
        let time = this.data.objInput.TestTime.value;
        // this.judgeTimeStep(time);
    },
    handleDateChange (e) {
        this.bindChange(e);
        let date = this.data.objInput.TestDate.value;
        let cur = formatData('yyyy-MM-dd');
        date === cur
            ? this.setData({
            'objInput.TestTime.value': formatData('hh:mm'),
            'objInput.TestTime.end': formatData('hh:mm'),
        })
            : this.setData({
            'objInput.TestTime.end': '',
        })
    },
    initData () {
        let time = this.data.objInput.TestTime.value;
        let index = this.judgeTimeStep(time);
        this.setStartAndEnd(index, time);
    },
    judgeTimeStep (time = '') {
        time = time || formatData('hh:dd');
        let cur = +time.replace(':', '');
        let index = WowCool.findFirstIndexForArr(ARR_TIME_STEP_KEY, (item) => {
            let { start, end } = item;
            start = +start.replace(':', '');
            end = +end.replace(':', '');
            return (cur >= start && cur <= end);
        });
        if (index > 4) this.setData({timeScrollLeft: 500});
        if (index < 3) this.setData({timeScrollLeft: 0});
        this.setData({
            timeStep: ARR_TIME_STEP[index]
        });
        return index;
    },
    setStartAndEnd (index, value) {
        let { start, end } = ARR_TIME_STEP_KEY[index];
        this.setData({
            'objInput.TestTime.value': value || start,
        });
    },
    countNum (scrollLeft) {
        let value = 0;
        if (+scrollLeft !== 0) {
            let width = this.data.ruleWidth;
            let num = (2 / (width * 10));
            value = ((num * 100 * scrollLeft) / 100).toFixed(1);
        }
        this.setData({
            'objHidden.Bloodsugar.value': value
        });
    },
    countScrollLeft () {
        let value = +this.data.objHidden.Bloodsugar.value;
        let width = this.data.ruleWidth;
        let num = (2 / (width * 10));
        let scrollLeft = Math.floor(value / num);
        this.setData({
            scrollLeft,
        })
    },
    handleScroll (e) {
        let { detail } = e;
        deltaX += detail.deltaX;
        this.countNum(Math.abs(deltaX));
    },
    // 加减
    handleAddOrSub (e) {
        let { currentTarget } = e;
        let type = currentTarget.dataset.type || '1';
        let value = +this.data.objHidden.Bloodsugar.value || 0;
        value = +value;
        if (type === '0' && value > 0) {
            value = (value * 10 - 1) / 10;
        }
        if ( type === '1' && value < 30) {
            value = (value * 10 + 1) / 10;
        }
        if (value !== 0) value = value.toFixed(1);
        this.setData({
            'objHidden.Bloodsugar.value': value,
        });
        this.countScrollLeft();
    },
    // 选择时间段
    handleTimeStep (e) {
        let { currentTarget } = e;
        let timeStep = currentTarget.dataset.value;
        this.setData({
            timeStep,
        });
        let index = ARR_TIME_STEP.indexOf(timeStep);
        // this.setStartAndEnd(index);
    },
    // 保存提交
    handleSubmit(e) {
        if (Valid.check(this.data.objInput)) return;
        if (Valid.check(this.data.objHidden)) return;
        let { value, formId } = e.detail;
        this.getTestSugar();
        this.doSubWeChatFormId(formId, 'record_index');
    },
    handleClose () {
        this.setData({is_pop: false })
    },
    // 验证是否当前时间段是否有数据
    getTestSugar() {
        let { objInput, objHidden } = this.data;
        let data = Valid.input(objInput, objHidden);
        data.TimeStep = this.data.arrTimeStep.indexOf(this.data.timeStep) + 1;
        data.Bloodsugar = +data.Bloodsugar;
        return Http(Http.API.Req_testSugar, data).then((res) => {
            let { Id } = res;
            Id > 0 ? this.setData({is_pop: true}) : this.setTestSugar();
        }).toast();
    },
    // 提交设置
    setTestSugar() {
        let { objInput, objHidden } = this.data;
        let data = Valid.input(objInput, objHidden);
        data.TimeStep = this.data.arrTimeStep.indexOf(this.data.timeStep) + 1;
        data.Bloodsugar = +data.Bloodsugar;
        return Http(Http.API.Do_subTestSugar, data).then((res) => {
            return Router.push('clock_index', { Bloodsugar: res.Bloodsugar });
        }).toast().finally(() => {
            this.setData({ is_pop: false });
        });
    },
}));
