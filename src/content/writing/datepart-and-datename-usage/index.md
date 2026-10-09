---
title: "DATEPART and DATENAME usage"
date: 2014-07-14
section: lab
tags: ["SQL Server"]
summary: "Had this requirement of reading the name and month value for one of our requirement today. We used the easiest once DATEPART month, Customer\\ joining\\ date this outputs the…"
---

Had this requirement of reading the name and month value for one of our requirement today.  
We used the easiest once -

DATEPART(month, Customer\_joining\_date)

this outputs the numeric month value. So if its January its 1, Feb then its 2.

DATENAME(month, Customer\_joining\_date)

this outputs the month name from the date time value. So if its in mm-dd-yyyy (08-26-1987 18:52:03:00) then it is will output's AUGUST.

SYSDATETIME() vs  GETDATE()

both of them will return the same current system date time but SYSDATETIME() will return that in DATETIME2 format with precision upto 7 digits.
