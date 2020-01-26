---
path: '/remove-from-array'
date: '2020-01-26'
title: '配列から不要な要素を削除した新しい配列がほしい．'
description: '配列の中から特定の要素を削除した新しい配列を作成したい．そして，元の配列はそのまま保持しておきたい．'
tags: ['javascript']
published: true
---


作成日：2020/01/26

## 状況

- 配列からいらない要素を削除したい．
- 削除して残った要素の配列を新しい配列として取得したい．
- 元の配列はそのまま保持しておきたい．

## 配列の要素削除といえばArray.prototype.splice()だろ！

```js
const array1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const newArray1 = array1.splice(2,1);
console.log(array1);
console.log(newArray1);
```

実行結果
```js
[0, 1, 3, 4, 5, 6, 7, 8, 9] // array1
[2] // newArray1
```

違う，そうじゃない．．．

こうなってほしい
```js
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]  // array1
[0, 1, 3, 4, 5, 6, 7, 8, 9] // newArray1

```

`splice()`を使用すると，戻り値が「削除した要素」になる．

しかも，元の配列に変更を加えるので，元の配列は保持されない．

## Array.prototype.filter()を使えばOK！

```js
const array2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const newArray2 = array2.filter((x, index)=> index != 2)
console.log(array2);
console.log(newArray2);
```

実行結果
```js
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]  // array2
[0, 1, 3, 4, 5, 6, 7, 8, 9] // newArray2
```
`filter()`を使えば条件に当てはまる要素のみを抽出して新しい配列を生成することができる．

引数でindexを渡せるので，配列の場合はindexを使って条件を指定すればOK！


good luck ( `･ω･)b

