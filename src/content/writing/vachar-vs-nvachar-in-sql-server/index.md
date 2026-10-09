---
title: "vachar vs nvachar in SQL Server"
date: 2016-05-10
section: lab
tags: ["SQL Server"]
summary: "When should we use VARCHAR and when should we be using an NVARCHAR? Here are the few points that you have to take in consideration when designing a database column that uses…"
---

When should we use VARCHAR and when should we be using an NVARCHAR? Here are the few points that you have to take in consideration when designing a database column that uses one of the above.  
  

![](./image-1.png)

  
  
  

-       VARCHAR takes less amount of disk space to store than NVACHAR for the same string.
-       VARCHAR does not support unicode data. So, if I try to save a string that is in any other language than English, it fails to display it as is.
-       Thus NVARCHAR comes to our rescue in case we want to save unicode string variables/ literals.
-       If we run the execution plan for select statements that have VARCHAR and NVARCHAR, we will notice that NVARCHAR takes more time to than VARCHAR
