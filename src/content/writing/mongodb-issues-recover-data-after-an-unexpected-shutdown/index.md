---
title: "MongoDB issues : Recover Data after an Unexpected Shutdown"
date: 2014-10-05
section: lab
tags: ["MongoDB"]
summary: "Today while working on MongoDb, i had a power interruption and the system has restarted. when i tried to start mongod.exe with the command \\ mongod.exe dbpath E:\\\\MyFolder\\\\bin…"
---

Today while working on MongoDb, i had a power interruption and the system has restarted. when i tried to start mongod.exe with the command

\>mongod.exe --dbpath E:\\MyFolder\\bin

it threw me an error stating there was an issue with the close connections of Mongod. This means that data sync has some issues and so mongod cannot start smoothly  
The solution for this is:

check if there is a file named mongod.lock in the bin folder. If yes, check if its size is greater than 0kB.  
If yes, then delete this file, because this is the one that is intimating mongod that there was an abrupt closure of the database the previous time.  
now go back to the command line and say

\>mongod.exe --journal (in case journal is not set for your db)  
\>mongod.exe --repair

this should set the database back in line and up and running.  
if you get another error like  
*initandlisten\] exception in initAndListen: 10296 dbpath (/data/db) does not exist, terminating*  
then exit the cmd line and rerun the repair command and then say

\>mongod.exe --dbpath E:\\MyFolder\\bin

to set everything back in line.
