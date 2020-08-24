# kakapo-admin-bot-test
kakapo-admin-bot-testは生まれたばかりのcytubeボットです。
ドキュメント整備は後でやるよ！

# 出来る事
cytubeのチャンネルの管理者操作をある程度自動化できます。  
プレイリスト開放や再生モード切替を細かいレベルでスケジュールを組んで自動実行できます。  
ブラウザは不要です。ローカル実行の場合はNodeJSで立ち上げる必要があります。  
~~Herokuに載せれば完全自動です。~~  
完全自動はお手軽には無理でした。すまん。  
負荷は微々たるものなので、24時間動いてるPCで起動放置が楽かも（でもスリープ入っちゃうと動かないかも）。  
分かる人はAWSのEC2インスタンスとか借りてその上で実行してみて。

(2020/08/04追記)
自分で試してみた感じ、一番楽なのはIBMの`IBM Cloud Foundry`借りる。  
よわよわサーバーだけど無制限無料。  
負荷自体軽いから性能要らないし。  
ただ`index.js`をちょっと弄って`express`辺りでサーバー立ち上げるようにしておかないと上手く上がってくれないっぽい。
あと導入手引きはちょっと書けないかな…。多いから…。

# 更新履歴
- V1.0.18 20/08/24 10:00
  - ライブラリからの追加機能のフィルターにいいねでのフィルターを追加。最小いいね～最大いいねの範囲指定。-1で無効。デフォは両方無効。
- V1.0.17 20/08/18 16:50
  - ライブラリからの追加機能のフィルターに時間でのフィルターを追加。最小秒～最大秒の範囲指定。デフォは0~600。
  - カスタム投票モードにカオス投票モード追加。余興のお遊び機能。
- V1.0.16 20/08/17 17:00
  - 早押し再生の3秒締め切りモードは中止。今の所は１票固定モードのみで。２票以上も設定は出来るけど正しく動くかは保証外。メッセージテンプレートも元に戻した。
  - 代わりにカスタム投票モード`CUSTOM_VOTE_PLAYMODE`を追加。締め切り秒数、最小選択肢、最大選択肢、状況表示を設定可能。高速投票も選択肢めっちゃ多い投票もどっちもいける。
- V1.0.15 20/08/16 07:45
  - 早押し再生モードの複数投票はちょっと一旦見直し。すまねえ。代わりに3秒締め切り投票モードにする。メッセージテンプレートも更新。度々すまねえ。
- v1.0.14 20/08/15 17:15
  - 早押し再生のバグ修正。
- v1.0.13 20/08/15 15:15
  - 早押し再生モードの締め切り票数を設定出来る様に。後バグ修正。メッセージテンプレートのパラメータも追加したので衝突に注意。
- v1.0.12 20/08/14 19:00
  - 早押し再生モードコマンド`QUICKPUSH_PLAYMODE`を追加（β版）。投票で候補を出して最初に選ばれたものを次に再生する。
- v1.0.11 20/08/13 17:00
  - `POLL_PLAYMODE`の投票結果で同率1位が複数あった場合、1位の中からランダムで選ぶように修正。（修正前は上優先）
- v1.0.10 20/08/13 09:00
  - `POLL_PLAYMODE`のバグ修正。`show`が機能してなかった。ついでにコマンド直接実行にも対応。
- v1.0.9 20/08/12 21:00
  - 投票アイテムを使って次の再生モードを決めるコマンド`POLL_PLAYMODE`を追加。
- v1.0.8 20/08/12 17:00  
  - メッセージ機能を強化。複数登録可能＆複数登録時にはランダム投稿。
    - `SEND_CHAT`コマンドでのメッセージを複数登録出来る様に。
    - `ADD_QUEUE_LIBRARY_TIME`及び`ADD_QUEUE_LIBRARY_COUNT`のメッセージをテンプレートファイル化。テンプレートファイル内のメッセージも複数登録化に。
- v1.0.7 20/08/03 15:30  
  - ライブラリからの追加機能にフィルタ―機能追加。タイトルまたはURLの部分一致でフィルター出来るように。
- v1.0.6 20/07/28 10:30  
  - ライブラリからの追加機能のバグ修正。デスマンがうまく追加出来てなかった。
- v1.0.5 20/07/27 11:50
  - ライブラリからランダムに n件 or n分 ぶんのプレイリストを作成するコマンドを追加。
  - タスク起動以外にもコマンドを直接実行できるように。
- v1.0.4 20/07/09 10:30
  - エラー時の挙動をちょっと修正。youtubeの追加制限エラーとかに気づきやすいように。
