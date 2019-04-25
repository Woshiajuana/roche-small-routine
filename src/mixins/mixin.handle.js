/**
 * Created by lenovo on 18/09/01.
 */

export default (options) => {
    let {
        mixins,
    } = options;
    if (!mixins) return options;
    let result = {...options};
    let data = {};
    mixins.forEach((item) => {
        item.data && (data = {...data, ...item.data});
        options = {
            ...options,
            ...item,
        }
    });
    !result.data && (result.data = {});
    result = {
        ...options,
        ...result,
        data: {
            ...data,
            ...result.data,
        },
    };
    return result;
}
