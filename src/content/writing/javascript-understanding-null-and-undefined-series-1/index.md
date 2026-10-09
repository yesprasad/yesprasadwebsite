---
title: "JavaScript :: Understanding NULL and UNDEFINED :: Series 1"
date: 2015-06-01
section: lab
tags: ["JavaScript"]
summary: "I was teaching my cousin JS in his summer vacation. I will post those basic JS details that i taught him here on my blog in a series ./image 1.png"
---

I was teaching my cousin JS in his summer vacation. I will post those basic JS details that i taught him here on my blog in a series

```js
var myVariable;
//myVariable is not assigned with any value. So it is undefined.
//undefined is a JS primitive type just like string, number..

console.log(myVariable);

var newVariable = null;
//newVariable is assigned with a value null. Null as well is a primitive type.
console.log(newVariable);

//Both undefined and null execute to false in a JS boolean expression.
//Apart from zero (number 0) all other primitive types of JS
// execute to true in a boolean expression.

if(!myVariable){
  console.log("Hey myVariable is undefined and so i am executed");
}

if(!newVariable){
  console.log("Hey the newVariable is null and so i am executed");
}

var myNumber =0;
if(!myNumber){
  console.log("I told you right! that 0 executes to false!")
}
```

![](./image-1.png)
