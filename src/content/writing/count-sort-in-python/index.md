---
title: "Count Sort in Python"
date: 2018-08-01
section: lab
tags: ["Algorithms","Python"]
summary: "Here is the count sort implementation using python"
---

Here is the count sort implementation using python

```python
ary = [1,1,1,2,4,5,6,1,2,2,4,5]
outAry = [0] * (len(ary) + 1)
max = 0
for i in range(len(ary)):
  if max <= ary[i]:
    max = ary[i]

cntAry = [0] * (max + 1)

for j in range(len(ary)):
  cntAry[ary[j]] +=1

for k in range(1,len(cntAry)):
  cntAry[k] += cntAry[k-1]

for m in range(len(ary)-1,-1,-1):
  outAry[cntAry[ary[m]]-1] = ary[m]
  cntAry[ary[m]] -=1

print(outAry)
```