- v1.0.3 20/07/04 11:05
  - コマンド二つ追加。動画のランダム追加とAPIからの取得。
- v1.0.2 20/07/01 10:55
  - ログをもう少しちゃんと出すようにしました。機能追加はなし。
- v1.0.1 20/06/30 15時頃 
  - コマンドを追加しました。
- v1.0.0 20/06/29 17時頃
  - 多分動くと思うからリリースしようぜ。

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
フォーマットはjsonです。壊すと動かなくなるので注意してください。不安な人は初期状態のバックアップを取ってください。  
``` js
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
cytube側で短期間の連続ログインを弾いたりしているので、無茶なスケジュール（10秒ごととか）を組むと怒られます。  

設定例
```
*/5 * * * * * -> ５秒毎に実行
0 30 9 * * * -> 毎日９時半に実行
0 0 */3 * * * -> ３時 6時 9時 12時 15時 18時 21時 24時に実行
0 30 10,15 * * * -> 毎日10時半と15時半に実行
0 30 12-16 * * * -> 毎日12時半、13時半、14時半、15時半、16時半に実行
0 0 12 * * 1-5 -> 平日12時に実行
0 0 */2 * * 6-7 -> 土日だけ2時間おきに実行
0 0 9-23/2 * * * -> 9時から23時までの間、2時間おきに実行（9時、11時、13時...）
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
- POLL_PLAYMODE  
v1.0.9から追加。  
次の再生モードを投票で決めます。締め切りになった時点で反映されます。同率１位の場合は１位中からランダム(v1.0.11~)。  
`seconds`は締め切りまでの秒数です。  
`show`を`true`で設定すると、投票中の票数が見えます。  
投票タイトル等は`msgs-poll-playmode.json`がテンプレートです。（テンプレートの詳細は後述）
    ``` js
    // 設定例
    // 18:30,20:30,22:30に再生モード投票切り替え
    {
        "cron": "0 30 18-22/2 * * *",
        "cmds": [
            {
                "cmd": "POLL_PLAYMODE",
                "seconds": 300,
                "show": true
            }
        ]
    }
    ```
※注意点  
他に投票アイテムがある状態で実行すると、先の投票アイテムが強制的に終了されます。  
また、投票が終わるまでは待機状態になります。他のタスクと実行時間が被らない様に気を付けてください。

- QUICKPUSH_PLAYMODE  
v1.0.12から追加（β版）。  
次の曲を早押し投票で決めます。候補はプレイリストからランダムで選ばれます。  
`minutes`は早押しモードを実行する分数です。  
`min`は候補の最小数です。  
`max`は候補の最大数です。  
`min`と`max`に別の値を入れると、その範囲内でランダムな候補数になります。  
~~`vote`は締め切り票数です。トータルでこの数投票されると締め切られます。同率1位は1位間でランダム。デフォルトは1です。~~　　
~~上手く動作しないので一旦検討に戻す。代わりに`vote`を2以上に設定した場合は３秒締め切り投票モードに。~~　　
再度複数投票締め切りに戻す。申し訳ない。現状は１票モードのみが動作保証。
投票タイトル等は`msgs-quickpush-playmode.json`がテンプレートです。（テンプレートの詳細は後述）  
    ``` js
    // 設定例
    // 21時から1時間早押しモード。候補数は4-8。
    {
        "cron": "0 0 21 * * *",
        "cmds": [
            {
                "cmd": "QUICKPUSH_PLAYMODE",
                "minutes": 60,
                "min": 4,
                "max": 8,
                "vote": 1
            }
        ]
    }
    ```
※注意点  
他のコマンドと比べてやや特殊な挙動をします。バグがある可能性も。  
起動中は他のタスクと実行が被らないようにした方が良いです。  
または直接起動で使うか。  
後投票アイテムがいっぱい出来てちょっと鬱陶しいかも。  

