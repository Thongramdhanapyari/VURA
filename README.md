# Vura | Agentic AI Inventory Management 🚀

**Vura** is a modern MERN-stack application designed to bridge the gap between physical inventory and digital intelligence. Moving beyond traditional tracking, Vura utilizes an **AI Agentic workflow** to transform raw data (via OCR) into actionable business reasoning.



## 🌟 Key Features

* **🔐 Secure Authentication:** Robust user system using **JSON Web Tokens (JWT)** and **bcrypt** for secure hashing, featuring a custom React-based login/register flow.
* **👁️ Agentic Perception (OCR):** Integrated OCR pipeline that "sees" physical invoices and extracts unstructured data for system processing.
* **🤖 Human-like AI Agent (Active Dev):** An autonomous layer designed to **reason** with inventory data—predicting stockouts and suggesting profit optimizations.
* **📊 Real-time Dashboard:** A high-performance UI built with **Tailwind CSS v4** and **React Hooks** to visualize total portfolio value and net profit margins instantly.

---

## 📊 Database Schema Architecture

The system uses a relational-style document schema to ensure data integrity and agentic reasoning capability:

* **User Collection:** Handles Auth (Name, Email, Hashed Password).
* **Product Collection:** Core data (Name, Category, Price, Cost, Stock).
* **Intelligence Logic:** The Agent calculates health based on:
  $$Margin = \frac{Price - Cost}{Price} \times 100$$



---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Tailwind CSS v4, Vite 7 |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB Compass (Local/Community Server) |
| **Security** | JWT, Bcrypt.js, Dotenv |
| **Intelligence** | Tesseract.js / LLM Reasoning Logic |

---

## 🗺️ Project Roadmap

### **Phase 1: Foundation (Completed) ✅**
- [x] Full-stack MERN setup with secure JWT Authentication.
- [x] Responsive Dashboard UI for asset tracking.
- [x] MongoDB Schema for multi-user inventory management.

### **Phase 2: Perception (In Progress) 🏗️**
- [x] OCR integration for raw text extraction.
- [ ] **Data Mapping:** Logic to automatically convert OCR "blobs" into structured database entries.
- [ ] **Validation Layer:** Human-in-the-loop verification for OCR accuracy.

### **Phase 3: Autonomy (Upcoming) 🚀**
- [ ] **Reasoning Engine:** Integrating LLM logic to provide natural language insights.
- [ ] **Predictive Stocking:** Agent-led forecasting based on historical sales trends.

---

## 🚀 Setup & Installation (For Reviewers)

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local instance on port 27017)

### 2. Backend Setup
1. `cd vura_backend`
2. `npm install`
3. Create a `.env` file based on `.env.example`.
4. **Seed Data:** Run `npm run seed` (Crucial for the AI Agent to have data to analyze).
5. `npm start` (Runs on Port 5000)

### 3. Frontend Setup
1. `cd vura_frontend`
2. `npm install`
3. `npm run dev` (Runs on Port 5173)

---

## 🗺️ Port & Connection Logic
- **UI:** `http://localhost:5173`
- **API:** `http://localhost:5000`
- **Database:** `mongodb://localhost:27017`

> **💡 Developer Tip:** If you have **MongoDB Compass** installed, you can visualize the inventory live. After running `npm run seed`, connect to `localhost:27017` in Compass to see the `vura_db` collections.