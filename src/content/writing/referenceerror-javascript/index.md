---
title: "ReferenceError JavaScript"
date: 2016-07-28
section: lab
tags: ["JavaScript"]
summary: "The result is ReferenceError because JS has asked SCOPE by LOOKING UP and traversing from the current scope to the global scope and has not found any declaration for variable…"
---

```js
function foo(a){
  console.log(a); // prints 8
};
foo(8); // invokes foo with a value of 8

function doo(a){
  c = 6;
  console.log(a+b+c); // outputs - ReferenceError 
  b = 9;
}
// The result is ReferenceError  because JS has asked SCOPE by LOOKING-UP and 
// tranversing from the current scope to the global scope and has not found any declaration for variable 'b'
// However, for 'c' there is an assigned value and JS has looked-up to scope upto the global level and in
// non-strict mode of JS, the compiler has created a variable declaration for 'c' and has given it to foo.
```

The result is ReferenceError  because JS has asked SCOPE by LOOKING-UP and  
traversing from the current scope to the global scope and has not found any declaration for variable 'b'.

However, for 'c' there is an assigned value and JS has looked-up to scope upto the global level and in  
non-strict mode of JS, the compiler has created a variable declaration for 'c' and has given it to foo.

![](./image-1.png)
