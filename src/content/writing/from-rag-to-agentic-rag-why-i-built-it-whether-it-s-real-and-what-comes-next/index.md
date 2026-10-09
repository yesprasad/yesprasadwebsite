---
title: "From RAG to Agentic RAG — Why I Built It, Whether It's Real, and What Comes Next"
date: 2025-09-19
section: essay
tags: ["AI Agents","Agentic RAG","RAG","ReAct","Architecture"]
summary: "A RAG system answers. An agent pursues a goal. Reconstructing why I added an agent layer to my wellness benefits RAG system, and when a RAG system actually needs to become an agent."
series: rag-from-scratch
part: 4
---

I have a confession: I forgot why I built this.

I finished my RAG series — three posts on chunking, hallucination, and token speed — and then kept coding. The repo grew a new folder called `agent/`. Files appeared: `perceive.py`, `reason.py`, `act.py`. I shipped it, wrote a README, and moved on. A few weeks later someone asked me why I added the agent layer at all, and I genuinely did not have a crisp answer.

So I went back and reconstructed it. This article is what I found — and more usefully, *when* a RAG system actually needs to become an agent, with real evidence from companies that have already made that call.

## The honest reconstruction: why I actually built this

It started with an ER visit. The bill was itemized in ways I did not understand, which sent me down a rabbit hole about how medical charges are actually structured. I built a RAG system to query policy documents — wellness plans, benefits handbooks, coverage tables — and get plain-language answers with citations.

That worked. But then a different question formed: what if an employee did not just want to *read* their benefits — what if they wanted to *act* on them? Check eligibility before a procedure. Compare two plan options side by side. Ask a follow-up that depended on the previous answer. These are not retrieval problems. They are reasoning problems that happen to need retrieval inside them.

> "A RAG system answers. An agent pursues a goal. The moment your user's question requires more than one retrieval step to answer honestly, you are already in agent territory."

That is the line I crossed — probably without fully realising it. The wellness agent I built is designed for employees and HR teams at companies whose wellness benefits are administered through a provider. Simple queries like *"what is the maximum gym claim?"* are retrieval. But *"compare my nutrition and mental health coverage and tell me which one I am underusing"* — that requires intent classification, two separate retrievals, a synthesis step, and a structured answer. That is an agent workflow.

## RAG vs agent: the actual difference — not the theoretical one

### Traditional RAG: one question. One retrieval. One answer.

Query comes in. Embed it. Fetch top-K chunks. Pass to LLM. Done. The flow is linear, static, and non-iterative. It cannot decide to look again.

### Agentic RAG: a goal. Multiple steps. Adaptive retrieval.

The LLM plans, retrieves, observes the result, and decides: enough context, or retrieve again? It can call tools, cross-reference sources, and change strategy mid-run.

The practical difference shows up in three scenarios. First, when a query has multiple parts and each part needs its own retrieval. Second, when the answer to the first question determines what to ask next. Third, when you need the system to check its own answer — to retrieve a second source and verify before responding. Standard RAG cannot do any of these. An agent can.

## When does RAG need to become an agent?

Not always. This is important. Most RAG problems do not need an agent — adding one adds latency, cost, and complexity. The question is whether your use case hits the signals that justify it.

- **Multi-step queries.** The user's question cannot be answered from a single retrieval. It requires sub-questions with intermediate results feeding forward.
- **Multiple data sources.** The answer lives across different documents, APIs, or structured databases — and the agent must decide which to query and in what order.
- **Verification required.** High-stakes answers (benefits, healthcare, compliance) need the system to cross-check its own response before surfacing it to the user.
- **Conversational continuity.** The user's follow-up question depends on the previous answer. Without memory, each turn starts cold and loses context.

The Wellness AI Agent hits three of these. Benefits queries often span multiple plan documents. Comparisons require synthesis across sources. And in healthcare adjacent domains, a wrong answer has real consequences — verification is not optional.

## Companies already running this in production

This is not experimental. Agentic RAG is in production at scale across industries — and the use cases closest to mine are the most instructive.

