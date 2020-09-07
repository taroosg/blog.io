---
path: "/nodejs-install-at-ubuntu"
date: "2020-09-07"
title: "ubuntuでnode.jsとnpmをインストールしたときのメモ"
description: "開発するときたいていnodeが必要になるので一通りの流れをメモ"
tags: ["node.js", "ubuntu"]
published: true
---

- 作成日：2019/06/26

- 更新日：2020/09/07

- 実行環境：ubuntu 20.04 LTS

node.js をインストールする方法はいくつか存在するが，最も簡単（だと勝手に考えている）nodebrew を用いた方法を紹介する．

今回は ubuntu 上で実行しているが，他 OS でも nodebrew は使用できる．その場合の nodebrew インストール方法は各自ググりましょう．

## 事前準備

ubuntu 上ではとりあえず以下を実行しておく．

`update`は最新のパッケージを拾って来てくれる．

`upgrade`は拾ってきたパッケージで実際に更新する．

```bash
$ sudo apt update
$ sudo apt upgrade
```

## 手順 1 パッケージの準備

まずは`curl`コマンドを用いて nodebrew のパッケージをダウンロードする．

```bash
$ curl -L git.io/nodebrew | perl - setup
```

`curl`がインストールされていない場合は以下のコマンドでインストールし，上記コマンドを再度実行する．

```bash
$ sudo apt update
$ sudo apt install curl
```

どうしても`curl`コマンドがうまく行かない場合は`wget`を用いて実行する．

```bash
$ wget git.io/nodebrew
$ perl nodebrew setup
```

## 手順 2 パスを通す

設定ファイル`.profile`にパスを記述する．`.bash_profile`や`.bashrc`を使用している場合はそちらでも OK．

以下のコマンドを実行し，設定ファイルを開く．

```bash
$ vi ~/.profile
```

開いたら最下行に以下を追記．

```txt
export PATH=$HOME/.nodebrew/current/bin:$PATH
```

保存して閉じたら以下のコマンドで設定を読み込む．

```bash
$ source ~/.profile
```

### nodebrew のインストール結果確認

以下のコマンドを実行するとバージョンとコマンドが表示される．

```bash
$ nodebrew
nodebrew 1.0.1

Usage:
    nodebrew help                         Show this message
    nodebrew install <version>            Download and install <version> (from binary)
    nodebrew compile <version>            Download and install <version> (from source)
    nodebrew install-binary <version>     Alias of `install` (For backward compatibility)
    nodebrew uninstall <version>          Uninstall <version>
    nodebrew use <version>                Use <version>
    nodebrew list                         List installed versions
    nodebrew ls                           Alias for `list`
    nodebrew ls-remote                    List remote versions
    nodebrew ls-all                       List remote and installed versions
    nodebrew alias <key> <value>          Set alias
    nodebrew unalias <key>                Remove alias
    nodebrew clean <version> | all        Remove source file
    nodebrew selfupdate                   Update nodebrew
    nodebrew migrate-package <version>    Install global NPM packages contained in <version> to current version
    nodebrew exec <version> -- <command>  Execute <command> using specified <version>

Example:
    # install
    nodebrew install v8.9.4

    # use a specific version number
    nodebrew use v8.9.4
```

## node.js のインストール

以下のコマンドでインストール可能な node.js のバージョンが表示される．

```bash
$ nodebrew ls-remote
```

とりあえず LTS の最新バージョンをインストールする．

（node.js は偶数バージョンが LTS）

```bash
$ nodebrew install v14.9.0
Fetching: https://nodejs.org/dist/v14.9.0/node-v14.9.0-linux-x64.tar.gz
######################################################################### 100.0%
Installed successfully
```

インストールしたら使用するバージョンを指定する．

```bash
$ nodebrew use v14.9.0
use v14.9.0
```

多分うまくいってるので node.js と npm のバージョンを確認しておく．

(npm は node.js と同時にインストールされる)

いい感じにバージョンが表示されれば OK！

```bash
$ node -v
v14.9.0
$ npm -v
6.14.8
```

以上だ( `･ω･)b
