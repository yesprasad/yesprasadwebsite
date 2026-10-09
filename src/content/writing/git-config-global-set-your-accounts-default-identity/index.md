---
title: "git Config --global :: set your accounts default identity"
date: 2014-10-10
section: lab
tags: ["Git","Tools"]
summary: "I was working on to puch my node application to heroku last week. Before we can push the code to Heroku, we need to have Git not GitHub installed on our machines with a valid…"
---

I was working on to puch my node application to heroku last week. Before we can push the code to Heroku, we need to have Git (not GitHub) installed on our machines with a valid SSH token. Git, to reiterate, is a version control tool.  
So, when i said >git commit, this was the msg that was shown.  
Q) What did i do?  
A) inplace of the user.email and user.name, give a value that you think you can remember day in and day out!!!

$ git commit

  

\*\*\* Please tell me who you are.

  

Run

  

git config --global user.email "you@example.com"

  

git config --global user.name "Your Name"

  

to set your account's default identity.

Omit --global to set the identity only in this repository.

  

  

fatal: unable to auto-detect email address (got 'Obby@ObbyWorkstation.(none)')
