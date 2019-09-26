---
title: firebaseで認証してログインユーザのデータのみを取得したいときのサンプル
date: 2019-09-26
published: true
tags: ['javascript', 'firebase']
series: false
canonical_url: false
description: "firebaseでログインしたユーザが登録したデータのみを取得して並び替えたかったが，デフォルトだとエラーになるのでインデックスを利用した．"
slug: firebase-auth-and-index
---

作成日：2019/09/26

今回はgoogle認証とgithub認証を実装する．

todoリストを作成し，ログインユーザが登録したデータだけを古い順に並び替えて取得する処理を実装しようとしたらちょっとハマった．

## firebaseの設定

[firebaseのコンソール](https://console.firebase.google.com)からプロジェクトを作成．webアプリを作成する手順を進めておく．


## 認証機能の実装

### - google認証の準備

1. コンソール画面から「Authentication」→「ログイン方法」に進み，「google」の項目で「有効にする」のトグルをオン．

2. 「プロジェクトのサポートメール」でメールアドレスを選択し，「保存」をクリック．これでgoogleログインの準備は完了．

### - github認証の準備

1. コンソール画面から「Authentication」→「ログイン方法」に進み，「github」の項目で「有効にする」のトグルをオン．画面は一旦このままにしておく．

2. [githubの開発者ページ](https://github.com/settings/developers)から「OAuth Apps」→「New OAuth App」と進む．

3. 必要事項を入力する．urlなどは適当でOK．「Authorization callback URL」の項目は1の画面の「設定を完了するには、この認証コールバック URL を GitHub アプリの設定に追加します。」の下に書かれているurlをコピペする．貼り付けたら「Register application」をクリック．

4. 「Client ID」と「Client Secret」が発行されるので，1の画面にそれぞれコピペして「保存」をクリック．

※googleとgithubで同じメールアドレスを使用している場合

1の画面の下の方「詳細設定」「1 つのメールアドレスにつき 1 つのアカウント」の「変更」をクリック．
「同一のメールアドレスを使用して複数のアカウントを作成できるようにします」を選択して「保存」をクリック．


### - gcpコンソールでの操作

認証するには認証を実行するアプリのurlを追加しておく必要がある．

[gcpコンソール画面](https://console.cloud.google.com)の左上のメニューから「APIとサービス」→「認証情報」→「OAuth 2.0 クライアント ID」の「Web client (auto created by Google Service)」をクリック．

「制限事項」の部分に開発環境のurl(http://localhost:5500など)を追加し，「保存」をクリック．


## データベースの準備

今回はcloud firestoreを使用する．コレクションの作成とテストデータの追加を実施する．「テストデータで開始」を選択．

コンソール画面から「database」を選択し，コレクションを作成する．コレクション名は「todo」とし，IDは自動ID，フィールド名は「task」「user」「created_at」の3つを作成しておく．中身は適当でOK．
「created_at」はtimestamp型で入れる．入力したら「保存」をクリック．


## - webアプリの実装

firebaseとの接続は済ませておく（APIキーの記述など）．
htmlは`button`と`input`などを記述しておく．

```html
<div>
  <button id="googleSignin">google</button>
  <button id="githubSignin">github</button>
</div>
<div>
  <button id="signout">signout</button>
</div>

<div id="todo">
  <input type="text" id="task">
  <button id="submit">submit</button>
  <ul id="output"></ul>
</div>

<script src="https://www.gstatic.com/firebasejs/7.0.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/7.0.0/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/7.0.0/firebase-firestore.js"></script>

<script>
  const firebaseConfig = {
    apiKey: "YORU_API_KEY",
    authDomain: "...",
    databaseURL: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
  };
  firebase.initializeApp(firebaseConfig);
  // dbの設定
  const todoDb = firebase.firestore().collection('todo');
</script>
```

### - ログインとログアウトの実装

[googleログイン](https://firebase.google.com/docs/auth/web/google-signin)と[githubログイン](https://firebase.google.com/docs/auth/web/github-auth)を参考に進める．

```javascript
// ログインプロバイダの指定
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const githubAuthProvider = new firebase.auth.GithubAuthProvider();

// ユーザ情報
let user = {};

// loginの関数
const signin = (provider) => {
  firebase.auth().signInWithPopup(provider).then(result => {
    user = result.user;
    console.log('You are logged in!');
    console.log(user);
    getTodo();
  }).catch(error => {
    console.log(error);
  });
}

// logoutの関数
const signout = () => {
  firebase.auth().signOut().then(() => {
    user = {};
    console.log('You are logged out!');
  }).catch(error => {
    console.log(error);
  });
}

```

### - データ追加処理の実装

[リファレンス](https://firebase.google.com/docs/firestore/quickstart?authuser=0#add_data)を参考に進める．

```javascript
// todo追加の関数
const addTodo = task => {
  todoDb.add({
    task: task,
    user: user.uid,
    created_at: firebase.firestore.FieldValue.serverTimestamp(),
  })
    .then(docRef => {
      console.log('Document written with ID: ', docRef.id);
    })
    .catch(error => {
      console.error('Error adding document: ', error);
    });
}
```

### - データ取得処理の実装

※ログイン・ログアウト処理の関数よりも上に記述する．
とりあえずリアルタイムに全件取得する．
[リファレンス](https://firebase.google.com/docs/firestore/query-data/listen)を参考に進める．
取得したデータを全件ブラウザに出力している．

```javascript
// todo取得の処理
const getTodo = () => {
  todoDb.onSnapshot(querySnapshot => {
    const firestoreData = [];
    querySnapshot.forEach(doc => {
      firestoreData.push({
        id: doc.id,
        data: doc.data()
      });
    });
    document.getElementById('output').innerHTML = firestoreData.map(x => `<li>${JSON.stringify(x)}</li>`);
  });
}
```

クリックイベントで関数を実行する処理を追加（末尾に追記）．

```javascript
document.getElementById('googleSignin').addEventListener('click', () => signin(googleAuthProvider));
document.getElementById('githubSignin').addEventListener('click', () => signin(githubAuthProvider));
document.getElementById('signout').addEventListener('click', () => user.uid ? signout() : false);
document.getElementById('submit').addEventListener('click', () => user.uid ? addTodo(document.getElementById('task').value) : false);
```

ここまでで動作確認をしておく．うまく動いていれば，ブラウザにデータの一覧が表示される．

## データの並び替えとフィルタリング

### - データの並び替え

古い順に表示したいので，orderbyを使用して順番を変更する．[リファレンス](https://firebase.google.com/docs/firestore/query-data/order-limit-data#order_and_limit_data)を参考にコードを修正する．

```javascript
// todo取得の処理
const getTodo = () => {
  todoDb.orderBy('created_at', 'asc').onSnapshot(querySnapshot => {
    const firestoreData = [];
    querySnapshot.forEach(doc => {
      firestoreData.push({
        id: doc.id,
        data: doc.data()
      });
    });
    document.getElementById('output').innerHTML = firestoreData.map(x => `<li>${JSON.stringify(x)}</li>`);
  });
}
```

### - データの絞り込み

ログインしているユーザが登録したデータだけを表示したいのでwhereを使用して絞り込みを行う．[リファレンス](https://firebase.google.com/docs/firestore/query-data/queries#simple_queries)を参考にコードを修正する．

ただし，このままだとエラーが発生する．これは`where`と`orderby`を別々のフィールドで実行できない仕様となっているため．[参考](https://firebase.google.com/docs/firestore/query-data/queries#compound_queries)

```javascript
// todo取得の処理
const getTodo = () => {
  todoDb.where('user', '==', user.uid).orderBy('created_at', 'asc').onSnapshot(querySnapshot => {
    const firestoreData = [];
    querySnapshot.forEach(doc => {
      firestoreData.push({
        id: doc.id,
        data: doc.data()
      });
    });
    document.getElementById('output').innerHTML = firestoreData.map(x => `<li>${JSON.stringify(x)}</li>`);
  });
}
```

## インデックスの作成

コンソール画面から「database」→「インデックス」→「複合」→「手動でインデックスを作成」に進む．

ダイアログが開くので，今回は「コレクションID」を「todo」，「フィールドのパス」には「user」「created_at」を入力．「クエリのスコープ」は「コレクション」を選択．入力したら「インデックスを作成」をクリックし，暫く待つ．

ステータスが「ビルド中」から「有効」になれば準備完了．再度アプリを実行すると正常にデータが取得できることが確認できる．

## まとめ

異なるフィールドで絞り込みや並び替えを行いたいときはインデックスを利用しよう！


