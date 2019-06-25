---
title: ubuntuでnodejsとnpmをインストールしたときのメモ
date: 2019-06-26 00:00:00
description: "開発するときたいていnodeが必要になるので一通りの流れをメモ"
slug: node-install-at ubuntu
---

作成日：2019/06/26

更新日：2019/06/26

実行OS：ubuntu 18.04 LTS

## **事前準備？**

ubuntuはとりあえず以下を実行しておこう．

updateは最新のパッケージを拾って来てくれる．

upgradeは拾ってきたパッケージで実際に更新する．
```bash
$ sudo apt-get update
$ sudo apt-get upgrade
```

## **手順**

### **nodejs, npmのインストール**

とりあえずインストールする．道中は全てyでOK．
```bash
$ sudo apt install nodejs npm
```

### **管理用パッケージ「n」の導入**

node関連のパッケージを管理する「n」を導入する．

以下のコマンドを実行．
```bash
$ sudo npm install n -g
```

### **nを使用したnode, npmのインストール**

以下のコマンドを実行．自動的のnode.jsの最新の安定版をインストールしてくれる．

npmも同時に入る．
```bash
$ sudo n stable
```

### **いらんnode.jsとnpmは削除**

以下のコマンドを実行．道中は全てyでOK．

`purge`を実行すると設定ファイルもろとも消し飛ばしてくれる．
```bash
$ sudo apt purge nodejs npm
```

シェルを再起動する．
```bash
$ exec $SHELL -l
```

### **バージョン確認**

多分うまくいってるのでnode.jsとnpmのバージョンを確認しておく．

いい感じにバージョンが表示されればOK！
```bash
$ node -v
$ npm -v
```

以上だ( `･ω･)
