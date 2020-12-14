---
path: "/bingogame-made-of-array"
date: "2020-12-14"
title: "JavaScriptでビンゴゲームをつくったら配列だった話"
description: "何かを開発するときは配列処理が強い味方になる．一通りの配列処理を把握することは，簡単なアプリケーションをつくる助けになるだろう．"
tags: ["javascript"]
published: true
---

- 作成日：2020/12/14

- 更新日：2020/12/14

## はじめに

「好きな芸能人」の話より「好きな Array.prototype 」の話で盛り上がりたい．

盛り上がりたくない．．？？

## 想定している読者

- JavaScript でアプリケーションを作りたい（作っている）方．
- 配列になんとなく苦手意識を持っていたり，あまり使えていない方．
- ロジックを考えるのが好きだけどなかなか思い通りに行かない方．

配列は最高なので，配列を使うことで実装の幅を広げてみよう！

（といいつつ実装の話しかしてないので誰得な記事になった感がすごい．．．配列をどうやって使うのか，少しでも感じていただければ幸いである．．．）

## 大雑把な概要

- JS でビンゴゲームつくったら完全に配列だった．
- あらゆる処理は配列処理の組み合わせでなんとかなることが少なくない（今回はなんとかなった）．
- 「配列ができること」を知れば，設計や実装の幅も広がるッ！

## 成果物

