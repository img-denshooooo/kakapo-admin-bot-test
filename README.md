# kakapo-admin-bot-test
kakapo-admin-bot-testは生まれたばかりのcytubeボットです。
ドキュメント整備は後でやるよ！

# 出来る事
cytubeのチャンネルの管理者操作をある程度自動化できます。  
プレイリスト開放や再生モード切替を細かいレベルでスケジュールを組んで自動実行できます。  
ブラウザは不要です。ローカル実行の場合はNodeJSで立ち上げる必要があります。  
~~Herokuに載せれば完全自動です。~~  
Herokuに載せるの難しそうなので完全自動はちょっと考え中です。AWS借りるのが手っ取り早いかなぁ。

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
成功すれば同フォルダ内に`node_modules`というフォルダが出来ます。  
上手くいかない場合はNodeJSとnpm周りの設定を見直してください。  
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
*/5 * * * * * -> ５秒毎に実行
0 30 9 * * * -> 毎日９時半に実行
0 0 */3 * * * -> ３時 6時 9時 12時 15時 18時 21時 24時に実行
0 0 12 * * 1-5 -> 平日12時に実行
0 0 */2 * * 6-7 -> 土日だけ2時間おきに実行
```

#### cmds
流したいコマンドを好きな数だけ書いて下さい。  
上から順に流れていきます。

#### cmd
ボットが行う動作です。以下のものがあります。
- OPEN_PLAYLIST  
プレイリストを開放します。追加できるようになります。  
    ``` js
    // 設定例
    // 毎日9時に開放
    {
        "cron": "0 0 9 * * *",
        "cmds": [
            {
                "cmd": "OPEN_PLAYLIST"
            }
        ]
    },
    ```
- LOCK_PLAYLIST  
プレイリストをロックします。追加できなくなります。  
    ``` js
    // 設定例
    // 毎日18時にロック
    {
        "cron": "0 0 18 * * *",
        "cmds": [
            {
                "cmd": "LOCK_PLAYLIST"
            }
        ]
    },
    ```
- DEFAULT_PLAYMODE  
上から再生モードにします。  
    ``` js
    // 設定例
    // 毎日12時から上から再生モード
    {
        "cron": "0 0 12 * * *",
        "cmds": [
            {
                "cmd": "DEFAULT_PLAYMODE"
            }
        ]
    },
    ```
- RANDOM_PLAYMODE  
ランダム再生モードにします。  
    ``` js
    // 設定例
    // 毎日12時からランダム再生モード
    {
        "cron": "0 0 12 * * *",
        "cmds": [
            {
                "cmd": "RANDOM_PLAYMODE"
            }
        ]
    },
    ```
- VOTE_PLAYMODE  
投票再生モードにします。  
    ``` js
    // 設定例
    // 毎日12時から投票再生モード
    {
        "cron": "0 0 12 * * *",
        "cmds": [
            {
                "cmd": "VOTE_PLAYMODE"
            }
        ]
    },
    ```
- TOGGLE_PLAYMODE  
再生モードを順次切り替えます。上から→ランダム→投票→上から→...でループします。  
    ``` js
    // 設定例
    // 3時間ごとに再生モード切替
    {
        "cron": "0 0 */3 * * *",
        "cmds": [
            {
                "cmd": "TOGGLE_PLAYMODE"
            }
        ]
    },
    ```
- SHUFFLE_PLAYMODE  
再生モードをランダムで切り替えます。現在のモードと違うどちらかのモードになります。  
`sameModeOK`を`true`で設定すると、現在のモードもランダム対象になります。（同じモード連続がありえるようになる）  
    ``` js
    // 設定例
    // 平日は3時間ごとにシャッフル切り替え（同じモード連続なし）
    {
        "cron": "0 0 */3 * * 1-5",
        "cmds": [
            {
                "cmd": "SHUFFLE_PLAYMODE"
            }
        ]
    },
    // 休日は2時間ごとにシャッフル切り替え（同じモード連続あり）
    {
        "cron": "0 0 */2 * * 6-7",
        "cmds": [
            {
                "cmd": "SHUFFLE_PLAYMODE",
                "sameModeOK": true
            }
        ]
    },
    ```

- SEND_CHAT  
チャットを送信します。`msg`に内容を入力してください。  
    ``` js
    // 設定例
    // 3時間ごとの再生モード順次切り替えの時にチャットを送る
    {
        "cron": "0 0 */3 * * *",
        "cmds": [
            {
                "cmd": "TOGGLE_PLAYMODE"
            },
            {
                "cmd": "SEND_CHAT",
                "msg": "再生モード切り替え！"
            }
        ]
    },
    ```
- ADD_QUEUE  
動画を先頭に追加します。`link`に動画のURLを入力してください。　　
    ``` js
    // 設定例
    // 毎日12時に決まった動画を上げる
    // （同時に上から再生モードにする必要がある）
    {
        "cron": "0 0 12 * * *",
        "cmds": [
            {
                "cmd": "ADD_QUEUE",
                "link": "https://********************"
            },
            {
                "cmd": "DEFAULT_PLAYMODE"
            }
        ]
    },
    ```

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
~~※ やり方は`Heroku 導入`とかでググって出てくるドキュメントの方が詳しいです。すまん。~~  

Herokuだと途中で止まる事に気付きました。というかHerokuはWebアプリじゃないと駄目だね。  
代替案考え中。

じゃあサーバー立てて無理矢理Webアプリにするか→一定時間アクセスがないとIdleモードにされてスケジュール実行が出来ない→じゃあ定期的にアクセスして無理矢理起こすか→無料プランだと1日のうち6時間スリープしなきゃダメ→実現しても使い勝手悪くなりそうだからAWSの無期限無料インスタンスに載せるのが早いかなあ。登録立ち上げまでが面倒なんだよね。→無期限無料にEC2ないじゃん。こりゃ駄目か。→というかクラウド借りる時点でハードル高すぎるか。出来る人は説明なくても出来るし、縁のない人は説明あっても訳分からないだろうし。一旦断念。

# ごめん
在宅勤務で暇だから片手間で作ったやつだからね。  
動かなかったらごめん。報告してくれたら直します。  
スレで教えてほしいけどあまりアクティブ率高くないんだごめん。
