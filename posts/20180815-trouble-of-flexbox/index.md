---
path: '/trouble-of-flexbox'
date: '2018-07-30'
title: 'flexboxのハマりポイント'
description: '様々なレイアウトに大活躍のflexbox．しかし慣れないうちはcssに書いたのに効かねええええということが多々ある．そんたときに落ち着けるよう，いくつかのパターンを紹介する！'
tags: ['html', 'css']
published: true
---


## **display:flex;は子要素のみに効く**

例えばhtmlに，

```html
<div>
    <ul>
        <li>text</li>
        <li>text</li>
    </ul>
</div>
```

このように書いて「text」2つを横並びにしたいとき，`<div>`に対して`display:flex;`をつけても横並びにならない．

これは横並びにしたい`<li>`は`<div>`から見ると孫要素であり，小要素は`<ul>`であるためである．`<ul>`は1つしかないので，当然見た目は変わらない．

`<li>`を横並びにするには，`<ul>`にdisplay:flex;をつけることで解決できる！

参考：[親要素と小要素について](https://qiita.com/NoxGit/items/0fe9cbbf72db3e6b2eea)

## **縦と横の向きによってプロパティが異なる**

flexboxは横並びだけでなく縦並びでも活躍する．

しかし，縦並びにした際に上下中央配置をしようとしてcssに下記のように書いたけれど効かない，ということが発生する．

```css
.test{
    display:flex;
    flex-direction:column;
    align-items:center;
}
```

これは，縦方向になると上下左右の方向が変わるためである．

`flex-direction:column;`の場合，縦方向が`justify-content`，横方向が`align-items`となる．

正しく動くのは以下．

```css
.test{
    display:flex;
    flex-direction:column;
    justify-content:center;
}
```

混乱しやすく説明もしづらいが，とりあえずどちらか書いてみて，効かなければもう片方を書いてみると徐々にイメージが掴めてくる．

参考：[https://memorandumrail.com/2018/…/03/alignitems-doesnt-work/](https://memorandumrail.com/2018/…/03/alignitems-doesnt-work/)

## **その他**

大体のレイアウトが載っているサンプル集．

[https://www.nxworld.net/tips/flexbox-examples.html](https://www.nxworld.net/tips/flexbox-examples.html)

以上だ( `･ω･)b
