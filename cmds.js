// imports
const request = require('request');
const io = require('socket.io-client');
const util = require('./util');
const filter = require('./filter');
const msgs = require('./msgs');

// const
const PLAYMODE = {
    DEFAULT: 0,
    RANDOM: 1,
    VOTE: 2
};
const TIMEOUT = 30000;

// prop
let SOCKET;
const CHANNEL = {};

// connect/close
const connect = function connect() {
    CHANNEL.name = process.env.CHANNEL_NAME;
    return new Promise((resolve, reject) => {
        request.get({
            uri: `https://cytube.xyz/socketconfig/${CHANNEL.name}.json`
        }, (error, resp, body) => {
            const servers = JSON.parse(body).servers;
            const socketServer = servers[0].url;
            SOCKET = io(socketServer, { reconnection: true });

            SOCKET.on('connect', () => {
                SOCKET.emit('joinChannel', {
                    name: CHANNEL.name
                });
                SOCKET.emit('login', {
                    name: process.env.BOT_USER_NAME,
                    pw: process.env.BOT_USER_PW
                });
            });

            SOCKET.on('joinChannel', data => {
                console.log(data);
            });

            const login = new Promise((resolve, reject) => {
                SOCKET.on('login', data => {
                    console.log(data);
                    if (data.success) {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                });
            });

            const randomPlay = new Promise((resolve, reject) => {
                let timer;
                SOCKET.on('setRandomPlay', mode => {
                    CHANNEL.playmode = mode;
                    clearTimeout(timer);
                    resolve(true);
                });
                timer = setTimeout(() => {
                    reject(false);
                }, TIMEOUT);
            });

            const playlistLocked = new Promise((resolve, reject) => {
                let timer;
                SOCKET.on('setPlaylistLocked', mode => {
                    CHANNEL.playlistLocked = mode;
                    clearTimeout(timer);
                    resolve(true);
                });
                timer = setTimeout(() => {
                    reject(false);
                }, TIMEOUT);
            });

            SOCKET.on('error', msg => {
                console.log('error!');
                console.log(msg);
                SOCKET.close();
            });

            SOCKET.on('errorMsg', data => {
                console.log('error!');
                console.log(data.msg);
            });

            Promise.all([login, randomPlay, playlistLocked])
                .then(() => {
                    util.log("connect success!")
                    console.log(CHANNEL);
                    resolve(true);
                })
                .catch(() => {
                    util.log("connect fail!");
                    console.log(CHANNEL);
                    reject(false);
                });
        });
    });
};

const close = function close() {
    SOCKET.close();
}

// こっからコマンド本体

/**
 * プレイリスト開放
 */
const openPlaylist = function openPlaylist() {
    return new Promise((resolve, reject) => {
        if (!CHANNEL.playlistLocked) {
            resolve(true);
            return;
        }

        var timer;
        SOCKET.once('setPlaylistLock', mode => {
            util.log(`OPEN PLAYLIST`);
            clearTimeout(timer);
            resolve(true);
        });
        timer = setTimeout(() => {
            reject(false);
        }, TIMEOUT);
        SOCKET.emit("togglePlaylistLock");
    });
};

/**
 * プレイリストロック
 */
const lockPlaylist = function lockPlaylist() {
    return new Promise((resolve, reject) => {
        if (CHANNEL.playlistLocked) {
            resolve(true);
            return;
        }

        var timer;
        SOCKET.once('setPlaylistLock', mode => {
            util.log(`LOCKED PLAYLIST`);
            clearTimeout(timer);
            resolve(true);
        });
        timer = setTimeout(() => {
            reject(false);
        }, TIMEOUT);
        SOCKET.emit("togglePlaylistLock");
    });
};

/**
 * デフォルト再生モード（上から）に変更
 */
const toDefaultPlayMode = async function toDefaultPlayMode() {
    return new Promise(async (resolve, reject) => {
        try {
            switch (CHANNEL.playmode) {
                case PLAYMODE.DEFAULT:
                    break;
                case PLAYMODE.RANDOM:
                    await togglePlayMode();
                case PLAYMODE.VOTE:
                    await togglePlayMode();
                    break;
            }
            util.log(`DEFAULT PLAYMODE`);
            resolve(true);
        } catch (e) {
            reject(false);
        }
    });
};

/**
 * ランダム再生モードに変更
 */
const toRandomPlayMode = async function toRandomPlayMode() {
    return new Promise(async (resolve, reject) => {
        try {
            switch (CHANNEL.playmode) {
                case PLAYMODE.DEFAULT:
                    await togglePlayMode();
                    break;
                case PLAYMODE.RANDOM:
                    break;
                case PLAYMODE.VOTE:
                    await togglePlayMode();
                    await togglePlayMode();
                    break;
            }
            util.log(`RANDOM PLAYMODE`);
            resolve(true);
        } catch (e) {
            reject(false);
        }
    });
};

/**
 * 投票再生モードに変更
 */
const toVotePlayMode = async function toVotePlayMode() {
    return new Promise(async (resolve, reject) => {
        try {
            switch (CHANNEL.playmode) {
                case PLAYMODE.DEFAULT:
                    await togglePlayMode();
                case PLAYMODE.RANDOM:
                    await togglePlayMode();
                    break;
                case PLAYMODE.VOTE:
                    break;
            }
            util.log(`VOTE PLAYMODE`);
            resolve(true);
        } catch (e) {
            reject(false);
        }
    });
};

/**
 * 再生モード切替
 */
const togglePlayMode = function togglePlayMode() {
    return new Promise((resolve, reject) => {
        var timer;
        SOCKET.once('setRandomPlay', mode => {
            clearTimeout(timer);
            resolve(true);
        });
        timer = setTimeout(() => {
            reject(false);
        }, TIMEOUT);
        SOCKET.emit("toggleRandomPlay");
    });
};

/**
 * 再生モードランダム切替
 */
const shufflePlayMode = function shufflePlayMode(cmd) {
    let mode;
    do {
        mode = util.rand(0, 2);
    } while (mode === CHANNEL.playmode && !cmd.sameModeOK)
    util.log(`SHUFFLE PLAYMODE`);

    switch (mode) {
        case PLAYMODE.DEFAULT:
            return toDefaultPlayMode();
        case PLAYMODE.RANDOM:
            return toRandomPlayMode();
        case PLAYMODE.VOTE:
            return toVotePlayMode();
        default:
            new Error(mode);
    }
};

/**
 * チャット送信
 */
const addChat = function addChat(cmd) {
    return new Promise((resolve, reject) => {
        let msg = cmd.msg;
        if (Array.isArray(cmd.msg)) {
            msg = msg[util.rand(0, msg.length - 1)];
        }

        var timer;
        SOCKET.once('chatMsg', mode => {
            clearTimeout(timer);
            util.log(`SEND MSG : ${msg}`);
            resolve(true);
        });
        timer = setTimeout(() => {
            reject(false);
        }, TIMEOUT);
        SOCKET.emit("chatMsg", {
            msg: msg,
            meta: {}
        });
    });
};

/**
 * キュー先頭に追加
 */
const addQueue = function addQueue(cmd) {
    return new Promise((resolve, reject) => {
        var timer;
        SOCKET.once('queue', mode => {
            clearTimeout(timer);
            util.log(`ADD QUEUE : ${cmd.link}`);
            resolve(true);
        });
        timer = setTimeout(() => {
            reject('TIMEOUT - 時間内に正常終了しませんでした。youtubeの場合、追加制限がかかっているかもしれません。');
        }, TIMEOUT);
        let data = util.parseMediaLink(cmd.link);
        console.log(data);
        SOCKET.emit("queue", {
            id: data.id,
            type: data.type,
            pos: cmd.pos || "next",
            duration: 0,
            temp: true
        });
    });
};

/**
 * キュー先頭にランダム追加
 */
const addQueueRandom = function addQueueRandom(cmd) {
    return addQueue({
        cmd: 'ADD_QUEUE',
        link: cmd.links[util.rand(0, cmd.links.length - 1)]
    });
};

/**
 * 外部APIから動画リンクを取得してキュー先頭に追加
 */
const addQueueApi = function addQueueApi(cmd) {
    return new Promise((resolve, reject) => {
        request.get({
            uri: cmd.url
        }, (error, resp, body) => {
            if (error) {
                util.log("API接続失敗。 URLが正しいか及びAPIが生存しているか確認して下さい。");
                reject(error);
            } else {
                try {
                    resolve(JSON.parse(body)[cmd.prop]);
                } catch (e) {
                    util.log("JSON解析失敗。 APIの戻り値がJSONでない可能性があります。");
                    reject(e);
                }
            }
        });
    }).then(link => {
        return addQueue({
            cmd: 'ADD_QUEUE',
            link
        });
    }).catch(err => {
        util.log(err);
        return false;
    });
};

const getLibrary = function getLibrary() {
    return new Promise((resolve, reject) => {
        var timer;
        SOCKET.once('searchResults', data => {
            clearTimeout(timer);
            util.log(`GET LIBRARY : ${data.results.length} 件`);
            resolve(data.results);
        });
        timer = setTimeout(() => {
            reject('TIMEOUT - 時間内にライブラリが取得できませんでした');
        }, TIMEOUT);
        SOCKET.emit("searchMedia", {
            source: "library",
            query: ""
        });
    });
};

/**
 * ライブラリから指定した時間分追加
 */
const addQueueLibraryTime = async function addQueueLibraryTime(cmd) {
    const INTERVAL = cmd.interval || 6000;
    if (INTERVAL < 6000) {
        INTERVAL = 6000;
    }

    const msgFactory = await msgs.load('./msgs-add-library.json');

    return getLibrary()
        .then(async data => {
            let queues = [];
            let time = (cmd.minutes || 0) * 60;
            let sum = 0;
            while (time > 0 && data.length > 0) {
                let tar = data.splice(util.rand(0, data.length - 1), 1)[0];
                if (filter.ok(tar)) {
                    time -= tar.seconds;
                    sum += tar.seconds;
                    queues.push(util.formatURL(tar));
                }
            }

            util.log(`LIBRARYから ${Math.floor(sum / 60)}min ${sum % 60}sec 分追加`);
            util.log(`負荷防止の為に1件につき${INTERVAL / 1000}秒の間隔で追加します`);
            
            if (cmd.announce) {
                await addChat({
                    cmd: 'SEND_CHAT',
                    msg: msgFactory.getFormatMsg('START', {
                        kensu: queues.length,
                        fun: Math.ceil(sum / 60),
                        yoteiFun: Math.ceil((queues.length * 6) / 60)
                    })
                })
            }

            let cnt = 0;
            for (const queue of queues) {
                util.log(`追加中... 残 ${queues.length - cnt} 件`);

                try {
                    await addQueue({
                        cmd: 'ADD_QUEUE',
                        link: queue
                    });
                } catch (e) {
                    util.log(`追加失敗: ${queue}`);
                }

                if (queues.indexOf(queue) != queues.length - 1) {
                    await util.sleep(INTERVAL);
                }

                cnt += 1;

                if (cmd.announce && cnt % 10 == 0) {
                    await addChat({
                        cmd: 'SEND_CHAT',
                        msg: msgFactory.getFormatMsg('INTERVAL', {
                            nokori: queues.length - cnt
                        })
                    })
                }
            }

            if (cmd.announce) {
                await addChat({
                    cmd: 'SEND_CHAT',
                    msg: msgFactory.getFormatMsg('END')
                })
            }

            util.log(`追加完了 ${cnt} 件`);

        });
};

/**
 * ライブラリから指定したサイズ分追加
 */
const addQueueLibraryCount = async function addQueueLibraryCount(cmd) {
    const INTERVAL = cmd.interval || 6000;
    if (INTERVAL < 6000) {
        INTERVAL = 6000;
    }
    return getLibrary()
        .then(async data => {
            let queues = [];
            let count = cmd.count || 0;
            while (count > 0 && data.length > 0) {
                let tar = data.splice(util.rand(0, data.length - 1), 1)[0];
                if (filter.ok(tar)) {
                    count -= 1;
                    queues.push(util.formatURL(tar));
                }
            }

            util.log(`LIBRARYから ${queues.length} 件追加`);
            util.log(`負荷防止の為に1件につき${INTERVAL / 1000}秒の間隔で追加します`);

            if (cmd.announce) {
                await addChat({
                    cmd: 'SEND_CHAT',
                    msg: msgFactory.getFormatMsg('START', {
                        kensu: queues.length,
                        fun: Math.ceil(sum / 60),
                        yoteiFun: Math.ceil((queues.length * 6) / 60)
                    })
                })
            }

            let cnt = 0;
            for (const queue of queues) {
                util.log(`追加中... 残 ${queues.length - cnt} 件`);

                try {
                    await addQueue({
                        cmd: 'ADD_QUEUE',
                        link: queue
                    });
                } catch (e) {
                    util.log(`追加失敗: ${queue}`);
                }

                if (queues.indexOf(queue) != queues.length - 1) {
                    await util.sleep(INTERVAL);
                }

                cnt += 1;

                if (cmd.announce && cnt % 10 == 0) {
                    await addChat({
                        cmd: 'SEND_CHAT',
                        msg: msgFactory.getFormatMsg('INTERVAL', {
                            nokori: queues.length - cnt
                        })
                    })
                }
            }

            if (cmd.announce) {
                await addChat({
                    cmd: 'SEND_CHAT',
                    msg: msgFactory.getFormatMsg('END')
                })
            }

            util.log(`追加完了 ${cnt} 件`);

        });
};

// コマンドのマップ
const CMDS = {
    OPEN_PLAYLIST: openPlaylist,
    LOCK_PLAYLIST: lockPlaylist,
    DEFAULT_PLAYMODE: toDefaultPlayMode,
    RANDOM_PLAYMODE: toRandomPlayMode,
    VOTE_PLAYMODE: toVotePlayMode,
    TOGGLE_PLAYMODE: togglePlayMode,
    SHUFFLE_PLAYMODE: shufflePlayMode,
    SEND_CHAT: addChat,
    ADD_QUEUE: addQueue,
    ADD_QUEUE_RANDOM: addQueueRandom,
    ADD_QUEUE_API: addQueueApi,
    ADD_QUEUE_LIBRARY_TIME: addQueueLibraryTime,
    ADD_QUEUE_LIBRARY_COUNT: addQueueLibraryCount
};

module.exports = {
    connect,
    close,
    CMDS
};
