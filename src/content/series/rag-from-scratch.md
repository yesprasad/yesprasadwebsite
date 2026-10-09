---
title: RAG from Scratch
tagline: Retrieval-augmented generation built on an 8GB laptop — no GPU, no LangChain — and taken all the way to agents and AWS.
order: 1
links:
  - { label: "Code: single-document RAG", url: "https://github.com/yesprasad/rag_single_document" }
  - { label: "Code: multi-document RAG with citations", url: "https://github.com/yesprasad/rag_citations_metadata_multi_doc" }
  - { label: "Code: wellness AI agent", url: "https://github.com/yesprasad/Intel_RAG_2_AI_Agent_101" }
next:
  label: What's next
  text: The same idea — see why a system did what it did before you trust it — applied to code changes.
  url: /platforms/
---

Every RAG tutorial starts with `pip install langchain`. This series starts with a blank Python file.

I built a RAG system from the ground up — chunker, embeddings, vector store, citations, local models — on a CPU-only laptop with 8GB of RAM, then took it to an agent and to AWS. Every failure is written down: the chunks that destroyed meaning, the models that hallucinated confidently, the 40-minute answers.

Read it in order, or jump to the part you need.
