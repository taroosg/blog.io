---
path: '/trouble-of-input-type-number'
date: '2018-08-30'
title: 'input type="number"でハマった'
description: 'input type="number"で数値を入れて取得しようとしたところ激しくハマったのでメモ'
tags: ['html', 'javascript']
published: true
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
min = document.getElementBuId('min').value;
max = document.getElementBuId('max').value;
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
min = document.getElementBuId('min').value;
'use strict';
alert(typeof min);
```

とやってみるとstringだったので数値型に変換する必要がありそう．

(use strictを使わないとどちらでもobjectになるので注意)

## **解決策**

取得した数字を数値型に変換．Number()を使用．

```javascript
min = Number(document.getElementBuId('min').value);
max = Number(document.getElementBuId('max').value);
```

で解決．

`type="number"`とか言っておきながら実は文字列とかひどい(｀；ω；´)

以上だ( `･ω･)b
