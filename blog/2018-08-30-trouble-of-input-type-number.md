---
title: `<input type="number">`でハマった
date: 2018-08-30 00:00:00
description: '`<input type="number">`で数値を入れて取得しようとしたところ激しくハマったのでメモ'
image: "./images/trouble-of-input-type-number.jpg"
slug: trouble-of-input-type-number
---

## **やりたいこと**
`input type=number`で最大値と最小値を取得し，範囲内の乱数を発生させたい．

## **書いたコード**

### **html**

```html
<input type="number" id="min" value="1">
<input type="number" id="max" value="10">
```

### **js**

```javascript
min = $('#min').val();
max = $('#max').val();
result = Math.floor(Math.random() * (max - min + 1)) + min;
console.log(result);
```

## **結果**

適当に何回か実行．

```bash
21
51
11
101
71
...
```

なんかおかしい( ・ω・)?

## **原因**

必ず末尾に1がついているので，文字列結合になっているのではと疑う．

```javascript
min = $('#min').val();
'use strict';
alert(typeof min);
```

とやってみるとstringだったので数値型に変換する必要がありそう．

(use strictを使わないとどちらでもobjectになるので注意)

## **解決策**

取得した数字を数値型に変換．Number()を使用．

```javascript
min = Number($('#min').val());
max = Number($('#max').val());
```

で解決．

`type="number"`とか言っておきながら実は文字列とかひどい(｀；ω；´)
