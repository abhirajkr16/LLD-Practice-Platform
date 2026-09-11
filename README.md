# LLD Practice Platform

* A backend-powered platform to practice Low-Level Design (LLD) interview problems (parking lot, elevator, etc.), to submit a structured design, get deterministic rubric-based feedback, retry on failure and revise without losing history

### Why this exists

* LLD problems have no single correct answer, making their grading different from coding problems.
* No single correct answer → can't compare against one canonical class diagram
* No real feedback loop → most practice is done by reading someone else's solution, not getting feedback on one's own
* Evaluation can fail independently of design quality → a crashed evaluator shouldn't cost you your submission
* Real interviews are iterative → you're asked to adapt your design when requirements change, not solve once and move on

### What's built (MVP)

* Problem catalog seeded with LLD problems (requirements, constraints, edge cases, change scenarios)
* Structured design submission — entities, responsibilities, relationships, behaviors, design decisions, interfaces, assumptions
* Submission validated for completeness before it's accepted
* Attempt + submission + evaluation persisted atomically, before evaluation runs
* Deterministic rubric evaluator across 5 design dimensions → qualitative, explainable feedback (no numeric score)
* Retry API for failed evaluations — no resubmission needed
* Revisions create a new attempt linked to its predecessor, so history isn't overwritten
* Full test suite: domain, use-cases, infrastructure, integration, API


> The `client/` folder has an initial React/Vite scaffold, but the working prototype right now is backend + REST API, driven by the automated test suites and Postman.

## Tech stack

| Layer | Tech |
|---|---|
| Runtime | Node.js 18+ |
| Server | Express 5 |
| Database | SQLite (`better-sqlite3`, WAL mode) |
| Validation | Zod + custom domain validators |
| Testing | Vitest + Supertest |
| Frontend (scaffold only) | React 19 + Vite |

## How a submission flows

```mermaid
flowchart TD
    A[Pick a problem] --> B[Draft design evidence]
    B --> C[POST submission]
    C --> D{Valid?}
    D -- No --> E[422 rejected]
    D -- Yes --> F[Persist attempt + submission + evaluation:evaluating]
    F --> G[Run deterministic evaluator]
    G -- Success --> H[feedback_available]
    G -- Error --> I[evaluation_failed]
    I --> J[POST retry] --> G
    H --> K[Review feedback]
    K --> L[Revise → new attempt, predecessor linked]
```

The important part: **the submission is saved before evaluation runs.** If the evaluator throws, the work isn't lost — it just sits in `evaluation_failed` until retried.

## Architecture

Layered so domain rules don't know SQLite or Express exist.

```mermaid
graph TD
    Client[API Consumer] --> Router[Express Routes]
    Router --> Controller[Controllers]
    Controller --> UseCases[Application Use Cases]
    UseCases --> Domain[Domain: Problem, Attempt, Submission, Evaluation]
    UseCases --> Ports[Repository + Evaluator Ports]
    Ports -.implemented by.-> Infra[SQLite Repos, UnitOfWork, DeterministicEvaluator]
    Infra --> DB[(SQLite)]
```

- **Domain** (`server/src/domain/`) — plain JS entities and value objects, zero framework/DB dependencies
- **Application** (`server/src/application/`) — use cases (`SubmitDesign`, `RetryEvaluation`, ...) that talk to ports, not implementations
- **Infrastructure** (`server/src/infrastructure/`) — SQLite repos, the `UnitOfWork` transaction, the rubric evaluator
- **API** (`server/src/routes/`, `controllers/`) — Express routes + centralized error middleware mapping domain errors to HTTP codes

Evaluation sits behind an `Evaluator` port, so a future LLM-based evaluator can be swapped in without touching the practice flow.

## Domain model

```
Problem (1) ──< Attempt (0..*) ── Submission (1) ── Evaluation (1)
                                       │                 │
                                  DesignEvidence    FeedbackReport
```

| Entity | What it's for |
|---|---|
| `Problem` | The LLD challenge — requirements, constraints, scope, change scenarios |
| `Attempt` | One learner session; optionally linked to a `predecessorAttemptId` for revisions |
| `Submission` | Immutable snapshot of what was submitted |
| `DesignEvidence` | Structured evidence: entities, responsibilities, relationships, behaviors, decisions, interfaces, assumptions |
| `Evaluation` | Lifecycle: `evaluating → feedback_available / evaluation_failed`; only failed ones can retry |
| `FeedbackReport` | Qualitative findings — priority / secondary / optional, no numeric score |

