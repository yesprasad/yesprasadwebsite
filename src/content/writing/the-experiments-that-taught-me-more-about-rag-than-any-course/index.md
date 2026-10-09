---
title: "The Experiments That Taught Me More About RAG Than Any Course"
date: 2025-09-04
section: lab
tags: ["RAG","LLM","Benchmarking","Local LLM","Ollama"]
summary: "Three local models, one CPU-only machine with 8GB RAM, and twenty policy questions. What benchmarking DeepSeek 4b, Qwen 1.5b and Qwen 7b taught me about top-K, coherence and hallucination."
series: rag-from-scratch
part: 3
---

I did not set out to run a benchmarking study. I was building a RAG system for policy documents, running it locally on a CPU-only machine with 8GB RAM, and things kept failing in ways that courses and tutorials never warned me about. Each failure taught me something. This article is those lessons — in the order I learned them, the hard way.

- **3** LLMs tested locally
- **8GB** RAM · CPU only
- **11–12** winning tokens/min

## Same hardware. Same documents. Three very different results.

Three models running locally via Ollama: DeepSeek 4b with reasoning mode, Qwen 1.5b, and Qwen 7b. One ChromaDB vector store with paragraph-chunked policy documents. Top-K set to 5 — meaning every query retrieved 5 paragraph chunks and passed them all to the model as context.

I was not trying to find the best model for general use. I was trying to find the best model for *this specific task*: answering questions about policy documents, on constrained hardware, with real retrieved context — not a toy prompt.

```text
Test Setup

── ENVIRONMENT
Hardware:   MacBook · CPU only · 8GB RAM
Runtime:    Ollama · local inference · no GPU
Vector DB:  ChromaDB · persistent · paragraph chunks
Top-K:      5 chunks per query
Queries:    20 policy questions · same across all models

── MODELS TESTED
DeepSeek 4b with reasoning mode
Qwen 1.5b quantized
Qwen 7b quantized
```

## Experiment 1 — DeepSeek 4b · reasoning mode

### Impressive in demos. Unusable on CPU.

DeepSeek's reasoning mode is compelling — you can watch the chain of thought unroll before the answer arrives. On a GPU, that is a feature. On a CPU with 8GB RAM, it is a liability.

Average throughput: **3–5 tokens per minute.** A 200-token answer took between 40 and 60 minutes. No user will wait an hour for a policy answer. That is not a performance problem — it is a product-ending problem.

But speed was not the worst of it. Under top-K of 5, DeepSeek's coherence degraded. It would blend facts from different chunks — sometimes correctly, sometimes not — producing answers that sounded right but introduced numbers or conditions that were not in any of the retrieved documents. Subtle hallucination. The hardest kind to catch.

**Lesson:** Reasoning mode requires enough model capacity to hold the reasoning trace *and* the retrieved context simultaneously. On constrained hardware with large context, it becomes a liability, not an asset.

## Experiment 2 — Qwen 1.5b · fast but brittle

### Faster throughput. Different failure mode.

Qwen 1.5b was faster — 7 to 9 tokens per minute — and for small contexts it performed reasonably. The problem emerged specifically with top-K of 5. Passing 5 paragraph chunks to a 1.5b parameter model is asking it to reason across more context than it can reliably hold.

The failure mode was different from DeepSeek. Qwen 1.5b did not blend facts — it *truncated*. It answered based on the first 1 or 2 chunks and ignored the rest, even when the most relevant information was in chunk 4 or 5. The retrieved context window exceeded the model's effective reasoning capacity, and it defaulted to what it saw first.

**Lesson:** Small quantized models have an effective context ceiling that is lower than their advertised context window. For RAG with large top-K, model capacity matters more than raw speed.

## Experiment 3 — Qwen 7b · the sweet spot

### 11–12 tokens/min. Coherence held.

Qwen 7b ran at 11 to 12 tokens per minute on the same CPU-only hardware. A 200-token answer in roughly 17 minutes — slow by API standards, but workable for a local system where privacy matters more than speed.

More importantly, coherence held under full top-K context. The model could reason across all 5 retrieved chunks, synthesize information from multiple paragraphs, and produce answers that stayed grounded in the retrieved content. Hallucination dropped dramatically compared to the smaller models.

**Lesson:** For local RAG on constrained hardware, 7b is the minimum viable model size for reliable top-K coherence. The speed penalty is real — and so is the quality gain.

## Why top-K matters more than people think

| Model | Tok/min | Coherence | Failure mode |
| --- | --- | --- | --- |
| DeepSeek 4b | 3–5 | Failed ✗ | Fact blending |
| Qwen 1.5b | 7–9 | Degraded △ | Context truncation |
| Qwen 7b | 11–12 | Consistent ✓ | None observed |

*Full benchmark results · Top-K=5 · CPU only · 8GB RAM*

Top-K is the number of retrieved chunks passed to the LLM as context. Higher top-K means more retrieved information — which sounds better. But there is a model capacity ceiling. Below it, more context improves answers. Above it, the model starts losing coherence, dropping chunks, or blending facts incorrectly.

The right top-K is not a universal constant. It is a function of your model's capacity, your chunk size, and your document type. For my system — paragraph chunks averaging 150–200 words, policy documents, Qwen 7b — top-K of 5 was the practical ceiling before quality started degrading.

## The one no benchmark tells you: what does a wrong answer look like?

Token speed and coherence counts are useful. But the most important experiment I ran was not quantitative. I manually read 20 answers, traced each one back to its citation, opened the source document at the cited lines, and asked: did the model stay inside the retrieved context, or did it bring in something from outside?

> "The citation is not just a trust signal for the user. It is the only way to know, after the fact, whether your model stayed inside the retrieved context or started making things up."

Smaller models failed this test more often. Not always — sometimes they were perfectly accurate on simple queries. But on complex multi-clause policies with conditions and exceptions, they would occasionally introduce a number or qualifier that was not in the cited lines. Without citations, you would never know. You would just trust the confident-sounding answer.

## Three decisions I'd make from day one

1. **Start with 7b minimum.** Do not optimise for speed before you know your model can hold the context load. Start with a model that can handle your top-K reliably.
2. **Citations from line one.** Not as a feature — as infrastructure. Every chunk that touches the LLM should carry its source metadata from the very beginning.
3. **Measure token speed early.** On local hardware, the difference between 5 and 12 tokens/min is the difference between a usable tool and an unusable one.

**Part 3 of 3.** Part 1 covers building the full system from scratch without LangChain. Part 2 covers chunking strategy — why paragraph boundaries beat fixed-size windows and why overlap helps the LLM, not retrieval.

---

[View the code on GitHub](https://github.com/yesprasad/rag_citations_metadata_multi_doc) · [Read about Fluent-Graph](/writing/fluentgraph-semantic-intelligence-layer-for-servicenow-fluent-and-llm-systems/) · [LinkedIn](https://www.linkedin.com/in/eshwarprasadyaddanapudi/)
