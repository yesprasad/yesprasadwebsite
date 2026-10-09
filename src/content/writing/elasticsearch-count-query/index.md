---
title: "Elasticsearch :: count query"
date: 2015-08-26
section: lab
tags: ["Elasticsearch","MongoDB"]
summary: "I have an index in Elasticsearch that has bank details. What if I want to query this index database to find all the account holders whose age is equal to 40 and who does…"
---

I have an index in Elasticsearch that has bank details. What if I want to query this index (database) to find all the account holders whose age is equal to 40 and who does address lane does not have the word 'lane' in it?  

![](./image-1.png)

  
here is the query. I get the count  

```js
GET bank/_count
{
    "query":{
        "bool": {
            "must": [
               {"match": {
                  "age": 40
               }}
            ],
            "must_not": [
               {
                   "match": {
                      "address": "lane"
                   }
               }
            ]
        }
    }
}
```
