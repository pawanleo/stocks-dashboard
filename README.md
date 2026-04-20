# 📈 SleekTrader

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?logo=github)](https://github.com/pawanleo/Real-Time-Trading-Dashboard)

**SleekTrader** is a real-time, microservices-based crypto and stock dashboard. It features live streaming WebSocket updates, historical charting, price threshold alerts, and mock algorithmic AI market analysis. 

The architecture is built with modern full-stack tools and is production-ready with full tests and Kubernetes deployment manifests.

---

## ⚡ Features

- **Live Market Data:** Zero-latency streaming price updates via Socket.IO.
- **Dynamic Charting:** Real-time appending price charts for multiple tickers via `recharts`.
- **Price Threshold Alerts:** Set "Above/Below" thresholds that trigger global toast notifications instantly when crossed.
- **Mock AI Analytics:** Sleek "Analyze with AI" modal that "reads" momentum and volume to give a mock verdict.
- **Microservices Architecture:** Strictly separated backend API/WebSockets and frontend UI.
- **Production Ready:** Fully containerized with Docker, deployable via Kubernetes, and heavily tested (Vitest + React Testing Library + Jest + Supertest).

---

## 🛠 Tech Stack

### Frontend
- **React (v18)** + **TypeScript**
- **Vite** for ultra-fast bundling and HMR.
- **Zustand** for global state management (managing WebSockets and caching).
- **TailwindCSS** for responsive, modern, dark-mode design.
- **Recharts** for SVG-based charting.
- **Vitest & React Testing Library** for component testing.

### Backend
- **Node.js** + **TypeScript**
- **Express.js** for RESTful API routes.
- **Socket.IO** for live multiplexed streaming data.
- **Jest & Supertest** for unit and integration testing.

### Infrastructure
- **Docker** & **Docker Compose**
- **Kubernetes** manifests (Deployments, Services, Nginx Ingress).

---

## 🚀 Getting Started

You can run SleekTrader locally on your machine or inside isolated Docker containers.

### Option A: Local Development (Without Docker)

Make sure you have Node (e.g. `v18+`) installed.

**1. Start the Backend:**
```bash
cd backend
npm install
npm run dev
```
*(The backend runs on `http://localhost:4000`)*

**2. Start the Frontend:**
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*(The frontend runs on `http://localhost:80` or `http://localhost:3000`. Check your terminal output!)*

> **Note:** If you see an `EADDRINUSE` error, make sure you don't have Docker containers holding the port. Stop them with `docker-compose down`.

### Option B: Docker Environment

If you prefer to run the entire stack through Docker Compose with hot-reloading active:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

---

## 🧪 Running Tests

Both frontend and backend are covered by test suites. 

### Frontend Tests (Vitest)
```bash
cd frontend
npm run test
```

### Backend Tests (Jest)
```bash
cd backend
npm run test
```

---

## 🏗 Kubernetes Deployment

Production YAML manifests are located in the `k8s/` directory.

1. Ensure your Kubernetes cluster has an Nginx Ingress controller installed.
2. Apply the configuration:
```bash
kubectl apply -f k8s/
```
3. Map the ingress host to your `/etc/hosts` file:
```
127.0.0.1 sleektrader.local
```
4. Visit `http://sleektrader.local`.

---

## 📖 API Documentation

### REST API

- **`GET /api/tickers`**
  Get the current snapshot of all tracked markets.
  
- **`GET /api/tickers/:symbol/history?points=60`**
  Fetch cached historical mock data. Generates random walk data if un-cached.

- **`POST /api/alerts`**
  Create a new price alert.
  *Body:* `{ symbol: "AAPL", targetPrice: 150.00, direction: "above" | "below" }`

- **`GET /api/alerts`**
  Fetch active alerts.

- **`DELETE /api/alerts/:id`**
  Delete an alert by ID.

### WebSocket (Socket.IO)

- Event: `market_init` — Sent on connection. Contains current array of all `TickerData`.
- Event: `market_update` — Sent every 1 second containing only tickers that have changed.
- Event: `price_alert` — Triggered when a ticker crosses a user's defined threshold.
