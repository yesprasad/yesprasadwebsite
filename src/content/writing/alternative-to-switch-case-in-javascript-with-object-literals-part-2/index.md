---
title: "Alternative to SWITCH CASE in JavaScript with Object Literals :: Part 2"
date: 2017-01-05
section: lab
tags: ["JavaScript"]
summary: "Objects in JavaScript can have properties that are functions. we have seen in our previous article on how our property is writing to the console when called it using a…"
---

Objects in JavaScript can have properties that are functions. we have seen in our previous article on how our property is writing to the console when called it using a property.

We will exploit this helpful and powerful tool write functions that be used for many actions.

```js
'use strict';

const getStudentsDetails = (inputCondition) => {

    const fnGetStudentsDetailsForParents = () => {
         return console.log('These details are parents');
    },
    fnGetStudentsDetailsForTeachers = () => {
         return console.log('These details are students');
    },
     studentCondition = {
        'detailsOfStudentsForParents': fnGetStudentsDetailsForParents,
        'detailsOfStudentForTeachers': fnGetStudentsDetailsForTeachers
    };
    return studentCondition[inputCondition]();
};

getStudentsDetails('detailsOfStudentForTeachers');
```

![](./image-1.png)
