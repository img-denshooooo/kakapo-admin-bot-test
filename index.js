// v 1.0.15

// imports
const cron = require('node-cron');
const fs = require('fs');
const util = require('./util');
const { connect, close, CMDS } = require('./cmds')
// env
require('dotenv').config();

util.log('起動します。');

// main
fs.readFile('./schedule.json', (err, data) => {

  /*
   * ファイル読んでタスクをcronに登録するだけ
   */

  if (!data) {
    util.log("schedule.json読み込み失敗。ファイルが存在するか確認してください。");
    util.log(err);
    return;
  }

  let schedules;
  try {
    schedules = JSON.parse(data);
  } catch (e) {
    util.log('schedule.jsonが壊れています。括弧の閉じ忘れ、カンマの付け忘れ・消し忘れ、"の有無を確認して下さい。');
    throw e;
  }

  util.log(`${schedules.length} 件のタスクを設定。`);

  schedules.forEach(task => {
    cron.schedule(task.cron, async () => {
      util.log("タスク起動");
      if (!await connect()) {
        close();
        return;
      }
      for (const cmd of task.cmds) {
        util.log(`コマンド [${cmd.cmd}] 実行`);
        try {
          await CMDS[cmd.cmd](cmd);
          util.log(`コマンド [${cmd.cmd}] 実行完了。`);
        } catch (e) {
          util.log(`コマンド [${cmd.cmd}] 実行失敗。`);
          console.log(e);
          console.log(cmd);
        }
      }
      util.log("タスク終了");
      close();
    });
  });

  util.log('タスク実行を待機します。');

});