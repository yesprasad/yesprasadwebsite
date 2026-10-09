---
title: "When 'const' in ES6 is mutable/ not really a const"
date: 2018-09-14
section: lab
tags: ["ES6"]
summary: "So, recently, I was doing a code review and found a piece of code which is like below ./image 1.png As you can see in the above code, The empty array that is defined as const…"
---

So, recently, I was doing a code review and found a piece of code which is like below

![](./image-1.png)

As you can see in the above code, The empty array that is defined as const is mutable. This is because - the constant constraint is enforced only on the variable type and not inside it.

This is the same with objects as well. You can see the example below

![](./image-2.png)
