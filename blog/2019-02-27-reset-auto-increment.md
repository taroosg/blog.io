---
title: mysqlでauto-incrementの値をリセットしたいときのSQL
date: 2019-02-27 00:00:00
description: "テストデータ入れまくって値が大変になったときのために．"
image: "./images/reset-auto-increment.jpg"
slug: reset-auto-increment
---

完全に備忘録．．．

## **どうした？？**

### **テストデータ入れすぎた．．．**

- DBのCRUD処理などで適当にデータを入れた．
- 大体コードができたけどauto-incrementの値が1000とかになってる！
- リセットしたい！！！

### **解決策**

以下のSQLを実行すれば一発！

実行する前にデータは削除しておいたほうが良さそう．

```sql
ALTER TABLE テーブル名 AUTO_INCREMENT = 1;
```