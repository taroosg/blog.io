---
path: "/too-long-unique"
date: "2022-11-30"
title: "Laravelでユニーク制約つけたらunique keyが長すぎた件"
description: "マイグレーション時にユニーク制約を書けたらキーの長さが長すぎて怒られた．"
tags: ["Laravel"]
published: true
---

作成日：2022/11/30

更新日：2022/11/30

## どうした？？

- ユニーク制約かけたい．

- マイグレーション実行したらエラーが出た．

## マイグレーションファイル

```php
$table->unique(['hogehoge_id', 'fugafuga_piyopiyo_id']);
```

動かしたらエラーが出た．

```txt
SQLSTATE[42000]: Syntax error or access violation: 1059 Identifier name 'hogehoge_user_id_fugafuga_piyopiyo_user_id_unique' is too
   long ...
```

長すぎるってさ(´・ω・｀)

## 解決策

ユニーク制約に名前をつけるといける．名前をつけないと Laravel 側で決めたルールに従って名前が決まるため，長すぎてエラーになることがある．

```php
$table->unique(['hogehoge_id', 'fugafuga_piyopiyo_id'])->name("hogehoge_id_fugafuga_piyopiyo_id_unique");
```

## まとめ

テーブル名やカラム名が長いときは名前をつけておくとスムーズにいける！

以上だ( `･ω･)b
