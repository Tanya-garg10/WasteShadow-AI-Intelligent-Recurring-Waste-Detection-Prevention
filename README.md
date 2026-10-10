# WasteShadow AI – Intelligent Recurring Waste Detection & Prevention

> **“Don't just clean the waste. Stop it from coming back.”**

WasteShadow AI is an AI-first civic-tech intelligence SaaS designed to solve the chronic garbage recurrence trap across Indian municipalities.

## 1. Problem Statement & The Recurrence Trap

Ordinary grievance apps dispatch sweepers or compactors to clean blackspots, only for waste to reappear at the exact same coordinates within 36–72 hours.
- **Municipal blind spot:** Cleaning without diagnosing why waste accumulates there.
- **Monsoon hazard:** Plastics and construction silt repeatedly choking stormwater culverts, triggering severe urban flooding within minutes of rain.
- **Supply mismatch:** Wholesale market vendors offloading produce at 04:00 AM, while municipal compactor tippers only arrive at 08:30 AM.

WasteShadow AI analyzes dated incident photos, spatial records, and collection schedules to:
1. Detect and classify **Recurring Hotspots** (One-time, Emerging, Repeated).
2. Quantify **Stormwater Culvert Occlusion Risk** before flood events.
3. Formulate **Evidence-Linked Root-Cause Hypotheses** with explicit uncertainty ratings.
4. Drive **Actionable Civic Work Orders** verified through ground-truth photographic audits.

## 2. System Architecture & Tech Stack

```
 ┌─────────────────────────────────────────────────────────────┐
 │            WasteShadow AI Client (React 19)                 │
 │  • Tailwind CSS v4       • Leaflet + OpenStreetMap          │
 │  • Lucide Icons          • Spatiotemporal Clustering        │
 └──────────────┬──────────────────────────────┬───────────────┘
                │                              │
                ▼                              ▼
 ┌──────────────────────────────┐ ┌─────────────────────────────┐
 │  FastAPI Backend (Python)    │ │  AI Vision Core             │
 │  • REST API endpoints        │ │  • Gemini 3.8 Flash Vision  │
 │  • Recurrence Scoring Engine │ │  • Transparent Demo         │
 │  • SQLAlchemy ORM            │ │    Fallback Engine          │
 └──────────────┬───────────────┘ └─────────────────────────────┘
                │
                ▼
 ┌──────────────────────────────┐
 │  Database Storage            │
 │  • PostgreSQL / Supabase     │
 │  • SQLite (Local embedded)   │
 └──────────────────────────────┘
```

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Leaflet OSM, Motion
- **AI Core:** Gemini 3.8 Flash (`@google/genai`) with transparent simulated demo fallback
- **Backend:** Python 3.11 + FastAPI + Uvicorn + SQLAlchemy + Pydantic v2
- **Database:** PostgreSQL / Supabase with spatial indexing and Row Level Security
- **Deployment:** Render (Backend), Vercel (Frontend), Docker (Full-stack container)

## 3. Directory Structure

```
.
├── backend/                        # Python FastAPI Backend
│   ├── ai_vision.py                # Gemini 3.8 Flash & demo fallback
│   ├── database.py                 # SQLAlchemy session provider
│   ├── Dockerfile                  # Containerized deployment
│   ├── main.py                     # FastAPI REST API endpoints
│   ├── models.py                   # SQLAlchemy ORM models
│   ├── recurrence_engine.py        # Spatiotemporal clustering & scoring
│   ├── requirements.txt            # Python dependencies
│   ├── schema.sql                  # PostgreSQL & Supabase schema with RLS
│   ├── schemas.py                  # Pydantic request & response schemas
│   └── seed_data.py                # Database seeder script
├── src/                            # Frontend React Application
│   ├── components/
│   │   ├── common/                 # DemoBadge, Toast notification container
│   │   ├── dashboard/              # AI Intelligence Dashboard & KPIs
│   │   ├── hypotheses/             # Root-Cause Hypothesis Engine
│   │   ├── investigation/          # Hotspot Detail & Dossier Export
│   │   ├── landing/                # Hero, benchmark impact, solution steps
│   │   ├── layout/                 # Navbar with personas, Footer
│   │   ├── map/                    # Leaflet interactive hotspot map
│   │   ├── recurrence/             # Recurrence score simulator & formula
│   │   ├── reports/                # Query filters, CSV & JSON export
│   │   ├── tracker/                # Work orders & verified cleanup workflow
│   │   └── upload/                 # 1-Click photo presets, AI vision analyzer
│   ├── services/
│   │   ├── aiVisionService.ts      # Client Gemini Vision & demo engine
│   │   ├── recurrenceEngine.ts     # Client spatiotemporal calculator
│   │   ├── seedData.ts             # High-fidelity SVG & scenario seeds
│   │   └── storageService.ts       # State persistence & recalculations
│   ├── types/                      # TypeScript domain models
│   ├── App.tsx                     # Main application controller
│   ├── main.tsx                    # React DOM entry point
│   └── index.css                   # Tailwind CSS imports
├── index.html                      # HTML entry with Leaflet stylesheet
├── package.json                    # Frontend npm dependencies
├── vite.config.ts                  # Vite build configuration
├── .env.example                    # Environment variable template
├── HACKATHON_DEMO_SCRIPT.md        # 3-Minute pitch script for judges
└── README.md                       # Complete documentation
```

