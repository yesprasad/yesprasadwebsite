---
title: "Remove all docker images and containers shell script"
date: 2017-08-29
section: lab
tags: ["Docker"]
summary: "./image 1.png"
---

```bash
## remove all containers attached to the images
docker rm -f $(docker ps -a -q)

## Delete every Docker image
docker rmi -f $(docker images -q)
```

![](./image-1.png)
