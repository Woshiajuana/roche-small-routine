
const handle = function (e) {
    let {
        detail,
        currentTarget
    } = e;
    let key = currentTarget.dataset.key;
    let obj = currentTarget.dataset.obj;
    let value = typeof detail.value === 'undefined' ?
        currentTarget.dataset.value : detail.value;
    if (obj) {
        let sItem = `${obj}.${key}.value`;
        this.setData({
            [sItem]: value
        });
    } else {
        this.setData({
            [key]: value
        });
    }

};

export default {
    bindInput: handle,
    bindTap: handle,
    bindChange: handle,
}