## 4. Algorithmic Recurrence Scoring Logic

Unlike ordinary tools that misclassify incidents based on superficial visual similarity, WasteShadow AI computes an objective recurrence score ($R_{score} \in [0, 100]$):

$$R_{score} = w_1 \cdot F + w_2 \cdot C_{int} + w_3 \cdot P_{cat} + w_4 \cdot \text{Relapse}$$

1. **Frequency Component ($w_1 = 35\%$):** Event count within 80-meter spatial radius.
2. **Interval Consistency ($w_2 = 25\%$):** Regularity of recurrence cycles (e.g. weekly peak unloading) based on interval standard deviation.
3. **Category Persistence ($w_3 = 20\%$):** Ratio of identical waste categories (e.g. 80%+ wholesale vegetable discards).
4. **Post-Cleanup Relapse ($w_4 = 20\%$):** Penalty when waste reappears following an official municipal cleanup.

### Classification Rules
- **One-Time:** $\le 1$ incident or zero relapses after verified cleanup.
- **Emerging:** 2 incidents within 30 days.
- **Repeated (Chronic):** $\ge 3$ incidents or average recurrence cadence $\le 14$ days.

## 5. Seeded Demo Scenarios (Bengaluru Urban Wards)

- **Location A (Indiranagar 12th Main Road, Ward 84):** One-time post-festival dry packaging overflow. Promptly swept and verified clean with ground-truth after photos. Recurrence score: **18/100**.
- **Location B (KR Flower & Vegetable Market, Ward 109):** Chronic recurring accumulation of perishable produce crates. Reappears within 48h after cleanup due to a 3.5h mismatch between vendor offloading (04:00 AM) and compactor arrival (08:30 AM). Recurrence score: **89/100**.
- **Location C (Koramangala 80ft Road Culvert, Ward 151):** High-hazard chronic hotspot where single-use plastics choke 85% of the primary stormwater drain aperture, posing an imminent flood threat. Recurrence score: **95/100**.

## 6. Running Locally

### Frontend (React + Vite)
```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env

# 3. Start development server
npm run dev
# Running on http://localhost:3000
```

### Backend (Python FastAPI)
```bash
cd backend

# 1. Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Seed initial benchmark data
python seed_data.py

# 4. Start FastAPI server
uvicorn main:app --reload --port 8000
# Running on http://localhost:8000 (Docs at /docs)
```

## 7. Deployment Instructions

### A. Vercel (Frontend)
1. Import repository on Vercel.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Set `GEMINI_API_KEY` in Vercel Project Environment Variables.

### B. Render (Backend)
1. Create a **Web Service** pointing to `/backend`.
2. Runtime: **Python 3** or **Docker** (`backend/Dockerfile`).
3. Build Command: `pip install -r requirements.txt`.
4. Start Command: `sh -c "python seed_data.py && uvicorn main:app --host 0.0.0.0 --port $PORT"`.
5. Set Environment Variables: `GEMINI_API_KEY`, `DATABASE_URL`.

## 8. Ethical AI & Civic Methodology Notice

- **Observation vs Assumption:** Photographic AI detects physical surface materials and drain proximity. It does not speculate on intent.
- **Ground-Truth Process:** Work orders are only marked *Resolved* when field inspectors attach timestamped photographic proof.
