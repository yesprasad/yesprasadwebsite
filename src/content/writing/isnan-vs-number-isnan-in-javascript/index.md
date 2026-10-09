---
title: "isNaN vs Number.isNaN in JavaScript"
date: 2017-01-13
section: lab
tags: ["JavaScript"]
summary: "I was working on a specific requirement where in an input text can sometimes be wrongly formatted to contain alphabets other than digits. If you notice, Number.isNaN always…"
---

**I was working on a specific requirement where in an input text can sometimes be wrongly formatted to contain alphabets other than digits.**

```js
'use strict';

const inputOfNumber = '1234',
inputHavingAlphabet = '1Node2';

console.log(`input number type :${isNaN(inputOfNumber)}`); 

console.log(`input with alphabets :${isNaN(inputHavingAlphabet)}`);

/*
        input number type :false
        input with alphabets :true
 */

console.log('\n using Number.isNaN \n');

console.log(`input number type :${Number.isNaN(inputOfNumber)}`);

console.log(`input with alphabets :${Number.isNaN(inputHavingAlphabet)}`);

/*
        input number type :false
        input with alphabets :false
 */
```

If you notice, **Number.isNaN** always almost returns **false** and this is because this function should only be used to verify id the input is NaN datatype or not. This will not help us to verify  - is an input a number only or does it have any non-digit contents.

The only time when Number.isNaN returns true is when the value fed to it is indeed an 'NaN'. If you want to verify if the input really has anything apart from a non-digit in it, we can do something like this.

```js
Number.isNaN(Number(inputOfNumber)); 
// Number(inputOfNumber) returns number 1234. 
// This is now passed as input to Number.isNaN which returns false

Number.isNaN(Number(inputHavingAlphabet));  
// Number(inputHavingAlphabet) returns number NaN. 
// This is now passed as input to Number.isNaN which returns true
```

**Number.isNaN came into picture because == and === both fail to verify the conditional check for a variable against NaN.**

![](./image-1.png)
