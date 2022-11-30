---
path: "/many-to-many-complex-table"
date: "2022-11-30"
title: "Laravelで複雑な名前のテーブルと連携する中間テーブルを作成する"
description: "テーブル名にアンダースコアが入ってテーブルを用いる中間テーブルを作成しようとしてハマったのでメモ．"
tags: ["Laravel"]
published: true
---

作成日：2022/11/30

更新日：2022/11/30

## どうした？？

- hoges テーブルと fuga_piyos テーブルで中間テーブルをつくりたい．

- アンダースコアの位置がよくわからなくなりそうじゃね？？

## マイグレーションファイル作成

いつものやつ（hoges テーブルと fugas テーブルで中間テーブル）

```bash
php artisan make:migration create_hoge_fuga_table
```

アンダースコアで区切ってるから fuga_piyos テーブルだと困る．．(´・ω・｀)

## 解決策

`"` で囲って文字列形式で書ける．

```bash
php artisan make:migration "create hoge fuga_piyo table"
```

## まとめ

同じ結果になるなら毎回ダブルクォーテーションで区切って書けば良さそう．

以上だ( `･ω･)b