- CUSTOM_VOTE_PLAYMODE  
v1.0.16から追加（β版）。  
カスタム投票モードで次の曲を決めます。  
`minutes`はカスタム投票モードを実行する分数です。  
`seconds`は投票の締め切り秒数です。  
`min`は候補の最小数です。  
`max`は候補の最大数です。最大５０。  
`min`と`max`に別の値を入れると、その範囲内でランダムな候補数になります。  
`show`を`true`で設定すると、投票中の票数が見えます。  
(v1.0.17)`chaos`を`true`で設定すると投票候補の曲名をグチャグチャにします。ほぼランダムみたいなものになります。刺激が欲しい時にどうぞ。  
投票タイトル等は`msgs-custom-vote-playmode.json`がテンプレートです。（テンプレートの詳細は後述）  
    ``` js
    // 設定例
    // 21時から1時間カスタム投票モード。60秒締め切り、候補数4-8、投票表示。
    {
        "cron": "0 0 21 * * *",
        "cmds": [
            {
                "cmd": "CUSTOM_VOTE_PLAYMODE",
                "minutes": 60,
                "seconds": 60,
                "min": 4,
                "max": 8,
                "show": true,
                "chaos": false
            }
        ]
    },
    // 21時から1時間カスタム投票モード。3秒締め切り、候補数2~4、投票非表示。
    {
        "cron": "0 0 21 * * *",
        "cmds": [
            {
                "cmd": "CUSTOM_VOTE_PLAYMODE",
                "minutes": 60,
                "seconds": 3,
                "min": 2,
                "max": 4,
                "show": false,
                "chaos": false
            }
        ]
    }
    // 21時から1時間カスタム投票モード。60秒締め切り、候補数50固定、投票非表示。
    {
        "cron": "0 0 21 * * *",
        "cmds": [
            {
                "cmd": "CUSTOM_VOTE_PLAYMODE",
                "minutes": 60,
                "seconds": 60,
                "min": 50,
                "max": 50,
                "show": false,
                "chaos": false
            }
        ]
    }
    
    ```
※注意点  
早押しモードと同じ注意点。  

