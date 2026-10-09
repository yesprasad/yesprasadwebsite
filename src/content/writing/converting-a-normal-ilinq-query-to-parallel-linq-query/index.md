---
title: "Converting a normal ILINQ query to parallel linq query"
date: 2014-03-15
section: lab
tags: [".NET"]
summary: "A simple example for converting the normal linq query to a Parallel Linq query in dotnet. public void NormalLinqQuery { IEnumerable<int localRange = Enumerable.Range 1,…"
---

A simple example for converting the normal linq query to a Parallel Linq query in dotnet.  

  

  

public void NormalLinqQuery()

        {

            IEnumerable<int> localRange = Enumerable.Range(1, 100000000);

            Stopwatch watch = Stopwatch.StartNew();

            var output = localRange

                .Where(getNum => getNum % 1234567 == 0)

                .Select(rangeNum => rangeNum);

            foreach (var num in output)

                Console.WriteLine(num);

            Console.WriteLine("Normal Query in millisec: {0}",watch.ElapsedMilliseconds);

        }

  

        public void ParallelLinqQueryExample()

        {

            IEnumerable<int> localRange = Enumerable.Range(1, 100000000);

            Stopwatch watch = Stopwatch.StartNew();

            var output = localRange

                .AsParallel()

                .Where(getNum => getNum % 1234567 == 0)

                .Select(rangeNum => rangeNum);

            foreach (var num in output)

                Console.WriteLine(num);

            Console.WriteLine("Parallel Query in millisec: {0}", watch.ElapsedMilliseconds);

        }
