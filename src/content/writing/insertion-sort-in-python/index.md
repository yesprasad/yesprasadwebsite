---
title: "Insertion sort in Python"
date: 2018-06-29
section: lab
tags: ["Algorithms","Python"]
summary: "From today, I will be posting on Sorting algorithms in Python First of the sorting algorithm is insertion sort . Time complexity: O n^2 space complexity: O 1 Since the elements…"
---

From today, I will be posting on Sorting algorithms in Python  
First of the sorting algorithm is **insertion sort**.  
Time complexity: O(n^2)  
space complexity: O(1)

Since the elements are swapped in-place of the array, there is no extra space that is consumed  

#### **Approach:**

Always assume that the first element(index=0) of the array is sorted. Start the comparison from index=1.  
For the current index, we take a variable that helps us hold our previous index until we reach the 0th index of the array.  
when we find that the current element is smaller than its immediate previous element, set the current index value to previous index value and then set the previous index value to current element. now reduce the previous index value by 1 thus making the while loop break when we reach the 0th index.

Here is the code for insertion sort

```python
def sort(ar):
  #start from index 1 assuming the first elem is already sorted
  for currIndex in range(1, len(ar)):
    value = ar[currIndex]
    prevIndex = currIndex - 1
    #loop through the ary until we reach 0th index
    while prevIndex>=0:
      if value < ar[prevIndex]:
        ar[prevIndex+1] = ar[prevIndex]
        ar[prevIndex] = value
        prevIndex -= 1
      else:
        break

ary= [7,4,3,3,1,2,1,100]
sort(ary)
print(ary)
```

Hackerrank practice problems are below:  
[https://www.hackerrank.com/challenges/insertionsort1/problem](https://www.hackerrank.com/challenges/insertionsort1/problem)  
[https://www.hackerrank.com/challenges/insertionsort2/problem](https://www.hackerrank.com/challenges/insertionsort2/problem)
