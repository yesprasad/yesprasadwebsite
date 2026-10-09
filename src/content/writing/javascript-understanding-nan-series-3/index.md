---
title: "JavaScript :: Understanding NaN :: Series 3"
date: 2015-06-01
section: lab
tags: ["JavaScript"]
summary: "We all have seen variables in JS that throw an undefined primitive type when they are not assigned any value in Series 1 of JS. Now, let us see what happens when we add a…"
---

We all have seen variables in JS  that throw an undefined primitive type when they are not assigned any value in Series 1 of JS.  
Now, let us see what happens when we add a Undefined primitive type to some value.

```js
//remember? this is how we declared a variable but have not assigned a value to it
var iHaveNoValue;
// write it out
console.log("value of iHaveNoValue is  " + iHaveNoValue);
// when we add some value of an undefined primitive type
// JS gives out NaN. That is not a number.
console.log(iHaveNoValue +1);
```

![](./image-1.png)
