---
title: "From ChromaDB to S3 Vectors — What I Learned About How Embeddings Actually Work"
date: 2026-01-01
section: essay
tags: ["RAG","Embeddings","ChromaDB","S3 Vectors","AWS Bedrock"]
summary: "I traced one sentence from raw text through embedding, storage and retrieval in two different systems — ChromaDB locally and S3 Vectors on AWS. What came out changed how I think about vector databases."
series: rag-from-scratch
part: 5
---

I have been building RAG systems for a while now. ChromaDB locally, then AWS with Bedrock and S3 Vectors. As I was building, I asked myself: *"so where exactly does the embedding sit?"*

So I went deep. I traced one sentence — one actual benefits document chunk — from raw text all the way through embedding, storage, and retrieval. In two completely different systems. What came out the other side changed how I think about vector databases in general.

## The sentence that started it: a simple question

My RAG system answers health insurance benefits questions. The documents contain sentences like this:

```text
"Preventive care: Annual physical, immunizations, and screenings
covered at 100% in-network, no copay."
```

When a user asks *"Is my annual checkup free?"* — they never wrote those exact words. The RAG system has to find that sentence anyway. That is the whole point of vector search: finding semantic similarity, not keyword matches.

To get there, that sentence has to become a number. Actually, it has to become a list of numbers. Let me show you exactly what happens — in both worlds.

## Two worlds, same problem: same pipeline, *very different internals*

I built the same pipeline twice. First with **sentence-transformers + ChromaDB** running locally. Then with **Amazon Titan V2 + S3 Vectors** on AWS via CDK. Same input. Same goal.

```python title="World 1 — Local / ChromaDB"
self.model = SentenceTransformer('all-MiniLM-L6-v2')
self.client = chromadb.PersistentClient(path='./chroma_store')
self.collection = self.client.get_or_create_collection('policies')
```

```python title="World 2 — AWS / S3 Vectors"
bedrock_runtime = boto3.client("bedrock-runtime", region_name="us-east-1")
s3vectors = boto3.client("s3vectors", region_name="us-east-1")
```

One runs inference on my laptop. The other makes API calls to AWS. But the shape of what they produce — and what they store — is structurally the same.

## Step 1: Turning text into *numbers*

```text title="embedding — encode()"
"Preventive care: Annual physical, immunizations..."
        ↓  encode()  or  invoke_model()
[0.0231, -0.1847, 0.0093, 0.2341, ..., -0.0876]
```

**With `all-MiniLM-L6-v2`:** The model weights (~80 MB) live on your machine. `model.encode(text)` runs inference locally and returns a numpy array of **384 floats**. No network call. No cost. Fast.

**With Titan V2:** A POST request goes to Bedrock. AWS runs the model on their infrastructure and returns a list of **1024 floats**. Network latency. Billed per token.

> "The embedding is not a summary. It is a coordinate. A point in high-dimensional space where meaning lives as geometry."

## Step 2: What gets stored *and where*

This is where the two systems diverge most visibly.

```python title="ChromaDB — add()"
def process_chunk(self, chunk_text, chunk_id):
    embeddings = self.model.encode(chunk_text)
    self.collection.add(
        documents=[chunk_text],
        embeddings=[embeddings.tolist()],
        ids=[chunk_id]
    )
```

```python title="AWS — put_vectors()"
vectors_payload.append({
    "key": f"{policy}_chunk_{idx:04d}",
    "data": {"float32": embedding},         # the 1024 floats
    "metadata": {
        "policy":      "PPO_PLUS",
        "chunk":       chunk_text,          # original text stored here
        "chunk_index": idx,
        "source":      "docs/ppo_plus_2024.txt"
    }
})
s3vectors.put_vectors(
    vectorBucketName=BUCKET, indexName=INDEX, vectors=vectors_payload
)
```

The structure is the same: a unique key, the float vector, and the original text traveling alongside. The difference is that my ChromaDB version stores no `policy` metadata — which matters enormously at query time.

## The full *pipeline visualised*

```text
YOUR SENTENCE (raw text)
         │
         ▼
┌─────────────────────────┐
│   EMBEDDING MODEL       │
│                         │
│  MiniLM  →  384 floats  │
│  Titan   →  1024 floats │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────────────────────────────┐
│              VECTOR STORE                        │
│                                                  │
│  KEY          │ VECTOR          │ TEXT/METADATA  │
│  chunk_0042   │ [0.02, -0.18…] │ "Preventive…"  │
│  chunk_0043   │ [0.11,  0.03…] │ "Deductible…"  │
│  chunk_0044   │ [-0.07, 0.22…] │ "Out-of-pocket"│
│                                                  │
│  ◄── similarity search runs here ──►             │
│        (on the float columns only)               │
└─────────────────────────────────────────────────┘
          │
          ▼
    QUERY: "Is my annual checkup free?"
         │  embed this too
         ▼
    [0.019, -0.176, ...]   ← 384 or 1024 floats
         │  cosine similarity against stored vectors
         ▼
    chunk_0042  score 0.91  ✓  return its text
    chunk_0019  score 0.74
    chunk_0031  score 0.71
```

## Step 3 — the part I did not expect: ChromaDB uses *two storage systems*

