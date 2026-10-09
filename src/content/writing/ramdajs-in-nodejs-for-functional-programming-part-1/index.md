---
title: "Ramdajs in Nodejs for functional programming : Part 1"
date: 2017-01-08
section: lab
tags: ["JavaScript","Functional Programming","Node.js"]
summary: "./image 1.jpg Ramda http://ramdajs.com/ helps you bring functional programming FP paradigm to your JavaScript code. It makes use of the rich FP practices of Higher order…"
---

![](./image-1.jpg)

  
[Ramda](http://ramdajs.com/) helps you bring functional programming (FP) paradigm to your JavaScript code. It makes use of the rich FP practices of Higher-order functions, currying, composition and others.

In the upcoming videos on my channel at [Nodejs-Everyday](https://www.youtube.com/channel/UCTsHdcwSnIthHf-Y_zOzjiw) I will show you all of these code snippets hands-on along with a series on Functional Programming with JavaScript.

We will have a look at few of the [functions](http://ramdajs.com/docs/) that we can use in our everyday code to kick-start using Ramda.js.

When we talk about functional programming, one of the 1st feature from FP that almost all talk about is [MAP](http://ramdajs.com/docs/#map).

Map function takes in a functor and applies them on each of the element from the array/ object that we work with.

Here is the example of Map function.

```js
'use strict';

const R = require('ramda'),
      students = [
          {
              name:'Eshwar',
              class: 'CS'
          },
          {
              name:'Prasad',
              class: 'CS'
          },
          {
              name:'Bob',
              class: 'ECE'
          },
          {
              name:'Martin',
              class: 'CS'
          },
          {
              name:'Josh',
              class: 'ECE'
          }
      ],
      pickNames = R.map(x=> x.name, students);

console.log(pickNames);
```

If we have to do the same in ES5 using loops, we write it like this

```js
const studentNames = [];
for(let i =0; i< students.length;i++) {
 studentNames.push(students[i].name); 
}
console.log(studentNames)
```

  
What if we want to filter the students who class is 'CS'? **We use the same loop from above and do a conditional check like below.**

```js
const studentNames = [];
  for(let i =0; i< students.length;i++) {
    if(students[i].class ==='CS') {
         studentNames.push(students[i].name); 
    }
  }
  console.log(studentNames); // Output: ["Eshwar", "Prasad", "Martin"]
```

  
**we can achieve the same using Ramda, the functional style with chaining the functions as below.**

```js
'use strict';

const R = require('ramda'),
      pickNamesWithCSClass = R.filter(x=> x.class === 'CS', students)
                    .map(x=> x.name, students);

console.log(pickNamesWithCSClass);
```

  
**

#### We will take a break here and examine the features in the next article. We will talk about *Flatten, finding duplicates, merge and others*

**
