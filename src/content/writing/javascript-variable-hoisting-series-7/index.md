---
title: "JavaScript :: variable Hoisting :: Series 7"
date: 2015-06-05
section: lab
tags: ["JavaScript"]
summary: "./image 1.png"
---

```js
console.log(x);
var x=3;

// the above statement in JS complied as 
//hey, there is no variable called x for you. let me create one for you.
//JS creates it and says, its value is not defined. so writes it as "undefined"

 j;
 console.log(j);
 var j=8;
 console.log(j);

// This is called as variable hoisting in JS.

var myvar = "my value";
 
(function() {
  console.log(myvar); // undefined
  var myvar = "local value";
})();

// In the above function, the value of myvar is "undefined" coz the function is
//requested to be executed immediately at the very place where it is hit 
// by the compiler. Hence, myvar is undefined.
```

  

![](./image-1.png)
