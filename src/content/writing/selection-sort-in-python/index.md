---
title: "selection sort in python"
date: 2018-06-29
section: lab
tags: ["Algorithms","Python"]
summary: "selection sort: time complexity: O n^2 space complexity: O 1"
---

selection sort:  
time complexity: O(n^2)  
space complexity: O(1)  

```python
def sort(ar):
  for i in range(len(ar)):
    #assume first index has the min value element
    min_idx = i
    for j in range(i,len(ar)):
      if(ar[min_idx]> ar[j]):
        min_idx=j
    ar[i],ar[min_idx]=ar[min_idx],ar[i]
ary = [11,25,12,22,64]
sort(ary)
print(ary)
```
