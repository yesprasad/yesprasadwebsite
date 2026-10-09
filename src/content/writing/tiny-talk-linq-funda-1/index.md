---
title: "Tiny talk :: LINQ Funda :1"
date: 2014-11-16
section: lab
tags: [".NET"]
summary: "IEnumerable Is for LINQ to Objects Objects that are in memory on Heap IQueryable Is for working on LINQ to SQL Inside it, it using Expressions to frame and execute sql queries.…"
---

### IEnumerable 

  

-   Is for LINQ to Objects
-   Objects that are in memory on Heap

### IQueryable 

  

-   Is for working on LINQ to SQL
-   Inside it, it using Expressions to frame and execute sql queries.

###   
Func<T>

-   Can return a value. The last value in the definition is the return.

Ex: 

  

Func<int,int> PrintNumber = x => (x);

            Console.WriteLine(PrintNumber(50));

  

  

### Action<T>

-   Cannot return any value. It is only to feed and use directly

  

Ex:

Action PrintEmpty = () => Console.WriteLine("Hi");

            PrintEmpty();

  

            Action<int> PrintOneNumber = x => Console.WriteLine(x);

            PrintOneNumber(5);

  

### Expression:

-   To be used to help the developer better understand the code.
-   It is slightly different from Func<T> and Action<T>.
-   Expression takes Func<T> as input and is to be used as a variable and not as a method that is the case with Func or Action

  

Ex:

Expression<Func<int, int, int>> PrintMulti = (x, y) => (x \* y);

            Func<int, int, int> Mutli = PrintMulti.Compile();  
            var zExp = Mutli(5, 10);  
            Console.WriteLine(z);