## Evaluation rubric

The evaluator is fully deterministic — no LLM, no external API, fully reproducible.

| Dimension | Checks |
|---|---|
| Requirement coverage | Do requirements show up in the submitted evidence |
| Responsibility assignment | Are responsibilities spread across entities, not dumped on one |
| Structure & coupling | Are there real relationships between entities |
| Behavioral coherence | Is there actual behavior modeled, not just static data |
| Extensibility & rationale | Did the learner explain *why* they made a decision |

## API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/problems` | List problems |
| GET | `/api/problems/:problemId` | Problem details |
| GET | `/api/problems/:problemId/attempts` | Attempt history for a problem |
| POST | `/api/problems/:problemId/submissions` | Submit a design |
| GET | `/api/attempts/:attemptId` | Attempt + submission + evaluation |
| POST | `/api/attempts/:attemptId/evaluation/retry` | Retry a failed evaluation |

# How to Run

## Prerequisites

Install:

* Node.js 18+
* npm

---

## 1. Clone the repository

```bash
git clone https://github.com/abhirajkr16/LLD-Practice-Platform.git
cd LLD-Practice-Platform
```

---

## 2. Install backend dependencies

From the project root:

```bash
npm install
```

---

## 3. Install frontend dependencies

```bash
cd client
npm install
cd ..
```

---

## 4. Start the backend

From the project root:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:3000
```

---

## 5. Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

Vite will provide the local frontend URL.

---

# Environment Variables

The current MVP does not require external API keys or third-party services to run the core application.

The frontend currently communicates with:

```text
http://localhost:3000/api
```

If the backend URL needs to change later, it can be moved into a frontend environment variable instead of keeping it hardcoded.

No secrets should be committed to the repository.

---

# Database Setup

The project uses SQLite through `better-sqlite3`.

The database is stored locally as:

```text
data/app.db
```

The schema is initialized when the backend starts.

Initial problems are seeded from:

```text
server/src/database/seed.js
```

The seed script uses idempotent inserts, so existing problem records are not duplicated when the seed process is run again.

To seed the problems manually:

```bash
node server/src/database/seed.js
```

The main database concepts are:

```text
problems
attempts
submissions
evaluations

## Testing

```
domain-test.js          → pure domain logic
application-test.js     → use cases with in-memory fakes
infrastructure-test.js  → SQLite repos
integration-test.js     → full flow, real DB
api.test.js / retry-*   → HTTP via Vitest + Supertest
```

Run everything: `npm test -- run`

## Repository Structure

```text
LLD-Practice-Platform/
│
├── client/
│   └── src/
│       ├── api/
│       ├── pages/
│       ├── routes/
│       └── App.jsx
│
├── server/
│   └── src/
│       ├── application/
│       │   ├── ports/
│       │   └── use-cases/
│       │
│       ├── controllers/
│       │
│       ├── database/
│       │   ├── schema.sql
│       │   ├── init.js
│       │   └── seed.js
│       │
│       ├── domain/
│       │   ├── attempt/
│       │   ├── evaluation/
│       │   ├── feedback/
│       │   ├── problem/
│       │   └── submission/
│       │
│       ├── infrastructure/
│       │   ├── database/
│       │   ├── evaluation/
│       │   └── repositories/
│       │
│       ├── middleware/
│       ├── routes/
│       └── server.js
│
├── data/
│   └── app.db
│
├── AI_USAGE.md
├── package.json
└── README.md

## Limitations (on purpose, not by accident)

- Keyword/heuristic rubric matching, not semantic understanding
- No auth / multi-tenant users yet
- Evaluation runs synchronously in the request cycle — no background queue
- Frontend scaffold exists but isn't wired to the API yet
- Problems are added via seed scripts, not an admin UI

## Where this could go next

- Swap in an `LLMEvaluator` behind the existing `Evaluator` port for semantic feedback
- Wire up the React client for browsing problems and submitting designs
- Move evaluation to a background worker
- Add auth + per-user attempt history
- Accept UML diagrams as an alternate submission format

## Author

Abhiraj Kumar — abhirajmait16@gmail.com
