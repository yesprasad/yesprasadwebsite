---
title: "understanding Closure concept in JavaScript"
date: 2017-08-29
section: lab
tags: ["JavaScript"]
summary: "Closure: Definition: When a function is able to access and exercise its lexical scope when it is executing outside its scope is called a closure. Here is a function code…"
---

**Closure: Definition:** When a function is able to access and exercise its lexical scope when it is executing outside its scope is called a closure. Here is a function code snippet where you can experience closure. Have a look at it.  
 

```js
'use strict';
// The simplest of the examples to experience closure
function foo(i) {
    const a = `i am from foo ${i}`;
    
     function bar(){
        console.log(a);
    };
    return bar;
};

const baz = foo(3);

baz();
```

Going a bit further, here is the day to day code from a javascript file that implements revealing module pattern. It also exercises the closure concept.

```js
'use strict';
// this is the code that we all have seen in our code.
// revealing module pattern example. The simplest pattern exists everywhere. 
const doWork = () => {
    const x =2, y = 3,
    add = () => {
        return x + y;
    },
    multi = () => {
        return x * y;
    }
    return {
        add: add,
        multiply:multi
    }
};

const v = doWork();

console.log(v.add());
```

  

![](./image-1.png)
