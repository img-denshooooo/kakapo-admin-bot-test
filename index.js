// imports
const request = require('request');
const io = require('socket.io-client');
const cron = require('node-cron');
const fs = require('fs');
const util = require('./util')
// env
require('dotenv').config();

// const
const PLAYMODE = {
  DEFAULT: 0,
  RANDOM: 1,
  VOTE: 2
};
const TIMEOUT = 10000;

// prop
let SOCKET;
const CHANNEL = {};

// connect/close
const connect = function connect() {
  return new Promise((resolve, reject) => {
    request.get({
      uri: `https://cytube.xyz/socketconfig/${process.env.CHANNEL_NAME}.json`
    }, (error, resp, body) => {
      const servers = JSON.parse(body).servers;
      const socketServer = servers[0].url;
      SOCKET = io(socketServer, { reconnection: true });
      
      SOCKET.on('connect', () => {
        SOCKET.emit('joinChannel', {
          name: process.env.CHANNEL_NAME
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
          console.log("RANDOM");
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
          console.log("PLAYLIST");
          CHANNEL.playlistLocked = mode;
          clearTimeout(timer);
          resolve(true);
        });
        timer = setTimeout(() => {
          reject(false);
        }, TIMEOUT);
      });

      SOCKET.on('error', msg => {
        console.log(msg);
        SOCKET.close();
      });

      SOCKET.on('errorMsg', data => {
        console.log(data.msg);
      });

      Promise.all([login, randomPlay, playlistLocked])
        .then(() => {
          console.log(CHANNEL);
          resolve(true);
        })
        .catch(() => {
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
const lockPlaylist = function openPlaylist() {
  return new Promise((resolve, reject) => {
    if (CHANNEL.playlistLocked) {
      resolve(true);
      return;
    }

    var timer;
    SOCKET.once('setPlaylistLock', mode => {
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
      resolve();
    } catch(e) {
      reject();
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
      resolve();
    } catch (e) {
      reject();
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
      resolve();
    } catch (e) {
      reject();
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
 * チャット送信
 */
const addChat = function addChat(cmd) {
  return new Promise((resolve, reject) => {
    var timer;
    SOCKET.once('chatMsg', mode => {
      clearTimeout(timer);
      resolve(true);
    });
    timer = setTimeout(() => {
      reject(false);
    }, TIMEOUT);
    SOCKET.emit("chatMsg", {
      msg: cmd.msg,
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
      resolve(true);
    });
    timer = setTimeout(() => {
      reject(false);
    }, TIMEOUT);
    let data = util.parseMediaLink(cmd.link);
    SOCKET.emit("queue", {
      id: data.id,
      type: data.type,
      pos: "next",
      duration: 0,
      temp: true
    });
  });
};

// コマンドのマップ
const CMDS = {
  OPEN_PLAYLIST: openPlaylist,
  LOCK_PLAYLIST: lockPlaylist,
  DEFAULT_PLAYMODE: toDefaultPlayMode,
  RANDOM_PLAYMODE: toRandomPlayMode,
  VOTE_PLAYMODE: toVotePlayMode,
  SEND_CHAT: addChat,
  ADD_QUEUE: addQueue,
};

// main
fs.readFile('./schedule.json', (err, data) => {

  /*
   * ファイル読んでタスクをcronに登録するだけ
   */

  if (!data) {
    console.log(err);
    return;
  }
  
  const schedules = JSON.parse(data);
  
  schedules.forEach(task => {
    cron.schedule(task.cron, async () => {
      if (!await connect()) {
        close();
        return;
      }
      for (const cmd of task.cmds) {
        await CMDS[cmd.cmd](cmd);
      }
      close();
    });
  });

});