---
title: "Elasticsearch Series :: Episode 2"
date: 2015-05-17
section: lab
tags: ["Elasticsearch"]
summary: "Hi All, In my previous post, I gave a quick demo on what is Elasticsearch and told you how to set it up in your local machines as a webservice. Now, we will take a step forward…"
---

Hi All,  
In my previous post, I gave a quick demo on what is Elasticsearch and told you how to set it up in your local machines as a webservice. Now, we will take a step forward and will try to understand few basic queries that we can run on ES.

In ES, Index (Indices) are equivalent to a database name and table in a RDBMS is equal to type in ES.

So, we will start with creating a simple index named Employees in ES. Within it, we have Employee as the type, the table that holds the data of every employee who is working with our dummy company named Dumbo.  
No matter wether it is SQL or NOSQL, we are humans and we are bound to have data that is related. So, I have the following details for an employee.  

![](./image-1.png)

firstname, lastname, employee\_id,salary, experience, location,role

Hence, my data would be something like this.  

```json
{
    "employee_id":1,
    "firstname":"Jack",
    "lastname":"Henry",
    "salary":15000,
    "experience":5,
    "location":"New York"
    "role": "Senior Technical"
}
```

So, let us create this in our ES database that is running at port 9200 on localhost.  

```
PUT employess/employee/1
{
    "employee_id":1,
    "firstname":"Jack",
    "lastname":"Henry",
    "salary":15000,
    "experience":5,
    "location":"New York"
    "role": "Senior Technical"
}
```

This code piece creates a new index employees and then creates a type employee and creates a schema within elasticsearch and then saves the data. As ES is JSON based full-text search database, all the talk with the ES happens in JSON in RESTful manner.

```json
{
   "employees": {
      "mappings": {
         "employee": {
            "properties": {
               "employee_id": {
                  "type": "long"
               },
               "experience": {
                  "type": "long"
               },
               "firstname": {
                  "type": "string"
               },
               "lastname": {
                  "type": "string"
               },
               "location": {
                  "type": "string"
               },
               "role": {
                  "type": "string"
               },
               "salary": {
                  "type": "long"
               }
            }
         }
      }
   }
}
```

Notice, that ES has identified the datatypes based on the data passed to each field in the JSON. Thus the properties are set as per the understanding of ES. We can create mapping as per our requirements and we will discuss this in the due course of the series.

Lets insert a couple of more employees in the index so that we can do some basic operations on it.

```
PUT employees/employee/2
{
    "employee_id":2,
    "firstname":"Steve",
    "lastname":"Kovacs",
    "salary":14000,
    "experience":5,
    "location":"New York",
    "role": "Senior Technical"
}
```

The output from ES is as below.

```json
{
   "_index": "employees",
   "_type": "employee",
   "_id": "2",
   "_version": 1,
   "created": true
}
```

Notice from the above code that ES tells us what is the index, type on which the data is created along with its version and is it created or not.  
The version is 1 as this is a new entry in the type and there exists NO  entry prior to this on the id = 2.  
Remember that the id = 2 is the one that we are sending in the PUT request and not the employee\_id.

If we do not mention the id in the PUT request, ES will auto generate an id that it uses for identification.

Lets re-execute the same piece of code again. Notice the difference? version has change to 2. This means that the data is updated.

```json
{
   "_index": "employees",
   "_type": "employee",
   "_id": "2",
   "_version": 2,
   "created": false
}
```

But in real sense, ES marks the current record with id = 2 as deleted and recreates a new one. We will talk on this as well in the coming days.
