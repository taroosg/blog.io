---
title: objectのarrayを特定のvalueでソートしてみる
date: 2019-03-19 00:00:00
description: "objectのarrayを新しい順に並べたいぞ，とかくときの話"
image: "./images/object-sort.jpg"
slug: object-sort
---

完全に備忘録．．．

## **何する？？**

### **オブジェクトが入っている配列について，特定のvalueでソートしたい！**

- javascriptでオブジェクトが入っている配列をソートしたい！

- オブジェクト内に日時があり新しい順に並べたいとき，とか．

## **解決策**

これでいけた！

```javascript
var arr = [
    {
        name:'a',
        val:10,
        datetime:'2019-03-10 00:18:30'
    },
    {
        name:'d',
        val:100,
        datetime:'2019-03-09 09:32:25'
    },
    {
        name:'b',
        val:1,
        datetime:'2019-03-08 18:09:43'
    }
];

function compare(a, b) {
    const datetimeA = a.datetime.toUpperCase();
    const datetimeB = b.datetime.toUpperCase();

    let comparison = 0;
    if (datetimeA > datetimeB) {
      comparison = 1;
    } else if (datetimeA < datetimeB) {
      comparison = -1;
    }
    return comparison * -1;
}
console.log(arr.sort(compare));
```

出力結果

```bash
[ { name: 'a', val: 10, datetime: '2019-03-10 00:18:30' },
  { name: 'd', val: 100, datetime: '2019-03-09 09:32:25' },
  { name: 'b', val: 1, datetime: '2019-03-08 18:09:43' } ]
```

ソートの順序を逆にするには`return`のところで`-1`を外せばOK！

以上である！！