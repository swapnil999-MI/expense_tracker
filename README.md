# 📘 Full Stack Application – My App

## 🧩 Overview

**My App** is a full-stack web application built using a **React (Vite)** frontend and a **Node.js + TypeScript (Express)** backend.  
It integrates **MongoDB** as the database and supports both **local (Docker-based)** and **cloud (MongoDB Atlas)** modes.  
This project demonstrates modern full-stack development practices with clean architecture and containerized deployment.

---

## ⚙️ Project Structure

```
my-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validations/
│   ├── Dockerfile
│   ├── package.json
│   ├── .env
│   └── .env.development
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── package.json
│
└── docker-compose.yml
```

---

## 🧠 How to Run the Project

### 1️⃣ Prerequisites

- Node.js (v18+)
- npm
- Docker & Docker Compose (optional)
- Internet connection (for MongoDB Atlas)

---

## 🚀 Run Without Docker (Manual Setup)

### 🧩 Backend Setup

```bash
cd backend
npm install
```

### 🏗️ Build TypeScript

```bash
npx tsc
```

### ▶️ Run in Production Mode

```bash
npm start
```

### ⚡ Run in Development Mode (Hot Reload)

```bash
npx nodemon --exec npx tsx src/server.ts
```

> 📝 When running **without Docker**, MongoDB Atlas is used as the database.  
> The connection string is read from your `.env` file (cloud DB).  
> This approach ensures compatibility even if MongoDB is not installed locally.

---

### 🎨 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

This runs the app locally at [http://localhost:5173](http://localhost:5173).

---

## 🐳 Run Using Docker (Recommended for Local DB)

If you have **Docker installed**, simply run:

```bash
docker compose -f docker-compose.yml up -d --build
```

- Frontend → [http://localhost:5173](http://localhost:5173)
- Backend → [http://localhost:5000](http://localhost:5000)
- MongoDB runs inside the Docker container

> 🧠 In Docker mode, a **local MongoDB** container is used as the database.

---

## ⚙️ Environment Variables

- `.env.development` file is used **automatically in Docker mode**
- `.env` file is used **when running manually (without Docker)**

This means:
- .env files are directly pushed to avoid any manual setup and pass atlas db url
- When you run `docker compose -f docker-compose.yml up -d --build`, the system automatically uses the variables from `.env.development`.
- When you run using Node.js directly (`npm start` or `npx nodemon`), it uses `.env`.


## 🌐 API Endpoints

| Method | Endpoint | Description |
|---------|-----------|-------------|
| GET | /api/v1/transactions | Get all transactions |
| GET | /api/v1/transactions/:id | Get a transaction by ID |
| POST | /api/v1/transactions | Create a new transaction |
| PUT | /api/v1/transactions/:id | Update a transaction |
| DELETE | /api/v1/transactions/:id | Delete a transaction |

---

## 🧱 Scripts

### Backend

| Command | Description |
|----------|-------------|
| npm run dev | Run development server |
| npx tsc | Compile TypeScript |
| npm start | Start production server |

### Frontend

| Command | Description |
|----------|-------------|
| npm run dev | Run React app |
| npm run build | Build frontend |
| npm run preview | Preview production build |

---

## 🧑‍💻 Author

**Name:** Swapnil Jagadale  
**Role:** Full Stack Developer  
**Email:** swapniljagadale999@gmail.com 
---

## 🪪 License

This project is licensed under the **MIT License**.
