---
title: "Lets make our code talk - episode 2"
date: 2013-12-13
section: lab
tags: [".NET","Clean Code"]
summary: "In episode 1 we made variable names talk. This time: how to improve the same code further so it tells its own story."
---

In our [previous post episode -1](/writing/lets-make-our-code-talk/), we spoke on how we can make our variable names can talk and all of them put together can tell their story on their own.

But if we see, in our previous code snippet, we can improve it much more than what it is now. Lets go get it here...  

```js
var customersBilledThisMonth;
//fill the list here
for(int currentCustomerNode=0; currentCustomerNode<customersBilledThisMonth.count;
          currentCustomerNode++)
{
        if(customersBilledThisMonth[currentCustomerNode].billedAmount>750)
       {
     Console.WriteLine(customersBilledThisMonth[currentCustomerNode].customerName);
        }
}
```

We can see a number in the code, right? Hey, what is this? Have a look at it a little closely...

  

Yeah!! I get it. It says if the value billedAmount is greater than 750, we enter the IF-condition. 

Okay, now let us make our code better. Let it talk to us on its own.

```js
var customersBilledThisMonth;
//fill the list here
var currentMonthTotalBillAmount
  = 750;
for(int currentCustomerNode=0; currentCustomerNode<customersBilledThisMonth.count;            currentCustomerNode++)
{
        if(customersBilledThisMonth[currentCustomerNode].billedAmount> currentMonthTotalBillAmount)
       {
     Console.WriteLine(customersBilledThisMonth[currentCustomerNode].customerName);
        }
}
```

  

  

  

  
That's it? Not really.  
Lets make it little more readable and story telling thing. What if the client want this value to be changed to $900 next month? Open the project, change the code, build and deploy again? NO. So what we do is make it configurable.

Add the below code in config.cs  

```html
<appSettings>
<add key ="currentBillingAmount" value = "750"/>
</appSettings>
```

change the value assigned to the variable as below  

```js
var currentMonthTotalBillAmount = ConfigurationSettings.AppSettings("currentBillingAmount");
```

  

Now, add the string that's hard coded into an enum file or a constants file, so that if the name spelled at different areas stay the same and there are no typos.

Observed the change? Now its more easy to understand what the code is doing?

There are many more ways than just this. This is one way of making our code do the right thing than just deliver the mere functionality.

####  Yes, its telling its story. Will talk more in the next episode.
