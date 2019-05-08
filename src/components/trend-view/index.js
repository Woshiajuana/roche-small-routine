import './index.json'
import './index.wxml'
import './index.scss'

import Mixin                        from 'utils/mixin.component.util'
import Modal                        from 'plugins/modal.plugin'
import SourceMixin                  from 'mixins/source.mixin'
import Valid                        from 'utils/valid.util'
import Regular                      from 'utils/regular.util'
import Http                         from 'plugins/http.plugin'
import {
    getBarChart,
}                                   from 'utils/chart.util'
let barChart = getBarChart();

Component(Mixin({
    mixins: [

    ],
    data: {
        canvasOpts:  {
            onInit: barChart.init,
        }
    },
    lifetimes: {
        attached () {

        },
    },
    methods: {

    }
}));