- **Uber · Genie.** Their on-call engineering copilot uses agents at multiple stages: a Query Optimizer reformulates ambiguous questions, a Source Identifier narrows the document set, and a Post-Processor deduplicates retrieved context. Result: 27% more acceptable answers, 60% reduction in incorrect advice vs traditional RAG.
- **eBay · Mercury.** Their internal agent platform combines RAG with real-time inventory data for product recommendations. The agent decides when to retrieve and what source to use — product docs, live listings, or user history — depending on the query context.
- **Healthcare RAG.** Agentic RAG systems pulling patient history, clinical literature, and drug interaction databases improved radiology QA accuracy from 68% to 73%. The agent retrieves from verified sources and decomposes complex clinical questions before answering.
- **Enterprise HR / Benefits.** Employee policy copilots answering HR, travel, and benefits queries with citations and effective dates are explicitly named as a production RAG use case in 2025 enterprise guides — exactly the domain of the Wellness Agent.

## What I built — and what the ReAct loop looks like

The project structure separates concerns into two layers. The `core/` folder handles the machinery: chunking, embedding, retrieval, LLM calls. The `agent/` folder handles the reasoning loop: perception, planning, action. Separating these was the most important architectural decision I made — it means the agent layer can evolve without rewriting the retrieval layer.

```text
Wellness AI Agent — Project Structure

── agent/ (the reasoning loop)
perceive.py       → clean input, classify intent
reason.py         → plan steps, assemble retrieval queries
act.py            → call core/, generate answer, observe result

── core/ (the retrieval machinery)
chunker.py        → paragraph-based, 2-sentence overlap
embedder.py       → all-MiniLM-L6-v2 embeddings
retriever.py      → ChromaDB vector search, top-K cosine
llm_interface.py  → Ollama / local model calls

── documents/
wellness_plan.md  → the benefit document corpus
```

The pattern the agent follows is close to ReAct — Reasoning + Acting — where the model interleaves thought steps with retrieval actions. Perceive observes the input. Reason plans the retrieval steps. Act executes them and observes the result. The difference between this and full ReAct is the feedback loop: in true ReAct, the observation from Act feeds back into Reason so the model can decide whether to retrieve again or stop. That loop is the next thing I am adding.

### Current state: agentic RAG pipeline — linear

Perceive → Reason → Act runs once per query. The agent classifies intent, retrieves relevant chunks from the wellness plan documents, synthesizes an answer with citations. Single pass, no iteration.

**Works well for:** Single-intent queries — "what is covered for mental health?" — where one retrieval retrieves enough to answer fully.

### Next state: full ReAct loop — iterative

Act feeds its observation back into Reason. The LLM decides: "I have enough context" → deliver answer, or "I need to retrieve from the nutrition section too" → loop again. Maximum 3–4 iterations before forcing a final answer.

**Needed for:** Multi-part queries — "compare my gym and nutrition coverage and flag anything expiring this year" — where a single retrieval does not surface enough.

## The phrase I keep coming back to: reactive to predictive

When I first wrote about AI agents, I included a phrase without fully unpacking it: *reactive to predictive.* Traditional software — and traditional RAG — is reactive. Something happens, the system responds. An agent is predictive: it has a goal, it plans steps toward that goal, and it adjusts when reality does not match the plan.

For wellness benefits, that shift matters more than it might seem. A reactive system answers what you asked. A predictive one might notice you asked about gym coverage but have not claimed it yet this year, and surface that proactively. That is not a retrieval problem. That is an agent problem. And it is exactly the kind of thing that makes the difference between a tool employees open once and a tool they actually rely on.

> "The market for agentic RAG is projected to reach $40 billion by 2035. The underlying use case — grounded, auditable, multi-step reasoning over private documents — is the same one I am building for wellness benefits."

## Where this project goes from here

- ✓ Paragraph chunking with 2-sentence overlap in core/
- ✓ Intent classification in perceive.py
- ✓ Retrieval + generation with citations in reason/act
- ✓ Separated agent layer from retrieval layer
- ○ ReAct feedback loop: act observation → reason re-plan
- ○ Session memory in core/ — remember prior Q&A per user
- ○ Multi-document routing — which plan document to query first
- ○ Claims processing actions — not just answers, but submissions

**Part 4 of the RAG → Agent series.** Parts 1–3 cover building RAG from scratch without LangChain, chunking strategy, and local model benchmarking. The full code for the Wellness AI Agent — including the agent loop and core RAG machinery — is on GitHub.

---

Wellness AI Agent on GitHub · Built from scratch · No LangChain · Full agent loop coming. [View on GitHub](https://github.com/yesprasad/Intel_RAG_2_AI_Agent_101) · [RAG repo](https://github.com/yesprasad/rag_citations_metadata_multi_doc) · [LinkedIn](https://www.linkedin.com/in/eshwarprasadyaddanapudi/)
