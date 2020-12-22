---
path: "/cloud-functions-express"
date: "2020-02-18"
title: "Cloud Functions + ExpressでサーバレスAPIを実装"
description: "Cloud Functionsでサーバの処理を実装したいが，そのままでは扱いにくいのでExpressを導入して実装してみた．"
tags: ["node.js", "firebase"]
published: true
---

作成日：2020/02/16

## 今回の趣旨

- Cloud Functions 上で Google books API から情報を取得する．
- クライアントから送信されてきたキーワードを受け取り，API に投げる．
- API から返ってきたデータをクライアントに送信する．
- Cloud Functions を利用することでサーバを用意することなく API を実装！

## 環境構築

### Firebase のプロジェクト作成

- Firebase のコンソールにログインし，新規プロジェクトを作成する．
- プロジェクト名は任意．
- DB などは特に設定しなくて OK．

### 必要なツールのバージョン確認

- Node.js と npm が必要なので，以下のコマンドで状況を確認する．
- バージョンが表示されれば OK．

```bash
$ node -v
v12.15.0
$ npm -v
6.13.7
```

### Fiirebase を扱うツールのインストール

- firebase 関連のコマンドを実行するため，下記のコマンドでインストールする．

```bash
$ npm install -g firebase-tools
```

### 雛形の作成

- 適当な場所にディレクトリを作成し，ターミナルで移動して必要なファイルを準備する．
- 今回は例としてデスクトップに`20200215cloudfunctions`ディレクトリを作成する．
- 下記コマンドを順番に実行．

```bash
$ cd ~/Desktop
$ mkdir 20200215cloudfunctions
$ cd 20200215cloudfunctions
$ firebase init
```

- 選択肢が出るので，十字キーで`Functions`を選択してスペースキーでチェックを入れる（下図参照）．
- チェックを入れたら Enter．

```bash
? Which Firebase CLI features do you want to set up for this folder? Press Space
 to select features, then Enter to confirm your choices.
 ◯ Database: Deploy Firebase Realtime Database Rules
 ◯ Firestore: Deploy rules and create indexes for Firestore
❯◉ Functions: Configure and deploy Cloud Functions
 ◯ Hosting: Configure and deploy Firebase Hosting sites
 ◯ Storage: Deploy Cloud Storage security rules
 ◯ Emulators: Set up local emulators for Firebase features
```

- 続いて，以下の選択肢が表示される．
- `Use an existing project`を選択して Enter．

```bash
? Please select an option: (Use arrow keys)
❯ Use an existing project
  Create a new project
  Add Firebase to an existing Google Cloud Platform project
  Don't set up a default project
```

- プロジェクトの選択肢が出るので，上で作成したプロジェクトを選択して Enter．

```bash
? Select a default Firebase project for this directory:
  hoge-c83e4 (hoge)
  hoge-791f2 (hogehoge)
  fuga-813c6 (fuga)
❯ functions-69daf (20200215-functions)
  hoge-216007 (hogefuga)
  piyo (piyo)
  hogefuga (hoge-fuga)
```

- 選択肢が出るので，`Javascript`を選択して Enter．

```bash
? What language would you like to use to write Cloud Functions? (Use arrow keys)

❯ JavaScript
  TypeScript
```

- 以降は下のような感じ．

```bash
? Do you want to use ESLint to catch probable bugs and enforce style? No
✔  Wrote functions/package.json
✔  Wrote functions/index.js
✔  Wrote functions/.gitignore
? Do you want to install dependencies with npm now? Yes
...
i  Writing configuration info to firebase.json...
i  Writing project information to .firebaserc...
i  Writing gitignore file to .gitignore...

✔  Firebase initialization complete!
```

これで準備完了！

## 初回デプロイ&動作確認

### ファイルの内容確認&解説

- 必要なファイルが準備されているので，エディタでプロジェクトのフォルダを開く．
- `functions/index.js`を開くと下記のような内容が記述されている．
- 1 行目はモジュールの読み込み．
- `helloWorld`は関数名．この関数にリクエストが来ると，`Hello from Firebase!`という文字列を返すよう記述されている．

