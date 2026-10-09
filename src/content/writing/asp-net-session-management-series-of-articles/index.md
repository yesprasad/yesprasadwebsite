---
title: "ASP.NET Session Management - Series of articles"
date: 2015-07-30
section: lab
tags: [".NET"]
summary: "ASP.NET Session Management is one of the important concepts in ASP.NET to store are retrieve data for ease of use during the life cycle of the application/ website. As part of…"
---

## ASP.NET Session Management is one of the important concepts in ASP.NET to store are retrieve data for ease of use during the life cycle of the application/ website.

  

**As part of my task called - Revisiting basics,** I have decided to take on this topic. Hence, in the next series of articles, we will discuss about all the available **session management types/methods** we have. 

  

### ASP.NET session management can be done in any of the following ways.

-   Application
-   Session
-   Cookie
-   Cross Post Page
-   Query String
-   ItemState
-   Profile

![](./image-1.png)

  

#### **Application**: Application session management is holding data at application level. This is done by storing data in the Application object by a key and assigning a value to it. Application session keys are available as global data and reside on the server's in memory of the asp.net worker process. There is more about this in an article on my blog.

  

#### Session state**:** Session management can be done using the session object with a key and assigning a value to it. The session objects are unique for every client. Thus there will be a session that holds different keys for every user. This as well stays at the server side. However, the default session state will not work in the case of web farms as your load balancer might turn your request to the available server and not to the same server every time.  Developers working on web applications that are internally used and run on a single server might not be aware of these details. 

  

**Session sate** has **different modes** in which it works. 

1.  InProc 
2.  OutProc

The **OutProc** has two different **modes** in it again. 

1.  ASP.NET state server
2.  and SQLServer
3.  Custom (This is an exciting topic. I will explore this in detail as another article apart from sessionstate)

We will discuss more on this with code snippets in an article here on my blog.

  

#### Cookie**:**This is the most famous one that is known even to the non-developers. The two main drawbacks are that the client's browser should support cookies and its size is limited. More on this in a new article.

#### **Query String:** Yet another most famous way in storing and passing data between pages. This drawback is that the data is clearly visible in the browsers query section. More coming on this.

#### **Cross Page Post:** This is a method wherein the data from calling page to the called page is sent using the PostBackUrl concept which as well is a property attached to the event handling items on the page.

#### ItemState: ItemState is another out of box functionality that is supported by ASP.NET to store and retrieve data as session values. However, it is to be noted that all the values saved in ItemState are for a single Request. This is because ItemState is useful only if the page movement is using server.transfer. So that data is moved from Page-A to Page-B with in the server and browser has no clue about this.More on this in another article.

#### Profile: This is used similar to session state.Yet, one of the biggest advantages of Profile is that boxing-unboxing is taken care by itself and the developer need not worry about casting. More on this in coming article.
