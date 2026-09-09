# LLD Practice Platform

A focused web practice platform that enables intermediate software engineers to practice Low-Level Design (LLD) on interview-standard problems and receive objective, qualitative AI evaluation grounded in their submitted design evidence.

---

## Architecture Overview

Built as a clean TypeScript monolith following Ports & Adapters (Hexagonal Architecture):

$$\text{UI / HTTP Layer} \rightarrow \text{Application Orchestration} \rightarrow \text{Domain Core \& Ports} \leftarrow \text{Infrastructure}$$

- **Server (`server/`):** Express application layered into `api/`, `application/`, `domain/`, and `infrastructure/`.
- **Client (`client/`):** Vite + React single-page application with modern responsive CSS design.
- **Database:** SQLite (WAL mode) for local development and in-process ACID transactions.

---

## Getting Started

### Prerequisites
- Node.js >= 20.x (tested on v24.x)
- npm >= 10.x

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Development Mode
Run both backend server and frontend client concurrently:
```bash
npm run dev
```
- Backend runs on `http://localhost:3000`
- Frontend runs on `http://localhost:5173` (with `/api` proxied to backend)

Or run individually:
```bash
npm run dev:server    # Backend only
npm run dev:client    # Frontend only
```

### 4. Running Tests
Run the test suite (Vitest):
```bash
npm test
```

### 5. Typechecking & Build
```bash
npm run typecheck     # Typecheck both server and client
npm run build         # Build client and compile server
```

---

## Project Structure
```
LLD-Practice-Platform/
├── client/                     # Frontend client (Vite + React)
│   ├── src/
│   │   ├── App.tsx             # Application shell
│   │   ├── config.ts           # Client config
│   │   ├── index.css           # Design tokens & styles
│   │   └── main.tsx            # Client entry
│   ├── tests/                  # Client test suite
│   └── index.html
├── server/                     # Backend server (Express + Node.js)
│   ├── src/
│   │   ├── api/                # Delivery layer (routes, controllers)
│   │   ├── application/        # Orchestration layer (commands, queries)
│   │   ├── domain/             # Domain model (aggregates, policies, ports)
│   │   ├── infrastructure/     # Infrastructure (persistence, evaluator adapters)
│   │   ├── app.ts              # Express factory & middleware
│   │   ├── config.ts           # Environment config
│   │   └── index.ts            # Server entry
│   └── tests/                  # Backend test suite (domain, application, api)
├── .env.example                # Environment template
├── package.json                # Monolith dependencies & scripts
├── tsconfig.json               # Base TypeScript configuration
├── tsconfig.server.json        # Server TypeScript configuration
├── tsconfig.client.json        # Client TypeScript configuration
├── vite.config.ts              # Vite configuration & API proxy
└── vitest.config.ts            # Test runner configuration
```
