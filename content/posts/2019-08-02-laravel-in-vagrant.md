---
title: vagrantを使用したlaravelの環境構築
date: 2019-08-02
published: true
tags: ['php', 'laravel', 'vagrant']
series: false
canonical_url: false
description: "laravelで開発したいんだけど開発環境はどうすればよいのだ．．．"
slug: laravel-in-vagrant
---

作成日：2019/08/02

更新日：2019/08/02

実行OS：macOS 10.14.6


## **用語の解説**

- virtualbox
virtualboxは仮想のPC．PCの中に仮想のPC（virtual machine）を入れることができる．

- vagrant
vagrantはvirtualboxをCUIで操作するためのツール．virtualboxのみでも仮想マシンを構築できるが面倒くさいのでvagrantを使用する．

- vagrant box
virtual machineの元となるテンプレート．boxファイルは自分で作ることもできる（今回はlaravel公式が準備してくれているものを使用する）．

- vagrant file
vagrant fileは，（virtualbox上の）仮想マシンの構築設定などを記述するためのファイル．例えば，「OSはCentOS7」とか「接続IPは192.168.30.10」など．

vagrantのコマンドを実行すると，自動でvagrant fileが読み込まれ，記述内容に従って仮想マシンが構築される仕組み．

## **virtualboxとvagrantの準備**

下記urlからvirtualboxのダウンロード -> インストール

