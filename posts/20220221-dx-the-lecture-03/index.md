---
path: "/dx-the-lecture-03"
date: "2022-02-21"
title: "講義を DX する（完結編）"
description: "現在担当している講義フローがアナログすぎて不幸だったので DX した（完結編）．"
tags: ["lifehack", "github", "deno", "typescript"]
published: true
---

- 作成日：2022/02/21

- 更新日：2022/02/21

## はじめに

- 前半（[リンク](./dx-the-lecture-01)）
- 後半（[リンク](./dx-the-lecture-02)）
- 完結編（この記事）

これまでの尽力によって，講義資料問題は解決した．

成し遂げた DX，勝ち取った デプロイ．

CI/CD は揺るぎなく，講義はこの先も続くだろう．

だが，私には致命的な見落としがあった---

### 致命的な見落とし

そう，コストである．

結論，クラスの資料をデプロイする毎にコストがかかり続け，クラスが増える毎にコストが増え続ける．

- Vercel でデプロイする場合，同一リポジトリからは 3 ブランチしかデプロイができない（フリープラン）．
- アカウントを有料プラン（\$20 / month）にアップグレードすることで 10 ブランチまで増やすことが可能．
- しかし，10 ブランチを超えたら更に有料アカウントを追加しなければならない．

これは中長期的な運用を行う上で致命的と言わざるを得ない．

```txt
＿人人人人人人人人人人人人人人人人人＿
＞　膨らみ続ける自腹コストとか無理　＜
￣Y^Y^Y^Y^Y^Y^Y^Y^Y^Y^Y^Y^Y^Y^￣
```

## 方針

**デプロイ先を Vercel から Deno Deploy に変更する．**

Vercel はコストが増え続けるため，デプロイ先を変更するしかない．新たなデプロイ先は下記の条件を満たす必要がある．

- GitHub の任意のブランチからコードをデプロイできる．
- 単一リポジトリから任意の数のブランチを制限なくデプロイできる．
- 無料．

「Deno Deploy」は Deno が公式で提供しているホスティングサービスである．Deno 向けのデプロイ環境であり，エントリーポイントとなる ts ファイルを指定してデプロイする．

つまり，ユーザからリクエストが送られてくると指定した ts ファイルが必ず動作する．

一方，現在講義資料作成に使用している「mdbook」は HTML ファイルをビルドし，ファイルに直接リクエストを送ることで画面に内容を表示している．

．．．ということは，ts ファイルに「リクエスト先のファイル名を取得して」「サーバ上にある該当ファイルを読み込み」「レスポンスとして返す」処理を記述すればいけるんじゃね？？

しかも．．．

```
＿人人人人＿
＞　無料　＜
￣Y^Y^Y^Y^￣
```

## 実装

実装のポイントは以下の 2 つ．

- ts ファイルを準備し，以下の処理を実装する．
  - リクエスト先のファイル名を取得する．
  - サーバ上にある該当ファイルを読み込む．
  - 読み込んだデータをレスポンスとして返す．
- GitHub Actions 実行時に，上記 ts ファイルをビルド生成物の中に含める．
  - ↑ にしておくことで，デプロイ時に ts ファイルをエントリーポイントにすることができる．

## ts ファイルの実装

まず，プロジェクト直下に `server.ts` を作成する．

コードは Deno のサーバ立ち上げ（テンプレ）に処理を加えた．

ポイントは以下のとおり．

- レスポンスに付与する header にはデータの種類を指定する必要がある．
  - 使用しているファイルに対応する header をテーブルとして用意し，リクエストの拡張子を取得して対応させた．
  - ファイルの種類が少ないのでまずは力技で解決．
- 基本は「リクエスト URL = ファイル名」だが，リクエストが `/` のときは `index.html` を返す必要がある．
  - 条件分岐で強引に処理．
- 変なリクエストは `404.html` を返す必要がある．
  - 条件分岐で強引に処理．

