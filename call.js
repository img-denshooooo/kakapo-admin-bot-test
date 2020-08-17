const util = require('./util');
const { connect, close, CMDS } = require('./cmds')
// env
require('dotenv').config();

const main = async function main() {

    const cmd = process.argv[2];

    let cmdBody = {cmd};

    switch (cmd) {
        case 'SEND_CHAT':
            cmdBody.msg = process.argv[3];
            break;
        case 'ADD_QUEUE':
            cmdBody.link = process.argv[3];
            break;
        case 'ADD_QUEUE_LIBRARY_TIME':
            cmdBody.minutes = process.argv[3];
            cmdBody.interval = process.argv[4];
            cmdBody.announce = true;
            break;
        case 'ADD_QUEUE_LIBRARY_COUNT':
            cmdBody.count = process.argv[3];
            cmdBody.interval = process.argv[4];
            cmdBody.announce = true;
            break;
        case 'POLL_PLAYMODE':
            cmdBody.seconds = Number(process.argv[3] || 300);
            cmdBody.show = process.argv[4] === 'true';
            break;
        case 'QUICKPUSH_PLAYMODE':
            cmdBody.minutes = Number(process.argv[3] || 30);
            cmdBody.min = Number(process.argv[4] || 4);
            cmdBody.max = Number(process.argv[5] || 8);
            cmdBody.vote = Number(process.argv[6] || 1);
            break;
        case 'CUSTOM_VOTE_PLAYMODE':
            cmdBody.minutes = Number(process.argv[3] || 30);
            cmdBody.seconds = Number(process.argv[4] || 60);
            cmdBody.min = Number(process.argv[5] || 4);
            cmdBody.max = Number(process.argv[6] || 4);
            cmdBody.show = Number(process.argv[7] === 'true');
            break;
        case 'OPEN_PLAYLIST':
        case 'LOCK_PLAYLIST':
        case 'DEFAULT_PLAYMODE':
        case 'RANDOM_PLAYMODE':
        case 'VOTE_PLAYMODE':
        case 'TOGGLE_PLAYMODE':
        case 'SHUFFLE_PLAYMODE':
            break;
        default:
            util.log(`コマンド [${cmd}] は存在しないコマンドか、callで実行できないコマンドです。`);
            return;
    }

    if (!await connect()) {
        close();
        return;
    }

    util.log(`コマンド [${cmd}] 実行`);

    try {
        await CMDS[cmd](cmdBody);
        util.log(`コマンド [${cmd}] 実行完了。`);
    } catch (e) {
        util.log(`コマンド [${cmd}] 実行失敗。`);
        console.log(e);
        console.log(cmdBody);
    }

    close();

};

main();