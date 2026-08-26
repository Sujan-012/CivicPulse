# 🏛️ SGP-CSA — Smart Governance Platform for Administrative Operations with Citizen Service Assistance

A full-stack civic services platform with three roles:

- **Citizens** report civic issues, apply for documents (Aadhar, Birth Certificate, etc.),
  and view announcements.
- **Officers** get issues assigned to them by the admin, accept the assignment, and
  resolve them.
- **Admins** manage everything: assign issues to officers, create officer accounts,
  review and approve/reject document applications, and publish announcements.

## ✨ Features

- Three separate logins: Citizen (`/login`), Officer (`/officer-login`), Admin (`/admin-login`)
- Report civic issues with device GPS location capture, category, description
- Search & filter issues by status/category/location; open location directly in Google Maps
- Officer assignment workflow: Admin assigns → Officer accepts → status auto-updates
- Apply for government documents (Aadhar Card, Birth Certificate, etc.) with status tracking
- Admin approves/rejects applications with a custom response message sent back to the citizen
- Announcements: only Admin can publish, all logged-in users (citizen/officer/admin) can view
- Admin dashboard with live stats (Total / Pending / In Progress / Resolved)
- Protected routes, toasts, responsive sidebar dashboard UI

## 🛠️ Tech Stack

- **Frontend:** React (Vite), React Router, Axios, React-Toastify
- **Backend:** Java 17, Spring Boot, Spring Security, JWT, Spring Data JPA
- **Database:** MySQL

## 🚀 Running it locally

### 1. Backend

```bash
cd backend
# configure src/main/resources/application.properties with your MySQL credentials
./mvnw spring-boot:run
```
Runs on `http://localhost:8080`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`.

### Default accounts (auto-created on first backend startup)

| Role    | Login page       | Email                  | Password    |
|---------|-------------------|-------------------------|-------------|
| Admin   | `/admin-login`    | admin@civicpulse.com    | admin123    |
| Officer | `/officer-login`  | officer@civicpulse.com  | officer123  |

Citizens register themselves at `/register`.

## 📂 Structure

```
SGP-CSA/
├── backend/     Spring Boot API (auth, issues, applications, announcements)
└── frontend/    React (Vite) client
```
