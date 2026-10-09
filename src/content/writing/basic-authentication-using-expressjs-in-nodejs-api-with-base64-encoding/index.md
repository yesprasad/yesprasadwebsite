---
title: "Basic Authentication using Expressjs in Nodejs API with Base64 encoding"
date: 2015-08-04
section: lab
tags: ["Node.js"]
summary: "Basic Authentication using Expressjs and Nodejs Base64 encoding Express.js gives us an out of box solution for ding basic authentication via its request parameter. We all know…"
---

## Basic Authentication using Expressjs and Nodejs Base64 encoding

  
Express.js gives us an out-of-box solution for ding basic authentication via its request parameter.

We all know that the callback function has request and response (req,res). So, when the user makes a request to our Node.js, we receive Header information as well in the request object. In that if 'authorization' property is set and given a value, that can be used. We can ask our REST API consumers to send username and password in Base64 encoding as the value of this authorization property.

The base64 coded value can be obtained using [https://www.base64encode.org/](https://www.base64encode.org/)  
For us, the validation is if username is equal to password we give the data to the consumer of the API. In real life scenario, we might do it against the data values in our DB.

Let us take a look at the code. The code itself has explanation. Please drop a comment /share this post if you like it or even if you have any queries. See you soon with one more tutorial.

```js
/* Basic authentication using expressjs in Nodejs applications.
   The data is sent in the request headers*/
var express = require('express');
var app = express();

app.get('/',function(req,res){
	res.send('to go beyond this root for the API, you need to have basic authentication using base64 encoding');
});

app.get('/api/displayNames',function(req,res){
	if(req.headers.authorization === undefined){
		res.status(401).send('Please provide WWW-Authorization using basic in headers with base 64 encoding');
	}
	else
	{
		//grab the encoded value
		var encoded = req.headers.authorization.split(' ')[1];
		// decode it using base64
		var decoded = new Buffer(encoded,'base64').toString();
		var name = decoded.split(':')[0];
		var password = decoded.split(':')[1];
		// check if the passed username and password match with the values in our database.
		// this is dummy validation. 
		if(name === password){
		var namesObj = [{
		name: 'Eshwar',place: 'Hyderabad'},{name: 'Prasad',place: 'New York'},{name: 'Yaddanapudi',place: 'San Francisco'}];
		res.status(200).send(JSON.stringify(namesObj));		
		}
		else{
			res.status(403).send('Invalid authorization data provided. Please check username and pwd');
		}
	
	}
}).listen(3423);
console.log('waiting at 3423');
```

![](./image-1.png)