- SEND_CHAT  
チャットを送信します。`msg`に内容を入力してください。  
v1.0.8からは`msg`を配列`[]`にすれば複数登録出来ます。その場合、登録されたメッセージのうち一つがランダムで投稿されます。
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
    // ランダムver
    // 3つのメッセージのうちどれか一つが投稿される
    {
        "cron": "0 0 */3 * * *",
        "cmds": [
            {
                "cmd": "TOGGLE_PLAYMODE"
            },
            {
                "cmd": "SEND_CHAT",
                "msg": [
                   "再生モード切り替え！",
                   "再生モード切り替え♪",
                   "再生モード切り替え☆"
                ]
            }
        ]
    },
    ```
- ADD_QUEUE  
動画を先頭に追加します。`link`に動画のURLを入力してください。  
注意：動画追加は先頭に追加されるので、一度のタスクで複数の動画を追加したい場合は、流したい順と逆の順で追加するようにして下さい。
    ``` js
    // 設定例
    // 毎日12時に決まった動画を上げる
    // （同時に上から再生モードにする必要がある）
    {
        "cron": "0 0 12 * * *",
        "cmds": [
            {
                "cmd": "DEFAULT_PLAYMODE"
            },
            {
                "cmd": "ADD_QUEUE",
                "link": "https://********************"
            }
        ]
    },
    ```
- ADD_QUEUE_RANDOM  
動画をランダムに追加します。`links`に好きな数の動画のURLをカンマ区切り入力してください。
どれか一つだけ追加されます。
    ``` js
    // 設定例
    // 毎日9時に占い（どれか一つの動画をランダムに追加）
    // （同時に上から再生モードにする必要がある）
    {
        "cron": "0 0 9 * * *",
        "cmds": [
            {
                "cmd": "DEFAULT_PLAYMODE"
            },
            {
                "cmd": "ADD_QUEUE_RANDOM",
                "links": [
                    "https://www.youtube.com/watch?v=DU6sYVEjb-M",
                    "https://www.youtube.com/watch?v=mS12vd-h8Bs",
                    "https://www.youtube.com/watch?v=CYe3ZNIEhKg",
                    "https://www.youtube.com/watch?v=uBgzd5G3Lm4",
                    "https://www.youtube.com/watch?v=wKnoh8nxOZ4",
                    "https://www.youtube.com/watch?v=Ziz3s7Cuh6s",
                    "https://www.youtube.com/watch?v=d8YwinUpR_Q"
                ]
            },
            {
                "cmd": "SEND_CHAT",
                "msg": "今日の運勢は…"
            }
        ]
    },
    ```
    
- ADD_QUEUE_API  
外部APIから動画のリンクを取得します。`url`に外部APIのURL、`prop`に取得されるJSONのURLが格納されているプロパティ名を指定して下さい。
    ``` js
    // 設定例
    // 毎日9時に天気予報を追加（注意：この外部APIは制作者が違うので管理できない）
    {
        "cron": "0 0 9 * * *",
        "cmds": [
            {
                "cmd": "DEFAULT_PLAYMODE"
            },
            {
                "cmd": "ADD_QUEUE_API",
                "url": "https://hatarake-youtube-api.herokuapp.com/tenki",
                "prop": "url"
            },
            {
                "cmd": "SEND_CHAT",
                "msg": "今日の天気予報です"
            }
        ]
    },
    ```
- ADD_QUEUE_LIBRARY_TIME  
ライブラリから指定した分ぶんのランダムな曲を重複なしでキューに追加します。  
追加は6秒間隔で行われます（負荷対策）。指定次第では結構時間がかかります。  
`announce`を`true`にすると追加状況をチャンネルに書きます。  
filter.jsonにフィルターを指定できます。マッチした曲は抽出対象になりません。詳しくは後述。
    ``` js
    // 設定例
    // 毎日24時に6時間分の曲を追加
    {
        "cron": "0 0 24 * * *",
        "cmds": [
            {
                "cmd": "DEFAULT_PLAYMODE"
            },
            {
                "cmd": "ADD_QUEUE_LIBRARY_TIME",
                "minutes": 360,
                "announce": true
            }
        ]
    },
    ```
    
- ADD_QUEUE_LIBRARY_COUNT  
ライブラリから指定した数のランダムな曲を重複なしでキューに追加します。  
追加は6秒間隔で行われます（負荷対策）。指定次第では結構時間がかかります。  
`announce`を`true`にすると追加状況をチャンネルに書きます。  
filter.jsonにフィルターを指定できます。マッチした曲は抽出対象になりません。詳しくは後述。
    ``` js
    // 設定例
    // 毎日9時に100件分の曲を追加
    {
        "cron": "0 0 9 * * *",
        "cmds": [
            {
                "cmd": "DEFAULT_PLAYMODE"
            },
            {
                "cmd": "ADD_QUEUE_LIBRARY_COUNT",
                "count": 100,
                "announce": true
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
また、実行後にスケジュールを変更した場合は一旦落として実行しなおしてください。

## 6.テストについて
スケジュールの動作テストをするときは適当にテストチャンネルを作って実行してみるといいと思います。  

## 7.更新
プログラムのVerが上がり、それを反映させたい場合は、ソースのルートで`git pull`を実行してください。
```
git pull
```
JSファイルとかを更新しているとそのまま着信出来ないので注意して下さい。    
着信後に`npm install`が必要な場合があります。更新履歴に書くようにします。  
訳分からなくなった時は最初の手順に戻ってやりなおして、`.env`と`schedule.json`だけコピーすれば良いと思います。

# ~~Heroku~~
~~に自動化したい場合はHerokuに載せればローカルで起動しなくて済みます。~~
1. ~~Herokuのアカウントとる。~~
2. ~~Heroku-CLI入れる。~~
3. ~~設定済みのこのプロジェクトをHerokuに上げる。~~  
~~※ やり方は`Heroku 導入`とかでググって出てくるドキュメントの方が詳しいです。すまん。~~  

Herokuだと途中で止まる事に気付きました。というかHerokuはWebアプリじゃないと駄目だね。  
代替案考え中。

じゃあサーバー立てて無理矢理Webアプリにするか→一定時間アクセスがないとIdleモードにされてスケジュール実行が出来ない→じゃあ定期的にアクセスして無理矢理起こすか→無料プランだと1日のうち6時間スリープしなきゃダメ→実現しても使い勝手悪くなりそうだからAWSの無期限無料インスタンスに載せるのが早いかなあ。登録立ち上げまでが面倒なんだよね。→無期限無料にEC2ないじゃん。こりゃ駄目か。→というかクラウド借りる時点でハードル高すぎるか。出来る人は説明なくても出来るし、縁のない人は説明あっても訳分からないだろうし。一旦断念。

# json知らないorあまり書いた事ない人へ
構造を表す事が出来る書き方だと思ってください。（jsを勉強したいと思っている人はそういう風に覚えない方が良いけど）  
便利なんですがウッカリミスで壊れるので注意して下さい。ウッカリポイントを上げておきます。  

- 括弧の閉じ忘れ  
開き括弧があったら必ず閉じ括弧があります。閉じ括弧を忘れると壊れます。  
例では開きと閉じが分かりやすいように括弧の中身を改行して字下げします。これをインデントと言います。  
  ``` js
  {
      "cron": "0 0 12 * * *",
      "cmds": [
          {
              "cmd": "ADD_QUEUE",
              "link": "https://********************"
          },
          {
              "cmd": "DEFAULT_PLAYMODE"
              // <- ここが閉じ忘れ
      ]
  }
  ```
- 括弧の対応違い  
使われる括弧は`{}`と`[]`の2種類です。`「」`はないんだよ`「」`。  
`{`で開かれたら必ず`}`で閉じられます。`[`は`]`です。対応を間違えないようにしましょう。  
間違えると壊れます。
  ``` js
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
      } // <- ここが対応違い
  }
  ```
- 括弧の間違い   
`{}`と`[]`は意味が異なります。どう異なるかはあまり説明しません。  
サンプルやデフォルト設定の通りにしましょう。`{}`で書かれている場所は`{}`。`[]`で書かれている場所は`[]`。  
間違えると壊れます。
  ``` js
  {
      "cron": "0 0 12 * * *",
      "cmds": [
          [ // <- {}で書かないといけない
              "cmd": "ADD_QUEUE",
              "link": "https://********************"
          ],
          [ // <- こっちも
              "cmd": "DEFAULT_PLAYMODE"
          ]
      } 
  }
  ```
- ダブルクォーテーションの囲い忘れ、閉じ忘れ  
文字列は`"`で囲む必要があります。サンプルやデフォルトを真似する感じでどうぞ。  
ものによっては囲まないものもあります。少ないですが。  
囲い忘れや閉じ忘れをすると壊れます。
  ``` js
  {
      "cron": 0 0 12 * * *, // <- 囲い忘れ
      "cmds": [
          {
              "cmd": "ADD_QUEUE"
              "link": "https://******************** // <- 閉じ忘れ
          },
          {
              "cmd": "SHUFFLE_PLAYMODE",
              "sameModeOK": true // <- これは囲まないのが正しい
          }
      } 
  }
  ```

- カンマの付け忘れ  
複数の要素を並べる時にはカンマで区切ります。  
タスクを追加した時、コマンド(cmd)を追加した時は`,`を付けるのを忘れないで下さい。  
忘れると壊れます。
  ``` js
  {
      "cron": "0 0 12 * * *",
      "cmds": [
          {
              "cmd": "ADD_QUEUE"
              "link": "https://********************"
          },
          {
              "cmd": "SHUFFLE_PLAYMODE",
              "sameModeOK": true
          } // <- カンマの付け忘れ
          {
              "cmd": "OPEN_PLAYLIST"
          }
      } 
  } // <- カンマの付け忘れ
  {
      "cron": "0 0 18 * * *",
      "cmds": [
          {
              "cmd": "LOCK_PLAYLIST"
          }
      } 
  }
  ```
- カンマの消し忘れ  
余分なカンマがあっても壊れます。一番最後の要素には`,`は要りません。  
よくあるのはタスクやコマンドをコピーして消し忘れる事です。
  ``` js
  [
    {
        "cron": "0 0 12 * * *",
        "cmds": [
            {
                "cmd": "ADD_QUEUE"
                "link": "https://********************"
            },
            {
                "cmd": "SHUFFLE_PLAYMODE",
                "sameModeOK": true
            },
            {
                "cmd": "OPEN_PLAYLIST"
            }, // <- カンマの消し忘れ
        } 
    }, 
    {
        "cron": "0 0 18 * * *",
        "cmds": [
            {
                "cmd": "LOCK_PLAYLIST"
            }
        } 
    }, // <- カンマの消し忘れ
  ]
  ```
壊れた場合、実行時にエラーログが出ると思います。  
ログにはどこが悪いのか書かれているので、読めそうだったら頑張って読んでみよう。  
行と列の位置も出てると思います。

# 設定チュートリアル
schedule.jsの設定チュートリアルです。  
デフォルト設定をクリアした状態で１から設定する方法を追っていきます。

## 1. 初期状態
一番外側の括弧は`[]`になります。
``` js
[]
```

## 2. タスクを追加
`[]`の中に`{}`を追加します。
``` js
[
    {
    }
]
```

## 3. スケジュールを設定
`{}`に`cron`属性を設定します。  
毎日９時に起動するようにします。  
コマンドを追加出来る様に`cmds`も追加しておきます。
``` js
[
    {
        "cron": "0 0 9 * * *",
        "cmds": [

        ]
    }
]
```

## 4. コマンドを追加
毎日９時に動画を追加します。
``` js
[
    {
        "cron": "0 0 9 * * *",
        "cmds": [
          {
              "cmd": "ADD_QUEUE",
              "link": "https://*********"
          }
        ]
    }
]
```
更にランダム再生の動画（カカポ占い）を追加します。  
プレイリストの先頭に追加されるので、再生順はランダム再生の方が先になります。  
``` js
[
    {
        "cron": "0 0 9 * * *",
        "cmds": [
            {
                "cmd": "ADD_QUEUE",
                "link": "https://*********"
            },
            {
                "cmd": "ADD_QUEUE_RANDOM",
                "links": [
                    "https://www.youtube.com/watch?v=DU6sYVEjb-M",
                    "https://www.youtube.com/watch?v=mS12vd-h8Bs",
                    "https://www.youtube.com/watch?v=CYe3ZNIEhKg",
                    "https://www.youtube.com/watch?v=uBgzd5G3Lm4",
                    "https://www.youtube.com/watch?v=wKnoh8nxOZ4",
                    "https://www.youtube.com/watch?v=Ziz3s7Cuh6s",
                    "https://www.youtube.com/watch?v=d8YwinUpR_Q"
                ]
            }
        ]
    }
]
```
更にAPI取得の動画（天気予報）を追加します。
``` js
[
    {
        "cron": "0 0 9 * * *",
        "cmds": [
            {
                "cmd": "ADD_QUEUE",
                "link": "https://*********"
            },
            {
                "cmd": "ADD_QUEUE_RANDOM",
                "links": [
                    "https://www.youtube.com/watch?v=DU6sYVEjb-M",
                    "https://www.youtube.com/watch?v=mS12vd-h8Bs",
                    "https://www.youtube.com/watch?v=CYe3ZNIEhKg",
                    "https://www.youtube.com/watch?v=uBgzd5G3Lm4",
                    "https://www.youtube.com/watch?v=wKnoh8nxOZ4",
                    "https://www.youtube.com/watch?v=Ziz3s7Cuh6s",
                    "https://www.youtube.com/watch?v=d8YwinUpR_Q"
                ]
            },
            {
                "cmd": "ADD_QUEUE_API",
                "url": "https://hatarake-youtube-api.herokuapp.com/tenki",
                "prop": "url"
            }
        ]
    }
]
```
更にチャット送信を追加します。
``` js
[
    {
        "cron": "0 0 9 * * *",
        "cmds": [
            {
                "cmd": "ADD_QUEUE",
                "link": "https://*********"
            },
            {
                "cmd": "ADD_QUEUE_RANDOM",
                "links": [
                    "https://www.youtube.com/watch?v=DU6sYVEjb-M",
                    "https://www.youtube.com/watch?v=mS12vd-h8Bs",
                    "https://www.youtube.com/watch?v=CYe3ZNIEhKg",
                    "https://www.youtube.com/watch?v=uBgzd5G3Lm4",
                    "https://www.youtube.com/watch?v=wKnoh8nxOZ4",
                    "https://www.youtube.com/watch?v=Ziz3s7Cuh6s",
                    "https://www.youtube.com/watch?v=d8YwinUpR_Q"
                ]
            },
            {
                "cmd": "ADD_QUEUE_API",
                "url": "https://hatarake-youtube-api.herokuapp.com/tenki",
                "prop": "url"
            },
            {
                "cmd": "SEND_CHAT",
                "msg": "おはよう！今日も仕事だ！"
            }
        ]
    }
]
```
これで、毎日朝９時に、
1. APIから取得した動画を追加
1. ランダムで動画を追加
1. 決められた動画を追加
1. チャットを送信

するタスクが出来ます。  
更に１２時のタスクを追加します。
``` js
[
    {
        "cron": "0 0 9 * * *",
        "cmds": [
            {
                "cmd": "ADD_QUEUE",
                "link": "https://*********"
            },
            {
                "cmd": "ADD_QUEUE_RANDOM",
                "links": [
                    "https://www.youtube.com/watch?v=DU6sYVEjb-M",
                    "https://www.youtube.com/watch?v=mS12vd-h8Bs",
                    "https://www.youtube.com/watch?v=CYe3ZNIEhKg",
                    "https://www.youtube.com/watch?v=uBgzd5G3Lm4",
                    "https://www.youtube.com/watch?v=wKnoh8nxOZ4",
                    "https://www.youtube.com/watch?v=Ziz3s7Cuh6s",
                    "https://www.youtube.com/watch?v=d8YwinUpR_Q"
                ]
            },
            {
                "cmd": "ADD_QUEUE_API",
                "url": "https://hatarake-youtube-api.herokuapp.com/tenki",
                "prop": "url"
            },
            {
                "cmd": "SEND_CHAT",
                "msg": "おはよう！今日も仕事だ！"
            }
        ]
    },
    {
        "cron": "0 0 12 * * *",
        "cmds": [
            "cmd": "SEND_CHAT",
            "msg": "お昼です！"
        ]
    }
]
```
こんな感じでタスクやコマンドを追加していくのが基本的な使い方です。

# 直接実行
v1.0.5からは直接実行機能を付けました。  
ソースのルートディレクトリでプロンプトから以下のように呼び出してください。
```
node call {コマンド} {コマンドごとの引数}
```
※ `npm`じゃなく`node`なので注意

## コマンド
基本的にschedule.jsonで指定するものと同じです。  
一部のコマンドは直接実行対象外です。
以下はコマンド実行例。

- SEND_CHAT  
  テストと送信。
  ```
  node call SEND_CHAT "テスト"
  ```
  
- ADD_QUEUE  
  動画を追加
  ```
  node call ADD_QUEUE 動画のURL
  ```

- ADD_QUEUE_LIBRARY_TIME  
  ライブラリからランダムに120分ぶんの動画を追加。
  ※ 事前に上から再生モードにしておいた方がいい
  ```
  node call ADD_QUEUE_LIBRARY_TIME 120
  ```
  
- ADD_QUEUE_LIBRARY_COUNT  
  ライブラリからランダムに100件ぶんの動画を追加。
  ※ 事前に上から再生モードにしておいた方がいい
  ```
  node call ADD_QUEUE_LIBRARY_COUNT 100 
  ```

- POLL_PLAYMODE  
  投票で再生モードを決定。
  一つ目の引数は締め切り秒数。二つ目は投票状態を表示するか。
  ```
  node call POLL_PLAYMODE 300 true
  ```
  
- QUICKPUSH_PLAYMODE  
  早押し再生モードを実行。
  一つ目の引数は実行分数。二つ目は最小候補数。三つ目は最大候補数。四つ目は締め切り票数。
  ```
  node call QUICKPUSH_PLAYMODE 60 4 8 1
  ```
  
- CUSTOM_VOTE_PLAYMODE  
  カスタム投票再生モードを実行。
  一つ目の引数は実行分数。二つ目は投票締め切り秒数。三つ目は最小候補数。四つ目は最大候補数。五つ目は投票状態を表示するか。
  ```
  node call CUSTOM_VOTE_PLAYMODE 60 60 4 8 true
  ```
  
- OPEN_PLAYLIST  
- LOCK_PLAYLIST
- DEFAULT_PLAYMODE
- RANDOM_PLAYMODE
- VOTE_PLAYMODE
- TOGGLE_PLAYMODE
- SHUFFLE_PLAYMODE  
  全部まとめて引数なし。
  ```
  node call OPEN_PLAYLIST
  ```

# フィルター機能
v1.0.7からライブラリーからのランダム抽出にフィルター機能を付けました。  
同梱されている`filter.json`を編集する事で、特定の文字を含むタイトルか特定のURLを抽出対象から除外する事が出来ます。  

設定例
```
{
    "titles": [
        "お天気キャスター解説",
        "ラッキーカカポ占い"
    ],
    "urls": [
        "http://www.nicovideo.jp/watch/nm", <- 再生できない奴
        "https://youtube.com/watch?v=weLA22wlSq4" <- ビックリ系の曲
    ],
    "minSeconds": 0,
    "maxSeconds": 600,
    "minIine": -1,
    "maxIine": -1
} 
```

`titles`はタイトル部分一致指定です。  
動画タイトルに設定した文字が**含まれていたら**除外対象となります。  
先頭でも末尾でも真ん中でも除外されます。大文字小文字も無視されます。

`urls`はURL部分一致指定です。  
同じく動画URLに設定した文字が**含まれていたら**除外対象となります。  

`minSeconds`は動画の長さの最小です。これより短い動画は除外対象となります。`-1`を設定すると無効になります。  

`maxSeconds`は動画の長さの最大です。これより長い動画は除外対象となります。`-1`を設定すると無効になります。  

`minIIne`は動画のいいね数の最小です。これより少ない動画は除外対象となります。`-1`を設定すると無効になります。  

`maxIIne`は動画のいいね数の最大です。これより多い動画は除外対象となります。`-1`を設定すると無効になります。  

# メッセージテンプレート
v1.0.8からは一部コマンドのメッセージをテンプレートファイル化しました。  
テンプレートファイルを修正する事で投稿されるメッセージを変更できます。  
  
## 記述例  
- `,`区切りで複数登録出来ます。複数登録した場合はランダムでどれか一つが選ばれます。
- `${...}`はパラメータ埋め込みです。埋め込めるパラメータはメッセージごとに異なります。
``` js
{
    "START": [
        "${kensu} 件（約${fun}分）追加！ 予定実行時間 ${yoteiFun}分！"
    ],
    "INTERVAL": [
        "後 ${nokori} 件...",
        "後 ${nokori} 件＞＜;",
        "後 ${nokori} 件！！"
    ],
    "END": [
        "追加完了☆",
        "追加完了♬",
        "追加完了＞＜"
    ]
}
```

## テンプレートファイル

### `msgs-add-library.json`  
`ADD_QUEUE_LIBRARY_TIME`及び`ADD_QUEUE_LIBRARY_COUNT`のメッセージテンプレート。  
記述例
``` js
{
    "START": [
        "${kensu} 件（約${fun}分）追加！ 予定実行時間 ${yoteiFun}分！"
    ],
    "INTERVAL": [
        "後 ${nokori} 件...",
        "後 ${nokori} 件＞＜;",
        "後 ${nokori} 件！！"
    ],
    "END": [
        "追加完了☆",
        "追加完了♬",
        "追加完了＞＜"
    ]
}
```

- START  
  処理開始時のメッセージです。  
  - `${kensu}`  
    追加される件数です。  
  - `${fun}`  
    追加される動画の合計分数です。  
  - `${yoteiFun}`  
    予定実行時間です。  
- INTERVAL  
  10件間隔で差し込まれる、残り件数のメッセージです。  
  - `${nokori}`  
    残り件数です。
- END  
  処理終了時のメッセージです。パラメータはありません。
  

### `msgs-poll-playmode.json`  
`POLL_PLAYMODE`のメッセージテンプレート。  
記述例
``` js
{
    "TITLE": [
        "次の再生モードを決めるよ！${fun}分で締め切り！"
    ],
    "DEFAULT_PLAYMODE": [
        "上から！"
    ],
    "RANDOM_PLAYMODE": [
        "ランダム！"
    ],
    "VOTE_PLAYMODE": [
        "投票！"
    ],
    "SHUFFLE_PLAYMODE": [
        "お任せ！"
    ],
    "END": [
        "${playmode}再生モードに切り替え☆"
    ]
}
```

- TITLE  
  投票に表示されるタイトルです。  
  - `${fun}`  
    締め切り時間を分で表示します。切り上げ。  
- DEFAULT_PLAYMODE  
  上から再生モードの選択肢です。  
- RANDOM_PLAYMODE  
  ランダム再生モードの選択肢です。  
- VOTE_PLAYMODE  
  投票再生モードの選択肢です。  
- SHUFFLE_PLAYMODE  
  再生モードシャッフルの選択肢です。  
- END  
  処理終了時のメッセージです。  
  - `${playmode}`  
    投票で決まった再生モードです。  
    
### `msgs-quickpush-playmode.json`  
`QUICKPUSH_PLAYMODE`のメッセージテンプレート。  
記述例
``` js
{
    "START": [
        "${endDate}頃まで早押し再生モード！"
    ],
    "POLL_TITLE": [
        "次に再生する曲を早押し！先着${vote}票！"
    ],
    "COUNTDOWN_START": [
        "早押しいくよー"
    ],
    "WINNER": [
        "${title} に決定！"
    ],
    "END": [
        "早押し再生モード終了＞＜"
    ]
}
```

- START  
  開始時に送信されるチャットです。  
  - `${endDate}`  
    予定終了時刻です。  
- POLL_TITLE  
  投票のタイトルです。  
- COUNTDOWN_START  
  投票カウントダウンの前口上です。  
- WINNER  
  投票決定時に送信されるチャットです。  
  - `${title}`  
    曲のタイトルです。  
- END  
  終了時のメッセージです。  
  
### `msgs-quickpush-playmode.json`  
`QUICKPUSH_PLAYMODE`のメッセージテンプレート。  
記述例
``` js
{
    "START": [
        "${endDate}頃までカスタム投票再生モード！${seconds}秒締め切り！${min}～${max}択！投票状況${show}！"
    ],
    "POLL_TITLE": [
        "次に再生する曲を選んでね！${seconds}秒で締め切り！"
    ],
    "WINNER": [
        "${title} に決定！"
    ],
    "END": [
        "カスタム投票再生モード終了＞＜"
    ]
}
```

- START  
  開始時に送信されるチャットです。  
  - `${endDate}`  
    予定終了時刻です。  
  - `${seconds}`  
    締め切り秒数です。
  - `${min}`  
    最小選択肢数です。
  - `${min}`  
    最小選択肢数です。
  - `${show}`  
    投票状況の表示です。
- POLL_TITLE  
  投票のタイトルです。  
- WINNER  
  投票決定時に送信されるチャットです。  
  - `${title}`  
    曲のタイトルです。  
- END  
  終了時のメッセージです。  

# ごめん
在宅勤務で暇だから片手間で作ったやつだからね。  
動かなかったらごめん。報告してくれたら直します。  
スレで教えてほしいけどあまりアクティブ率高くないんだごめん。
