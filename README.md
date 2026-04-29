# 🚀 CodebySRS | Futuristic Developer Portfolio

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![Firebase](https://img.shields.io/badge/Deployed_on-Firebase-orange?logo=firebase)

A highly interactive, full-stack developer portfolio featuring 3D WebGL animations, a secure custom CMS, and a scalable Node.js/PostgreSQL backend. Designed for absolute performance, strict maintainability, and stunning visual fidelity.

---

## ✨ Key Features

### 🎮 Immersive Frontend Experience
- **Interactive 3D Hero:** Custom WebGL particle systems and interactive geometries powered by React Three Fiber.
- **Glassmorphism UI:** Premium, modern aesthetic using advanced Tailwind CSS utilities.
- **Fluid Animations:** Scroll-linked animations and smooth page transitions powered by Framer Motion.
- **Responsive Design:** Pixel-perfect, high-density layouts optimized from mobile to ultra-wide displays.
- **Dark Mode Native:** Deep integration of Shadcn/ui for consistent, toggleable theming.

### 🛡️ Secure Admin Dashboard (CMS)
- **Role-Based Authentication:** Protected routes using Passport.js and secure PostgreSQL-backed sessions.
- **Project Management:** Full CRUD operations for portfolio items, including rich descriptions and image links.
- **Skills Matrix:** Categorize and reorder skills dynamically with visual proficiency indicators.
- **Message Center:** Read/Unread tracking for contact form submissions directly in the dashboard.
- **Global Settings:** Live-update site configuration, including About text, Privacy Policies, and Terms of Service.

### ⚡ Enterprise-Grade Backend
- **Type-Safe ORM:** Drizzle ORM ensures compile-time safety for all SQL queries and schema definitions.
- **Single Source of Truth:** End-to-end validation—Zod schemas are shared synchronously between the React frontend (React Hook Form) and Express backend (API Middleware).
- **Rate Limiting:** IP-based DDoS and spam protection on critical routes (e.g., Contact Form submissions, Login).

---

## 🏗️ Architecture & Stack

### Frontend Layer
- **Framework:** React 18 (Bundled with Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn/ui
- **3D Graphics:** Three.js + React Three Fiber + Drei
- **Animations:** Framer Motion
- **State Management & Fetching:** React Query (TanStack) + Wouter (Routing)

### Backend Layer
- **Server:** Node.js + Express.js
- **Database:** PostgreSQL (Optimized for Neon.tech)
- **ORM:** Drizzle ORM
- **Validation:** Zod
- **Authentication:** Passport.js + express-session + connect-pg-simple

### DevOps & Deployment
- **Hosting:** Firebase Hosting (Client SPA)
- **API Runtime:** Firebase Cloud Functions (Gen 2 Express Wrapper)
- **Package Manager:** npm

---

## 📁 Directory Structure

The repository follows a strict monorepo-style structure to ensure absolute decoupling of concerns.

```text
CodebySRS/
├── client/                 # ⚛️ React Frontend Application
│   └── src/
│       ├── components/     # Reusable UI, 3D scenes, Layouts, Admin modules
│       ├── hooks/          # Custom data-fetching & UI state hooks
│       ├── pages/          # Route-level components mapping to URLs
│       ├── types/          # Frontend-specific type definitions
│       └── lib/            # Pure utility functions & API clients
├── server/                 # ⚙️ Node.js Backend Application
│   ├── config/             # Strict environment validation on startup
│   ├── middleware/         # Express middlewares (Auth, Rate Limiting, Security)
│   ├── routes/             # REST API controllers
│   ├── storage.ts          # Drizzle ORM database queries and connections
│   └── firebase-entry.ts   # Firebase Cloud Functions production wrapper
├── shared/                 # 🤝 Cross-Boundary Code
│   ├── schemas/            # Zod validation schemas (Used by both Client/Server)
│   └── types/              # Shared Database Models & TS Interfaces
├── drizzle.config.ts       # Drizzle ORM Migration Configuration
└── firebase.json           # Firebase Deployment & Rewrite Rules
```

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
- Node.js (v18 or newer)
- PostgreSQL (v14 or newer) installed locally or a [Neon.tech](https://neon.tech) cloud database URL.

### 2. Installation

Clone the repository and install dependencies:
```bash
git clone https://github.com/Suhail5125/CodebySRS.git
cd CodebySRS
npm install
```

### 3. Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Populate the `.env` file. **You must generate a highly secure session secret:**
```bash
# Run this in your terminal to generate a secure 32-byte hex string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**`.env` Reference:**
| Variable | Required | Description |
|----------|:--------:|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `SESSION_SECRET` | ✅ | Secure 32+ character string for encrypting cookies |
| `PORT` | ❌ | Development server port (Defaults to `5000`) |
| `NODE_ENV` | ❌ | `development` or `production` |

### 4. Database Setup

Push the Drizzle schema directly to your PostgreSQL instance:
```bash
npm run db:push
```

*(Optional)* Seed the database with sample portfolio projects, skills, and admin credentials:
```bash
npm run db:seed
```

### 5. Run Development Server

Start the Vite frontend and Express backend concurrently:
```bash
npm run dev
```
- **Public Site:** [http://localhost:5000](http://localhost:5000)
- **Admin Panel:** [http://localhost:5000/admin/login](http://localhost:5000/admin/login)
  - *Default Credentials:* `admin` / `admin123` *(Change immediately upon deployment)*

---

## 🌐 Production Deployment (Firebase + Neon)

This project is perfectly optimized for a Serverless deployment using Firebase. Static React files are served instantly via Firebase CDN Hosting, while the Express API is dynamically served via Firebase Cloud Functions.

### Step 1: Firebase CLI Setup
```bash
npm install -g firebase-tools
firebase login
```

### Step 2: Set Cloud Functions Secrets
Firebase Cloud Functions need secure access to your database URL and Session Secret. Set these via Firebase Secrets manager:
```bash
firebase functions:secrets:set DATABASE_URL
firebase functions:secrets:set SESSION_SECRET
```

### Step 3: Build & Deploy
This single command will type-check your code, build the React SPA, compile the Express server, and deploy everything to your Firebase project:
```bash
npm run firebase:deploy
```

---

## 🤝 Contributing

We enforce a strict code quality standard to maintain structural integrity. Before submitting a pull request:
1. Ensure all TypeScript checks pass: `npm run check`.
2. Ensure no validation logic is manually duplicated. Always define rules in `/shared/schemas/` and import them where needed.
3. Keep route pages (`/client/src/pages/`) strictly for rendering components. All heavy logic belongs in `/components/` or `/hooks/`.

---

## 📄 License

This project is licensed under the MIT License. Feel free to use this architecture as the foundation for your own projects.
