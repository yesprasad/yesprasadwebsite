---
title: "From Flip-Flops to AI Agents: Twenty-One Years of Writing in Public"
date: 2026-10-08
section: notes
tags: [career, writing, engineering]
summary: "An ECE student's blog in 2005, a first seminar on flip-flops, and the one question that has followed me from circuits to AI agents: what changes when state changes?"
featured: true
draft: false
---

In 2005, I was an Electronics and Communication Engineering student in Hyderabad with a new Blogger account and more curiosity than I knew what to do with. I wrote about MEMS, nanotube transistors, CDMA and WiMAX: anything that looked like the future.

That August, I posted a short note: I was preparing a seminar on **flip-flops**, and if anyone wanted to help, or needed help, they should reach out.

I didn't know it then, but that seminar was about the idea I would spend the next two decades working on.

## A flip-flop is a promise about state

A flip-flop is the smallest unit of memory in digital electronics. It holds one bit. It changes only when a clock tells it to, and every circuit around it depends on that change happening exactly when, and exactly how, it is supposed to.

Digital design teaches you an early, uncomfortable lesson: **the change itself is rarely the problem. What the change reaches is.** One flip-flop toggling at the wrong moment can ripple through everything wired to it.

I left circuits behind. That lesson never left me.

## From circuits to code

My path moved from hardware to software, first building applications, then leading teams that built them. I wrote along the way, because writing was how I understood things.

Between 2013 and 2016, I wrote about C#, ASP.NET, MongoDB, Agile and Node.js on my *Tech Talks* blog. In 2016, *Node.js Everyday* followed: the event loop, ES6, Docker, unit testing with Mocha and Chai. I started recording video lessons the same year, because some ideas are easier to show than to explain.

## Building for enterprises

My first chapter in software was at **Infosys**, on a Loan Origination System for **Rabobank** Australia and New Zealand, the world's leading agricultural lender, built on .NET, C#, ASP.NET and SQL Server. I led the team that built its Workflow module: the part that shows branch managers a client's financial position, previous loans and existing assets before they decide on an application. I then led the onsite team in Sydney through system testing, UAT and production support. It was a high-risk project, and turning it around earned our team **first prize**.

Later, at **ADP**, I led JavaScript engineering on an automotive microservices platform built on Node.js and Kubernetes.

Enterprise software taught me that systems are never just code. They are contracts, integrations and people who depend on things not breaking.

At **Telstra**, I led JavaScript engineering on billing and customer platforms. Our team won the **Telstra Innovation Hackathon (#TIH2019)** against 69 teams from four countries, and later the **Dream Team of the Quarter** award. Both taught me that a good idea still has to be built, shown and defended.

## Leading at platform scale

At **ServiceNow**, I was an Engineering Manager, leading a team of ten engineers on Sourcing and Procurement Operations. We shipped workflows that real enterprises run their purchasing on, across releases, languages and the ServiceNow Store.

This is where the flip-flop lesson came back in full. On an enterprise platform, a change is never small. A role, an access rule, a business rule or a table relationship is wired into everything around it. Teams didn't fear writing changes. **They feared not knowing what a change would reach.**

## The thread: consequences before change

Today, AI agents write code too, and quickly. An agent can change an access rule in seconds. The diff shows two lines. It doesn't show which roles gained access, which records now depend on that change, or what moved underneath.

That is the problem I work on now:

- **Fluent-Graph** maps a ServiceNow Fluent application as a graph and shows the blast radius and consequences of every change before it is committed.
- **deep-graph** brings the same structural context to AI code review for TypeScript and Java.
- **The Authorship Inversion**, my position paper, argues that once agents become the authors of software, systems need a layer that shows consequences *before* action, not after.

It's the same question I first met in a flip-flop seminar: **when state changes, what else changes with it?**

## Still writing

Twenty-one years after that first post, I'm still writing in public, now with research, talks and open-source tools alongside the articles.

The topics have changed. The habit hasn't: learn something, build something, and write it down so someone else can understand it faster than I did.

This site brings all of it together in one place.
