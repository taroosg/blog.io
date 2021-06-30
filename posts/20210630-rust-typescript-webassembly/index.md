---
path: "/useeffect-vs-useswr"
date: "2021-02-17"
title: "Next.jsのuseSWRが便利だったのでuseEffectと比較してみた．"
description: "Reactでの非同期処理はuseEffectを中心とした実装になるが，Next.jsではより便利なuseSWRが存在する．やや記述が異なるが，使い方は非常に似ているため利用してみた．"
tags: ["javascript", "react", "next.js"]
published: true
---

- 作成日：2021/02/17

- 更新日：2021/02/17

## 今回のネタ

非同期処理を連続して実行する状況をイメージし，位置情報から天気情報を取得する処理を実装する．

- アプリケーションのページにアクセス時，位置情報を取得する．
- 取得した位置情報を元に，OpenWeatherMap API にリクエストを送信して天気情報を取得する．

## 対象者

- React で何らかのアプリケーションを実装した経験がある．
- useState と useEffect を用いた処理を実装した経験がある．
- Next.js のチュートリアルをやった程度，あるいは非同期処理をこれから実装してみる人．

## useEffect を使った実装

シンプルに`useState`で`data`変数を定義し，`useEffect`で読み込み時に位置情報取得 -> API リクエストの順に処理を実行する．

処理自体の流れは明確だがやや記述量が多い点と，実行タイミングの制御が難しい点がネックとなる．アプリケーションの要件によらず基本はページレンダリング時の実行で，任意のタイミングで実行するには`useEffect`の第 2 引数で適当な引数を設定して制御する必要がある．

```js
const [data, setData] = useState({});
useEffect(() => {
  const onSuccess = async (position) => {
    const result = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${position?.coords?.latitude}&lon=${position?.coords?.longitude}&units=metric&appid=YOUR_API_KEY`
    );
    const data = await result.json();
    setData(data);
  };
  const onError = (err) => {
    console.log(err);
  };
  const options = {
    enableHighAccuracy: true,
    timeout: 60000,
    maximumAge: 30000,
  };
  navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
}, []);
```

## useSWR を使った実装

続いて，Next.js の機能である`useSWR`を用いた実装を行う．

大まかな仕組みは以下の通り．

- やりたい処理（今回は位置情報取得と API リクエスト）を記述した関数を定義する（今回は`fetcher()`関数）．
- `useSWR()`に上記の関数と実行のタイミングを指定する．

まず`fetcher()`関数を実装するが，非同期処理を連続して実行するため`Promise`を用いた実装としている．`async / await`を用いたいところだが，`getCurrentPosition`は返り値がないので仕方なく`Promise`で実装．

`useSWR()`はまず`{ data: data }`部分でデータのキー名を指定する（`data`を指定するとコンポーネントなどから保持しているデータを呼び出せる）．

第 3 引数のオブジェクトは，

- `initialData`は`data`の初期値
- `refreshInterval`に時間を設定することで，`fetcher()`を定期実行できる．0 だと定期実行しない．
- `revalidateOnFocus`を true にすると，ブラウザのタブがフォーカスされたタイミングで`fetcher()`を実行する．

```js
const fetcher = () => {
  // getCurrentPositionは返り値なしなのでPromiseで実装
  return new Promise((resolve, reject) => {
    const onSuccess = async (position) => {
      const result = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${position?.coords?.latitude}&lon=${position?.coords?.longitude}&units=metric&appid=YOUR_API_KEY`
      );
      const data = await result.json();
      resolve(data);
    };
    const options = {
      enableHighAccuracy: true,
      timeout: 60000,
      maximumAge: 30000,
    };
    navigator.geolocation.getCurrentPosition(onSuccess, reject, options);
  });
};

// swrでクライアントからデータ取得してdataに入れる
// 指定したタイミングでfetcher関数を実行してくれる
const { data: data } = useSWR("geolocation", fetcher, {
  // 初期データ
  initialData: null,
  // pollingの期間
  refreshInterval: 0,
  // windowのフォーカス時にRevalidateする
  revalidateOnFocus: true,
});
```

この機能は非常に強力で，ページ読み込み時だけでなくユーザがタブでフォーカスしたタイミングや，設定した時間毎に定期実行することができる．

今回は Promise を実装したためやや長いコードとなったが，任意のタイミングで処理を実行できると考えれば有用性は高いだろう．

## まとめ

今回は Next.js の機能である`useSWR()`を紹介した．React 単独では利用できない非常に便利な機能であり，このために Next.js を採用するという選択肢もありだろう．

今回のような位置情報 -> 天気情報取得のような処理では，例えばある地点でユーザが天気情報を取得した後に移動して再度ページを開く場合が考えられる．

その際，`useEffect`ではページを移動したり再読込が必要になるが，`useSWR()`のオプションを設定しておけば，ページをもう一度表示するだけで新しい位置情報から天気情報を再取得することもできる．

このように，Web アプリケーションであっても，ネイティブアプリケーションのような振る舞いが実装できるため，より開発の幅が広がるのではないだろうか．

今回は以上である( `･ω･)b
