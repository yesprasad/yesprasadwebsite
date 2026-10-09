---
title: "What RAG Tutorials Don't Teach You — Chunking, Hallucination, and Token Speed"
date: 2025-09-02
section: essay
tags: ["RAG","LLM","Chunking","Local LLM"]
summary: "Three problems no RAG tutorial warned me about: chunking that destroys meaning, quantized models hallucinating under load, and token speed that makes some models unusable on real hardware."
---

Most RAG tutorials show you how to get an answer. Very few show you how to get a *correct* answer — and almost none explain what causes a wrong one. After building a multi-document RAG system from scratch, I ran into three problems no tutorial warned me about: chunking destroying meaning, quantized models hallucinating under load, and token speed making some models unusable on real hardware.

This is what I learned — and what I would do differently from day one.

## Problem 1: Fixed-size chunking destroys meaning

The default chunking strategy in most tutorials is fixed-size — split every 512 tokens, maybe with a small overlap. It is simple, predictable, and fast. It is also wrong for documents where meaning lives inside a continuous clause.

I was chunking policy documents. A policy clause like *"employees are entitled to reimbursement up to $500 provided the expense was pre-approved by a line manager and falls within the categories defined in Appendix B"* — split at a fixed boundary — becomes two useless half-sentences. Neither chunk retrieves well. Neither answers the question correctly.

> "Chunking is not a technical decision. It is a semantic decision. The unit of your chunk should be the unit of meaning in your document."

```text
Chunking Comparison — Policy Document

── FIXED-SIZE (512 tokens)
Chunk A: "...employees are entitled to reimbursement up to $500 provided the"
         ✗ missing: who qualifies, what categories apply
Chunk B: "expense was pre-approved by a line manager and falls within..."
         ✗ missing: the amount, the subject of the clause

── PARAGRAPH-BASED
Chunk A: "employees are entitled to reimbursement up to $500 provided the expense
          was pre-approved by a line manager and falls within Appendix B categories."
         ✓ complete semantic unit — retrieves and answers correctly
```

My solution: chunk by paragraph boundary. A blank line in the document signals the end of a semantic unit. When the chunker hits two consecutive newlines, it closes the current buffer and stores the chunk. The result is chunks that map to human-readable ideas — not arbitrary token counts.

## Problem 2: Overlap is for the LLM — not for retrieval

Most tutorials that mention overlap describe it as improving retrieval — the idea being that repeated content increases the chance a chunk matches a query embedding. That is not quite right. Overlap does not meaningfully change cosine similarity scores. What it actually does is help the LLM.

When your retriever returns chunk 7, that chunk starts cold. The LLM has no idea what was in chunk 6. If a clause spans a paragraph boundary — condition in paragraph 6, consequence in paragraph 7 — the LLM reading only chunk 7 will generate an incomplete or wrong answer.

- **Without overlap — chunk 7 starts cold.** LLM misses the condition set in paragraph 6. Answer is incomplete or fabricated from training data.
- **With 2-sentence overlap — chunk 7 has context.** Last 2 lines of paragraph 6 prefix chunk 7. LLM has continuity. Answer is grounded and complete.

I added the last 2 sentences of each paragraph as a prefix to the next chunk. This is not retrieval improvement — it is generation improvement. Keep that distinction clear, because it changes *how* you would measure whether it is working.

> "The overlap is not for the embedding model. It is for the LLM that reads what the embedding model found."

## Problem 3: Quantized models hallucinate under large top-K

I tested three local models: DeepSeek 4b, Qwen 1.5b, and Qwen 7b. On small top-K contexts, all three performed reasonably. The problems emerged when I increased top-K to 5, passing more retrieved context to the model.

Smaller quantized models started hallucinating — not dramatically, but in the subtle way that is hardest to catch: confident answers that *almost* matched the policy document but introduced a number or condition that was not there. The model could not hold the full context and started filling gaps from its training data instead of the retrieved chunks.

| Model | Tokens/min | Coherence |
| --- | --- | --- |
| DeepSeek 4b | 3–5 | Hallucinated ✗ |
| Qwen 1.5b | 7–9 | Degraded △ |
| Qwen 7b | 11–12 | Consistent ✓ |

*Model benchmark · Top-K=5 · CPU only · 8GB RAM. Measured on MacBook · CPU-only inference · averages over 20 queries.*

DeepSeek with its reasoning mode was particularly slow — 3 to 5 tokens per minute on CPU-only hardware. For a single query that might mean waiting 40 to 60 minutes for an answer. That is not a performance problem — it is a product-ending problem. Qwen 7b at 11 to 12 tokens per minute was the only model that balanced speed and coherence at top-K of 5.

## The real insight: citations as your debugging loop

Every answer in my system includes a citation: the filename, the start line, and the end line of every chunk that contributed to the response. I added this for user trust. What I quickly realized is that citations are also the most powerful debugging tool in the entire pipeline.

If the citation points to lines 42–67 and the answer is wrong, I know exactly where to look. Open the document, read those lines, ask: was the answer actually in that chunk? Was it too large? Was the answer split across a boundary?

```text
Answer: Employees are entitled to reimbursement up to $500...

📚 Sources:
1. policy_handbook.txt (lines 42–67)
2. expense_guidelines.txt (lines 12–28)

# if answer is wrong → open file → read lines 42-67 → diagnose chunk boundary
```

> "Run 10 policy questions. Record the citations. Read the cited chunks manually. That process is the foundation of a RAG evaluation loop — and it costs nothing except discipline."

**Part 2 of 3.** Part 1 covers building the full system from scratch without LangChain and why that choice matters. Part 3 covers the complete model benchmarking experiment — three models, one CPU, and what the token speed numbers mean for production inference decisions.

---

Full code on GitHub — with comments left in on purpose, so you can see the thinking. [View on GitHub](https://github.com/yesprasad/rag_citations_metadata_multi_doc) · [Connect on LinkedIn](https://www.linkedin.com/in/eshwarprasadyaddanapudi/)
