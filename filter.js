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
        util.log('filter.jsonが壊れています。括弧の閉じ忘れ、カンマの付け忘れ・消し忘れ、"の有無を確認して下さい。');
        throw e;
    }

});

const ng = function ng(obj) {
    return ngTitle(obj.title) || ngUrl(util.formatURL(obj)) || ngTime(obj.seconds);
}

const ngTitle = function ngTitle(title) {
    return json.titles.some(it => title.toUpperCase().indexOf(it.toUpperCase()) >= 0);
}

const ngUrl = function ngUrl(url) {
    url = url.replace('http://', 'https://')
    return json.urls.some(it => url.indexOf(it.replace('http://', 'https://')) >= 0);
}

const ngTime = function ngTime(seconds) {
    if (json.minSeconds === -1 && json.maxSeconds === -1) {
        return false;
    }
    if (json.minSeconds === -1) {
        return seconds > json.maxSeconds;
    }
    if (json.maxSeconds === -1) {
        return json.minSeconds > seconds;
    }
    return json.minSeconds > seconds 
            || seconds > json.maxSeconds;
}

const ok = function ok(obj) {
    return !ng(obj);
}

module.exports = {
    ok,
    ng
};