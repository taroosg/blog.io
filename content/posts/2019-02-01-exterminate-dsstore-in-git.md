---
title: gitで邪魔な.DS_storeを駆逐する
date: 2019-01-10
published: true
tags: ['git']
series: false
canonical_url: false
description: "Mac osを使用していると度々悩まされる.DS_Store．gitにプッシュしたときにこいつが存在したときの怒りは計り知れない(｀；ω；´)"
slug: exterminate-dsstore-in-git
---

## **コミット対象から外す**

### **1. 「`.gitignore_global`」を作成する**

ルートディレクトリ直下に「`.gitignore_global`」を作成する．ターミナルから以下を実行で作成．

```bash
$ vi ~/.gitignore_global
```

### **2. 作成したファイルに「`.DS_Store`」を記述**

上記手順で開いたファイルは空なので，下記と追記して保存する．
```bash
.DS_Store
```

### **3. gitへ設定を反映させる**

上記ファイルを設定に反映する．ターミナルで以下を実行する．

```bash
$ git config –-global core.excludesfile ~/.gitignore_global
```

### **4. 設定状況の確認**

設定がうまく行われているか確認する．ターミナルで以下を実行し，上記記述が反映されていればOK．

```bash
$ git config --list
```

確認したら「q」で閉じよう．

これで設定完了．後はいつもどおりpushすればOK！


以上だ( `･ω･)b


