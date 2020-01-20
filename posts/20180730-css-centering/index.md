---
path: '/css-centering'
date: '2018-07-30'
title: 'いろいろなcssの中央寄せについての考え方とflexboxのススメ'
description: 'webサイト構成で頻出する「中央寄せ」について，初めに何すれば良いのかを解説．合わせて，影響する「block要素」と「inline要素」についても解説．'
tags: ['html', 'css']
published: true
---


## **中央寄せについて**

中央寄せには，「text-align:center;」「margin: 0 auto;」「display:flex; +α」などいろいろな種類が存在する．

下記のサイトにそれぞれまとめられているので，一度目を通して見ることをおすすめする．
(できれば自分でそれぞれ動かしてみると良い)

参考サイト①：[https://www.granfairs.com/blog/staff/centering-by-css](https://www.granfairs.com/blog/staff/centering-by-css)

(「css 中央寄せ」でググった)

## **要素の種類について**

中央寄せには複数の方法があるが，実際に試してみると効く場合や効かない場合がある．

「cssが効かねえええええ」とパニックを起こしそうなときは，効かせたい要素が「block要素」なのか「inline要素」なのかを確認すると良い．

タグの種類によってどちらか異なる．それぞれ効くものと効かないものがある．

参考サイト②：[https://saruwakakun.com/html-css/basic/display](https://saruwakakun.com/html-css/basic/display)

(「block inline 違い」でググった)

## **個人的なおすすめ**

中央寄せに限らず，コーディングには単一の目的に対して複数の方法が存在することは少なくない．

経験が少ないとどれを使えばいいのかよくわからないと思うが，私は狙い通りに表示できればどれを使っても良いと考えている．

個人的なおすすめは，「困ったらとりあえずflexboxを使ってレイアウトする」．

大半のレイアウトはflexboxでゴリ押しできる．

まず1つの方法で確実に実装できるようになっておき，その後メリットデメリットを知り，いろいろな手法を使い分けられるようになれば良い．

(flexboxを推しているのは，中央寄せに限らず，できることがとても多いから)

以上だ( `･ω･)b
