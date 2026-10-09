---
title: "count sort in JavaScript"
date: 2018-08-01
section: lab
tags: ["JavaScript","Algorithms"]
summary: "Here is the JS implementation of count sort"
---

Here is the JS implementation of count sort

```js
var ary = [1,1,1,2,4,5,6,1,2,2,4,5]

//count sort
/*
1 - 4 times
2 - 3
4 - 2
5 - 2
6 - 1
*/

let maxValue = 0;

ary.map(x => {
  if(x > maxValue) {
    maxValue = x
  }
});

//creates an array of size = maxValue
let cntAry = new Array(maxValue+1);
cntAry.fill(0);

ary.map( (x,idx) => {
  
  cntAry[ary[idx]]++;
});

console.log(cntAry.indexOf(Math.max.apply(null,cntAry)));
```
