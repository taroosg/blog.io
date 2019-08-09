---
title: 多次元配列を1次元配列にしたい
date: 2019-08-02
published: true
tags: ['javascript']
series: false
canonical_url: false
description: "適当なところからデータを持ってきて配列に配列を入れたけど一つの配列にしたかった"
slug: multiArray-to-singleArray
---

作成日：2019/06/29

更新日：2019/08/02

javascriptの備忘録的なやつ．

## **状況**

これを．．．
```javascript
const multiArray = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16]
];
```

こうしたい
```javascript
const singleArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
```


## **解決策**

こうじゃ！
```javascript
const multiArray2singleArray = (multiArray) => {
    return multiArray.reduce((a, c) => {
        return Array.isArray(c) ? a.concat(flatten(c)) : a.concat(c);
    }, []);
};
```

`reduce`関数で配列を要素に分け，配列じゃなくなるまで再帰的に実行する．

後は実行してあげればOK！
```javascript
const multiArray = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16]
];

console.log(multiArray2singleArray(multiArray));
```

## **2019/08/02追記**

`Array.prototype.flat()`で一撃．．！

古いブラウザは知らん．

```javascript
const multiArray = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16]
];

console.log(multiArray.flat());
```

個別に定義していればこっち（スプレッド構文）でもいいかも

```javascript
const array1 = [1, 2, 3, 4];
const array2 = [5, 6, 7, 8];

const newArray = [...array1, ...arrau2];
```


参考サイト

[https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/flat](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)

以上だ( `･ω･)b
