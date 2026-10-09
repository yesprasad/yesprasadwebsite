---
title: "I Built a RAG System Without LangChain — Here's What I Actually Learned"
date: 2025-09-01
section: essay
tags: ["RAG","LLM","Python","ChromaDB","Ollama"]
summary: "Every RAG tutorial starts with pip install langchain. I built one from scratch instead — Python, Sentence-Transformers, ChromaDB and a local LLM — and learned what the abstractions hide."
series: rag-from-scratch
part: 1
---

Every RAG tutorial I found started the same way: *pip install langchain.* And then the magic happened — a few method calls, a vector store, and suddenly you had a "production RAG system." Except you didn't. You had a wrapper around a wrapper around a wrapper, and when something went wrong, you had no idea where to look.

So I built one from scratch. No LangChain. No LlamaIndex. Just Python, Sentence-Transformers, ChromaDB, and a local LLM running on my laptop. Here is what building it from the ground up taught me that no tutorial covered.

## Why most RAG demos don't prepare you

### Scenario A: You follow the tutorial. It works perfectly.

Three API calls, a vector store, a retriever. The demo answers correctly. You ship it. Then it fails on real documents in ways you can't debug because you don't know what's inside the abstraction.

### Scenario B: You build from scratch. You break everything.

Your chunker splits a policy clause mid-sentence. Your model hallucinates on large contexts. You fix both — and now you understand every layer because you wrote every layer.

> "I chose not to use LangChain deliberately. This helped me internalize the mechanics of RAG — from document parsing to contextual retrieval — all the way through model interaction."

## Two pipelines. Every stage visible.

```text
RAG Pipeline — KnowledgeAI

── INGESTION (runs once per document set)
Plain Text Docs → Paragraph Chunker → 2-Sentence Overlap → MiniLM Embeddings → ChromaDB Store

── RETRIEVAL + GENERATION (every query)
User Question → Query Embed → Top-K Cosine → Context Assembly → Qwen 7b · Ollama

── OUTPUT
✓ Answer + filename · start_line · end_line
```

There are two pipelines that run at different times. Ingestion happens once. Retrieval and generation happen on every query. Understanding that separation is the first thing frameworks hide from you. When you write it yourself, the boundary is a function call — and you know exactly what crosses it.

## The system — and what I left visible on purpose

The system reads plain text policy documents, chunks them into paragraphs with 2-sentence overlap, generates embeddings using `all-MiniLM-L6-v2`, stores them in a persistent ChromaDB instance, and answers natural language questions by retrieving the most relevant chunks and passing them to a local LLM via Ollama.

I left commented logic, print statements, and intermediate variables in the code deliberately. Comments like *"this is valid only for the very first para we read from the file"* are in there on purpose — they show the edge cases I found while building, not polished away to look tidy.

- **Chunking — paragraph-based.** Blank line = end of semantic unit. Preserves meaning that fixed-size windows destroy.
- **Overlap — 2-sentence prefix.** Last 2 lines of each chunk prefix the next. Helps the LLM — not retrieval scores.
- **Citations — file + line range.** Every answer includes filename, start line, end line. Auditable and debuggable.

## What benchmarking three local models revealed

- **3** LLMs benchmarked locally
- **8GB** RAM · CPU only
- **11–12** winning tokens/min

| Model | Tokens/min | Coherence at top-K=5 |
| --- | --- | --- |
| DeepSeek 4b | 3–5 | Hallucinated ✗ |
| Qwen 1.5b | 7–9 | Degraded △ |
| Qwen 7b | 11–12 | Consistent ✓ |

*Model benchmark · Top-K=5 · CPU only · 8GB RAM*

The failure modes were different for each model. DeepSeek blended facts across chunks — subtle hallucination, confident tone. Qwen 1.5b truncated — it answered from the first chunk and ignored the rest. Qwen 7b held coherence across all 5 retrieved chunks. Same hardware, same documents, very different results.

## Citations are your debugging tool — not just a trust signal

I added citations for user trust. What I discovered quickly is that they are also the most powerful debugging instrument in the pipeline. When an answer is wrong, I know exactly where to look — open the document, read the cited lines, ask: was the answer actually in that chunk? Was it too large? Was the answer split across a boundary?

> "Citations aren't just for the user's trust. They are your chunking strategy's unit test."

## What works — and what's next

The system works. But it isn't fully production-ready, and I'm honest about that in the README. Three things are missing: an evaluation harness that scores faithfulness programmatically, ingestion idempotency so re-running doesn't create duplicate chunk IDs, and a distance threshold filter so low-confidence retrievals don't pollute the prompt.

- ✓ Paragraph chunking with 2-sentence overlap
- ✓ Citation-grounded retrieval with line tracking
- ✓ Local LLM benchmarking across 3 models
- ○ LLM-as-judge evaluation harness — next
- ○ Ingestion idempotency via content hashing — next
- ○ Distance threshold filtering — next

**Part 1 of 3.** Part 2 goes deep on chunking strategy — why paragraph boundaries beat fixed-size windows for policy documents, and why overlap helps the LLM not retrieval. Part 3 covers the full model benchmarking experiment and what token speed means for real inference decisions.

---

Full code and README on GitHub. Built to show how RAG works — not hide it. [View on GitHub](https://github.com/yesprasad/rag_citations_metadata_multi_doc) · [Connect on LinkedIn](https://www.linkedin.com/in/eshwarprasadyaddanapudi/)
