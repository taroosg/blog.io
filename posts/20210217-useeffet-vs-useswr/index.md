---
path: "/rust-typescript-webassembly"
date: "2021-06-30"
title: "RustとNext.js（TypeScript）でWebAssemblyするための手順"
description: "RustでWebAssemblyしたかったが，どうせならNext.js（TypeScript）でやりたかったので手順を調べたメモ．"
tags: ["javascript", "react", "next.js", "rust", "webassembly"]
published: true
---

- 作成日：2021/06/30

- 更新日：2021/06/30

## 今回のネタ

RustといえばWebAssemblyと（多分）言われているので，Next.jsと合わせて動作するよう組み合わせる．TypeScript対応もやるぞ．

Rustで関数を書いてビルドし，Next.jsから呼び出すだけの簡単設計．

## 対象者

- Next.jsの基本的な動きや実装を把握している人．
- Rustで簡単な関数を実装できる人．
- WebAssemblyやってみたいけどよくわからん人．


## プロジェクトの作成

適当な名前でディレクトリを作成し，必要なモジュールをインストールする．

```bash
$ mkdir ts-wasm && cd ts-wasm/
```
```bash
$ npm init -y
$ npm install react react-dom next
$ npm i -D typescript @types/node @types/react
```

package.jsonの`scripts`を以下のように編集する．

```json
{
  "name": "ts-wasm",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "next",
    "build": "next build",
    "start": "next start",
    "wasm": "wasm-pack build wasm -d ../src/lib",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "next": "^11.0.1",
    "react": "^17.0.2",
    "react-dom": "^17.0.2"
  },
  "devDependencies": {
    "@types/node": "^15.12.5",
    "@types/react": "^17.0.11",
    "typescript": "^4.3.4"
  }
}

```


## tsconfig.jsonの作成

tsconfig.jsonを作成する．

```bash
$ touch tsconfig.json
```

作成したら下記の内容を記述する．

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "noImplicitAny": true,
    "module": "esnext",
    "target": "es6",
    "jsx": "preserve",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleResolution": "node"
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules"
  ]
}

```


## Rust側の準備

Rustのプロジェクトを作成する．

```bash
$ cargo new --lib wasm
```

生成された`cargo.toml`を以下のように編集する．`[package]`部分は初期状態でOK．

```toml
[package]
authors = ["dio <dio@example.com>"]
edition = "2018"
name = "wasm"
version = "0.1.0"

[lib]
crate-type = ["cdylib"]
[dependencies]
wasm-bindgen = "0.2.74"

```

`src/lib.rs`を以下のように編集する．

```rs
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn sums(value: i32) -> i32 {
  value + 1
}

```

記述したらbuildする．

```bash
$ npm run wasm
```


## Next.js側の準備

`next.config.js`を作成する．

```bash
$ touch next.config.js
```

`next.config.js`を以下のように記述する．

```js
module.exports = {
  webpack: (config, { isServer }) => {
    config.experiments = {
      asyncWebAssembly: true,
    };
    config.output.webassemblyModuleFilename = (isServer ? '../' : '') + 'static/wasm/webassembly.wasm';
    return config;
  },
};

```

フロント側のファイルを作成する．

```bash
$ mkdir -p src/pages
$ touch src/pages/index.tsx
```

作成した`index.tsx`に以下の内容を記述する．

```ts
import { sums } from "../lib/wasm_bg.wasm";
import { useState } from "react";

const App = () => {
  const [value, setValue] = useState(0);
  return (
    <>
      <input
        onChange={(e) => {
          const v = Number(e.target.value);
          !isNaN(v) && setValue(sums(v));
        }}
      />
      <p>{value}</p>
    </>
  );
};

export default App;

```

## 動作確認

以下のコマンドを実行する．

```bash
$ npm run dev
```

ブラウザの画面で数値を入力し，入力欄下に「入力値 + 1」が表示されればOK！


## まとめ

Rustでbuildしたものをそのままimportして実行することができるため意外と簡単に導入ができた．

一度連携の仕組みをつくってしまえば，後はそれぞれのコードを書いてアプリケーションの機能を拡張できるだろう．

今回は以上である( `･ω･)b
