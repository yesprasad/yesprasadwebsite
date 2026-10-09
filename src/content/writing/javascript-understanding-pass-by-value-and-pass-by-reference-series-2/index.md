---
title: "JavaScript :: Understanding pass-by-value and pass-by-reference :: Series 2"
date: 2015-06-01
section: lab
tags: ["JavaScript"]
summary: "A look at the way the Pass by value and Pass by reference work in JavaScript. ./image 1.png"
---

A look at the way the Pass by value and Pass by reference work in JavaScript.

```js
//understanding pass by value and pass by reference in JS

// All value types in JS are pass by value 
// All object types are pass by reference in JS.
// Lets see the examples

var myName = "PeterParker";
console.log("Before:  " + myName);  // print PeterParker

var printName = function abc(takeName){
  takeName = "Spiderman";
  console.log("inside fun is:  " + takeName); // lexical scope: print Spiderman
};
printName(myName); 
console.log("myName value after function is:  " + myName); // print PeterParker

// understanding the pass by reference 

var userObj = {
  name: "John",
  age:23,
  place: "SFO"
};
console.log("before executing func name is:  " + userObj.name); // print John

var callMyObj =  function NewAbc(inObj){
  inObj.name = "Mary";
  console.log("name inside func is:  " + inObj.name); // print Mary
};
callMyObj(userObj);
console.log("after executing func name is:  " + userObj.name); // Pass by reference and so prints Mary
```

![](./image-1.png)
