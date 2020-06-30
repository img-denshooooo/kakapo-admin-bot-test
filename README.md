# kakapo-admin-bot-test
kakapo-admin-bot-testは生まれたばかりのcytubeボットです。
ドキュメント整備は後でやるよ！

# 出来る事
cytubeのチャンネルの管理者操作をある程度自動化できます。  
プレイリスト開放や再生モード切替を細かいレベルでスケジュールを組んで自動実行できます。  
ブラウザは不要です。ローカル実行の場合はNodeJSで立ち上げる必要があります。
Herokuに載せれば完全自動です。

# 導入（簡易版）
0. `NodeJS`がなかったらインストールして下さい。
1. `git clone`して`npm install`して下さい。
2. cytubeにボット用のユーザーを作成し、管理者権限を付与して下さい。
3. `.env`ファイルにチャンネル名と作ったボットユーザーとそのパスワードを設定して下さい。
4. `schedule.json`を好きに編集して下さい。スケジューリングはcronです。説明はまた今度で…。とりあえずデフォルトである程度設定してあります。
5. `schedule.json`の内容は趣味なんでウザかったら書き換えてください。ミクさんかわいいよミクさん。
6. `npm run start`でローカル起動できます。

# 導入（詳細版）

## 準備
githubからソースを落とすためにgitのクライアントが必要です。  
ローカル実行の場合はNodeJSが必要です。  
それぞれ公式からダウンロードしてインストールしてください。  
NodeJSは安定版の方で良いです。

## 1.ソース落とす
適当なフォルダを作成し、そこに移動してください。（コンソールで）
```
git clone https://github.com/img-denshooooo/kakapo-admin-bot-test.git
```
を実行して、ソースを落としてください。  
うまくいかない場合はgitクライアント周りを見直してください。(proxy下だとproxy設定要ります）  
どうしてもうまくいかない場合は上の方にあるClone→Download ZIPでソースを落として解答して配置してください。

## 2.NodeJSモジュール落とす
落としたソースのルートディレクトリ（多分`kakapo-admin-bot-test`）に移動して、`npm install`を実行してください。
```
npm install
```
proxy下だとproxy設定要ります。

## 3. cytubeにボット用のユーザーを作ってenvファイルに設定
cytubeで適当にボット用のユーザーを作って、そのユーザーに対象のチャンネルの管理者権限を付与してください。
管理者権限の付与はcytubeのチャンネル設定→編集→モデレータでできます。  
ソース内にある`.env`を開いて、各設定をしてください。  
- CHANNEL_NAME: 対象となるチャンネル名
- BOT_USER_NAME: 作ったボットユーザー名
- BOT_USER_PW: 作ったボットユーザーのパスワード
例
``` 
CHANNEL_NAME=img_channel 
BOT_USER_NAME=botne_miku
BOT_USER_PW=password
```

## 4. スケジュールの設定
`schedule.json`を好きに変更して、スケジュールを設定してください。  
デフォルト設定はいつものものと同じスケジュールになっています。（ただし時報の動画が異なるので注意してください）  
フォーマットはjsonです。壊すと動かなくなるので注意してください。  
```
// 一つ辺りの設定説明例
{
    "cron": "0 0 9 * * *", // 毎日９時に実行
    "cmds": [
        {
            "cmd": "DEFAULT_PLAYMODE" // 上から再生モード
        },
        {
            "cmd": "ADD_QUEUE", // 動画追加
            "link": "https://youtu.be/94mVMzYoOJc" // 動画のパス
        },
        {
            "cmd": "SEND_CHAT", // チャット送信
            "msg": "おはよう！お仕事です☆" // ☆彡
        }
    ]
},
```
### 設定の詳細
#### cron
cronでスケジュールを指定します。詳しくはcronで調べてください。  
左から順に秒・分・時・日・月・曜日で指定できます。  
設定例
```
*/5 * * * * * -> ５秒毎
0 30 9 * * * -> 毎日９時半に実行
0 0 */3 * * * -> ３時間毎
```

#### cmd
- OPEN_PLAYLIST  
プレイリストを開放します。追加できるようになります。
- LOCK_PLAYLIST  
プレイリストをロックします。追加できなくなります。
- DEFAULT_PLAYMODE  
上から再生モードにします。
- RANDOM_PLAYMODE  
ランダム再生モードにします。
- VOTE_PLAYMODE  
投票再生モードにします。
- SEND_CHAT  
チャットを送信します。`msg`に内容を入力してください。
- ADD_QUEUE  
動画を先頭に追加します。`link`に動画のURLを入力してください。

## 5.ローカル実行
ローカルで実行する場合は、ソースのルート（package.jsonのあるフォルダ）で以下を実行してください。
```
npm run start
```
この場合、実行しているコンソールは立ち上げっぱなしにする必要があります。

## 6.テストについて
スケジュールの動作テストをするときは適当にテストチャンネルを作って実行してみるといいと思います。  

# ~~Heroku~~
~~に自動化したい場合はHerokuに載せればローカルで起動しなくて済みます。~~
1. ~~Herokuのアカウントとる。~~
2. ~~Heroku-CLI入れる。~~
3. ~~設定済みのこのプロジェクトをHerokuに上げる。~~

Herokuだと途中で止まる事に気付きました。というかHerokuはWebアプリじゃないと駄目だね。  
代替案考え中。

※ やり方は`Heroku 導入`とかでググって出てくるドキュメントの方が詳しいです。すまん。

# ごめん
在宅勤務で暇だから片手間で作ったやつだからね。  
動かなかったらごめん。報告してくれたら直します。  
スレで教えてほしいけどあまりアクティブ率高くないんだごめん。
