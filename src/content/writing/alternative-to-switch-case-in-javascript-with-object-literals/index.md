---
title: "Alternative to SWITCH CASE in JavaScript with Object Literals"
date: 2017-01-05
section: lab
tags: ["JavaScript"]
summary: "For over 7 years, I was made to believe that SWITCH CASE is better than IF ELSE and almost all always, I was told that switch case is the best that can ever be... I was so…"
---

For over 7 years, I was made to believe that SWITCH-CASE is better than IF-ELSE and almost all always, I was told that switch-case is the best that can ever be...!!!

I was so idiotic. I was fooled not by anyone else but by my own ability in not trying to find if there is really nothing else than these 2 to handle loops.

After moving to JavaScript space, I implemented a requirement with non other than my good OLD friend switch-case. Ahh.. the code review comments were like pooh on my face...!!!

The comments were like this... ***"This works...! But there is a better way to achieve this...!!!"***

Then I started my work on this. Running through many coding articles and concepts, I ended up on how to use the GOOD OLD FRIEND of JAVASCRIPT called the OBJECT LITERAL.

So here is the case

```js
'use strict';

const normalSwitchExecution = (color) => {
    switch(color) {
        case 'orange': {
            return console.log('inside orange');
        }
        case 'red': {
            return console.log('inside red');
        }
        default: {
            return console.log('inside default');
        }
    }
};

normalSwitchExecution('orange'); // Outputs : inside orange
```

Now using the object literal we can achieve the same in much simpler way. Its like just in 2 lines.

```js
const withObjectLiterals = {
    'orange': () => {
         return console.log('inside orange using Object Literal');
    },
    'red': () => {
         return console.log('inside red using Object Literal');
    }
}

withObjectLiterals['orange'](); //outputs: inside orange using Object Literal
```

That code is much easy to read and understand let alone writing it. It has dramatically got down the effort that we need to put in.

![](./image-1.png)
