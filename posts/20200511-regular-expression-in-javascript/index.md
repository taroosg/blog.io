---
path: '/regular-expression-in-javascript'
date: '2020-05-11'
title: 'JavaScriptで正規表現に変数を用いる方法'
description: '正規表現の検索文字列（複数）に変数を使用したかったがハマったのでメモ．'
tags: ['javascript']
published: true
---

作成日：2020/05/11

## どうした？？

- 配列の中から特定の文字列が含まれた要素を抽出したい．
- 「特定の文字列」は複数あるので，変数や配列を用いて定義したものを使用したい．
- そもそも複数条件の文字列で抽出するのはどうすればよいのか．．．

## データ例（適当）

```js
const array = [
  {
    name: 'hoge',
    message: 'aaaaa',
  },
  {
    name: 'fuga',
    message: 'bbbbb',
  },
  {
    name: 'hoge',
    message: 'ccccc',
  },
  {
    name: 'fuga',
    message: 'ddddd',
  },
  {
    name: 'hoge',
    message: 'eeeee',
  },
  {
    name: 'hoge',
    message: 'fffff',
  },
  {
    name: 'piyo',
    message: 'ggggg',
  },
];
```

- ここから特定の文字列が含まれたメッセージだけを抽出したい！

## 解決策

- まず，特定の文字列複数条件（今回は`aa`または`bb`）で抽出をしてみる．
- `match()`の引数に正規表現を記述する．`/`間に正規表現を記述すればOK．
- 複数条件は`|`を使用してOR条件を設定する．
- `()`の位置でハマった．「任意文字列(複数文字列条件)任意文字列」にしないといけない．

```js
const abArray = array.filter(x => x.message.match(/.*(aa|bb).*/));
console.log(abArray);
```

実行結果
```js
(2) [{…}, {…}]
  0: {name: "hoge", message: "aaaaa"}
  1: {name: "fuga", message: "bbbbb"}
  length: 2
```

- 続いて，配列に条件文字列を入れて適用する．
- 変数や配列の場合は「/hogehoge/」では動作しないので，RegExpオブジェクトを定義する必要がある（`new RegExp()`の部分）．
- RegExpオブジェクトを使用する場合，引数に文字列形式で正規表現を記述すればOK．
- 今回は配列で検索文字列を定義しているため，OR条件にするには`join()`を用いて`|`区切りの文字列に変換した．

```js
const targetArray = ['c','f','g'];
const regExp = new RegExp(`.*(${targetArray.join('|')}).*`);
const cfgArray = array.filter(x => x.message.match(regExp));
console.log(cfgArray);
```

実行結果
```js
(3) [{…}, {…}, {…}]
  0: {name: "hoge", message: "ccccc"}
  1: {name: "hoge", message: "fffff"}
  2: {name: "piyo", message: "ggggg"}
  length: 3
```

## まとめ

- 正規表現を用いて複数条件検索（OR条件）を行うときは`|`で区切る．`()`の位置に注意．
- 変数や配列を用いるときはRegExpオブジェクトを使用する必要がある．
- 複数条件の場合は`|`区切りの文字列形式に直せばOK．

今回はここまで( `･ω･)b
