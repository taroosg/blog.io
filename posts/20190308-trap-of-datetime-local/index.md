---
path: '/trap-of-datetime-local'
date: '2019-03-08'
title: 'input type="datetime-local"でハマった'
description: 'datetime-localに初期値を入れたいときの話'
tags: ['html', 'php']
published: true
---


完全に備忘録．．．

## **どうした？？**

### **input type=datetime-localにvalueで値をセットしようとしたらブラウザに表示ができない．．．**

- phpを使用して`<form>`の`<input type="datetime-local">`からDBにデータを飛ばす．

- そうすると，こんな感じでDBに入る．
```bash
2019-03-08 00:00:00
```

- このデータを持ってきて，htmlのinput type=datetime-localにvalueでセットしようとした．

- しかし，`$time='2019-03-08 00:00:00';`
とかになるようにして`value="<?=$time?>"`にしても日付時間が入らない．

## **解決策**

これでいけた！

```php
<?=date('Y-m-d\TH:i', strtotime($time))?>
```

調べると，RFC 3339に準拠した形にしないといかんらしい．

正しい形は以下の通り．

```bash
2019-03-08T00:00
```

なので，上の$timeの場合は以下のように処理を書いてフォーマットを整える必要がある．

<?=date('Y-m-d\TH:i', strtotime($time))?>

解説すると，

1. strtotime()関数でunix時間になおす．
2. date()関数でフォーマットを合わせる．\Tを入れる点に注意．

以上だ( `･ω･)b
