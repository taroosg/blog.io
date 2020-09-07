---
path: "/nestjs-tutorial"
date: "2020-09-07"
title: "NestJSで簡単なtudoリストを実装するチュートリアル"
description: "Node.jsのフレームワークであるNestJSでシンプルなtodoリストを実装する"
tags: ["node.js", "nestjs", "typescript"]
published: true
---

- 作成日：2020/09/07

- 実行環境：Ubuntu 20.04 LTS

- Node.js バージョン：v14.9.0

- npm バージョン：v6.14.8

## はじめに

NestJS といういい感じのフレームワークが存在する．特徴を挙げてみると．．．

- NestJS は TypeScript 製の Node.js フレームワークである．

- 専用 CLI が準備されており，簡単にテンプレートを用意してアプリケーションを実装できる．

- Express をコアとして使用しているため，Express で使用できるものはだいたい使用できる．

Express だと自由度が高すぎて混沌とする場合でも，NestJS では各責務を分離できるアーキテクチャになっているので（多分）悲惨なことにならずに済む．

## 責務とアーキテクチャの雑な紹介

主に以下 4 つの要素で構成される．

- Module
  - 依存関係の管理．
- Controller
  - クライアントからのリクエストに対応する．
  - NestJS ではルーティングと一体になっており，リクエスト先と実行する処理の対応がわかりやすい（気がする）．
- Service
  - 各種機能を Controller に提供する．
  - 基本的なロジックはここに記述する．
- Repository
  - データを永続化する．
  - DB といい感じにやり取りするイメージ．

このように，各責務ごとに分離されているので，追加の実装や管理が行いやすくなるメリットがある．

## プロジェクト作成

早速実際に触ってみる．

任意の場所にプロジェクトフォルダ（今回は`nest-todo`）を作成し，移動．NestJS 用の CLI をインストールする．

CLI を用いると，コマンド一発でテンプレートのファイルなどが準備できる（便利）．

```bash
$ mkdir nest-todo
$ cd nest-todo/
$ npm i @nestjs/cli
+ @nestjs/cli@7.5.1
added 513 packages from 352 contributors and audited 515 packages in 41.254s

21 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

プロジェクトに必要なファイルを準備する以下のコマンドを実行．

```bash
$ npx nest new .
```

実行結果は以下．

```bash
⚡  We will scaffold your app in a few seconds..

CREATE .eslintrc.js (663 bytes)
CREATE .prettierrc (51 bytes)
CREATE README.md (3370 bytes)
CREATE nest-cli.json (64 bytes)
CREATE package.json (1891 bytes)
CREATE tsconfig.build.json (97 bytes)
CREATE tsconfig.json (339 bytes)
CREATE src/app.controller.spec.ts (617 bytes)
CREATE src/app.controller.ts (274 bytes)
CREATE src/app.module.ts (249 bytes)
CREATE src/app.service.ts (142 bytes)
CREATE src/main.ts (208 bytes)
CREATE test/app.e2e-spec.ts (630 bytes)
CREATE test/jest-e2e.json (183 bytes)

? Which package manager would you ❤️  to use? npm
✔ Installation in progress... ☕

🚀  Successfully created a new project
👉  Get started with the following commands:

$ cd .
$ npm run start


                          Thanks for installing Nest 🙏
                 Please consider donating to our open collective
                        to help us maintain this package.


               🍷  Donate: https://opencollective.com/nest
```

準備ができたらプロジェクトフォルダをエディタで開いておく．

## 必要なライブラリのインストール

今回は todo リストのデータを`sqlite`に保存する．

また，データを扱う際には`TypeORM`のライブラリを使用し，入力データのバリデーションに`class-validator`を使用するため，合わせてインストールする．

以下のコマンドを実行する．

```bash
$ npm i @nestjs/typeorm typeorm sqlite3
$ npm i class-transformer class-validator
```

特にエラー等なく完了すれば OK．

## TypeORM を用いたテーブル設計

インストールした`TypeORM`の機能を使って sqlite のテーブルを作成する．流れは以下．

- DB に接続するための設定．
- テーブルの構造を定義する Entity の作成．
- マイグレーションファイルの作成．
- マイグレーションファイルの実行（テーブルが作られる）．
- 結果の確認．

まず，NestJS から`TypeORM`を使用するため，`src/app.module.ts`を以下のように編集する．

この記述を行うことで，全てのモジュールから TypeORM の機能を呼び出すことができるようになる．

```ts
// app.module.ts
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm"; // 追記！

