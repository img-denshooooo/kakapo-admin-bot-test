const fs = require('fs');
const util = require('./util');

let json;
fs.readFile('./filter.json', (err, data) => {
    if (!data) {
        util.log("filter.json読み込み失敗。ファイルが存在するか確認してください。");
        util.log(err);
        return;
    }

    try {
        json = JSON.parse(data);
    } catch (e) {
        util.log('schedule.jsonが壊れています。括弧の閉じ忘れ、カンマの付け忘れ・消し忘れ、"の有無を確認して下さい。');
        throw e;
    }

});

const ng = function ng(obj) {
    return ngTitle(obj.title) || ngUrl(util.formatURL(obj));
}

const ngTitle = function ngTitle(title) {
    return json.titles.some(it => title.toUpperCase().indexOf(it.toUpperCase()) >= 0);
}

const ngUrl = function ngUrl(url) {
    url = url.replace('http://', 'https://')
    return json.urls.some(it => it.replace('http://', 'https://') === url);
}

const ok = function ok(obj) {
    return !ng(obj);
}

module.exports = {
    ok,
    ng
};