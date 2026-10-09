---
title: "JavaScript :: Method Overloading :: Series 4"
date: 2015-06-01
section: lab
tags: ["JavaScript"]
summary: "If you are coming from Java/C background, I am sure that you all know about method overloading as one of the OOPS concepts. So, let us see how JS works with method overloading.…"
---

If you are coming from Java/C# background, I am sure that you all know about method overloading as one of the OOPS concepts. So, let us see how JS works with method overloading.  
Let us try to understand if JS support method overloading or not.

```js
function add(x,y){
  return x+y;
}
console.log(add(1,2)); //outputs 3 (1+2);
```

Now, let us send 3 parameters/arguments to the method.  

```js
function add(x,y){
  return x+y;
}
console.log(add(1,2,3)); //outputs 3 (1+2); the 3rd parameter is ignored
```

Now, let us create another method with the same name "add" that takes 3 parameters/arguments.  

```js
function add(x,y){
  return x+y;
}
function add(x,y,z){
  return x+y+z;
}
console.log(add(1,2)); //outputs NaN (1+2 +undefined); 'z' is not passed
```

Thus we can conclude that JS does not allow us to have method overloading. JS complier considers the last method in the line of execution with the same name as the method to be executed.

![](./image-1.png)
