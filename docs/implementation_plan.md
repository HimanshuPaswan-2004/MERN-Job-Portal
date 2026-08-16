# 🏗️ Master Implementation Plan: Real-Life Job Portal (From Scratch)

Aapki request par, purana project delete kar diya gaya hai. Ab hum ekdum clean slate se ek **Enterprise-Level Job Portal** banayenge jo production ke liye ready hoga. Is plan me Architecture, Database schemas, File Structure, aur day-wise execution ki details hain.

---

## 📂 Expected File & Folder Structure

Hum project ko do main folders (`backend` aur `frontend`) me divide karenge.

```text
MERN-Job-Portal/
│
├── backend/                  # Node.js/Express
│   ├── controllers/          # API logic (user, job, company, application)
│   ├── middlewares/          # Auth middleware (isAuthenticated, multer for files)
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express API routes
│   ├── utils/                # DB connection, Cloudinary setup, JWT helpers
│   ├── .env                  # Secrets (Mongo URI, Cloudinary keys)
│   ├── index.js              # Main server entry file
│   └── package.json
│
└── frontend/                 # React + Vite
    ├── public/               # Static assets (favicons, generic images)
    ├── src/
    │   ├── assets/           # Internal images/icons
    │   ├── components/       # Reusable UI components (Navbar, Footer, Hero)
    │   │   ├── auth/         # Login, Signup
    │   │   ├── jobs/         # Job cards, Search filters
    │   │   └── admin/        # Recruiter dashboard tables/forms
    │   ├── hooks/            # Custom React hooks (e.g., useGetAllJobs)
    │   ├── pages/            # Main page layouts (Home, Browse, Profile)
    │   ├── redux/            # State management slices (authSlice, jobSlice)
    │   ├── utils/            # Constants (API endpoints)
    │   ├── App.jsx           # Main App with React Router
    │   └── main.jsx          # React DOM render & Redux Provider
    ├── tailwind.config.js
    └── package.json
```

---

## 🏛️ System Architecture

- **Frontend:** React.js + Vite, Tailwind CSS, Shadcn UI, Framer Motion (for animations), Redux Toolkit (State Management).
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (with Mongoose).
- **Authentication:** JWT (JSON Web Tokens) with HttpOnly cookies, Bcrypt for password hashing.
- **Media Storage:** Cloudinary (Profile photos & PDF Resumes).
- **Real-Time features:** Socket.io (for instant notifications).

---

## 🗄️ Database Architecture (Schemas)

1. **User Model (`User`)**
   - `fullname` (String), `email` (String, Unique), `password` (String, Hashed), `role` (Enum: `student`, `recruiter`), `profile` (Object: bio, skills, resume url, profilePhoto, companyId).
2. **Company Model (`Company`)**
   - `name` (String, Unique), `description` (String), `website` (String), `location` (String), `logo` (String), `userId` (Ref: User - recruiter).
3. **Job Model (`Job`)**
   - `title`, `description`, `requirements` (Array), `salary`, `experienceLevel`, `location`, `jobType`, `company` (Ref: Company), `created_by` (Ref: User), `applications` (Array of Refs: Application).
4. **Application Model (`Application`)**
   - `job` (Ref: Job), `applicant` (Ref: User), `status` (Enum: `pending`, `accepted`, `rejected`).

---

## 📅 Day-Wise Implementation Roadmap

### Day 1: Backend Foundation & Authentication
*Focus: Setting up the server, database connection, and secure login system.*
- Init Node/Express project (`npm init -y`).
- Setup MongoDB connection with Mongoose.
- Create User model.
- Implement `/register`, `/login`, `/logout`, and `/profile/update` API endpoints.
- Setup JWT authentication and `isAuthenticated` middleware.

### Day 2: Core Backend Logic (Jobs & Companies)
*Focus: Building APIs for recruiters to manage jobs and companies.*
- Create Company and Job models.
- Implement Company APIs (Register, Get Companies, Get by ID, Update).
- Implement Job APIs (Post Job, Get All Jobs, Get Job by ID, Get Admin Jobs).
- Add Cloudinary integration for handling file uploads (Logos and Resumes) via `multer`.

### Day 3: Frontend Setup & UI Foundation
*Focus: Initializing the React app and setting up the design system.*
- Init Vite React app.
- Install Tailwind CSS and Shadcn UI components.
- Setup React Router DOM for routing.
- Implement Light/Dark mode (`next-themes`).
- Build shared components: Navbar (glassmorphism), Footer, and animated Hero Section.

### Day 4: Authentication UI & Redux Integration
*Focus: Connecting frontend auth with backend.*
- Build Login and Signup pages with form validations.
- Setup Redux Toolkit and `redux-persist` for state management.
- Connect Login/Signup forms to the backend APIs.
- Build the User Profile page (showing details, skills, and resume).

### Day 5: Candidate Experience (Job Search & Applying)
*Focus: Building the core functionality for students.*
- Build the "Jobs" and "Browse" pages with filtering logic.
- Create Job Cards and detailed Job Description pages.
- Implement the "Apply for Job" API and connect it to the frontend UI.
- Update the User Profile to show "Applied Jobs".

### Day 6: Recruiter Experience (Dashboards)
*Focus: Building the admin dashboard for employers.*
- Build the "Companies" dashboard (List of created companies, register new company).
- Build the "Post Job" form with rich inputs.
- Build the "Applicants Tracker" data table for recruiters to view who applied.
- Connect APIs to accept/reject candidates from the dashboard.

### Day 7: Real-Time Features & Polish
*Focus: Making the app feel like a real enterprise product.*
- Integrate `socket.io` for real-time notifications (e.g., when a recruiter accepts an application, candidate gets an instant bell alert).
- Add infinite scrolling or pagination for the jobs list.
- Comprehensive end-to-end bug fixing and testing.

---

## ⚠️ User Review Required

- **Data Reset:** Purana project delete ho chuka hai, iska matlab hum ek naya, fresh database use karenge ya purane wale MongoDB cluster me hi naya collection banayenge. (Main existing connection string use kar lunga).
- **Timeline:** Ye roadmap kafi intensive hai aur hum ise ek-ek din karke pura karenge. 

## ❓ Open Questions
- Kya is project ko kisi specific folder naam (jaise `JobPortal-Pro`) me banana hai ya bas `JobPortal` rakhna hai?

**Agar aap is Master Plan (File Structure ke sath) se sehmat hain aur NAYA project shuru karna chahte hain, toh kripya "Proceed" par click karein!**
