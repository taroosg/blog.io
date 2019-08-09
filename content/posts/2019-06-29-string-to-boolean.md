---
title: 文字列のtrueをbooleanのtrueにしたい
date: 2019-06-29
published: true
tags: ['javascript']
series: false
canonical_url: false
description: "環境変数でtrueとかfalseとか読み込んだら文字列として認識されて死んだ"
slug: string-to-boolean
---

作成日：2019/06/29

更新日：2019/06/29

javascriptの備忘録的なやつ．

## **状況**

こういうときに環境変数によらず`options`が全部trueになる．．．
```javascript
const options = hoge.env.DEBUG
  ? { hoge: true }: { hoge: false };
```

## **原因**

`hoge.env.DEBUG`を見てみるとbooleanのtrueではなくて文字列のtrueだった．．．

環境変数からもってくると，文字列になってしまう場合があるようだ．

## **解決策**

`JSON.parse()`するとbooleanに戻る．

こうじゃ！

```javascript
const options = JSON.parse(hoge.env.DEBUG)
  ? { hoge: true }: { hoge: false };
```

以上だ( `･ω･)b
