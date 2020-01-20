---
path: '/access-xampp-mysql-via-a-terminal'
date: '2019-06-27'
title: 'xamppのmysqlにターミナルからアクセスしたい'
description: 'xamppのphpmyadminが使いづらいので，ターミナルからアクセスしたかった．'
tags: ['xampp', 'sql']
published: true
---

作成日：2019/06/27

更新日：2019/06/27

実行OS：macOS 10.14.4

xamppバージョン：7.3.6-2

備忘録的なやつ．

## **状況**

xamppで開発しているときにmysqlにアクセスしたいけどphpmyadminが使いづらいので，ターミナル経由でアクセスしたかった．

ユーザ名とパスワードは初期状態のまま．（パスワードは未設定）

```bash
user:root
password:
```

## **解決策**

場所を指定して直接実行してあげればOK！
```bash
$ /Applications/xampp/xamppfiles/bin/mysql -u root -p

Enter password:

Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 33
Server version: 10.3.16-MariaDB Source distribution

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]>
```

## **【参考】使用頻度が高い場合**

毎回コマンド打つのが面倒な場合はパスを通しておく．

`.bash_profile`に以下を追記．
```bash
export PATH="/Applications/xampp/xamppfiles/bin:$PATH"
```

これをやっておけば以下でアクセスできるようになるのでお好みで．
```bash
$ mysql -u root -p
```

以上だ( `･ω･)b
