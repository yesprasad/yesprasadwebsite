---
title: "Lets make our code talk - episode 3"
date: 2014-01-04
section: lab
tags: [".NET","Clean Code"]
summary: "Red-Color-Phobia: why hard-coded strings make code fragile, and how an enum makes the same C# logic clearer and safer."
---

Hi guys,  
Wish you and your dear one's a wonderful new year- 2014 ahead.

Continuing our abilities in trying to bring the best of us using our code, we are in the 3rd episode of this. This time around, we will discuss how we can make our code get rid of the red lines.  
Red lines? Yes, the hard coded text in C# is in general in red color and so we call it the Red-Color-Phobia.

## Red-Color-Phobia

Many developers have this tendency of hard coding few values, during the process of assigning things, comparing things or while retrieving things.

Example 1:  
Say, there is a requirement for an online shopping portal where in, based on the current location of the active customer, a surprise discount percentage has to be offered during the Thanks Giving time.

The developer/ programmer has written this to achieve the requirement.

```csharp
Var cutomerSurpriseDiscountPercentage=0;
Var customerLocation = string.Empty;
If(customerLocation == “New York”)
{
       cutomerSurpriseDiscountPercentage = 10;
}
```

How can we better this code?

Define an ENUM that holds the names of the locations to which the surprise discount s available

```csharp
enum ValidSurpriseDiscountLocations{
NewYork = “New York”,
Detroit,
NewJersy = “New Jersy”
}
```

Thus, our code is little modified for a better quality

```csharp
Var cutomerSurpriseDiscountPercentage=0;
Var customerLocation = string.Empty;
If(customerLocation == ValidSurpriseDiscountLocations. NewYork)
{
  cutomerSurpriseDiscountPercentage = 10;
}
```

See you again.
