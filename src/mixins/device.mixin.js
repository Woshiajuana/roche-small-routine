
import Source                       from 'utils/source.util'

export default {
    data: {
        device$: [
            {
                selectSrc: Source('20200117-s-1.png'), // 选择
                explainSrc: Source('20200117-e-1.jpg'), // 蓝牙链接说明
                explainText: '罗氏®血糖仪Performa Connect',
                addBeforeSrc: Source('20200117-a-b-1.jpg'), // 蓝牙搜索
                addAfterSrc: Source('20200117-a-b-1.jpg'),
                syncSrc: Source('sjtb-explain-bg.jpg'), // 同步数据
            },
            {
                selectSrc: Source('20200117-s-2.png'),

                explainSrc: Source('20200117-e-2.jpg'),
                explainSrc1: Source(`20200117-e-2-1.jpg?v=${new Date().getTime()}`),
                explainSrc2: Source(`20200117-e-2-2.jpg?v=${new Date().getTime()}`),

                explainText: '罗氏®智航®Guide',
                addBeforeSrc: Source(`20200117-a-b-2.jpg?v=${new Date().getTime()}`),
                addAfterSrc: Source('20200117-a-b-2.jpg?v=1'),

                syncSrc: Source('20200117-s-2.jpg'),
                syncSrc1: Source(`20200117-s-2-1.jpg?v=${new Date().getTime()}`),
                syncSrc2: Source(`20200117-s-2-2.jpg?v=${new Date().getTime()}`),
            },
            // {
            //     selectSrc: Source('20200117-s-3.png'),
            //     explainSrc: Source('20200117-e-3.jpg'),
            //     explainText: '罗氏®逸智®Instant',
            //     addBeforeSrc: Source('20200117-a-b-3.png'),
            //     addAfterSrc: Source('20200117-a-b-3.png'),
            //     syncSrc: Source('20200117-s-3.jpg'),
            // },
        ],
    },
}
