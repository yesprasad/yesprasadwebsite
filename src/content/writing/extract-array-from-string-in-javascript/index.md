---
title: "extract Array from string in JavaScript"
date: 2016-09-27
section: lab
tags: ["JavaScript","ES6"]
summary: "Many a times we receive data from API calls that are strings which hold Arrays/ objects. To extract these array/objects we use JSON.parse. There is a better now in ES6. below…"
---

Many a times we receive data from API calls that are strings which hold Arrays/ objects. To extract these array/objects we use JSON.parse. There is a better now in ES6.

below is the code snippet

```js
var data = "[{name: "Eshwar", place: "Hyderabad"}, {name: "Prasad", place: "Secunderabad"}]";

//extract array from variable data - ES5 way
var extractedArrES5 = JSON.parse(data);

//Now the ES6 way
var extracArryES6 = Array.from(data); 
```

  

![](./image-1.png)
