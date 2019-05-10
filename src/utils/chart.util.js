
import wxF2                     from 'utils/wx-f2.min'

export const F2 = wxF2;

export const getLineChart = (data = [], ticks = []) => {
    let chart = null;
    return {
        init (canvas, width, height) {
            chart = new F2.Chart({
                el: canvas,
                width,
                height,
                padding: ['auto', 50],
            });
            chart.source(data, {
                year: {
                    // tickCount: 6,
                    range: [0, 1],
                    ticks,
                },
                // value: {
                //     tickCount: 10,
                //     formatter(val) {
                //         return val;
                //     }
                // }
            });
            chart.tooltip({
                custom: true, // 自定义 tooltip 内容框
                showXTip: true,
                onChange(obj) {
                    const legend = chart.get('legendController').legends.top[0];
                    const tooltipItems = obj.items;
                    const legendItems = legend.items;
                    const map = {};
                    legendItems.map(item => {
                        map[item.name] = Object.assign({}, item);
                    });
                    tooltipItems.map(item => {
                        const { name, value } = item;
                        if (map[name]) {
                            map[name].value = value;
                        }
                    });
                    legend.setItems(Object.values(map));
                },
                onHide() {
                    const legend = chart.get('legendController').legends.top[0];
                    legend.setItems(chart.getLegendItems().country);
                }
            });
            chart.line().position('year*value').shape('smooth').color('type');
            // chart.point().position('year*value').color('type');
            chart.render();
            return chart;
        },
        update (data) {
            chart.changeData(data);
        }
    }
};
