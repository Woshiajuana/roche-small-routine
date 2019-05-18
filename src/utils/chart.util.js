
// import wxF2                     from 'utils/wx-f2.min'
const app = getApp();
const wxF2 = app.globalData.F2;

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
                value: {
                    tickCount: 5,
                    min: 0,
                    max: 20,
                    formatter(val) {
                        return val;
                    }
                }
            });
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
                    // type: 'cat',
                    // mask: 'MM/DD',
                    // tickCount: 2,
                    range: [0, 1],
                    ticks,
                    formatter (val) {
                        val = val + '';
                        return `${val.substring(1,3)}-${val.substring(3,5)}`
                    }
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
            // chart.area().position('year*value').color('type').shape('smooth');
            chart.line().position('year*value').color('type', function () {
                return '#dedede'
            }).shape('smooth');
            chart.point().position('year*value').color('value', function (val) {
                if (val > 10)
                    return '#F95727';
                if (val < 4.4)
                    return '#a2aabe';
                return '#2fb2e7';
            });
            chart.render();
            return chart;
        },
        update (data) {
            chart.changeData(data);
        }
    }
};
