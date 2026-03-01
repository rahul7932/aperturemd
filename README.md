# MedTrust AI

**An epistemology layer for medical AI** — transparent evidence attribution, confidence scoring, and knowledge gap detection.

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## The Problem

Most medical RAG systems do this:

```
Question → Retrieve documents → Generate answer → Done ✓
```

They give you an answer but can't explain:
- **Which evidence** supports which claims?
- **How strongly** does the evidence support the conclusion?
- **What contradicting studies** exist?
- **What don't we know?** What's missing from the evidence?

This opacity is fundamentally incompatible with evidence-based medicine.

---

## The Solution

MedTrust AI adds a **Trust Layer** — a post-hoc verification engine that audits every answer:

```
Question → Retrieve → Generate → TRUST LAYER → Trust Report
                                      │
                         ┌────────────┼────────────┐
                         │            │            │
                    Extract      Score        Detect
                    Claims    Attribution     Gaps
```

The output is a **Trust Report** that tells you:
- ✅ What claims were made
- 📊 Which documents support/contradict each claim  
- 🎯 Evidence-based confidence scores (not model logprobs)
- ⚠️ What evidence is missing

---

## Demo

![MedTrust AI Dashboard](https://via.placeholder.com/800x450?text=Dashboard+Screenshot)

*Ask a medical question → Get an answer with transparent evidence attribution*

---

## Key Features

### 🧬 Trust Layer (Core Innovation)

| Component | What It Does |
|-----------|--------------|
| **Claim Extractor** | Breaks answer into atomic, verifiable claims |
| **Attribution Scorer** | Classifies each document as SUPPORTS / CONTRADICTS / NEUTRAL |
| **Confidence Calculator** | Evidence-based scoring: `agreement × log(sources) × quality` |
| **Gap Detector** | Identifies missing evidence (populations, outcomes, durations) |

### 🔍 RAG Pipeline

| Feature | Description |
|---------|-------------|
| **PubMed Integration** | Ingest medical abstracts via E-utilities API |
| **Vector Search** | pgvector for semantic similarity (OpenAI embeddings) |
| **Inline Citations** | Answers include `[PMID:xxxxx]` links to PubMed |
| **Query Expansion** | Expand medical terminology for better retrieval |

### 📊 Dashboard

| Component | Purpose |
|-----------|---------|
| **Answer Panel** | Displays answer with clickable color-coded citations |
| **Evidence Map** | Expandable claim cards with supporting/contradicting evidence |
| **Confidence Meter** | Visual gauge with per-claim breakdown |
| **Gaps Panel** | Lists missing evidence and uncertainties |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           USER QUERY                                 │
│              "Do ACE inhibitors reduce mortality?"                   │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        RETRIEVAL LAYER                               │
│                                                                      │
│   Query Expander ──► Embeddings (OpenAI) ──► pgvector ──► Top K     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       GENERATION LAYER                               │
│                                                                      │
│                    RAG Generator (GPT-4o)                            │
│        "ACE inhibitors reduce mortality [PMID:12345]..."            │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 TRUST LAYER  ← The Core Innovation                   │
│                                                                      │
│   ┌──────────────┐    ┌───────────────┐    ┌──────────────────┐    │
│   │    Claim     │───►│  Attribution  │───►│   Confidence     │    │
│   │  Extractor   │    │    Scorer     │    │   Calculator     │    │
│   └──────────────┘    └───────────────┘    └──────────────────┘    │
│          │                                          │               │
│          └──────────────┐    ┌──────────────────────┘               │
│                         ▼    ▼                                       │
│                   ┌──────────────┐                                   │
│                   │ Gap Detector │                                   │
│                   └──────────────┘                                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         TRUST REPORT                                 │
│  {                                                                   │
│    "claims": [...],                                                  │
│    "overall_confidence": 0.73,                                       │
│    "evidence_summary": { "supporting": 4, "contradicting": 1 },     │
│    "global_gaps": ["Long-term outcomes unknown"]                     │
│  }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | FastAPI, Python 3.11+ |
| **Database** | PostgreSQL + pgvector (Supabase) |
| **Embeddings** | OpenAI text-embedding-3-small (1536 dims) |
| **LLM** | GPT-4o (generation), GPT-4o-mini (trust layer) |
| **Frontend** | React 18 + TypeScript + Tailwind CSS |
| **Build** | Vite |

---

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- [Supabase](https://supabase.com) account (free tier works)
- [OpenAI](https://platform.openai.com) API key

### 1. Clone & Setup Backend

```bash
git clone https://github.com/rahul7932/healthtech-1.git
cd healthtech-1/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp env.example .env
# Edit .env with your Supabase URL and OpenAI API key
```

### 2. Setup Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Enable pgvector: **Database → Extensions → Search "vector" → Enable**
3. Get connection string: **Project Settings → Database → Connection string (URI)**
4. Add to `.env` as `DATABASE_URL` (change `postgresql://` to `postgresql+asyncpg://`)

### 3. Run Backend

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

### 4. Setup & Run Frontend

```bash
cd frontend
npm install
npm run dev
```

### 5. Open the App

Navigate to **http://localhost:5173** and ask a medical question!

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/query` | POST | Submit question, get Trust Report |
| `/api/documents/ingest` | POST | Ingest PubMed abstracts |
| `/api/documents/count` | GET | Get document counts |
| `/api/documents/{pmid}` | GET | Get single document |
| `/health` | GET | Health check |

### Example: Query

```bash
curl -X POST http://localhost:8000/api/query \
  -H "Content-Type: application/json" \
  -d '{"question": "Do ACE inhibitors reduce mortality in heart failure?"}'
```

### Example: Ingest Documents

```bash
curl -X POST http://localhost:8000/api/documents/ingest \
  -H "Content-Type: application/json" \
  -d '{"query": "ACE inhibitors heart failure mortality", "max_results": 50}'
```

---

## Project Structure

```
healthtech-1/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI app entry
│   │   ├── config.py               # Environment config
│   │   ├── database.py             # SQLAlchemy async setup
│   │   ├── models/
│   │   │   ├── document.py         # Document ORM model
│   │   │   └── schemas.py          # Pydantic schemas
│   │   ├── services/
│   │   │   ├── pubmed.py           # PubMed API client
│   │   │   ├── embeddings.py       # OpenAI embeddings
│   │   │   ├── retriever.py        # pgvector search
│   │   │   ├── generator.py        # RAG generation
│   │   │   └── trust/              # ⭐ Trust Layer
│   │   │       ├── claim_extractor.py
│   │   │       ├── attribution_scorer.py
│   │   │       ├── confidence_calculator.py
│   │   │       └── gap_detector.py
│   │   └── api/
│   │       └── routes.py           # API endpoints
│   ├── requirements.txt
│   ├── TODO.md                     # RAG improvement roadmap
│   └── README.md                   # Backend docs
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── QueryInput.tsx
│   │   │   ├── AnswerPanel.tsx
│   │   │   ├── EvidenceMap.tsx
│   │   │   ├── ConfidenceMeter.tsx
│   │   │   └── GapsPanel.tsx
│   │   ├── api/client.ts
│   │   ├── types/index.ts
│   │   └── App.tsx
│   └── package.json
│
├── whitepaper/
│   └── main.tex                    # LaTeX whitepaper
│
└── README.md                       # You are here
```

---

## Roadmap

See [`backend/TODO.md`](backend/TODO.md) for the full improvement plan. Highlights:

### Retrieval Improvements
- [ ] **Hybrid Search** — Combine BM25 keyword matching with vector similarity
- [ ] **Cross-Encoder Re-ranking** — Two-stage retrieval for better precision
- [ ] **Query Expansion** — Expand medical terminology before retrieval

### Data Source Expansion
- [ ] **ClinicalTrials.gov** — Ongoing trials, protocols, structured outcomes
- [ ] **openFDA** — Drug labels, approval history, adverse events

### Trust Layer Enhancements
- [ ] **Citation Hallucination Detection** — Verify cited PMIDs exist in retrieved docs
- [ ] **NLI-based Attribution** — Use Natural Language Inference for scoring
- [ ] **Study Quality Weighting** — RCTs weighted higher than observational

---

## Why This Matters

> "Most candidates show: 'Look I used RAG.'  
> You'll show: 'I built an epistemology layer for medical AI.'  
> That's a completely different signal."

Medical AI needs more than accurate answers — it needs **transparent reasoning**. MedTrust AI demonstrates that LLMs can:

1. **Decompose** their answers into verifiable claims
2. **Attribute** each claim to specific evidence
3. **Quantify** confidence based on evidence, not model certainty
4. **Acknowledge** what they don't know

This is how doctors think. Now AI can show its work too.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Author

**Rahul Kumar**  
[GitHub](https://github.com/rahul7932) • [LinkedIn](https://linkedin.com/in/rahulkumar)

---

<p align="center">
  <i>Built to demonstrate transparent, trustworthy medical AI.</i>
</p>