[こちら（Github リポジトリ）](https://github.com/taroosg/bingo)

## この記事の背景

年末のイベントに向けて，受講生が JS でビンゴゲームを自作しようとしていた．

5\*5 のマスでビンゴするやつ（シート？名前知らん）の判定ロジックについて相談を受けた．

いくつかの考えを提示したが，まず自分でやらないことには示しがつかないので実装してみた．手を動かさない口だけの人間ほど滑稽なものはなかなかない．

## 今回のゴール

- ブラウザ上で 5\*5 のマスで縦横斜めのどれかが揃ったらビンゴのアラートを出す．4 マス揃った時点でリーチのアラートも出せれば更に良いだろう．

- スタート時にはランダムな数値を設置し，クリックごとにマスを塗りつぶしてゲームの状況を把握する．

- 早い話が，よくパーティーなどで配布されるビンゴのカードをブラウザ上で実装すれば良い．

## 実装の方針

ビンゴゲームのシート（以下シート）を見て気づいたことがある．これは完全に 2 次元の配列だ．寧ろ 2 次元配列を見ていたらビンゴゲームができた説まで提唱できるのではないか．

したがって，シートの基本は 2 次元配列を用いることとする．配列には「各要素にランダムの整数を割り振った 2 次元配列（以下，数値シート）」と「結果判定用の false で埋めた 2 次元配列（以下，結果シート）」（出た数値に対応するマスだけ true に書き換える）の 2 種類が必要だ．

ブラウザには数値シートを表示し，マスをクリックする度に「数値シートに対応する結果シート要素の更新」と「リーチ or ビンゴの判定」を行えばよいだろう．

## 実装

## 数値シートの準備

まずは画面に表示するための数値シートを作成する．

数値シートの完成形は以下のような形になるだろう（以下は一例，数値は毎回ランダムに入る）．

```js
const dataSheet = [
  [23, 62, 10, 97, 73],
  [53, 76, 33, 37, 48],
  [1, 96, 5, 28, 11],
  [50, 24, 27, 77, 67],
  [20, 9, 54, 38, 58],
];
```

このシートを準備するためには，以下の手順を考えた．

1. 1 から 99 の数値が入った配列を用意する．
2. 配列をシャッフルする関数を定義する．
3. 1 と 2 を用いて「1 から 99 が入っていて順番がシャッフルされた配列」を作成する．
4. 配列を「指定した長さの配列に分割する」関数を定義する．
5. 3 と 4 を用いて「ランダムな数が入った 5\*5 の 2 次元配列（=数値シート）」を作成する．

また，今回は Vanilla JS のみでの実装を目指す．普段は React（TypeScript）を用いて実装する筆者ではあるが，DOM 操作を最小限にすること，配列の破壊的な操作を最小限にすることを徹底した実装を行えば問題ないであろう．

### 1. 1 から 99 の数値が入った配列を用意する．

これは簡単だ．`new Array()`を用いて新しい配列を作成し，`.keys()`をつなげれば順番に数値が入る．まるで魔法のようだ．

余談だが，私はこの`new Array()`という表現がとても好きだ．「新たな配列を生み出す」という気概を感じないだろうか．コードを書いている自分自身も心が改まる一瞬である．

ビンゴゲームに 0 は存在しない（と記憶している）ので，最後に`filter()`を用いて 0 を除外した．

```js
const initialArray = [...new Array(100).keys()].filter((x) => x !== 0);
```

実装が終わった後に気づいたが，ビンゴゲームの数値は 50 までだった可能性がある．しかしながら，ロジックには影響しないため特に修正はしていない．必要があれば 100 を 50 に書き換えれば良いだけである．

### 2. 配列をシャッフルする関数を定義する．

手順 1 で「1 から 99 の重複しない配列」を作成した．次はこの配列の順番をランダムにする関数を定義する．

シャッフルの工程で偏りが生じることは好ましくない．そこで，今回はダステンフェルドのアルゴリズムを採用した（このアルゴリズムを解説するには余白が狭すぎるため，適宜検索していただきたい）．

```js
const createShuffledArray = (array) => {
  const tempArray = array;
  for (let i = tempArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = tempArray[i];
    tempArray[i] = tempArray[j];
    tempArray[j] = tmp;
  }
  return tempArray;
};
```

### 3. 1 と 2 を用いて「1 から 99 が入っていて順番がシャッフルされた配列」を作成する．

前項と前々項で作成したものを利用する．

```js
const shuffledArray = createShuffledArray(initialArray);
```

順番がランダムになっていることを確認できる．

### 4. 配列を「指定した長さの配列に分割する」関数を定義する．

3 で作成したランダムな数の配列は 1 次元配列である．次はこの配列を元に「5\*5 の 2 次元配列」を作成する必要がある．

`reduce()`を用いて，前から順番に 5 つを新しい配列に入れる処理を実行する．

```js
const arrayChunk = ([...array], size) => {
  return array.reduce(
    (acc, value, index) =>
      index % size ? acc : [...acc, array.slice(index, index + size)],
    []
  );
};
```

`reduce()`は配列の要素同士を使って処理を行う関数である．今回のように配列の形を指定した形に変換したい場合や要素の数値を使用して一定の計算を行いたい場合に有用であり，慣れないとやや難しいものの強力な関数である．

ただし，この関数は配列の最後まで処理を実行するため，5\*5 の 2 次元配列にはならない（列数は 5 になるが，行数は 20 になる）．

### 5. 3 と 4 を用いて「ランダムな数が入った 5\*5 の 2 次元配列（=数値シート）」を作成する．

「ランダムな 1 次元配列」と「配列を分割する関数」を用いて 2 次元配列を作成する．行数は最後に`filter()`を用いて調整すればよいだろう．

`filter()`は非常に便利だ．配列に対して式を入力し，true になる要素のみを返してくれる．使い方も簡単だ．

```js
const dataSheet = arrayChunk(shuffledArray, 5).filter((x, i) => i < 5);
```

結果を確認すると，以下のような 2 次元配列が確認できるだろう（数値は毎回ランダム）．

```js
[
  [23, 62, 10, 97, 73],
  [53, 76, 33, 37, 48],
  [1, 96, 5, 28, 11],
  [50, 24, 27, 77, 67],
  [20, 9, 54, 38, 58],
];
```

これで数値シートは完成である．ほぼ配列の処理しか使っていない．

## 結果シートの作成

こちらは 2 次元の配列をすべて`false`で埋めるだけなのでとても簡単である．

長さ 5 の配列を用意して，すべての要素を「長さ 5 で全要素が`false`の配列」にすれば良い．

```js
let resultSheet = [...new Array(5)].map(() => Array(5).fill(false));
```

`new Array(5)`のみでは直接 map できないが，スプレッド構文を用いることで配列として処理することができるようになる．

`...`の表記を見るだけで可能性を感じずにはいられない．他にも，HTMLCollection をスプレッド構文を組み合わせることで配列に変換することができて非常に処理がしやすくなる．

この配列は以下のような状態だ．この結果シートは，数値シートのいずれかがクリックされると，対応する座標の`false`を`true`に上書きする．

```js
[
  [false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
];
```

例：76（数値シート[1]\[2]）がクリックされた場合．．．

```js
[
  [23, 62, 10, 97, 73],
  [53, 76, 33, 37, 48],
  [1, 96, 5, 28, 11],
  [50, 24, 27, 77, 67],
  [20, 9, 54, 38, 58],
];
```

結果シートの[1]\[2]を true にする．縦横斜めのいずれかで true が揃ったらビンゴ．

```js
[
  [false, false, false, false, false],
  [false, true, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
];
```

これで結果シートの準備は完了だ．こちらもすべて配列の処理で実装が完了した．

## 数値シートの画面表示

数値シートを DOM に変換してブラウザ上に表示する．

予め HTML で`<tbody>`を用意しておき，その中に`<tr><td>数値</td></tr>`の形で描画すればよいだろう．以下のようなイメージだ．

```html
<tbody id="tbody">
  <tr>
    <td>23</td>
    <td>62</td>
    <td>10</td>
    <td>97</td>
    <td>73</td>
  </tr>
  <!-- 以下同様 -->
</tbody>
```

上記のように描画するために以下の関数を用意した．

```js
// 行のタグをつくる
const createTd = (rowArray, rowIndex) => {
  return rowArray.map(
    (x, i) =>
      `<td class="isclicked_${resultSheet[rowIndex][i]}" id="${rowIndex}_${i}">${x}</td>`
  );
};

// 全体のタグをつくる
const createTbody = (array) =>
  array.map((x, i) => `<tr>${createTd(x, i).join("")}</tr>`);

// 画面に描画する
const showTagsToTargetId = (targetId, tags) => {
  document.getElementById(targetId).innerHTML = tags;
};

// showTagsToTargetId('tbody', createTbody(dataSheet).join(''));のように実行すれば数値シートをDOMにして描画できるだろう．
```

クリック時に該当する座標を特定するため，id の値に行番号と列番号を含めた形とした．

また，クリック状態識別のために class 名が`is_clicked_true`の場合のみ背景に着色するよう css を用意したが，ロジックとはさほど関係ないので省略する．

## 数値クリック時の結果シート更新とビンゴ判定

数値クリック時に必要な処理は以下の流れである．

1. クリックされた数値の「数値シート内の座標」を取得する．

2. 結果シートの該当する座標の値を更新（false なら true に，true なら false に）．

3. 結果シートの縦横斜めをチェックし，true が 5 つ（ビンゴ）または 4 つ（リーチ）を判定する．

### 1. クリックされた数値の「数値シート内の座標」を取得する．

DOM 作成時，id に数値シートの座標を指定している（1_2 の形式）．まずはこの id を取得し，`1_2`（文字列）を`[1, 2]`（配列）に直す．

`_`を`split()`すれば配列形式になるので，後は文字列を数値に直してやれば良い．

やはり`map()`は万能選手．配列に対して何か操作したい場合はこれだけで押し切れる場合も多い．

```js
// 指定要素のid取得
const getId = (e) => e.target.id;

// 0_0形式のidを数値の配列にする
const getIndexFromId = (id) => id.split("_").map(Number);
```

これらの処理で，クリックした数値に対応する座標が`[1, 2]`の形で取得できた．別にこの形でなくても良いのだが，後々個別に取り出す必要があるのと，なんとなく配列の形にしたかった．

### 2. 結果シートの該当する座標の値を更新（false なら true に，true なら false に）．

結果シートと前項で取得した座標の配列を用いて，該当する部分の更新を行う．

入力した結果シートのコピーを作成し，コピーしたシートに対して操作を行う．このコピー操作でもスプレッド構文が大活躍だ．

配列は参照渡しとなるためコピーの処理がわかりにくい．スプレッド構文を用いることで値渡しとなるため，安全にコピーが実行できる．他に`slice()`を用いた方法もあるが，間違いなくスプレッド構文のほうが手軽かつ誤りが発生しづらいためオススメである．

入力された座標の配列から更新部分を指定し，false なら true に，true なら false に更新する．

そして，更新した配列を関数から出力する．配列と配列を入力し，新しい配列を返す．．．何事も配列である．

```js
// 入力配列の指定インデックスについてfalseとtrueを更新する
const updateResultSheet = (resultArray, targetIndexArray) => {
  const newResultArray = [...resultArray];
  newResultArray[targetIndexArray[0]][targetIndexArray[1]] = !newResultArray[
    targetIndexArray[0]
  ][targetIndexArray[1]];
  return newResultArray;
};
```

実行する際は，以下のような記述になる．

```js
resultSheet = updateResultSheet(resultSheet, getIndexFromId(getId(e)));
```

結果シートを上書きせざるを得ないが，部分的な破壊的処理ではなく，新しい配列そのもので上書きしているため，予期しない動作のリスクは少ないだろう．

（そろそろ関数の引数や戻り値に型が欲しくなるが，今回は Vanilla JS での実装であるためないものねだりである．．．）

### 3. 結果シートの縦横斜めをチェックし，true が 5 つ（ビンゴ）または 4 つ（リーチ）を判定する．

さて，いよいよ大詰めの判定ロジックである．縦横斜めのいずれかが 5 つ（or4 つ）揃ったらビンゴやリーチの判定を行う．

判定のためには，結果シートから「縦の配列」「横の配列」「斜めの配列」を抽出する必要がある．

一番簡単なのは横の配列だ．行番号を指定するだけで良い．結果シートと行番号を入力し，該当する配列を返す関数を定義する．

```js
// 2次元配列から行番号を指定して行のみの配列を作成
const getRowArray = (array, rowNumber) => array[rowNumber];
```

縦方向の配列は少々厄介だが，列番号とインデックスの指定の仕方がわかっていれば大丈夫だろう．入力した列番号をインデックスに指定するように`map()`で処理を行ってやれば良い．

```js
// 2次元配列から列番号を指定して列のみの配列を作成
const getColumnArray = (array, columnNumber) =>
  array.map((x) => x[columnNumber]);
```

斜めの配列はどうだろうか．こちらについては，正直手入力が一番早い気がする．

```js
// 2次元配列から斜めの配列を作成
const getCrossArray = (array) => {
  return [
    [array[0][0], array[1][1], array[2][2], array[3][3], array[4][4]],
    [array[0][4], array[1][3], array[2][2], array[3][1], array[4][0]],
  ];
};
```

以上で縦横斜めの配列を抽出できるようになった．これらを用いてチェックが必要な「横 5 つ」「縦 5 つ」「斜め 2 つ」の配列を一つの配列にまとめよう．

結果シートを入力すれば，チェックが必要な配列をすべて抽出することができる（斜め配列のみ深さが異なるので，スプレッド構文を使用して均している）．

```js
// 全チェックパターンの配列を集める
const getAllCheckArray = (array) => {
  return [
    getRowArray(array, 0),
    getRowArray(array, 1),
    getRowArray(array, 2),
    getRowArray(array, 3),
    getRowArray(array, 4),
    getColumnArray(array, 0),
    getColumnArray(array, 1),
    getColumnArray(array, 2),
    getColumnArray(array, 3),
    getColumnArray(array, 4),
    ...getCrossArray(array),
  ];
};
```

これで上記の配列に対してチェックの関数を実行すれば判定ができる段階までできた．続いて，実際に判定を行う関数を定義する．

必要な処理は，「入力した配列内の true の数」が「入力した数値」と等しければ true を返し，それ以外なら false を返すことである．

ここで想定される入力配列は`getAllCheckArray`で生成された 2 次元配列である（型を．．．型をください．．．）．

この 2 次元配列の各要素（true か false が要素の配列）に対して`filter()`処理を行い，true の要素のみを残す．更に，`some()`を用いて，true の要素数が入力した数値と同じ配列の有無を確認する．存在すれば true，存在しなければ false が返る．

`some()`は指定した式に対して true の要素が一つ以上存在すれば true，それ以外は false を返す．式を渡せば一発で存在を確認できる，非常にクールな関数だ．値を有無を確認するには`includes()`を用いることもできるが，今回は式での判定を行いたいので`some()`を採用した．

```js
// 指定した数のマスが揃っていればtrue
const hasNumberOfTrue = (allCheckArray, number) => {
  return allCheckArray
    .map((x) => x.filter(Boolean))
    .some((x) => x.length === number);
};
```

ビンゴの判定であれば，`every()`を用いて「5 つすべての要素が true の配列」のみを残しても良いかもしれない．しかし今回はリーチの場合も判定を行いたいため，true の数を引数として入力し，`filter()`と`some()`を用いてチェックする実装とした．

## DOM 関連の操作と実際の処理系実装

ここまでで必要な処理がすべて揃った．後はこれらの処理を組み合わせて画面を描画し，クリックイベントを登録し，イベント内に「結果シートの更新」「ビンゴ（or リーチ）の判定」を記述すれば完成だ．

はじめに，数値シートを元にして DOM の描画を行う．

```js
// 画面に表示される2次元配列表の更新と更新時のクリックイベント登録
const updateGame = () => {
  // 表示を更新
  showTagsToTargetId("tbody", createTbody(dataSheet).join(""));
};
```

続いて，クリックイベントの登録．td タグに対してイベント登録を行うが，ここでもスプレッド構文が活躍する．`document.getElementsByTagName('td')`で取得した要素は HTMLCollection なので，`forEach()`は実行できない．しかし，スプレッド構文を用いることで配列に変換できるため，`forEach()`を用いて各要素に`addEventListener`できるのである！！

なんと美しい．．．スプレッド構文は万能の願望器と言っても過言ではない！

```js
const updateGame = () => {
  showTagsToTargetId("tbody", createTbody(dataSheet).join(""));
  // クリックイベント登録
  [...document.getElementsByTagName("td")].forEach((x) => {
    x.addEventListener("click", (e) => {
      // クリック時の処理
    });
  });
};
```

後はクリックイベント内に結果表の更新処理と判定の処理を記述すれば良い．判定は三項演算子を用いて処理の重複がないように実装した．

判定終了後は数値シートと結果シートから生成された DOM を更新するため，再帰処理で`updateGame()`を呼び出す．

```js
// 結果表を更新
resultSheet = updateResultSheet(resultSheet, getIndexFromId(getId(e)));
// リーチかビンゴならアラート
const gameResult = hasNumberOfTrue(getAllCheckArray(resultSheet), 5)
  ? alert("Bingo!!!")
  : hasNumberOfTrue(getAllCheckArray(resultSheet), 4)
  ? alert("Reach!!!")
  : false;
updateGame();
```

最終的な処理系の全体像は以下のとおりだ．

（コード全体が見たい場合は成果物の Github リンクにあるからそちらを見て．．！）

```js
const updateGame = () => {
  showTagsToTargetId("tbody", createTbody(dataSheet).join(""));
  [...document.getElementsByTagName("td")].forEach((x) => {
    x.addEventListener("click", (e) => {
      resultSheet = updateResultSheet(resultSheet, getIndexFromId(getId(e)));
      const gameResult = hasNumberOfTrue(getAllCheckArray(resultSheet), 5)
        ? alert("Bingo!!!")
        : hasNumberOfTrue(getAllCheckArray(resultSheet), 4)
        ? alert("Reach!!!")
        : false;
      updateGame();
    });
  });
};
```

ビンゴゲームの開始時は，中心（座標だと[2]\[2]）は最初から空いている状態になるので，初回スタート時は下記の処理で調整した．内容としては数値シートと結果シートそれぞれを更新し，先に作成した`updateGame()`を実行して画面描画を行っているだけである．

```js
// 初回ゲーム開始
dataSheet[2][2] = "free";
resultSheet[2][2] = true;
updateGame();
```

これですべて完成だ．ここまで実装してみたという奇特な読者はぜひブラウザでビンゴを動かしてみてほしい．

## あとがき

今回はビンゴゲームの実装に挑戦し，結果的にはほぼすべての実装が配列での実装となったが，別に配列縛りをしていたわけではない．単に私が配列が好きなだけで，オブジェクトなどを組み合わせたもっと賢い実装もあるだろう．

しかしながら，配列処理には非常に強力なメソッドが数多く用意されており，これらをうまく利用するために配列の形に合わせていった結果である．今回利用した主な Array.prototype を以下に列挙してみる．

- [Array.prototype.filter()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [Array.prototype.forEach()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
- [Array.prototype.map()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [Array.prototype.reduce()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
- [Array.prototype.some()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
- [Array.prototype.join()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/join)
- [Array.prototype.splice()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)

いずれも強力かつ便利なメソッドである．これらを使えるだけでもデータを配列に寄せるメリットがある．もちろん他にも多くのメソッドが存在するので，配列に興味を持った方は調べてみてほしい．

何かのアプリを実装する際，どのように実装するかの設計は非常に重要である．実装しやすかったり，拡張しやすかったり，保守しやすかったり，バグが発生しづらかったり，．．．設計如何によって良くも悪くもなる．

自身が行える設計に幅を持たせるには「プログラミング言語は何ができるのか」を知ることがとても重要になる．私は，配列はできることが非常に多く，有用なメソッドを知っておくことで一気に視野が広がる存在であると考えている．

プログラムは，仮設検証を重ね，自分が考えたとおりに動いた（=仮設が証明された）ときが最も楽しい瞬間だ．プログラムを書き始めたけれど実装が進まない，という方は配列にチャレンジしてみては如何だろうか．そして「好きな Array.prototype は何？」などの議論に花を咲かせてみてほしい．
