<div align="center">

# 📋 TaskForge

### Full-Stack Project Management & Team Collaboration Platform

A role-based project and task management system built for organizations to plan projects, assign work, and track progress — all from one platform.

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=flat&logo=sequelize&logoColor=white)](https://sequelize.org/)

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 📖 Overview

**TaskForge** simulates a real-world SaaS product used by software companies to manage projects and collaborate with teams. It provides three distinct, role-based portals — **Administrator**, **Project Manager**, and **Team Member** — each with functionality tailored to that role's responsibilities.

Built from scratch as a full-stack application with a clean, scalable architecture, complete authentication and authorization, and a professional, modern UI.

---

## ✨ Features

### 🔐 Authentication & Access Control
- JWT-based authentication with secure password hashing (bcrypt)
- Role-Based Access Control (RBAC) — Admin, Project Manager, Team Member
- Protected routes on both frontend and backend

### 👑 Administrator Portal
- Create, update, activate/deactivate users
- Create and manage all projects, assign Project Managers
- Full visibility into every project and task in the system
- Organization-wide dashboard with key metrics

### 📊 Project Manager Portal
- View and manage only assigned projects
- Add or remove team members from projects
- Create tasks, assign them to team members, set priority & deadlines
- Monitor task progress across their projects

### ✅ Team Member Portal
- View assigned projects and tasks
- Update task status through a defined workflow: **To Do → In Progress → Review → Completed**
- Participate in task-specific discussions
- View personal notifications and manage profile

### 💬 Task Discussions
- Dedicated comment thread on every task for contextual, task-specific communication

### 🔔 Notifications
- Automatically triggered on task assignment, status changes, and new discussion messages
- Unread count and mark-as-read functionality

### 🔍 Search, Filter & Pagination
- Implemented across Users, Projects, and Tasks for fast, organized data access

---

## 🛠️ Tech Stack

**Backend**
- Node.js + Express.js — REST API
- PostgreSQL (hosted on [Neon](https://neon.tech)) — relational database
- Sequelize ORM — models, associations, migrations
- JWT + bcryptjs — authentication & password security
- express-validator — request validation

**Frontend**
- React (Vite) — UI library & build tool
- Tailwind CSS — utility-first styling
- React Router — client-side routing
- Axios — API communication with interceptors
- Lucide React — icon library

---

## 🏗️ Architecture

```
TaskForge/
├── backend/
│   └── src/
│       ├── config/          # Database connection
│       ├── models/          # Sequelize models & associations
│       ├── controllers/     # Business logic
│       ├── routes/          # API endpoints
│       ├── middlewares/     # Auth, roles, validation, error handling
│       ├── validators/      # express-validator rule sets
│       └── utils/           # Helpers (JWT, notifications, async handler)
│
└── frontend/
    └── src/
        ├── api/              # Axios API modules per resource
        ├── components/       # Reusable UI components (common + role-specific)
        ├── context/          # Auth context (global state)
        ├── hooks/            # Custom hooks
        ├── pages/            # Route-level pages (auth, admin, PM, team member, shared)
        ├── routes/           # Route definitions & protection
        └── utils/            # Formatting helpers
```

### Database Schema

| Model | Purpose |
|---|---|
| `User` | Admins, Project Managers, Team Members (single table, role field) |
| `Project` | Project details, status, priority, assigned PM |
| `ProjectMember` | Many-to-many link between Projects and team member Users |
| `Task` | Task details, assignment, status, priority, due date |
| `TaskDiscussion` | Comment thread per task |
| `Notification` | User-specific notifications with read state |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A PostgreSQL database (e.g. a free [Neon](https://neon.tech) instance)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

```bash
npm run dev
```

The API will run on `http://localhost:5000`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will run on `http://localhost:5173`.

---

## 🔑 Demo Credentials

Use these accounts to explore each portal:

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@taskforge.com` | `admin123` |
| **Project Manager** | `ali.pm@taskforge.com` | `pm123456` |
| **Team Member** | `sara.member@taskforge.com` | `member123` |

---

## 📸 Screenshots

*(Add screenshots of the Login page, each Dashboard, Project Details, and Task Details here before submission.)*

---

## 📄 License

This project was built as part of an internship task and is intended for educational and evaluation purposes.

---

<div align="center">

Built with ❤️ by **Areeba Ahsan**

</div>