```ts
import { serve } from "https://deno.land/std@0.120.0/http/server.ts";

async function handleRequest(request: Request): Promise<Response> {
  // 🔽 リクエストのURLを取得する．
  const { pathname } = new URL(request.url);

  // 🔽 ファイルの種類とheaderの種類を対応させたテーブルを作成．
  const contentType = {
    html: "text/html; charset=UTF-8",
    css: "text/css",
    js: "text/javascript",
    json: "application/json",
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    JPG: "image/jpeg",
    JPEG: "image/jpeg",
    png: "image/png",
    PNG: "image/png",
    gif: "image/gif",
    bmp: "image/bmp",
    svg: "image/svg+xml",
    zip: "application/zip",
  };

  const getFilePath = async (pathname) => {
    // 🔽 ファイルのデータ読み取り処理．リクエストが `/` の場合とファイルが見つからない場合を条件分岐．
    try {
      return await Deno.readFile(
        pathname === "/" ? "./index.html" : `.${pathname}`
      );
    } catch (error) {
      return await Deno.readFile("./404.html");
    }
  };

  const getHeader = (pathname, contentType) => {
    // 🔽 headerはリクエストの拡張子に応じてテーブルから指定．
    try {
      return {
        headers: {
          "content-type": contentType[pathname.split(".")[1]],
        },
      };
    } catch (error) {
      return {
        headers: {
          "content-type": "text/html",
        },
      };
    }
  };

  return new Response(
    await getFilePath(pathname),
    getHeader(pathname, contentType)
  );
}

serve(handleRequest);
```

## GitHub Actions の処理を追加

ts ファイルは完成したので，GitHub Actions でのビルド時に生成ディレクトリ（ここでは `book`）にコピーする必要がある．

単純にシェルコマンドを追記すれば OK．これで，`server.ts` がデプロイブランチのルートディレクトリに配置される．

```yml
name: github pages

on:
  push:
    branches:
      - class01-main
  pull_request:

jobs:
  deploy:
    runs-on: ubuntu-18.04
    steps:
      - uses: actions/checkout@v2

      - name: Setup mdBook
        uses: peaceiris/actions-mdbook@v1
        with:
          mdbook-version: "0.4.8"
          # mdbook-version: 'latest'

      # mdファイルのビルド
      - run: mdbook build

      # 🔽 `server.ts` を `book` ディレクトリにコピー．
      - run: |
          cp server.ts ./book
          mkdir ./book/samples
          cd samples
          find . \! -name '*.zip' -type d -exec zip -r {}.zip {} \;
          mv *.zip ../book/samples

      # ビルドされたファイル群をgh-pagesブランチにデプロイ
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        if: github.ref == 'refs/heads/class01-main'
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./book
          publish_branch: class01-deploy
```

## デプロイ

Deno Deploy から GUI 操作でデプロイできる．リポジトリとブランチを指定し，エントリーポイントとなるファイルを指定すれば秒で完了する．

ちなみに URL は下記のようになる．

Vercel の URL

```txt
https://hogeapp.vercel.app/
```

Deno Deploy の URL

```txt
https://hogeapp.deno.dev/
```

Vercel よりも更に短くなって良き．

## 結果

これらにより，講義のフローは以下のようになった．

1. マスタデータを作成しておく．**マスタデータには「Deno Deploy 実行用の ts ファイル」「ts ファイルをコピーするコマンドを書いた yml ファイル」を含めておく．**
2. 講師は，クラスが開講するタイミングで main ブランチからクラス用のブランチ（class0n-main，class0n-develop）を作成する．
3. 各クラス用ブランチの yml ファイルを編集し，GitHub Actions でビルドできるよう設定して実行する．
4. **Deno Deploy でクラス用のプロジェクトを作成し，各クラスのデプロイ用ブランチ（class0n-deploy）の `server.ts` を参照するよう設定する．**

Vercel の場合と比較してパフォーマンス低下（lighthouse のスコアで 78 → 65）があったののの，動けばええやろの精神で良いことにした．

体感それほど変わらないし．講義資料のファイルなので速度が求められる場面はほぼないと言っていい．

## まとめ

今回，デプロイ環境を Vercel から Deno Deploy に移すことでコスト問題を解決した．

### 【前回まで】

- テキスト主体の構成を採用することで，PDF によって発生する講義資料の不具合解消．
- オンラインデプロイ方式による講義資料へのアクセス改善．
- GitHub Actions を用いた講義資料とサンプルコードの管理や展開の簡略化．
- Vercel を用いることによる単一リポジトリでの講義資料運用．
- ブランチ運用最適化による修正内容の分散管理と単一講師の負荷軽減．
- 【致命傷】コストが青天井．

### 【今回】

- Deno Deploy を用いることで，単一リポジトリ複数ブランチを無限デプロイ可能にした．
- ts ファイルを入れることで，Deno Deploy での mdbook の動作を可能にした．
- コストは驚きのゼロ．

最低でも年間\$240 のコスト削減を成し遂げた．年間 ¥12,000 のワインを 2 本もらえると考えると，極めて意義の大きな仕事であった（作業時間は 2 時間程度）．

Deno Deploy は現在 Beta 3 なのだが，このままの体系で運用してくれることを切に願うッ．．！

今回は以上だ(｀･ω･)b
