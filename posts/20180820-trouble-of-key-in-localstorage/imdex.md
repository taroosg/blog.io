---
path: '/trouble-of-key-in-localstorage'
date: '2018-08-20'
title: 'localStorageに保存されるkeyの仕様でハマった'
description: 'ブラウザにデータを保存できるlocalStorageの機能だが，謎の仕様で3時間ほどハマったのでメモ．'
tags: ['javascript']
published: true
---


## **keyを順に取り出す**

localStorageにはkeyとvalueの組み合わせでデータを保存するが，これを順番に取り出して表示したいことがある．

## **パターンA(OK)**

例として，下のようにデータを保存しておき，keyを順に取り出してみる．

```bash
key value
1   aaa
2   bbb
3   ccc
4   ddd
```

いつもの書き方は以下．
```html
<script>
    for (var i = 0; i < localStorage.length; i++) {
        console.log(localStorage.key(i));
    }
</script>
```

このように書くと，コンソールに以下のように出力される．
```bash
1
2
3
4
```

計画通り(｀･ω･´)b

## **パターンB(NG)**

ある日，同じことをやろうとしてうまくいかないと相談された．

どうやら上述の書き方とは異なるようだ．
受け取ったコードは以下．

```html
<script>
    for (var key in localStorage) {
        console.log(key);
    }
</script>
```

自分がいつも書いているコードよりもスッキリしてスマートかも．早速動かす！

```bash
1
2
3
4
length
key
getItem
setItem
removeItem
clear
```

は，誰お前??(威圧)

なんでlengthとかkeyとかgetItemとか入れた覚えがないものが入ってるの??

早速調べ始めるも全く情報がない．3時間ほどあらゆる情報を漁った結果，以下のサイト(英語)に同じような状況を発見した．

[https://www.reddit.com/r/javascript/comments/3y97w8/looping\_through\_localstorage/](https://www.reddit.com/r/javascript/comments/3y97w8/looping\_through\_localstorage/)

それによると

> All objects have some user created keys, and some built in keys.
>The explanation as to why you are getting the extra keys is that they are built-in properties on the localstorage object.

だそうだ(´-ω-｀)

まとめると，
- localStorageにはユーザが入力したキー以外に組み込みのキーが存在するらしい．
- すべてのキーを順番に取ろうとすると(パターンB)，組み込みのキーも含めて処理を行うようだ．
- 組み込みのキーはlocalStorageの長さ(パターンA)には含まれない模様．

## **パターンC(OK)**
続けて解決策も示されている．

> The best practice for looping through object keys is to use the hasOwnProperty function.

つまりパターンBに追加して下記のようにすればOK．

```html
<script>
    for (var key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            console.log(key);
        }
    }
</script>
```

動かすと以下の通り．
```bash
1
2
3
4
```

(｀-ω-´)b

## **まとめ**

久々に盛大にハマったorz

- localStorageにはユーザが追加したデータと組み込みのデータが存在する．
- 組み込みのデータはlocalStorageの長さには含まれないが，順番にすべて取ろうとすると取れてしまう．
- `.hasOwnProperty(key)`を用いて条件分岐することでユーザが追加したデータのみを取得可能である！

以上だ( `･ω･)b
