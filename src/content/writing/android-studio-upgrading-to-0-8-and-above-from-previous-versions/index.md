---
title: "Android Studio :: upgrading to 0.8 and above from previous versions?"
date: 2014-10-02
section: lab
tags: ["Android"]
summary: "if you are upgrading from a previous version of Android Studio to 0.8 and above then with in your project, make sure you change the following things: In build.gradle, check if…"
---

if you are upgrading from a previous version of Android Studio to 0.8 and above then with in your project, make sure  
you change the following things:

In build.gradle, check if apply plugin reads as follows:  
apply plugin: 'com.android.application'

at the bottom of the file, the dependencies should read like this

compile 'com.android.support:appcompat-v7:20.0.0'
