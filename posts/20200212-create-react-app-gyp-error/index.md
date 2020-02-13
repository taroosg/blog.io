---
path: '/create-react-app-gyp-error'
date: '2020-02-12'
title: 'create-react-app hogehogeしたらgyp ERR!'
description: 'create-react-appでプロダクトつくろうとしたらgyp ERR!出されまくって怒られた．Xcodeのcommand line toolがおかしかったようなので直した．'
tags: ['react','git']
published: true
---


作成日：2020/02/12

突然ハマったので記録．

## 環境

macOS Catalina 10.15.3

```bash
$ node -v
v12.15.0
$ npm -v
6.13.7
```

## Reactのプロジェクトをつくるぞ！

```bash
$ npx create-react-app hogehoge
```

## 大量のエラー！！

```bash
...
gyp: No Xcode or CLT version detected!
gyp ERR! configure error
gyp ERR! stack Error: `gyp` failed with exit code: 1
...
```

（一応プロジェクト自体はできており，開発サーバも起動する状態）

## 原因

- XcodeのCommand Line Toolがおかしい．
- バージョンがおかしいのかどうかはわからないがとにかくなにかがおかしい．
- 多分macOS10.15.3にアップデートしてからおかしくなった．

## 対応策

Command Line Toolを一度アンインストールして再度インストールし直す．

### 手順

- インストール場所の確認
```bash
$ xcode-select -print-path
/Library/Developer/CommandLineTools
```

- 一式を削除
```bash
$ sudo rm -rf /Library/Developer/CommandLineTools
```

- 再度インストール
  - 上記コマンド実行時にインストールを促すウインドウが表示されるのでインストール．
  - 表示されない場合は下記コマンドを実行して手動でインストールする．
```bash
$ xcode-select --install
```

## 結果
再度Reactのプロジェクトを作成するとエラー発生せずうまくいった！

```bash
$ npx create-react-app hogehoge
...
Happy hacking!
```

Good Luck ( `･ω･)b


