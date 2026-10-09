---
title: "Lets make our code talk"
date: 2013-12-11
section: lab
tags: [".NET","Clean Code"]
summary: "Whaaattt......how can a code talk? Its Okay. Don't get too confused. Lets jump in.... Everyday, we spend most of our time writing the best that we believe is good for the…"
---

Whaaattt......how can a code talk? Its Okay. Don't get too confused. Lets jump in....  
Everyday, we spend most of our time writing the best that we believe is good for the project that we work on. At the end of the day, it should not just remain like - do some work on a button click or change content of the page based on a drop-down.

The code behind the application should tell you as a developer what it is doing.

***example***:  
**Requirement:** There is a list that holds the customers for a company who have billed the highest for the current month. We should loop through the list and print the names of the customers in the list whose billing amount is greater than $750.

Code:

var custLst;

//fill the list here

for(int i=0;i<custLst;i++)  
{  
        if(custLst\[i\].BildAmt>750)  
       {  

             Console.WriteLine(custLst\[i\].Name);

        }  
}

as you can read through, we will understand that it prints the name onto the console pane for the condition where the billing amount is greater than $750 by looping through the list. LIST..."i"......!!!

So whats the great deal????......... just think again... is the code really conveying the same as what we talked as above??? ......... NOT REALLY.....RIGHT???

now we will tweak the above same code to make it talk and tell its story on its own.... yes code should tell what it is doing and its story....

var customersBilledThisMonth;

//fill the list here

for(int currentCustomerNode=0; currentCustomerNode<customersBilledThisMonth; currentCustomerNode++)

{

        if(customersBilledThisMonth\[currentCustomerNode\].billedAmount>750)

       {

             Console.WriteLine(customersBilledThisMonth\[currentCustomerNode\].customerName);

        }

  

}

the above code makes more sense, isn't it?  
We will talk more about  - **Lets make our code talk** in the next post
