const fs = require('fs');
const util = require('./util');

const getMsg = function getMsg(key) {
    const msgs = this.json[key];
    return msgs[util.rand(0, msgs.length - 1)];
};

const formatMsg = function formatMsg(msg, params) {
    if (!params) {
        return msg;
    }
    
    for (const key of Object.keys(params)) {
        msg = msg.split('${' + key + '}').join(params[key]);
    }
    return msg;
};

const getFormatMsg = function getFormatMsg(key, params) {
    return formatMsg(this.getMsg(key), params);
}

const load = function load(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (!data) {
                util.log(filePath + "読み込み失敗。ファイルが存在するか確認してください。");
                util.log(err);
                reject(false);
                return;
            }

            try {
                resolve({
                    json: JSON.parse(data),
                    getMsg,
                    getFormatMsg
                });
            } catch (e) {
                util.log(filePath + 'が壊れています。括弧の閉じ忘れ、カンマの付け忘れ・消し忘れ、"の有無を確認して下さい。');
                throw e;
            }
        });
    });
}

module.exports = {
    load
};