[https://www.virtualbox.org/](https://www.virtualbox.org/)

下記urlからvagrantのダウンロード -> インストール．

[https://www.vagrantup.com/downloads.html](https://www.vagrantup.com/downloads.html)

※ macOSの場合

システム環境設定 -> セキュリティとプライバシーで「開発元"Oracle America, Inc."のシステムソフトウェアの読み込みがブロックされました」の右側の「許可」をクリック．

## **laravel用vagrant boxの準備**

macはターミナル，windowsはgit bashで以下のコマンドを実行する．vagrantでlaravelの環境を作成するための材料を取得する．

```bash
$ vagrant box add laravel/homestead
```

時間かかるのでひたすら待つ．何か選択しろ的なメッセージが出た場合はvirtualboxを選択．

※ 下記エラーが出た場合は再度上記コマンドを実行する．何回かやっていればそのうちうまくいく．

```bash
An error occurred while downloading the remote file. The error
message, if any, is reproduced below. Please fix this error and try
again.

OpenSSL SSL_read: SSL_ERROR_SYSCALL, errno 10054
```

うまくいった場合の実行結果
```bash
==> box: Loading metadata for box 'laravel/homestead'
    box: URL: https://vagrantcloud.com/laravel/homestead
==> box: Adding box 'laravel/homestead' (v8.0.1) for provider: virtualbox
    box: Downloading: https://vagrantcloud.com/laravel/boxes/homestead/versions/8.0.1/providers/virtualbox.box
    box: Download redirected to host: vagrantcloud-files-production.s3.amazonaws.com
==> box: Successfully added box 'laravel/homestead' (v8.0.1) for 'virtualbox'!
```

適当な場所にhomesteadをダウンロードする．（今回はホームディレクトリ直下にHomesteadフォルダを作成してダウンロード）homesteadはlaravel公式が提供するvagrant box．

```bash
$ git clone https://github.com/laravel/homestead.git ~/Homestead
```

実行結果
```bash
Cloning into 'Homestead'...
remote: Enumerating objects: 3367, done.
remote: Total 3367 (delta 0), reused 0 (delta 0), pack-reused 3367
Receiving objects: 100% (3367/3367), 720.54 KiB | 816.00 KiB/s, done.
Resolving deltas: 100% (2043/2043), done.
```

以下のコマンドでHomesteadディレクトリに移動する．
```bash
$ cd ~/Homestead
```

以下のコマンドで初期化する．

```bash
$ bash init.sh
```

実行結果
```bash
Homestead initialized!
```

自動でHomestead.yaml が作成される（設定ファイルであり，後で結構編集する）．

## **SSHキーの準備**

ssh接続するための鍵ファイルがあるかどうか確認する．

```bash
$ ls -a ~/.ssh
```

実行結果（例）
```bash
./           .DS_Store    id_rsa       known_hosts
../          config*      id_rsa.pub
```

id_rsaがあればOK．なければ以下のコマンドで作成する．
```bash
$ cd ~
$ ssh-keygen -t rsa
```

実行結果
```bash
Enter file in which to save the key
=>そのままEnter

Enter passphrase
=>任意のpassを入力してenter．表示されないので注意．
```
※ 入力したpassphraseを忘れると死．

再度sshキーを確認
```bash
$ ls -a ~/.ssh
```

実行結果（例）
```bash
./           .DS_Store    id_rsa       known_hosts
../          config*      id_rsa.pub
```

## **Homestead.yamlの確認**

再びHomesteadディレクトリに移動．
Homestead.yaml（設定ファイル）を確認する．
以下を実行

```bash
$ vi Homestead.yaml
```

ここの部分を
```yaml
ip: "192.168.10.10"
folders:
    - map: ~/code
      to: /home/vagrant/code
sites:
    - map: homestead.test
      to: /home/vagrant/code/public
databases:
    - homestead
```

下記のように変更する（ipの変更を忘れずに！）

```diff
-ip: "192.168.10.10"
+ip: "192.168.30.10"
folders:
    - map: ~/code
      to: /home/vagrant/code

+   - map: ~/code/project01
+     to: /home/vagrant/code/project01

sites:
    - map: homestead.test
      to: /home/vagrant/code/public

+   - map: project01.test
+     to: /home/vagrant/code/project01/public

databases:
    - homestead
+   - homestead_project01
```

~/codeが実際に記述したコードを格納する場所になる．

【重要】ルートディレクトリ直下にcodeディレクトリを作成しておく．

## **hostsファイルの設定**

ブラウザからアクセスできるよう設定を変更する．

macOSは下記のコマンドでファイルを開く．
```bash
$ sudo vi /etc/hosts
```

windowsは下記の場所にファイルがある．管理者権限でメモ帳を開き，下記ファイルを編集する．
`C:\Windows\System32\drivers\etc\hosts`

開いたファイルの一番下に以下を追記
```text
192.168.30.10 project01.test
```

## **仮想マシンの立ち上げ**

以下のコマンドで仮想マシンを起動する．時間かかるのでひたすら待つ．

```bash
$ vagrant up
```

※ 一度起動してからHomestead.yamlを追記/修正したときはこちらを実行する．

```bash
$ vagrant up --provision
```

※ 失敗するとエラーが出る．
```bash
The specified host network collides with a non-hostonly network!
This will cause your specified IP to be inaccessible. Please change
the IP or name of your host only network so that it no longer matches that of
a bridged or non-hostonly network.
```

その時は，Homestead.yaml（設定ファイル）を見直す．以下を実行して修正．

```bash
$ vi Homestead.yaml
```

修正したら以下を実行．
```bash
$ vagrant up --provision
```

立ち上げがうまくいった場合は以下が表示される．
```bash
Bringing machine 'homestead-7' up with 'virtualbox' provider...
==> homestead-7: Checking if box 'laravel/homestead' version '7.1.0' is up to date...
==> homestead-7: Clearing any previously set forwarded ports...
==> homestead-7: Fixed port collision for 22 => 2222. Now on port 2200.
==> homestead-7: Clearing any previously set network interfaces...
==> homestead-7: Preparing network interfaces based on configuration...
    homestead-7: Adapter 1: nat
    homestead-7: Adapter 2: hostonly
==> homestead-7: Forwarding ports...
    homestead-7: 80 (guest) => 8000 (host) (adapter 1)
    homestead-7: 443 (guest) => 44300 (host) (adapter 1)
    homestead-7: 3306 (guest) => 33060 (host) (adapter 1)
    homestead-7: 4040 (guest) => 4040 (host) (adapter 1)
    homestead-7: 5432 (guest) => 54320 (host) (adapter 1)
    homestead-7: 8025 (guest) => 8025 (host) (adapter 1)
    homestead-7: 27017 (guest) => 27017 (host) (adapter 1)
    homestead-7: 22 (guest) => 2200 (host) (adapter 1)
==> homestead-7: Running 'pre-boot' VM customizations...
==> homestead-7: Booting VM...
==> homestead-7: Waiting for machine to boot. This may take a few minutes...
    homestead-7: SSH address: 127.0.0.1:2200
    homestead-7: SSH username: vagrant
    homestead-7: SSH auth method: private key
==> homestead-7: Machine booted and ready!
==> homestead-7: Checking for guest additions in VM...
==> homestead-7: Setting hostname...
==> homestead-7: Configuring and enabling network interfaces...
==> homestead-7: Mounting shared folders...
    homestead-7: /vagrant => /Users/hoge/fuga/laravel/Homestead
    homestead-7: /home/vagrant/code => /Users/hoge/code
==> homestead-7: Machine already provisioned. Run `vagrant provision` or use the `--provision`
==> homestead-7: flag to force provisioning. Provisioners marked to run always will still run.
```

## **仮想マシンへログイン**

起動に成功したら仮想マシンにログインする．以下のコマンドを実行．

```bash
$ vagrant ssh
```

※ ログアウトするときは
```bash
$ exit
```

※ 仮想マシンを終了するときは
```bash
$ vagrant halt
```

ログインの実行結果
```bash
Welcome to Ubuntu 18.04.2 LTS (GNU/Linux 4.15.0-55-generic x86_64)

Thanks for using
 _                               _                 _
| |                             | |               | |
| |__   ___  _ __ ___   ___  ___| |_ ___  __ _  __| |
| '_ \ / _ \| '_ ` _ \ / _ \/ __| __/ _ \/ _` |/ _` |
| | | | (_) | | | | | |  __/\__ \ ||  __/ (_| | (_| |
|_| |_|\___/|_| |_| |_|\___||___/\__\___|\__,_|\__,_|

* Homestead v9.0.0 released
* Settler v8.0.0 released

0 packages can be updated.
0 updates are security updates.
```

## **仮想マシンの状態確認**

ログインしたら以下を実行してcodeディレクトリに移動する．

$の前がvagrant@homestead:~になっている点に注意．

```bash
vagrant@homestead:~$ cd code
```

phpのバージョンを確認する．

```bash
vagrant@homestead:~/code$ php -v
```

実行結果
```bash
PHP 7.3.7-2+ubuntu18.04.1+deb.sury.org+1 (cli) (built: Jul 25 2019 11:44:59) ( NTS )
Copyright (c) 1997-2018 The PHP Group
Zend Engine v3.3.7, Copyright (c) 1998-2018 Zend Technologies
    with Zend OPcache v7.3.7-2+ubuntu18.04.1+deb.sury.org+1, Copyright (c) 1999-2018, by Zend Technologies
```

7.3.7なのでこのままでOK．

composerのバージョンを確認する．
```bash
vagrant@homestead:~/code$ composer
```

実行結果
```bash
   ______
  / ____/___  ____ ___  ____  ____  ________  _____
 / /   / __ \/ __ `__ \/ __ \/ __ \/ ___/ _ \/ ___/
/ /___/ /_/ / / / / / / /_/ / /_/ (__  )  __/ /
\____/\____/_/ /_/ /_/ .___/\____/____/\___/_/
                    /_/
Composer version 1.8.6 2019-06-11 15:03:05
...
```

一応アップデートをかける．
```bash
vagrant@homestead:~/code$ sudo composer self-update
```

最新なら以下が出力される．
```bash
You are already using composer version 1.8.6 (stable channel).
```

【重要】codeディレクトリにいない場合はディレクトリを移動する．

```bash
vagrant@homestead:~$ cd code
```

## **laravelプロジェクト作成**

laravelのプロジェクトを作成する．（最新版のlaravelがインストールされる）
```bash
vagrant@homestead:~/code$ laravel new project01
```

※ こっちでもいいかも
```bash
vagrant@homestead:~/code$ sudo composer create-project --prefer-dist laravel/laravel project01
```

実行結果
```bash
...
Discovered Package: laravel/tinker
Discovered Package: nesbot/carbon
Discovered Package: nunomaduro/collision
Package manifest generated successfully.
Application ready! Build something amazing.
```

## **ブラウザで表示確認**

下記のurlでlaravel画面が表示されればOK！
- [http://project01.test](http://project01.test)

## **dbの状況確認**

mysqlにログインする．
```bash
vagrant@homestead:~/code$ mysql
```

実行結果
```bash
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 2
Server version: 5.7.25-0ubuntu0.18.04.2 (Ubuntu)

Copyright (c) 2000, 2019, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```

続けて以下を入力．
```bash
mysql> show databases;
```

実行結果
```bash
+--------------------+
| Database           |
+--------------------+
| information_schema |
| homestead          |
| homestead_project01|
| mysql              |
| performance_schema |
| sys                |
+--------------------+
5 rows in set (0.01 sec)
```

homestead_project01

```bash
mysql> use homestead_project01;
```

実行結果．

```bash
Database changed
```

テーブルの内容確認．

```bash
mysql> show tables;
```

実行結果（まだ作成されていない）

```bash
Empty set (0.00 sec)
```

mysqlを終了する．通常のターミナルに戻る．

```bash
mysql> exit;
Bye
```

## **コードをいじる場合**

ホームディレクトリ直下の`code`ディレクトリにコードが保存されているので，vs codeなどで編集する．

例：設定ファイル（.env）をいじる．
```diff
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
-DB_DATABASE=homestead
+DB_DATABASE=homestead_project01
DB_USERNAME=homestead
DB_PASSWORD=secret
```

## **その後の流れ**

モデルとマイグレーションファイルの作成．

```bash
vagrant@homestead:~/code$ php artisan make:model モデル名 -m
```

実行結果．モデルのファイルとマイグレーションファイルが作成．

```bash
Model created successfully.
Created Migration: 2019_08_07_062548_create_hoge_table
```

mysqlにログインして確認し，テーブルができていればOK．


## **追加でプロジェクト作成する手順（例としてproject02を追加）**

Homestedにログインしている場合はログアウトする．

```bash
vagrant@homestead:~/code$ exit
```

vagrantを終了させておく

```bash
$ vagrant halt
```

homestead.yamlを編集する．プロジェクト名，アドレス，DBを追加．

```diff
ip: "192.168.30.10"
folders:
    - map: ~/code
      to: /home/vagrant/code

    - map: ~/code/project01
      to: /home/vagrant/code/project01

+   - map: ~/code/project02
+     to: /home/vagrant/code/project02

sites:
    - map: homestead.test
      to: /home/vagrant/code/public

    - map: project01.test
      to: /home/vagrant/code/project01/public

+   - map: project02.test
+     to: /home/vagrant/code/project02/public

databases:
    - homestead
    - homestead_project01
+   - homestead_project02
```

hostsに上記内容を追記する．

```bash
$ sudo vi /etc/hosts
```

windowsは管理者権限でメモ帳を開き，`C:\Windows\System32\drivers\etc\hosts`を編集する．

以下のように追記する．

```bash
192.168.30.10 project01.test project02.test
```

hostsとHomestead.yamlを編集したら以下を実行．

```bash
$ vagrant up --provision
```

ログイン

```bash
$ vagrant ssh
```

立ち上がったらcodeディレクトリに移動
```bash
vagrant@homestead:~$ cd code
```

project02を作成
```bash
vagrant@homestead:~/code$ laravel new project02
```

終わったらブラウザで表示を確認．
- [http://project02.test](http://project02.test)


## **その他補足**

### **プロジェクトの削除**

プロジェクトを削除する場合は，vagrantにログインしてcodeディレクトリで以下を実行．

※ 間違えると大変なことになるので，事前に作業ディレクトリが正しいかどうかを5回くらいは確認しておくこと！！！

```
vagrant@homestead:~/code$ sudo rm -rf プロジェクトのディレクトリ名
```

失敗する場合は以下を実行してから再度上記コマンドを実行する．

```bash
vagrant@homestead:~/code$ sudo umount プロジェクトのディレクトリ名
```

### **仮想マシンの削除**

Homesetadディレクトリに移動し，`destroy`コマンドを実行する．

※ 実行前に`vagramt halt`で終了させておくこと．

```bash
$ cd ~/Homestead
$ vagrant destroy
```

残った`Homestead`フォルダを削除して完了．

以上である( `･ω･)b
