---
title: バレたらまずそうなfirebaseのAPIキーをどう扱うか．
date: 2020-01-13
published: true
tags: ['firebase','git']
series: false
canonical_url: false
description: "firebaseのAPIキーはバレたらまずそう．しかし，クライアントアプリケーション実装のためには記述する必要があるし，githubで管理する場合にはキーを見られてしまいそうである．どうすればよいのか．．．"
slug: handling-of-firebase-api-key
---

作成日：2020/01/13

## 状況

APIキーがバレると勝手に使われて破産するのでなんとかする必要がある．

## gitの扱い

githubでキーを記述したファイルを見られないように設定する．間違ってAPIキーをgithubにあげてしまった場合の対応を記載する．

「.gitignore」ファイルを使用することで指定したファイルorフォルダをgitの管理外にすることができる．

- ルートディレクトリに「.gitignore」ファイルを作成してgit管理したくないファイル名（orフォルダ名）を追加
- 【例】firebaseディレクトリのindex.jsを.gitignoreに記述
```
// .gitignoreに以下を追記
firebase/index.js
// firebaseフォルダの中全てを指定したい場合は以下
firebase/
```

- その後，下記コマンドを順番に実行

```
// git addしたことなければやらなくてOK（追跡対象リストから削除するコマンド）
$ git rm --cached ファイル名

// あとはいつもどおりcoommitしてpushすればOK
$ git add .
$ git commit -m"hogehoge"
$ git push origin master
```

- 【例】firebaseディレクトリのindex.jsをgit管理から外したい
```
$ git rm --cached firebase/index.js
```

フォルダごと指定したい場合は上の1行目を下記に変更．
```
$ git rm -r --cached ディレクトリ名
// 以降のコマンドは同様
```

- 【例】firebaseディレクトリの中身全部をgit管理から外したい
```
$ git rm -r --cached firebase
```

【注意】--cachedをつけないとファイル自体も削除される．


## デプロイ時の扱い

検証ツールでキーを抜かれても，他のアプリケーションで使用できないように設定する．APIキーは対策してもいずれバレるので，バレても自分のアプリケーション以外で使用できない状態にしておけばOK．

- https://console.cloud.google.com/にアクセス
- プロジェクトを選択
- APIとサービス -> 認証情報
- APIキーの編集ボタン
- アプリケーションの制限  -> HTTPリファラー
- ウェブサイトの制限 -> デプロイ先のURLを追加（記載したURLでしかAPIキーが動作しないようにする）
- 「保存」クリック

## まとめ

バレるのは以下2つの条件なので対策すればOK！

- githubにAPIキーを載せない．
- バレても他の条件は無効な状態にしておく．

good luck ( `･ω･)b

