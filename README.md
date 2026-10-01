# Burnly — Startup Planning Platform

Burnly is a startup planning platform built for founders. Enter your startup information once (**Venture Profile**: business idea, stage, team, revenue, expenses), and Burnly simulates your 36-month financial future while generating supporting intelligence reports (**Market Intelligence**, **Competitor Mapping**, **Execution Roadmap**, **Investor Pitch Outline**, and **Risk Intelligence**).

---

## Key Features

- **Deterministic Financial Simulation Core**: 36-month runway, break-even timing, net burn, funding needs calculation, and risk scoring calculated 100% by pure JavaScript engines.
- **Server-Side LLM Intelligence**: Powered by Google Gemini API (`gemini-1.5-flash`) with Google Search Grounding for real-time market citations.
- **Provenance & Staleness Detection**: Visual badges (`Computed`, `Sourced`, `Estimate`) and SHA-256 inputs hashing to detect stale reports.
- **Security & Privacy**: Short-lived JWT access tokens (30m) with `httpOnly` refresh token cookies, helmet security headers, rate limiting, and prompt-injection security boundaries (`<USER_STARTUP_PROFILE>`).

---

## Repository Structure

```
Burnly-Main/
├── backend/               # Express.js REST API + LLM Report Service
│   ├── config/            # Database connection
│   ├── controllers/       # Auth, Venture, Scenario, Report controllers
│   ├── middleware/        # JWT auth, rate limits, input sanitization
│   ├── models/            # User, Venture, Scenario, Report Mongoose models
│   ├── routes/            # REST API endpoint definitions
│   ├── services/          # llmClient, reportService, prompt builders
│   └── tests/             # Automated backend integration test suite
└── frontend/              # Vite + React + Tailwind CSS SPA
    ├── src/
    │   ├── components/    # Simulator, Projections, ReportView, Wizard
    │   ├── context/       # AuthContext, VentureContext
    │   ├── lib/           # simulationEngine, projections, riskScorer
    │   └── tests/         # Client-side unit test suite
```

---

## Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally or a MongoDB Atlas cluster URI
- Google AI Studio Gemini API Key (free tier available at [aistudio.google.com](https://aistudio.google.com))

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `/backend` (copy from `.env.example`):

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/burnly
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
LLM_MODEL=gemini-1.5-flash
REPORT_DAILY_LIMIT=10
```

Start the backend API server:

```bash
npm start
# Server running at http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# Dev server running at http://localhost:5173
```

---

## Running Tests & Scripts

### Backend Integration Tests
```bash
cd backend
npm test
```

### Report Verification Script (Prompt & Consistency Checks)
```bash
cd backend
node scripts/verifyReports.js

# Optional: Run with real live Gemini API calls
node scripts/verifyReports.js --live
```

### Frontend Unit Tests
```bash
cd frontend
npm test
```

### Production Build Verification
```bash
cd frontend
npm run build
```
