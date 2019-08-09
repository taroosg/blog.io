---
title: Juliaの環境構築（macOS, ubuntu）
date: 2019-06-25
published: true
tags: ['julia']
series: false
canonical_url: false
description: "Juliaの環境構築してみたのでまとめる"
slug: get-started-julia
---

作成日：2019/06/25

更新日：2019/06/25

実行OS：macOS 10.14.4, ubuntu 18.04 LTS

## **0.目次**
- 1. macの場合
- 2. ubuntuの場合

Juliaを触る機会があったので環境構築からスタート．

## **1. macの場合**

下記urlからダウンロード．今回はCurrent stable release: v1.1.1をダウンロードした．

[https://julialang.org/downloads/](https://julialang.org/downloads/)

ダウンロードしたらインストール．アプリケーションフォルダにJulia-1.1.appがインストールされる．

ターミナルで扱えるよう，パスを通しておく．ターミナルで以下を実行する．

zshを使用している場合は`.bashrc`を`.zshrc`に変更しよう．

```bash
$ echo "export PATH=/Applications/Julia-1.0.app/Contents/Resources/julia/bin:$PATH" >> ~/.bashrc
```

続けて以下を実行する．
```bash
$ source ~/.bashrc
```

ターミナルで以下を実行し，Juliaが動けばOK！

```bash
$ julia
```

## **2. ubuntuの場合**

macOSと同様に安定版1.1.1をインストールする．

ターミナルで以下を順番に実行する．

```bash
$ wget https://julialang-s3.julialang.org/bin/linux/x64/1.1/julia-1.1.1-linux-x86_64.tar.gz
```

続けて以下を実行．
```bash
tar -xzf julia-1.1.1-linux-x86_64.tar.gz
```

パスを通しておく．
```bash
$ echo "export PATH=~/julia-1.1.1/bin:$PATH" >> ~/.bashrc
```

設定を適用．
```bash
$ source ~/.bashrc
```

Juliaが動けばOK！
```bash
$ julia
```

以上だ( `･ω･)b
