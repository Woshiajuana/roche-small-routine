
// import wxF2                     from 'utils/wx-f2.min'
const app = getApp();
const wxF2 = app.globalData.F2;

export const F2 = wxF2;

// export const getRadarChart = (data = []) => {
//     let chart = null;
//     let max = 0;
//     data.forEach((item) => {
//         if (item.score > max)
//             max = item.score;
//     });
//     return {
//         init (canvas, width, height) {
//             chart = new F2.Chart({
//                 el: canvas,
//                 width,
//                 height,
//                 padding: ['auto', 50],
//             });
//             chart.coord('polar');
//             chart.source(data, {
//                 score: {
//                     min: 0,
//                     max,
//                     nice: false,
//                     tickCount: 4
//                 }
//             });
//             chart.area().position('item*score').color('user').animate({
//                 appear: {
//                     animation: 'groupWaveIn'
//                 }
//             });
//             chart.line().position('item*score').color('user').animate({
//                 appear: {
//                     animation: 'groupWaveIn'
//                 }
//             });
//             chart.point().position('item*score').color('user').style({
//                 stroke: '#fff',
//                 lineWidth: 1
//             }).animate({
//                 appear: {
//                     delay: 300
//                 }
//             });
//             chart.render();
//             return chart;
//         },
//         update (data) {
//             chart.changeData(data);
//         },
//     }
// };

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
                value: {
                    tickCount: 5,
                    min: 0,
                    max: 20,
                    formatter(val) {
                        return val;
                    }
                }
            });
            // chart.tooltip({
            //     custom: true, // 自定义 tooltip 内容框
            //     showXTip: true,
            //     onChange(obj) {
            //         const legend = chart.get('legendController').legends.top[0];
            //         const tooltipItems = obj.items;
            //         const legendItems = legend.items;
            //         const map = {};
            //         legendItems.map(item => {
            //             map[item.name] = Object.assign({}, item);
            //         });
            //         tooltipItems.map(item => {
            //             const { name, value } = item;
            //             if (map[name]) {
            //                 map[name].value = value;
            //             }
            //         });
            //         legend.setItems(Object.values(map));
            //     },
            //     onHide() {
            //         const legend = chart.get('legendController').legends.top[0];
            //         legend.setItems(chart.getLegendItems().country);
            //     }
            // });

            chart.area().position('year*value').color('type').shape('smooth');
            chart.line().position('year*value').color('type').shape('smooth');
            // chart.point().position('year*value').color('type');
            chart.render();
            return chart;
        },
        update (data) {
            chart.changeData(data);
        }
    }
};

export const getWeekLineChart = (data = [], ticks = []) => {
    let chart = null;
    console.log('ticks',ticks)
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
                    // type: 'timeCat',
                    // mask: 'MM/DD',
                    // tickCount: 2,
                    range: [0, 1],
                    ticks,
                    // min: ticks[0],
                    // max: ticks[ticks.length],
                },
                value: {
                    tickCount: 5,
                    min: 0,
                    max: 20,
                    formatter(val) {
                        return val;
                    }
                }
            });
            // chart.guide().regionFilter({
            //     start: ['min', 4.4],
            //     end: ['max', 10],
            //     color: '#fb8605'
            // });
            // chart.tooltip({
            //     custom: true, // 自定义 tooltip 内容框
            //     showXTip: true,
            //     onChange(obj) {
            //         const legend = chart.get('legendController').legends.top[0];
            //         const tooltipItems = obj.items;
            //         const legendItems = legend.items;
            //         const map = {};
            //         legendItems.map(item => {
            //             map[item.name] = Object.assign({}, item);
            //         });
            //         tooltipItems.map(item => {
            //             const { name, value } = item;
            //             if (map[name]) {
            //                 map[name].value = value;
            //             }
            //         });
            //         legend.setItems(Object.values(map));
            //     },
            //     onHide() {
            //         const legend = chart.get('legendController').legends.top[0];
            //         legend.setItems(chart.getLegendItems().country);
            //     }
            // });

            // chart.area().position('year*value').color('type').shape('smooth');
            chart.line().position('year*value').color('type').shape('smooth');
            chart.point().position('year*value').color('type');
            chart.render();
            return chart;
        },
        update (data) {
            chart.changeData(data);
        }
    }
};