```js
// functions/index.js
const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
```

### 編集&デプロイ

- 下記のように編集する（コメントアウト外すだけ）．

```js
// functions/index.js
const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});
```

- 保存したらデプロイする．
- ターミナルで下記を実行．

```bash
$ firebase deploy
```

- 実行結果

```bash
=== Deploying to 'fir-todo-8868b'...
i  deploying functions
i  functions: ensuring necessary APIs are enabled...
✔  functions: all necessary APIs are enabled
i  functions: preparing functions directory for uploading...
i  functions: packaged functions (26.53 KB) for uploading
✔  functions: functions folder uploaded successfully
i  functions: creating Node.js 8 function helloWorld(us-central1)...
✔  functions[helloWorld(us-central1)]: Successful create operation.
Function URL (helloWorld): https://hogehoge.cloudfunctions.net/helloWorld
✔  Deploy complete!
Project Console: https://console.firebase.google.com/project/fir-todo-8868b/overview
```

### 動作確認

- ターミナルからリクエストを送る．
- メッセージが返ってくれば OK！

```bash
$ curl https://hogehoge.cloudfunctions.net/helloWorld
Hello from Firebase!
```

## `Express`の導入

- Express は Node.js のフレームワーク．
- API のエンドポイントを手軽に実装できるので便利．
- 下記コマンドを実行してインストールする．
- （`functions`フォルダに移動しておく）

```bash
$ cd functions
$ npm install express
```

- インストールが終わったら index.js を編集する．
- `app.get()`で API エンドポイントを定義．
- `/hello`がエンドポイントの URL．

```js
// index.js
const functions = require("firebase-functions");
// Expressの読み込み
const express = require("express");

const app = express();

app.get("/hello", (req, res) => {
  // レスポンスの設定
  res.send("Hello Express!");
});

// 出力
const api = functions.https.onRequest(app);
module.exports = { api };
```

- 保存したらデプロイ．
- `helloworld`関数を削除していいかどうか訊かれたら yes で OK．

```bash
$ firebase deploy
? Would you like to proceed with deletion? Selecting no will continue the rest o
f the deployments. Yes
i  functions: deleting function helloWorld(us-central1)...
✔  functions[helloWorld(us-central1)]: Successful delete operation.
✔  functions[api(us-central1)]: Successful create operation.
Function URL (api): https://hogehoge.cloudfunctions.net/api

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/fir-todo-8868b/overview
```

- デプロイが完了しいたらリクエストしてみる．

```bash
$ curl https://hogehoge.cloudfunctions.net/api/hello
Hello Express!
```

これで動作 OK！

## `Express`での値の受け取り

### URL のパラメータ取得

- `/user/:userId`のように記述すると，値を受け取ることができる．
- 例えば，以下のようにリクエストを送信すると，Express では`2`の文字列を取得することができる．

```bash
https://hogehoge.cloudfunctions.net/api/user/2
```

- Express 内では`req.params.userId`のように取得する．
- `index.js`を以下のように編集する．

```js
const functions = require("firebase-functions");
const express = require("express");

const app = express();

app.get("/hello", (req, res) => {
  res.send("Hello Express!");
});

// エンドポイントを追加
app.get("/user/:userId", (req, res) => {
  const users = [
    { id: 1, name: "りゅうおう" },
    { id: 2, name: "ハーゴン" },
    { id: 3, name: "バラモス" },
    { id: 4, name: "ゾーマ" },
    { id: 5, name: "ピサロ" },
  ];
  // req.params.userIdでURLの後ろにつけた値をとれる．
  const targetUser = users.find(
    (user) => user.id === Number(req.params.userId)
  );
  res.send(targetUser);
});

const api = functions.https.onRequest(app);
module.exports = { api };
```

- 保存したらデプロイ

```bash
$ firebase deploy
```

- デプロイしたらリクエスト送信

```bash
$ curl https://hogehoge.cloudfunctions.net/api/user/2
{"id":2,"name":"ハーゴン"}
$ curl https://hogehoge.cloudfunctions.net/api/user/5
{"id":5,"name":"ピサロ"}
```

