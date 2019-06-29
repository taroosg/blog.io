---
title: web animations APIを使うための準備
date: 2018-12-15 00:00:00
description: '慣れた人には難しくないのだが馴染みがないとハマるのでメモ．基本的にはターミナルであれこれする感じ．'
image: "./images/setup-for-web-animation-api.jpg"
slug: setup-for-web-animation-api
---

## **0. 全体の流れ**
- homebrewのインストール
- node.jsのインストール
- npmのインストール(node.jsと一緒に入る)
- web animations APIのインストール

## **1. homebrewのインストール**

ターミナルで以下のコマンドを実行する．

```bash
$ ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"
```

参考：[homebrewのサイト](https://brew.sh/)

バージョンを確認して表示されればOK．

```bash
$ brew -v
Homebrew 1.7.6
```

一応アップデートしておくと良いかも．

```bash
$ brew update
```

## **2. node.jsのインストール**

web animations APIはnpm経由でインストールする．そのため，まずはnode.jsをインストールする必要がある．

node.jsをインストールするにはnodebrewをインストールする．

ターミナルで以下を実行する．以下のような感じになる．
```bash
$ curl -L git.io/nodebrew | perl - setup
========================================
Add path:

export PATH=$HOME/.nodebrew/current/bin:$PATH
========================================
```

次にパスを通す．上記のexport……の1行をコピーしておくと良い．

パスを通すには設定ファイル(?)に上記1行を追記する．下記のコマンドで設定ファイルを編集する．

```bash
$ vim ~/.bash_profile
```

zshの人は以下．
```bash
$ vim ~/.zshrc
```

ファイルを開いたら一番下とかに上記export……の1行を追記して保存して閉じる．下記コマンドで設定を適用する．zshの人は上に合わせてファイル名変えてね！

```bash
$ source ~/.bash_profile
```

nodebrewコマンドを実行していい感じになればOK．

```bash
$ nodebrew help
```

これでnode.jsのインストールする準備ができたので，いよいよnode.jsのインストールに進む．まずはインストールできるバージョンを確認する．

```bash
$ nodebrew ls-remote
```

たくさん出てくるので，適当なバージョンを選ぶ．奇数が開発版で偶数が安定版なので，とりあえず安定版の新し目のものを選ぶのが無難か．執筆時には10.11.0が最新だった．

下記コマンドでインストールする．

```bash
$ nodebrew install-binary v10.11.0
```

インストールできたら下記でバージョン確認．current: noneはインストールしたけど使う設定していないよ，の意．

```bash
$ nodebrew ls
v10.11.0
current: none
```

使用するバージョンを指定する．

```bash
$ nodebrew use v10.11.0
$ node -v
v10.11.0
```

これでnode.jsの準備は完了．

## **2. npmの準備**

web animations APIをインストールするにはnpmを使用する．npmはnode.jsインストール時に一緒にインストールされるため，基本的には特に作業を行う必要はない．

ここでは，インストールされていることを確認しておく．

```bash
$ npm -v
```

アップデートしておいても良いかも．

```bash
$ npm update -g npm
```

## **3. web animations APIのインストール**

npmを使用してweb animations APIをインストールする．
下記のコマンドを実行．

```bash
$ npm install web-animations-js
```

特にエラーとかでなければOK．
APIを使用するにはhtmlファイルからscriptタグで読み込めばOK．
```html
<script src="../node_modules/web-animations-js/web-animations-next.min.js"></script>
```

jsファイルの場所は`/Users/ユーザー名/node_modules`辺りになっていると思うので，いい感じにsrcのところを調整する．
あとは存分にscriptを書き殴って動かそう！

以上だ( `･ω･)b
