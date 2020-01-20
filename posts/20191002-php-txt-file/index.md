---
path: '/php-txt-file'
date: '2019-10-02'
title: 'phpでクールにtxtファイルを扱う方法を考える．'
description: 'phpでtxtファイルを扱う方法は複数あるが，どのように記述するのがクールなのかを考えてみた．'
tags: ['php']
published: true
---


作成日：2019/10/02

※ php7.3.6で検証．

## 状況

以下の処理を実行したい．

- phpでtxtファイルにデータを書き込む．
- phpでtxtファイルのデータを読み込む．

## 書き込み

今回は，配列をjson_encodeして書き込んでみる．

`$array`を`data/data.txt`に書き込む．

### - fopen()してfwrite()する方法

一番一般的（？）な方法．phpでファイルを開き，書き込みを行う．流れは以下．

- 追加書き込み形式でファイルを開く．
- ファイルをロックする．
- データを書き込む．最後に改行（`\n`）を追加する．
- ロックを解除する．
- ファイルを閉じる．

```php
<?php
$array = [
  'text' => 'hoge',
  'date' => '2019-10-02',
];

$file = fopen('data/data.txt', 'a+');
flock($file, LOCK_EX);
fwrite($file, json_encode($array) . "\n");
flock($file, LOCK_UN);
fclose($file);
```

流れがとてもわかりやすいと思う．ただ，コードがちょっと長いか．

参考

- [fopen()](https://www.php.net/manual/ja/function.fopen.php)

- [fwrite()](https://www.php.net/manual/ja/function.fwrite.php)

- [flock()](https://www.php.net/manual/ja/function.flock.php)

- [json_encode()](https://www.php.net/manual/ja/function.json-encode.php)

### - file_put_contents()する方法

`file_put_contents()`を使用すると一発で書き込みができる．

```php
<?php
$array = [
  'text' => 'hoge',
  'date' => '2019-10-02',
];

file_put_contents('data/data.txt', json_encode($array) . "\n", FILE_APPEND | LOCK_EX);
```

書き込み先のファイル名，書き込むデータ，書き込みの形式を指定するだけで書き込みが実行できる．

第3引数の`FILE_APPEND | LOCK_EX`はそれぞれ
- 追記書き込み
- 実行中はファイルロック

を表している．上記を指定することで，`fopen()`と`fwrite()`を使用した方法と同じ挙動となる．

引数がわかりやすい上に記述も短い．こちらを利用するほうが良さそう．

ただし，第3引数の挙動は`fopen()`と`fwrite()`を理解していないとわかりにくい．

参考

- [file_put_contents()](https://www.php.net/manual/ja/function.file-put-contents.php)


## 読み込み

書き込みで作成したデータ（`data/data.txt`）を読み込み，json形式にしてechoする．

### - fopen()してfgets()する方法

（多分）一般的な方法．流れもわかりやすい．

- データ格納用の配列を用意する．
- 読み込み形式でファイルを開く．
- ファイルをロックする．
- 1行ずつデータを取得（`fgets()`）し，`json_decode()`しつつ配列に追加する．
- ロックを解除する．
- ファイルを閉じる．
- データを格納した配列を`json_encode()`して`echo`する．
- （ファイル読み込みできない場合は空の配列を返す）

```php
<?php
$result_array = [];

if (file_exists('data/data.txt')) {
  $file = fopen('data/data.txt', 'r');
  flock($file, LOCK_EX);
  if ($file) {
    while ($line = fgets($file)) {
      $result_array[] = json_decode($line);
    }
  }
  flock($file, LOCK_UN);
  fclose($file);
  echo json_encode($result_array);
} else {
  echo json_encode([]);
}
```

流れはとてもわかりやすいが，コードが長いか．`while`を用いた記述が冗長な気もする．

参考

- [fgets()](https://www.php.net/manual/ja/function.fgets.php)

- [json_decode()](https://www.php.net/manual/ja/function.json-decode.php)


## - file()関数を用いる方法

`file()`関数を使用すると，txtファイルの1行を要素として配列にまとめることができる．

- `file()`関数を使用してtxtファイルの1行を要素とした配列（`$result_array`）を作成する．

- `array_map()`を用いて`$result_array`の各要素に対して`json_decode()`を実行し，最後に全体を`json_encode()`して返す．

```php
<?php
if (file_exists('data/data.txt')) {
  $result_array = file('data/data.txt', FILE_IGNORE_NEW_LINES);
  echo json_encode(array_map(function ($str) {
    return json_decode($str);
  }, $result_array));
} else {
  echo json_encode([]);
}
```

配列に入れればなんとかなるので，`file()`関数が便利．

参考

- [file()](https://www.php.net/manual/ja/function.file.php)

- [array_map()](https://www.php.net/manual/ja/function.array-map.php)


## まとめ

- 便利な関数があるので，うまく活用すると1文で処理が完結する．

- ただし，初見では実行されている内容がわかりにくいので，ファイル開く→閉じるの流れを押さえておくことがおすすめ．

good luck ( `･ω･)b