レスポンスが返ってくれば動作 OK．

## Google books API への http リクエスト

- リクエスト受信時に値を取得できたので，取得した値を用いて Node.js から外部の API にリクエストを送る．
- 例によって Google books API を利用する．
- Node.js から API へリクエストを送信することで，クライアントアプリケーションの処理を単純にすることができる．
- web アプリでもネイティブアプリでも，Node.js のエンドポイントにリクエストを送信するだけで良い．

### 必要なモジュールのインストール

- Node.js の標準機能でも http リクエストを行えるが，記述が煩雑になるので`request`モジュールを利用する．
- ついでに Promise を扱える`request-promise-native`もインストールする．
- 下記コマンドでインストール．

```bash
$ cd functions
$ npm install request
$ npm install request-promise-native
```

### リクエスト送信処理の追加

- Google books API へのリクエスト関数を定義．
- エンドポイントを追加し，関数を実行．
- API からのレスポンスをクライアントへ送信する．
- `index.js`を下記のように編集．

```js
// index.js
const functions = require("firebase-functions");
const express = require("express");
const requestPromise = require("request-promise-native"); // 追加

const app = express();

// APIにリクエストを送る関数を定義
const getDataFromApi = async (keyword) => {
  // cloud functionsから実行する場合には地域の設定が必要になるため，`country=JP`を追加している
  const requestUrl =
    "https://www.googleapis.com/books/v1/volumes?country=JP&q=intitle:";
  const result = await requestPromise(`${requestUrl}${keyword}`);
  return result;
};

app.get("/hello", (req, res) => {
  res.send("Hello Express!");
});

app.get("/user/:userId", (req, res) => {
  // 省略
});

// エンドポイント追加
app.get("/gbooks/:keyword", (req, res) => {
  // APIリクエストの関数を実行
  getDataFromApi(req.params.keyword).then((response) => res.send(response));
});

const api = functions.https.onRequest(app);
module.exports = { api };
```

### 動作確認

- 保存したらデプロイ

```bash
$ firebase deploy
```

- ターミナルからリクエストを送る．
- なんかいろいろかえってくれば OK！

```bash
$ curl https://hogehoge.cloudfunctions.net/api/gbooks/react
```

## CORS 対策

- ターミナルから`curl`コマンドでリクエストを送信すると正常に動作するが，クライアントアプリから`axios`などでリクエストを送信すると CORS エラーが発生する．
- アプリケーションからも利用できるように，追加のモジュールをインストールする．

```bash
$ cd functions
$ npm install cors
```

### ファイル内全ての API について CORS を許可したい場合

- 全部外部からのリクエストを許可する場合には下記のように追記すれば OK．

```js
// index.js
const functions = require("firebase-functions");
const express = require("express");
const requestPromise = require("request-promise-native");
const cors = require("cors"); // 追加

const app = express();

app.use(cors()); // 追加

const getDataFromApi = async (keyword) => {
  // 省略
};

app.get("/hello", (req, res) => {
  // 省略
});

app.get("/user/:userId", (req, res) => {
  // 省略
});

app.get("/gbooks/:keyword", (req, res) => {
  // 省略
});

const api = functions.https.onRequest(app);
module.exports = { api };
```

### 個別の API について CORS を許可したい場合

- 全部許可せずに，指定したエンドポイントのみアクセスを許可したい場合．
- 許可したいエンドポイントだけに追記を行う．

```js
// index.js
const functions = require("firebase-functions");
const express = require("express");
const requestPromise = require("request-promise-native");
const cors = require("cors"); // 追加

const app = express();

// app.use(cors());  // 一旦コメントアウト

const getDataFromApi = async (keyword) => {
  // 省略
};

app.get("/hello", (req, res) => {
  // 省略
});

app.get("/user/:userId", (req, res) => {
  // 省略
});

// ここに`cors()`を追加
app.get("/gbooks/:keyword", cors(), (req, res) => {
  // 省略
});

const api = functions.https.onRequest(app);
module.exports = { api };
```

- クライアントアプリケーションからリクエストを送信してデータが返ってくれば OK．

今回はここまで( `･ω･)b
