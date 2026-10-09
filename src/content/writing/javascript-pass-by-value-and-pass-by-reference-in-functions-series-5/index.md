---
title: "JavaScript :: Pass-by-Value and Pass-by-reference in functions :: Series 5"
date: 2015-06-05
section: lab
tags: ["JavaScript"]
summary: "JS functions are objects that are a created as a block to perform a specific action. If we pass an object to the JS function and modify the object's property, it is reflected…"
---

JS functions are objects that are a created as a block to perform a specific action.

If we pass an object to the JS function and modify the object's property, it is reflected at the global level.  
Where as if we try to modify the object itself, it is modified with in the scope of the function and not outside of it (i.e., at the global level)  
Here is the example for it.  

```js
/* START : pass by value example for function*/
var myName = "Peter";

function abc(name){
  name ="parker";
  console.log(name);
}
abc(myName);
console.log(myName);

/* END : pass by value example for function*/

/* START : pass by reference change in property permanent example for function*/

var carData = {
  name: "Ferrari",
  YoM: 2010
};

console.log(carData.name);
function useCar(carData){
  carData.name = "BMW";
  console.log(carData.name);
};

useCar(carData);

/* END : pass by reference change in property permanent example for function*/

/* START : pass by reference change in object doesnt happen example for function*/

//changing/ assigning a new object to the existing object inside a 
// inside a function is similar to pass-by-value and hence it remains same
// outisde the function scope
// This is same with non primitive-types objects like array, map etc.
function newCarUse(car){
var newCarData = {
  name: "Hyundai",
  YoM: 2010,
  Place: "India"
};
  car = newCarData;
  console.log(car);
}

newCarUse(carData);

console.log(carData);
```

![](./image-1.png)
