---
path: '/how-to-get-github-grass-as-array'
date: '2020-02-02'
title: 'Githubの草を配列のデータとして取得する．'
description: 'Githubの草をデータとして取得するときにsvgでは扱いにくいので，日付とcontributionの配列にして取得してみた．'
tags: ['node.js','javascript']
published: true
---


作成日：2020/02/02

## 状況

- Node.jsでGithubの草を取得したい．
- svgは嫌だ．
- 配列がいい．

## Githubの草

以下のURLで草のsvgにアクセスできる．

```txt
https://github.com/users/USER_NAME/contributions
```

## 要素の取得

`sync-request`というライブラリを使うと指定したURLの要素を取得できるようなので，これを利用した．

```bash
$ npm install sync-request
```

Node.jsのファイルに以下を記載
```js
const request = require('sync-request');
const grassUrl = 'https://github.com/users/USER_NAME/contributions';

// 草を取得する関数
const getGrass = url => {
  const response = request('GET', url);
  return response;
}
```

## svgの抽出

ほしいのは草の生えているsvg部分だけなので抽出する．

正規表現でsvgタグを抽出しているが，`.`だと改行が取れないので`[\s\S]`を使う必要があった．

```js
// 草を取得する関数
const getGrass = url => {
  const response = request('GET', url);
  const grass = response.body.toString().match(/<svg(?: [\s\S]+?)?>[\s\S]*?<\/svg>/g);
  return grass;
}
```

実行結果

```bash
...
[ '<svg width="828" height="128" class="js-calendar-graph-svg">\n  <g transform="translate(10, 20)"...
```

これでsvgデータが取れたので，このデータをブラウザに渡せば草を表示することができる．

ただし，筆者はsvgについて無知であるため，表示を調整することができなかった．

## svgではなく配列でデータを取得する

ほしいのは日付とcontribution数なので，配列で十分ではと考えた．

具体的には以下のような感じでデータを取得できれば如何様にでも処理できそうである．

```js
// こんな感じのデータになってほしい
[
  {
    data_date: '2020-02-02',
    data_count: 5
  },
  {
    data_date: '2020-02-01',
    data_count: 7
  },
  {
    data_date: '2020-01-31',
    data_count: 3
  },
]
```

で，svgの中身をよく見ると草の各マスは`<rect>`という要素で作られており，ここに日付とcontribution数が入っている．

```js
// rect要素の構造
<rect class="day" width="12" height="12" x="16" y="15" fill="#ebedf0" data-count="10" data-date="2019-02-02"/>
```

ということでsvgではなくrect要素を取得し，その中から必要なデータを抽出することにした．

```js
// 草を取得する関数
const getGrass = url => {
  const response = request('GET', url);
  const grassElement = response.body.toString().match(/<rect(?: [\s\S]+?)?\/>/g);
  const grassArray = grassElement.map(x => {
    return { data_date: x.split(' ')[8].slice(11, 21), data_count: Number(x.split(' ')[7].split('"').join('').slice(11)) }
  });
  return grassArray;
}
```

- 正規表現を用いてrect要素を配列で取得する．
- 取得した配列にmap()関数を適用し，要素内の`data-date`と`data-count`を抽出．`data-count`は数値に変換している．
  - 各要素をスペースでsplit()する．
  - `data-date`と`data-count`がそれぞれ8番目と7番目なので取り出す．
  - `data-count`は`"`が不要なので削除．
  - 文字数をカウントして必要な部分をslice()で切り出す．

実行結果
```js
[
  {
    data_date: '2019-02-03',
    data_count: 0
  },
  {
    data_date: '2019-02-04',
    data_count: 0
    },
  {
    data_date: '2019-02-05',
    data_count: 0
  },
  ...
]
  ```

あとは取得した配列をクライアント側に送ってあげれば如何様にでも表示できる．

good luck ( `･ω･)b

