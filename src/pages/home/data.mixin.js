
export default {
    data: {
        isPopup: false,
        isActEntry: false,
        objParams: {
            curKey: 'journal'
        },
        objEntry: {
            // // vip权益
            // equity: {
            //     url: 'mine_introduce_index',
            // },
            // 测糖计划
            plan: {
                url: 'questionnaire_programme_index',
                icon: '/assets/images/home-entry-btn1.png',
                icon2: '/assets/images/home-entry-vip-btn1.png',
                params: {
                    from: 'home_index',
                },
            },
            // 打卡有礼
            gift: {
                url: 'lottery_index',
                icon: '/assets/images/home-entry-btn2.png',
                icon2: '/assets/images/home-entry-vip-btn2.png',
            },
            // 血糖报告
            report: {
                url: 'report_index',
                icon: '/assets/images/home-entry-btn3.png',
                icon2: '/assets/images/home-entry-vip-btn3.png',
                params: {
                    curKey: 'weekly',
                },
            },
        }
    },
}
