---
title: "Bubble sort Algorithm in JavaScript"
date: 2017-06-16
section: lab
tags: ["JavaScript","Algorithms"]
summary: "./image 1.png"
---

```js
'use strict';

const unsorted = [9,6,3,11,2,4,14,1, -1,8,111,100,10000,2000,3000,4000,123,101,345,656, 789,673,234,567,890,112,343,563,133,134,135,136,234235,79890],
sortingFunction = (inputAry) => {
    const len = inputAry.length;
    let count = 0;
    while(count <= len) {
        for(let i = 0;i < len-count; i++) {
        if(inputAry[i] > inputAry[i+1]) {
            [inputAry[i], inputAry[i+1]] = [inputAry[i+1], inputAry[i]]
        }
    }
    count++;
}
 return inputAry;
}

sortingFunction(unsorted);
```

![](./image-1.png)
