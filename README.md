# FuelEU Maritime Compliance Platform

A full-stack implementation of FuelEU Maritime 2023/1805 Annex IV, Article 20 & 21.

This project implements the core compliance workflows required under the FuelEU Maritime regulation, using a Hexagonal (Ports & Adapters) Architecture, a modern React frontend, and a TypeScript–Node.js backend powered by PostgreSQL + Prisma.

The deliverable includes:

Routes management

Baseline comparison

Compliance Balance (CB) computation

Banking (Article 20)

Pooling (Article 21)

Clean domain modelling

Complete separation of core logic & adapters

AI-assisted development logs (AGENT_WORKFLOW.md)

Developer reflections (REFLECTION.md)

## 🧭 1. Overview

FuelEU Maritime requires ships to reduce GHG emissions through an intensity threshold measured in gCO₂e/MJ.
This system enables:

🔹 Route module

List all routes

Set a baseline route

Compare route intensities

Calculate percentage deviation & compliance status

🔹 Compliance module

Compute Compliance Balance (CB) using regulation formula

Persist CB snapshots

🔹 Banking module (Article 20)

Bank surplus CB

Apply banked CB to deficit routes

Validation checks for balance availability

🔹 Pooling module (Article 21)

Create pools of multiple ships

Redistribute CB using greedy allocation

Ensure rules:

Surplus ships cannot end negative

Deficit ships cannot exit worse

Total pool CB ≥ 0

Frontend provides a dashboard with 4 tabs:

Routes

Compare

Banking

Pooling

Each tab consumes backend APIs using typed ports & adapters.

## 🧱 2. Architecture Summary (Hexagonal)

This project strictly follows Clean Architecture / Hexagonal Architecture.

core/ (domain + business logic)
  domain/              → Entities, value objects
  application/         → Use cases (pure TS)
  ports/               → Interfaces (inbound/outbound)

adapters/
  inbound/             → Express controllers (HTTP)
  outbound/            → Prisma repositories (DB)
  ui/ (frontend)       → React components, pages, hooks

infrastructure/
  db/                  → Prisma client
  server/              → Express bootstrap

⭐ Benefits of this architecture

Zero coupling of business logic to Express/React/Prisma

Pure TypeScript domain → easy to test

Adapters can be replaced anytime (PostgreSQL → MySQL, REST → GraphQL etc.)

Follows enterprise backend standards used in FAANG-level systems

## ⚙️ 3. Installation & Setup
### 🔧 Backend Setup
1. Install dependencies
cd backend
npm install

2. Configure environment variables

Create .env file:

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/fueleu"

3. Run Prisma migration
npm run prisma:migrate

4. Generate Prisma client
npm run prisma:generate

5. Start development server
npm run dev


Backend runs at:
👉 http://localhost:4000

### 🎨 Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs at:
👉 http://localhost:5173

## 🧪 4. How to Execute Tests
### Backend tests
cd backend
npm run test


Expected tests:

ComputeCBUseCase

CreatePoolUseCase

Banking (apply + bank)

Route comparison logic

HTTP integration tests (Supertest)

### Frontend tests
cd frontend
npm run test


Expected:

UI components (table, charts, forms)

Hooks (useRoutes, useBanking, usePooling)

Mock service tests

## 📡 5. Sample API Requests & Responses
### 🟦 GET /routes

Request:

GET /routes


Response:

[
  {
    "routeId": "R001",
    "vesselType": "Container",
    "fuelType": "HFO",
    "year": 2024,
    "ghgIntensity": 91.0,
    "fuelConsumption": 5000,
    "distance": 12000,
    "totalEmissions": 4500
  }
]

### 🟧 POST /routes/:id/baseline
POST /routes/R001/baseline


Response:

{ "status": "baseline updated" }

### 🟩 GET /routes/comparison

Response:

{
  "baseline": { "ghgIntensity": 91.0 },
  "comparison": [
    {
      "routeId": "R002",
      "ghgIntensity": 88.0,
      "percentDiff": -3.29,
      "compliant": true
    }
  ]
}

### 🟪 GET /compliance/cb?shipId=R001&year=2024
{
  "shipId": "R001",
  "cb_before": 12030000,
  "cb_after": 12030000,
  "status": "surplus"
}

### 🟥 POST /pools
{
  "members": [
    { "shipId": "R001" },
    { "shipId": "R002" }
  ],
  "year": 2025
}


Response:

{
  "poolId": 1,
  "cb_after": [
    { "shipId": "R001", "cb": 4000000 },
    { "shipId": "R002", "cb": -2000000 }
  ]
}

## 🖼️ 6. Screenshots (Add after running project)
/screenshots/
  routes.png
  comparison.png
  banking.png
  pooling.png


(Add in GitHub after project runs.)

## 📚 References

Fuel EU Maritime Regulation (EU) 2023/1805
Annex IV – GHG intensity & CB calculation
Article 20 – Banking
Article 21 – Pooling

## 👨‍💻 Author

Yash Paunikar
NIT Warangal
Full-Stack, AI-Augmented Developer

⭐ README COMPLETE — ready to submit

Agar tum chaho to:

✔ README ko shorten/expand kar dunga
✔ Architecture diagram image bhi bana dunga
✔ GIF demo add kar dunga

Bas bol bhai.