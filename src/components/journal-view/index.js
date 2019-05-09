import './index.json'
import './index.wxml'
import './index.scss'

import Mixin                        from 'utils/mixin.component.util'
import Modal                        from 'plugins/modal.plugin'
import SourceMixin                  from 'mixins/source.mixin'
import Valid                        from 'utils/valid.util'
import Regular                      from 'utils/regular.util'
import Http                         from 'plugins/http.plugin'

const arrSrc = [
    { key: 'normal', value: 'select-nor-icon.png' },
    { key: 'active', value: 'select-ative-icon.png' },
];

Component(Mixin({
    mixins: [
        SourceMixin,
    ],
    properties: {
        // 这里定义了innerText属性，属性值可以在组件使用时指定
        formData: {
            type: Object,
            value: {},
        },
    },
    data: {
        arrList: [],
        PageIndex: 1,
        PageSize: 20,
        Count: 0
    },
    lifetimes: {
        attached () {
            this.sourceGet(arrSrc);
            this.reqJournalList();
        },
    },
    methods: {
        handleScrollToLower () {
            console.log(1)
            let { PageIndex, Count, arrList} = this.data;
            if (arrList.length >= Count) return null;
            PageIndex++;
            this.setData({PageIndex});
            this.reqJournalList();
        },
        reqJournalList () {
            let { PageIndex, PageSize, arrList } = this.data;
            return Http(Http.API.Req_journalList, {
                PageIndex,
                PageSize,
            }).then((res) => {
                let obj = res || {};
                let Count = obj.Count || '';
                let Data = obj.Data || [];
                arrList = [...arrList, ...Data];
                this.setData({ Count, arrList });
            }).toast();
        },
    }
}));
