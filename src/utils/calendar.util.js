
export const getMonthDay = (month) => {
    let date = new Date();
    date.setMonth(month);
    let sTime = date.setDate(1);
    month = month + 1;
    date.setMonth(month);
    let eTime = date.setDate(0);
    date.setDate(0);
    return {
        sTime,
        eTime,
    };
};


export default (options = {}) => {
    let curDate = options.curDate || new Date(); // 当前时间
    let year = curDate.getFullYear();
    let month = curDate.getMonth() ;
    let months = curDate.getMonth() + 1;
    let lastDay = new Date(year, months, 0);
    let preLastDay = new Date(year, month, 0);
    lastDay = lastDay.getDate();
    preLastDay = preLastDay.getDate();
    //第一天星期几
    let firstDay = new Date(year, month, 1);
    firstDay = firstDay.getDay();
    let arr = [];
    for (let i = 1; i <= lastDay; i++) {
        arr.push({
            num: i,
            value: 0,
            type: true,
        });
    }
    for (let i = 0; i < firstDay; i++) {
        arr.unshift({
            num: preLastDay - i,
            value: -1,
            type: false,
        });
    }
    let len = 42 - arr.length;
    for (let i = 0; i < len; i++) {
        arr.push({
            num: i + 1,
            value: -1,
            type: false,
        });
    }
    let resultData = splitArray(arr, 7);
    return {
        preDay: firstDay,
        resultData,
        nextDay: len,
        months,
    }
};

function splitArray (arr,len) {
    let arr_length = arr.length;
    let newArr = [];
    for(let i=0;i<arr_length;i+=len){
        newArr.push(arr.slice(i,i+len));
    }
    return newArr;
}