I thought ChromaDB was Magic! It is not. It uses **two completely separate storage systems** — and understanding why is the most interesting technical detail in this entire article.

```text title="./chroma_store — on disk"
./chroma_store/
├── chroma.sqlite3          ← ids, documents, metadata
└── <collection-uuid>/
    ├── data_level0.bin     ← the actual float vectors (HNSW)
    ├── header.bin
    └── length.bin
```

- **SQLite (`chroma.sqlite3`) — human-readable data.** IDs, original document text, and metadata — everything you can read, filter, and query with standard SQL.
- **HNSW (`data_level0.bin`) — the float vectors.** Raw float arrays stored in a Hierarchical Navigable Small World graph, purpose-built for nearest-neighbour search.

### Why two systems?

SQLite is not designed for *"find me the 3 rows whose float arrays are geometrically closest to this other float array."* HNSW builds a multi-layered graph and navigates it hierarchically — O(log n) instead of brute-force O(n). The two systems work together: HNSW returns IDs 42, 17, 8 → SQLite returns their text.

```text
HNSW GRAPH (simplified)

Layer 2 (coarse):    A ──────────────── E
                          \          /
Layer 1 (medium):    A ─── C ─────── E ─── G
                     │     │         │
Layer 0 (fine):    A─B─C─D─E─F─G─H─I─J  (all vectors here)

✓ Query enters at Layer 2, navigates toward target region,
  then drills to Layer 0 for exact nearest neighbors.
```

> "ChromaDB looks like one thing from the outside. Inside, it's a SQLite database and an HNSW graph file working as a team — one for the math, one for the meaning."

## Step 4: Why metadata filtering *actually matters*

At query time, the user asks: *"What is my deductible?"* That question gets embedded into the same vector space as all stored chunks. Here is where the two implementations diverge in a way that directly affects answer quality.

### Scenario A — ChromaDB, no metadata: imprecise retrieval.

A question about PPO deductibles might return HMO chunks. The similarity search does not know which plan the user is asking about. *Mixed results — a PPO question returned HMO_SELECT chunks.*

### Scenario B — S3 Vectors, filtered: precise retrieval.

Policy is stored as metadata at ingest and used to filter before similarity search runs. Only the correct plan's chunks are ranked.

```python title="The right way — ChromaDB supports this too"
results = self.collection.query(
    query_embeddings=[question_embedding.tolist()],
    n_results=3,
    where={"policy": "PPO_PLUS"}   # filter equivalent
)
```

The lesson: **metadata is not decoration.** It is the mechanism that makes multi-document RAG precise. Build it in from day one.

## ChromaDB vs S3 Vectors — *side by side*

| Dimension | ChromaDB (local) | S3 Vectors (AWS) |
| --- | --- | --- |
| Embedding model | `all-MiniLM-L6-v2` local | Titan Embed V2 via Bedrock |
| Vector dimensions | 384 | 1024 |
| Where model runs | Your machine (CPU) | AWS infrastructure |
| Embedding cost | Free (compute only) | Billed per token |
| Vector storage | HNSW `.bin` files on disk | Managed ANN index |
| Text/metadata | SQLite (chroma.sqlite3) | Metadata fields in S3 Vectors |
| Query filtering | `where={"policy": ...}` | `returnMetadata=True` + filter |
| Scales beyond one machine | No (file-based) | Yes (managed service) |
| Setup complexity | `pip install chromadb` | CDK stack + IAM + bootstrap |
| Best for | Local dev, prototyping | Production, multi-user, scale |

## What I would tell myself *before starting*

1. **ChromaDB is not Magic!.** It is SQLite plus HNSW. The SQLite handles text and metadata retrieval. The HNSW handles the actual vector math. They are different tools solving different problems, bundled into one library.
2. **The embedding dimension is a contract.** If you ingest with `all-MiniLM-L6-v2` (384 dims) and query with Titan V2 (1024 dims), you get an error or nonsense results. Whatever model you use at ingest time, you must use at query time. Always.
3. **Metadata is not optional.** The moment you have more than one document type or user context in your vector store, metadata filtering is how you keep retrievals precise. Build it in from day one.
4. **Local to cloud is architectural, not technical.** The concepts — embed, store, search, retrieve — are identical. The execution model changes: local CPU vs API call, disk files vs managed service, free vs billed. The hardest part was IAM and CDK, not the vector logic.

## Not by reading, *but by geometry*

The RAG pipeline I built for wellness benefits uses S3 Vectors in production now — with Titan V2 for embeddings, Nova Micro for generation, and Bedrock Guardrails on both input and output. The vector search itself is one step in a larger chain.

But understanding that one step precisely — what a vector is, where it lives, what retrieves it, and why ChromaDB needs both SQLite and HNSW to do the job — changed how I reason about everything above it.

That sentence about preventive care? It is a point in 1024-dimensional space now. When someone asks if their checkup is free, the system finds that point — not by reading, but by geometry.

---

Part of the RAG → Agentic RAG series — previous posts cover chunking strategy, hallucination handling, and the ReAct agent loop. [GitHub](https://github.com/yesprasad) · [LinkedIn](https://www.linkedin.com/in/eshwarprasadyaddanapudi/)
