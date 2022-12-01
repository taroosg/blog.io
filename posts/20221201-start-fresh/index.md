---
path: "/start-fresh"
date: "2022-12-01"
title: "Denoのフレームワーク「Fresh」で爆速開発"
description: "Denoのフレームワークを用いて爆速で環境構築からデプロイまで．"
tags: ["deno", "typescript", "fresh"]
published: true
---

- 作成日：2022/12/01

- 更新日：2022/12/01

## 今回のネタ

- Deno のフレームワークである Fresh を使用してみた．

- 環境構築からデプロイまでを一気通貫で行えて素晴らしかった．

- おみくじとじゃんけんの実装とデプロイまでをハンズオン形式でまとめた．

## 成果物

ソース

[https://github.com/taroosg/fresh-janken](https://github.com/taroosg/fresh-janken)

デプロイ（おみくじ）

[https://taroosg-fresh-janken.deno.dev/omikuji_page](https://taroosg-fresh-janken.deno.dev/omikuji_page)

デプロイ（じゃんけん）

[https://taroosg-fresh-janken.deno.dev/janken_page](https://taroosg-fresh-janken.deno.dev/janken_page)

## 動作環境

- macOS 13.0.1

- deno 1.28.2

- typescript 4.8.3

- fresh@1.1.2

## 対象者

- TypeScript で web アプリケーションを開発して爆速でデプロイまでしたい人．

- web アプリケーションの基本的な動き方を把握している人．

## もくじ

- Deno のインストール

- Fresh のプロジェクト作成

- ルーティングとページの作成

- おみくじの実装（フロントエンド）

- じゃんけんの実装（サーバサイド）

- デプロイ

## Deno のインストール

コマンド実行するだけ．mac だったら多分 Homebrew を使うのが一番楽．

[https://deno.land/manual@v1.28.2/getting_started/installation](https://deno.land/manual@v1.28.2/getting_started/installation)

## Fresh のプロジェクト作成

コマンド一発で OK．TailWindCSS を自動的に準備してくれるので使用する場合は y ですすめる．VS Code の設定もしてくれるのでこちらも必要に応じて y ですすめる．

```bash
deno run -A -r https://fresh.deno.dev PROJECT_NAME

  🍋 Fresh: the next-gen web framework.

Let\'s set up your new Fresh project.

Fresh has built in support for styling using Tailwind CSS. Do you want to use this? [y/N] y
Do you use VS Code? [y/N] y
The manifest has been generated for 3 routes and 1 islands.

Project initialized!

Enter your project directory using cd PROJECT_NAME.
Run deno task start to start the project. CTRL-C to stop.

Stuck? Join our Discord https://discord.gg/deno

Happy hacking! 🦕

```

ドキュメントが親切なので見ながら進めれば間違いない．

[https://fresh.deno.dev/docs/getting-started/create-a-project](https://fresh.deno.dev/docs/getting-started/create-a-project)

プロジェクトを作成したら以下コマンドで立ち上げる．停止させるときは `ctrl + c` で OK．

```bash
deno task start
```

立ち上げるとカウンターの画面が表示される．このページは `index.tsx` で，ページ内で `islands/Counter` と `components/Button` を読み込んでいる．

## ルーティングとページの作成

早速プロダクトの実装を進めていく．本記事ではおみくじとじゃんけんの処理を実装するが，Fresh はフルスタックのフレームワークであり，フロントエンドとサーバサイド双方の実装を行うことができる．

おみくじはフロントエンドの実装，じゃんけんはサーバサイドの実装を行う．

プロジェクト内は以下の構成となっている．

```txt
.
├── README.md
├── components
│   └── Button.tsx
├── deno.json
├── deno.lock
├── dev.ts
├── fresh.gen.ts
├── import_map.json
├── islands
│   └── Counter.tsx
├── main.ts
├── routes
│   ├── [name].tsx
│   ├── api
│   │   └── joke.ts
│   └── index.tsx
├── static
│   ├── favicon.ico
│   └── logo.svg
└── twind.config.ts

```

ページを作成する際には `routes` 内にファイルを作成するだけで良い．Fresh はファイルベースのルーティングとなっており，ディレクトリとファイルでルーティングを行う．Next.js で開発経験のある人には馴染み深い．

以下のファイルを作成しよう．

- `routes/omikuji_page.tsx`

- `routes/janken_page.tsx`

続いて，それぞれのファイルに下記の内容を記述する．

```tsx
// omikuji_page.tsx

import { Head } from "$fresh/runtime.ts";

export default function Omikuji_page() {
  return (
    <>
      <Head>
        <title>Omikuji</title>
      </Head>
      <h1>おみくじのページ</h1>
    </>
  );
}
```

```tsx
// janken_page.tsx

import { Head } from "$fresh/runtime.ts";

export default function Janken_page() {
  return (
    <>
      <Head>
        <title>Janken</title>
      </Head>
      <h1>じゃんけんのページ</h1>
    </>
  );
}
```

このように，Fresh ではコンポーネントの形式で画面の実装を行う．React や Next.js を扱った経験のある人ならすぐに慣れることができる．

コードを書いたら下記の URL にアクセスして動作を確認しておこう（それぞれ「おみくじのページ」と「じゃんけんのページ」が表示されれば OK）．

- `localhost:8000/omikuji_page`

- `localhost:8000/janken_page`

## おみくじの実装（フロントエンド）

続いて，おみくじの処理を書いてみよう．

Fresh では，基本的に JavaScript を読み込まず，動的な処理が記述されているコンポーネントが含まれる場合のみ読み込む．

`island` ディレクトリ以下におみくじ用のコンポーネントである `omikuji.tsx` を作成して以下の内容を記述しよう．

```tsx
// omikuji.tsx

import { useState } from "preact/hooks";

export default function Omikuji() {
  const getOmikuji = () =>
    ["大吉", "中吉", "小吉", "凶", "大凶"][~~(Math.random() * 5)];

  const [omikujiResult, setOmikujiResult] = useState("...");

  return (
    <>
      <button onClick={() => setOmikujiResult(getOmikuji())}>
        おみくじをひく
      </button>
      <p>今日の運勢は{omikujiResult}です</p>
    </>
  );
}
```

`omikuji_page.tsx` の内容を以下のように編集する．

```tsx
// omikuji_page.tsx

import { Head } from "$fresh/runtime.ts";
import Omikuji from "../islands/omikuji.tsx";

export default function Omikuji_page() {
  return (
    <>
      <Head>
        <title>Omikuji</title>
      </Head>
      <h1>おみくじのページ</h1>
      <Omikuji />
    </>
  );
}
```

`localhost:8000/omikuji_page` にアクセスし，「おみくじを引く」ボタンをクリックしてみよう．毎回ランダムにおみくじの結果が表示されれば OK．

これらの実装も React などで開発を行った経験があればスムーズに進められるだろう．

## じゃんけんの実装（サーバサイド）

続いて，じゃんけんの処理を実装する．

じゃんけんはプルダウンで自分の手を選択し，送信ボタンクリックでサーバに自分の手を POST で送信して結果を画面に表示する実装とする．

サーバサイドでの動きは以下の流れとなる．

1. GET や POST に応じてハンドラーを記述しておく．`async GET(){...}` `async POST(){...}` のように記述し，それぞれ GET と POST でリクエストを受けた際に{}内のコードが実行される．

2. ハンドラーは `ctx.render(data)` を返す．ここに入力した値がコンポーネントに渡される．

3. コンポーネントは `{ data }` の形で入力値を受け取り，コンポーネント内で使用することができる．

上記全てはサーバで実行され，構成された HTML のみがブラウザに渡される SSR の仕組みとなっている．

`janken_page.tsx` を以下のように編集する．

```tsx
// janken_page.tsx

import { Head } from "$fresh/runtime.ts";
import { Handlers } from "$fresh/server.ts";

// じゃんけんの結果をまとめる型
interface JankenResult {
  userHand: string;
  computerHand: string;
  winLose: string;
}

// じゃんけん関連の関数
const getComputerHand = () => [0, 1, 2][~~(Math.random() * 3)];

const getWinLose = (userHand: number | undefined, computerHand: number) =>
  [
    ["draw", "win", "lose"],
    ["lose", "draw", "win"],
    ["win", "lose", "draw"],
  ][userHand ?? 0][computerHand];

const getJankenHand = (jankenIndex: number) =>
  ["グー", "チョキ", "パー"][jankenIndex];

// ハンドラーの実装
export const handler: Handlers<JankenResult> = {
  // GETでページを開いた際には「待機中」のメッセージをコンポーネントに渡す．
  async GET(_, ctx) {
    const result: JankenResult = {
      userHand: "待機中",
      computerHand: "待機中",
      winLose: "待機中",
    };
    return ctx.render(result);
  },
  // POSTでリクエストされた場合（じゃんけんの手が送信されてきた場合）はじゃんけんの処理を実行して結果をコンポーネントに渡す．
  async POST(req, ctx) {
    const formData = await req.formData();
    const userHandIndex = Number(formData.get("user_hand"));
    const userHand = getJankenHand(userHandIndex);
    const computerHandIndex = getComputerHand();
    const computerHand = getJankenHand(computerHandIndex);
    const winLose = getWinLose(userHandIndex, computerHandIndex);
    const result = { userHand, computerHand, winLose };
    return ctx.render(result);
  },
};

// コンポーネントはじゃんけんの結果を受け取る
export default function Janken_page({ data }: { data: JankenResult }) {
  return (
    <>
      <Head>
        <title>Janken</title>
      </Head>
      <h1>じゃんけんのページ</h1>
      <h2>じゃんけんをする</h2>
      <form action="" method="POST">
        <select
          name="user_hand"
          defaultValue={["グー", "チョキ", "パー"]
            .indexOf(data.userHand)
            .toString()}
        >
          {["グー", "チョキ", "パー"].map((x, i) => (
            <option value={i}>{x}</option>
          ))}
        </select>
        <button type="submit">送信</button>
      </form>
      <h2>結果</h2>
      <p>自分の手：{data.userHand}</p>
      <p>相手の手：{data.computerHand}</p>
      <p>結果：{data.winLose}</p>
    </>
  );
}
```

コードを記述したら動作確認しよう．`localhost:8000/janken_page` にアクセスし，自分の手を選択して送信して結果が表示されれば OK！

Fresh でアプリケーションを実装する際には，このようなサーバサイドの処理がメインとなるだろう．ハンドラーを実装し，その中で外部 API や DB とのやり取りのコードを記述することで実装を進められるだろう．

## デプロイ

デプロイには Deno 公式が提供する Deno Deploy を使用する．GitHub 連携できるためとても簡単である．

まずは実装した Fresh のコードを GitHub に push しておく．

Deno Deploy にアクセスし，GitHub アカウントで認証しておく．

[https://deno.com/deploy](https://deno.com/deploy)

サインインしたら，プロジェクトを作成する．New Project ボタンをクリックすると画面が変わるので，GitHub リポジトリを選択する．「Add Repository」をクリックすれば OK．

「Add Repository」をクリックすると自動的に GitHub のページが開く．連携したいリポジトリ（Fresh のコードを push したリポジトリ）を選択し，Save をクリックする．

「Install Success」が表示されたら Deno Deploy のページへ戻り，連携するリポジトリを選択する．「main ブランチ」→「Automatic」→「main.ts」の順にクリックして「Link」をクリックする．

少し待つと画面が変わるので，「View」をクリックするとデプロイ先を開く事ができる．

デプロイ先の URL の後ろに `/omikuji_page` と `/janken_page` をつけてページを開き，実装した内容が動作していることを確認しよう！

ブラウザの操作だけで完結！すごい！

## まとめ

本記事では Fresh を使用した基本的な実装を行い，デプロイまでの手順を解説した．

Deno Deploy を含めて TypeScript での開発からデプロイまで全てを賄えるため非常に強力である．DB や外部 API との連携で完結する実装であればだいたい事足りそうな予感．

興味出たらぜひ触ってみよう！

今回は以上だ(｀･ω･)b