@Module({
  // ↓追記！
  imports: [TypeOrmModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

次に，プロジェクトルート直下（`package.json`などと同じ場所）に DB 接続設定などを記述する設定ファイル`ormconfig.json`を作成し，以下の内容を記述する．

- 今回は DB として sqlite を使用する．

- 個人用途であれば十分．

```json
// ormconfig.json
{
  "type": "sqlite",
  "database": "data/dev.sqlite",
  "entities": ["dist/entities/**/*.entity.js"],
  "migrations": ["dist/migrations/**/*.js"],
  "logging": true
}
```

追記した内容の概要は以下の通り．

- type: DB の種類．
- database: DB 名．
- entities: テーブル構成の定義（この後作成する）．
- migrations: マイグレーションファイルの場所（この後作成する）．
- logging: true にすると実行した SQL 文がわかっていい感じになる．

続いて，テーブルを作成するため`Entity`を定義する．

- `Entity`とはテーブルの構造をクラス構文で表現したもの．今回は Item テーブルを作成するので，テーブルに格納するデータの構造を定義する．

`src`ディレクトリの中に`entities`ディレクトリを作成し，その中に`items.entity.ts`を作成する．

作成した`items.entity.ts`以下の内容を記述する．

```ts
// items.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  todo: string;

  @Column("datetime")
  limit: Date;

  @Column("boolean", { default: false })
  idDone: boolean;

  @Column()
  deletePassword: string;

  @CreateDateColumn()
  readonly createdAt?: Date;

  @UpdateDateColumn()
  readonly updatedAt?: Date;
}
```

エンティティの主な部分（デコレータなど）は以下の通りに実装される．

- `@PrimaryGeneratedColumn()`をクラスの変数に付けると，それは自動増分主キーのカラムとなる．
- `@CreateDateColumn()`をつけると`created_at`になる．
- `readonly`をつけると INSERT 後にアプリケーションから変更できなくなる．

続いて以下のコマンドを実行し，テーブルを作成するためのマイグレーションファイルを作成する．

```bash
$ npm run build
$ npx typeorm migration:generate -d src/migrations -n create-item
```

実行結果（例）．ディレクトリ名などは環境で異なる．

```bash
Migration /home/hogehoge/fugadir/nest-todo/src/migrations/1599462850823-create-item.ts has been generated successfully.
```

続いて，以下のコマンドで作成したマイグレーションファイルを実行する．

- マイグレーションファイルの内容はエンティティによって生成されるため，特に手を加える必要はない．

```bash
$ npm run build
$ npx typeorm migration:run
```

実行結果（例）

```bash
query: SELECT * FROM "sqlite_master" WHERE "type" = 'table' AND "name" = 'migrations'
query: CREATE TABLE "migrations" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "timestamp" bigint NOT NULL, "name" varchar NOT NULL)
query: SELECT * FROM "migrations" "migrations" ORDER BY "id" DESC
0 migrations are already loaded in the database.
1 migrations were found in the source code.
1 migrations are new migrations that needs to be executed.
query: BEGIN TRANSACTION
query: CREATE TABLE "item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "todo" varchar NOT NULL, "limit" datetime NOT NULL, "idDone" boolean NOT NULL DEFAULT (0), "deletePassword" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))
query: INSERT INTO "migrations"("timestamp", "name") VALUES (?, ?) -- PARAMETERS: [1599462850823,"createItem1599462850823"]
Migration createItem1599462850823 has been executed successfully.
query: COMMIT
```

これでテーブルが作成されたので，下記コマンドで sqlite に入る．

```bash
$ sqlite3 data/dev.sqlite
SQLite version 3.31.1 2020-01-27 19:55:54
Enter ".help" for usage hints.
sqlite>
```

sqlite に入ったら，下記コマンドでテーブル構成を確認する．

```bash
sqlite> pragma table_info('item');
```

実行結果（例）

```bash
0|id|integer|1||1
1|todo|varchar|1||0
2|limit|datetime|1||0
3|idDone|boolean|1|0|0
4|deletePassword|varchar|1||0
5|createdAt|datetime|1|datetime('now')|0
6|updatedAt|datetime|1|datetime('now')|0
```

`items.entity.ts`で記述した内容と同様の構成になっていれば OK．

確認できたら`ctrl+d`で sqlite から出る．これでテーブルの準備は完了．

## todo アプリケーションで用いる module, controller, service の作成

下記コマンドを順番に実行し，module, controller, service を作成する．

module の作成

```bash
$ npx nest g module item
```

実行結果．ここで作成された`ItemModule`は自動的に`app.module.ts`に読み込まれる．

```bash
CREATE src/item/item.module.ts (81 bytes)
UPDATE src/app.module.ts (773 bytes)
```

controller の作成

```bash
$ npx nest g controller item
```

実行結果．ここで作成された`ItemController`は自動的に`item.module.ts`に読み込まれる．

```bash
CREATE src/item/item.controller.spec.ts (478 bytes)
CREATE src/item/item.controller.ts (97 bytes)
UPDATE src/item/item.module.ts (166 bytes)
```

service の作成

```bash
$ npx nest g service item
```

実行結果．ここで作成された`ItemService`は自動的に`item.module.ts`に読み込まれる．

```bash
CREATE src/item/item.service.spec.ts (446 bytes)
CREATE src/item/item.service.ts (88 bytes)
UPDATE src/item/item.module.ts (240 bytes)
```

`src/item/item.module.ts`を以下のように編集する．

```ts
// item.module.ts
import { Module } from "@nestjs/common";
import { ItemController } from "./item.controller";
import { ItemService } from "./item.service";
import { Item } from "src/entities/item.entity"; // 追加！
import { TypeOrmModule } from "@nestjs/typeorm"; // 追加！

@Module({
  controllers: [ItemController],
  imports: [TypeOrmModule.forFeature([Item])], // 追加！
  providers: [ItemService],
})
export class ItemModule {}
```

## 転送用のデータ構造（DTO）の作成

item 作成用の DTO をつくる．

- DTO はデータのやり取りをするときに構造やバリデーションなどを指定できる．

- 今回は`todo`と`limit`と`deletePassword`（削除用パスワード）が必須かつ文字列型になるように指定する．

`src/item/item.dto.ts`を作成し，以下の内容を記述する．

```ts
// item.dto.ts
import { IsNotEmpty, IsString } from "class-validator";

export class CreateItemDTO {
  // 空文字NG，string型指定
  @IsNotEmpty()
  @IsString()
  todo: string;

  @IsNotEmpty()
  @IsString()
  limit: string;

  @IsNotEmpty()
  @IsString()
  deletePassword: string;
}
```

DTO を用いたバリデーションを有効にする設定をする．

`src/main.ts`を以下の用に編集する．

```ts
// main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common"; // 追記！

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 以下追記！
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
```

## サービスに CRUD のロジックを実装する

Item サービス（メインの処理を記述するファイル）に Repository を注入する．

- Repository が DB のテーブルとやり取りをしてくれるので，サービスでは Repository に対して CRUD などの処理を命令する構造となる．

- `@InjectRepository(Memo)`と書けば DI コンテナが登録された Repository を生成して渡してくれる．

`src/item/item.service.ts`を以下のように編集する．これで`itemRepository`に対して指示を出せばテーブルに反映させることができるようになる．

```ts
// item.service.ts
import { Injectable } from "@nestjs/common";
import { Item } from "src/entities/item.entity"; // 追記！
import { Repository } from "typeorm"; // 追記！
import { InjectRepository } from "@nestjs/typeorm"; // 追記！

@Injectable()
export class ItemService {
  // ここから追記！
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>
  ) {}
  // ここまで追記！
}
```

サービスに CRUD のロジックを記述していく．`src/item/item.service.ts`を以下のように編集する．

- 細かい関数などは`TypeORM`のドキュメントなどを参照．

```ts
// item.service.ts
import { Injectable } from "@nestjs/common";
import { Item } from "src/entities/item.entity";
import { Repository, InsertResult, UpdateResult, DeleteResult } from "typeorm"; // 編集！
import { InjectRepository } from "@nestjs/typeorm";
import { CreateItemDTO } from "./item.dto"; // 追記！

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>
  ) {}

  // テーブルの全データを取得する関数を定義
  async findAll(): Promise<Item[]> {
    return await this.itemRepository.find();
  }

  // テーブルにアイテムを追加する関数を定義
  async create(item: CreateItemDTO): Promise<InsertResult> {
    return await this.itemRepository.insert(item);
  }

  // idを指定してテーブルから1件のデータを取得する関数を定義
  async find(id: number): Promise<Item> | null {
    return await this.itemRepository.findOne({ id: id });
  }

  // idを指定してテーブルのデータを更新する関数を定義
  async update(id: number, item): Promise<UpdateResult> {
    return await this.itemRepository.update(id, item);
  }

  //  idを指定してテーブルのデータを削除する関数を定義
  async delete(id: number): Promise<DeleteResult> {
    return await this.itemRepository.delete(id);
  }
}
```

## コントローラからのサービス呼び出し

コントローラにサービスを注入する．DI コンテナが ItemService 型の引数があれば自動で生成される．

- 以下では，とりあえず Create 処理と Read 処理のルーティングを実装する．

`src/item/item.controller.ts`を以下の用に編集する．

```ts
// item.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from "@nestjs/common"; // 編集！
import { ItemService } from "./item.service"; // 追記！
import { Item } from "../entities/item.entity"; // 追記！
import { CreateItemDTO } from "./item.dto"; // 追記！
import { InsertResult, UpdateResult, DeleteResult } from "typeorm"; // 追記！

@Controller("item")
export class ItemController {
  // サービスの呼び出し
  constructor(private readonly service: ItemService) {}

  // `item`のURIへのGETメソッドでデータ全件取得．サービスの`findAll()`関数を実行．
  @Get()
  async getItemList(): Promise<Item[]> {
    return await this.service.findAll();
  }

  // `item`のURIへのPOSTメソッドでデータ新規登録．
  @Post()
  async addItem(@Body() item: CreateItemDTO): Promise<InsertResult> {
    return await this.service.create(item);
  }

  // `item/id番号`のURIへのGETメソッドでid指定で1件データ取得．
  @Get(":id")
  async getItem(@Param("id") id: string): Promise<Item> {
    return await this.service.find(Number(id));
  }
}
```

## Create と Read の動作確認

下記コマンドでローカルサーバーを立ち上げる．

- 本コマンドを実行すると，ファイル保存時に自動で差分更新してくれるため，一度立ち上げたら立ち上げっぱなしで問題ない．

- 終了する場合は`ctrl + c`．

```bash
$ npm run start:dev
```

実行結果

```bash
...省略
Nest application successfully started +5ms
```

ブラウザで`http://localhost:3000/item`にアクセスし，空の配列が表示されれば OK．

続いて新規データを追加する．ターミナル等で下記を実行．

```bash
$ curl http://localhost:3000/item -X POST -d "todo=test&limit=2020-09-07&deletePassword=123456"
```

実行結果

```bash
{"identifiers":[{"id":1}],"generatedMaps":[{"id":1,"idDone":false,"createdAt":"2020-09-07T08:36:40.000Z","updatedAt":"2020-09-07T08:36:40.000Z"}],"raw":1}
```

上記の要領で，数件データを登録しておく（以降の例では計 4 件のデータを登録している）．

再度ブラウザで`http://localhost:3000/item`にアクセスし，下記のように登録したデータが表示されれば OK．

```json
[
  {
    "id": 1,
    "todo": "test",
    "limit": "2020-09-07T00:00:00.000Z",
    "idDone": false,
    "deletePassword": "123456",
    "createdAt": "2020-09-07T08:36:40.000Z",
    "updatedAt": "2020-09-07T08:36:40.000Z"
  },
  {
    "id": 2,
    "todo": "hoge",
    "limit": "2020-09-10T00:00:00.000Z",
    "idDone": false,
    "deletePassword": "111111",
    "createdAt": "2020-09-07T08:40:36.000Z",
    "updatedAt": "2020-09-07T08:40:36.000Z"
  },
  {
    "id": 3,
    "todo": "fuga",
    "limit": "2020-09-15T00:00:00.000Z",
    "idDone": false,
    "deletePassword": "222222",
    "createdAt": "2020-09-07T08:41:42.000Z",
    "updatedAt": "2020-09-07T08:41:42.000Z"
  },
  {
    "id": 4,
    "todo": "piyo",
    "limit": "2020-09-12T00:00:00.000Z",
    "idDone": false,
    "deletePassword": "333333",
    "createdAt": "2020-09-07T08:41:56.000Z",
    "updatedAt": "2020-09-07T08:41:56.000Z"
  }
]
```

また，ブラウザで`http://localhost:3000/item/2`のように id を指定すると，指定したデータ単体にアクセスできる．

実行結果

```json
{
  "id": 2,
  "todo": "hoge",
  "limit": "2020-09-10T00:00:00.000Z",
  "idDone": false,
  "deletePassword": "111111",
  "createdAt": "2020-09-07T08:40:36.000Z",
  "updatedAt": "2020-09-07T08:40:36.000Z"
}
```

ここまでで Create と Read の処理は完了．

## Update 処理の追加

update 処理時の DTO を定義する．
`item/item.dto.ts`を以下のように編集する．

```ts
import { IsNotEmpty, IsString, IsOptional } from "class-validator"; // 編集！

export class CreateItemDTO {
  @IsNotEmpty()
  @IsString()
  todo: string;

  @IsNotEmpty()
  @IsString()
  limit: string;

  @IsNotEmpty()
  @IsString()
  deletePassword: string;
}

// ↓追記！
export class UpdateItemDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  todo: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  limit: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  isDone: string;
}
```

コントローラに Update の処理を追加する．

```ts
// item.controller.ts
// ...省略
import { CreateItemDTO, UpdateItemDTO } from "./item.dto";  // 編集！

// ...省略
// `item/id番号/update`のURIにPUTメソッドで指定したデータの更新を実行．
  @Put(":id/update")
  async update(
    @Param("id") id: string,
    @Body() itemData: UpdateItemDTO,
  ): Promise<UpdateResult> {
    const newData = !itemData.isDone
      ? itemData
      : {
        ...itemData,
        ...{ isDone: itemData.isDone.toLowerCase() === "true" },
      };
    return await this.service.update(Number(id), newData);
  }
// ...
```

Update 処理の動作確認を行う．

```bash
$ curl http://localhost:3000/item/2/update -X PUT -d "limit=2020-09-30"
```

実行結果

```bash
{"generatedMaps":[],"raw":[]}
```

ブラウザで`http://localhost:3000/item/2`などにアクセスし，更新したデータが反映されていれば OK．

## Delete の処理

データの削除は予め設定した`deletePassword`を送信して削除する仕組みにする．

まず，Delete 時の dto を定義する．deletePassword のみ必要な構造．

`item/item.dto.ts`に追記．

```ts
// ...
// ↓追記
export class DeleteItemDTO {
  @IsString()
  @IsNotEmpty()
  deletePassword: string;
}
```

`item/item.dto.ts`に以下の処理を追記する．

```ts
// item/item.service.ts
// ...省略（Create，Update，Deleteの処理など）

// 追記！（パスワードを使用した削除）
async deleteByPassword(
  id: number,
  deletePassword: string,
): Promise<DeleteResult> {
  const targetItem = await this.find(id);
  if (!targetItem) {
    return Promise.reject(new Error("Missing Item."));
  }
  if (targetItem.deletePassword !== deletePassword) {
    return Promise.reject(new Error("Incorrect password"));
  }
  return await this.itemRepository.delete(id);
}
```

`item/item.controller.ts`に以下の処理を追記する．

```ts
// item.controller.ts
// ...省略
import { CreateItemDTO, UpdateItemDTO, DeleteItemDTO } from './item.dto';  // 編集！
// ...省略

// パスワードなしで即削除する処理（動作確認用）
@Delete(":id/delete")
async delete(@Param("id") id: string): Promise<DeleteResult> {
  return await this.service.delete(Number(id));
}

// POSTメソッドでパスワードを送信して削除する処理
@Post(":id/delete")
async deleteItem(
  @Param("id") id: string,
  @Body() deleteItem: DeleteItemDTO,
) {
  return await this.service.deleteByPassword(
    Number(id),
    deleteItem.deletePassword,
  );
}
```

Delete 処理の動作確認を行う．

以下のコマンドを実行する（直接削除する場合）．

```bash
$ curl http://localhost:3000/item/1/delete -X DELETE
```

以下のコマンドを実行する場合（パスワードを使用して削除する場合）．データ登録時に設定したパスワードを入力する．

```bash
$ curl http://localhost:3000/item/2/delete -X POST -d "deletePassword=111111"
```

ブラウザからアクセスして該当するデータが削除されていれば OK．

## 削除パスワードの正誤判定など

コントローラに`HttpException`と`HttpStatus`を追記

```ts
// item.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from "@nestjs/common"; // 編集！
// ...省略
```

削除処理部分を変更する．

```ts
// item.controller.ts
@Post(":id/delete")
async deleteItem(
  @Param("id") id: string,
  @Body() deleteItem: DeleteItemDTO,
) {
  const item = this.service.find(Number(id));
  // idで検索したけど該当するアイテムが見つからなかったとき
  if (!item) {
    throw new HttpException(
      {
        status: HttpStatus.NOT_FOUND,
        error: `Missing item(id: ${id}).`,
      },
      404,
    );
  }
  try {
    await this.service.deleteByPassword(
      Number(id),
      deleteItem.deletePassword,
    );
  } catch (e) {
    // 送信したパスワードが間違っていたとき
    if (e.message === "Incorrect password") {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "Incorrect password",
        },
        403,
      );
    }
    // パスワード合ってるけどなんかイマイチだったとき
    throw new HttpException(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Internal server error.",
      },
      500,
    );
  }
  return;
}
```

以下の動作が確認できれば OK．

- 間違ったパスワードでリクエストして 403 エラーが出る．
- 正しいパスワードでリクエストして該当するデータが削除される．

## Heroku にデプロイしてみる

デプロイは Github 上のソースコードを Heroku から取得する構成にする．このような構成にすることで，編集したソースコードを Github 上のリポジトリに push すると自動的に Heroku にデプロイされる仕組みになる．

アカウントがない場合は Github と Heroku のアカウントを用意しておく（どちらも無料で作成可能）．

### 設定ファイル準備&本番環境準備

まず，Heroku 用の設定ファイルを作成しておく．

プロジェクトルート直下に`Procfile`を作成する（拡張子はつけない）．

作成したファイルに以下の内容を記述する．

```txt
web: npm run start:prod
```

続いて，`src/main.ts`を以下のように編集する．

```ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 3000); // 編集！
}
bootstrap();
```

### Github へ push

Github 上で任意のリポジトリを作成し，作成したアプリケーションを push しておく．

### Heroku 上でのアプリケーション作成

Heroku にログインし，アプリケーションを作成する．App name は任意，region も適当で OK（初期値が US なのでそのままで問題なし）．

- アプリケーション作成後の画面で`Deployment method`の`Github`を選択する．

- 上で push したリポジトリを選択し，`connect`をクリック．

- すぐ下に`Automatic deploys`が表示されるので，お好みで設定．有効にしておくと Github の指定したブランチ（デフォルトは master）に push することで自動的に Heroku にデプロイされる．本記事では有効にしておく．

- この状態では再度 Github 上に push しないとデプロイが始まらないので，`Automatic deploys`の下にある`Manual deploy`の`Deploy Branch`ボタンをクリックするとすぐにデプロイできる．

- 上のタブの`Overview`をクリックし，右側の`View build progress`リンクからデプロイのログを見ることができる．

- ログに`https://アプリケーション名.herokuapp.com/ deployed to Heroku`のメッセージが表示されたらデプロイ完了．

### 動作確認

### Read

ブラウザで`https://アプリケーション名.herokuapp.com/item`にアクセスし，ローカルサーバーで実行したときと同じデータが表示されれば OK．

### Create

下記コマンドでデータ追加．

```bash
$ curl http://アプリケーション名.herokuapp.com/item -X POST -d "todo=deploy&limit=2020-09-07&deletePassword=123456"
```

Read で表示した URL にアクセスし，データが追加されていれば OK．

### Update

下記コマンドでデータを更新する．

```bash
$ curl http://アプリケーション名.herokuapp.com/item/4/update -X PUT -d "limit=2020-09-30"
```

Read で表示した URL にアクセスし，データが更新されていれば OK．

### Delete

下記コマンドでデータを削除する．パスワードは登録時に設定した値を使用する．

```bash
$ curl http://アプリケーション名.herokuapp.com/item/4/delete -X POST -d "deletePassword=333333"
```

Read で表示した URL にアクセスし，データが削除されていれば OK．

今回はここまで( `･ω･)b
