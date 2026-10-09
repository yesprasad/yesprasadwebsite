---
title: "ASP.NET WEB API Basic Authentication Custom with ASCII encoding and Base64 Encoded username and password"
date: 2015-08-06
section: lab
tags: [".NET"]
summary: "ASP.NET WEB API Basic Authentication Custom with ASCII encoding and Base64 Encoded username and password Hi mates, In the last article, we have explored the ways to do basic…"
---

## ASP.NET WEB API Basic Authentication Custom with ASCII encoding and Base64 Encoded username and password

Hi mates, In the last article, we have explored the ways to do basic authentication by picking up the username and password from the request headers in Node.js using Express.js request object.  

![](./image-1.png)

  

  
Today, in this article we will look at how we can achieve the same in ASP.NET Web API.

To Implement the basic authentication, we need to have our custom authentication class inherit from AuthorizationFilterAttribute that is part of the System.Net.Http.Filters namespace.

So, lets create a class named myAuthentication and let it inherit from AuthorizationFilterAttribute  as shown below.  

[View the code on GitHub](https://gist.github.com/eshwaryaddanapudi/d3925949599c05cb584d)

Once that is done, let us see if the headers have the authorization property filled with data.  
The username and password are in the headers under the authorization property that returns AuthenticationHeaderValue object. Of all these values, Scheme and Parameter are the properties that are of our interest.  

```csharp
 var authHeader = actionContext.Request.Headers.Authorization;
 if(authHeader.Scheme.Equals("basic",StringComparison.OrdinalIgnoreCase))
 var encodedHeader = authHeader.Parameter;
```

Once we have the authorization one, the Parameter property of this has the encoded value that is of our interest. We need to decode this. In general, the caller of the API and the API provider have an understanding about the kind of encoding they follow. In our example let us consider that our data is ASCII formated Base64 encoded data.

```csharp
 var acceptedEncoding = Encoding.ASCII;
                    var decodedHeader = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(encodedHeader));
```

As of this example, we will see if the username and the password are same. If they are, we will allow the user to access our API else we will throw unauthorized error status (HttpStatusCode)

So this unauthorized exception is thrown with a custom information on how the user can make a call to our API. This is done by adding data in the response headers of the actionContext object that we get when we inherit AuthorizationFilterAttribute  and override OnAuthorization method.

So, lets look at our myAuthentication class code.
