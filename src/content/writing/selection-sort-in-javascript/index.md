---
title: "Selection sort in JavaScript"
date: 2017-06-16
section: lab
tags: ["JavaScript","Algorithms"]
summary: "./image 1.png"
---

```js
const gAry = [5,2,1,3,6,4];

const fnSort = (a) => {
    let count = 0;
   while(count<= a.length) {
       let smallestIndex = 0;
   for(let i=0;i< a.length; i++) {
       if(a[i]> a[smallestIndex]) {
            smallestIndex = i;
           }
       if(smallestIndex !== i) {
            [a[i], a[smallestIndex]] = [a[smallestIndex], a[i]];
       }
   }
   count++;
}
return a;
}

console.log(fnSort(gAry));
```

![](./image-1.png)
