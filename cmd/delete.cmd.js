
import fs from 'fs-extra'
import path from 'path'
import {
    log
} from 'wow-cmd'

const Handle = (options, data) => new Promise((resolve, reject) => {
    let {
        params,
        parameters,
    } = options;
    params = params ? params.toLocaleLowerCase() : '';
    if (!params)
        return reject('清除失败：未指定清除目录');
    let dir = path.join(__dirname, '../', params);
    return resolve(dir);
});

// 参数 options
Handle.options = {
    cmd: ['-d', '--delete'],
};

// 成功
Handle.success = (res, next) => {
    log(`即将清除${res}目录`);
    emptyDir(res);
    log(`清除${res}目录成功`);
    next(res);
};

// 失败
Handle.error = (err, next) => {
    log(err, '004');
    next();
};

export default Handle;

function emptyDir(fileUrl) {
    try {
        fs.emptyDirSync(fileUrl)
    } catch(e) {
        log(e, '004');
        log(`重新清除${fileUrl}目录`);
        emptyDir(fileUrl);
    }
}
