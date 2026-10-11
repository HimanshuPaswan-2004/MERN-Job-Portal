# 💼 JobPortal – Full-Stack MERN Job Portal & ATS Platform

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

A modern, production-grade **Full-Stack Job Portal & Applicant Tracking System (ATS)** built with the **MERN Stack** (MongoDB, Express.js 5, React 19, Node.js), styled using **Tailwind CSS v4** and animated with **Lucide Icons**.

The platform provides dedicated, role-tailored experiences for both **Job Seekers (Candidates)** and **Employers (Recruiters)**, featuring real-time job filtering, interactive forms with live previews, multi-stage ATS applicant pipelines, profile & resume management, and secure authentication.

---

## ⚡ Quick Demo Accounts

Pre-configured accounts are generated automatically by running the seeder script (`npm run seed` in `backend`):

| Role | Email Address | Password | Capabilities |
| :--- | :--- | :--- | :--- |
| **Recruiter** | `hr@technova.com` | `password123` | Post & manage jobs, manage companies, review applicants, update hiring status |
| **Candidate** | `candidate@example.com` | `password123` | Explore jobs, apply with resumes & cover letters, track application pipeline |

> **Tip**: The login page also features one-click demo auto-fill buttons for quick testing without typing credentials!

---

## 🌟 Key Features

### 👤 Candidate Portal
* **Dynamic Landing & Discovery**:
  * Hero search bar with instant keyword, category, and location filtering.
  * Real-time platform statistics counters (Active Jobs, Candidates, Companies).
  * Curated job listings and company showcases.
* **Advanced Job Search & Filtering**:
  * Multi-dimensional filtering by **Job Type** (*Full-time, Part-time, Internship, Contract*), **Experience Level** (*Fresher, 1-2 years, 2-4 years, 5+ years*), **Location**, and **Salary Range** slider.
  * Deep search across job titles, descriptions, and required technology tags.
* **Job Detail & Instant Apply**:
  * Detailed job view containing responsibilities, requirements, benefits, and company summary.
  * Similar job recommendations algorithm based on industry and skills.
  * One-click job application with custom cover letter and auto-attached profile resume.
* **Candidate Profile & Resume Center**:
  * Rich profile customizer: bio, headline, phone, location, portfolio/social links.
  * Structured education and work experience timelines.
  * Skills tags editor and salary expectation settings.
  * Resume upload with instant preview and document management.
* **My Applications Tracker**:
  * Comprehensive dashboard tracking all submitted applications.
  * Status badges: `Applied` ➔ `In Review` ➔ `Shortlisted` ➔ `Interview` ➔ `Offered` ➔ `Hired` / `Rejected`.
  * KPI metric cards for total submissions, active reviews, shortlisted roles, and offers.

---

### 🏢 Recruiter & Employer Portal
* **Recruiter Analytics Dashboard**:
  * Overview metrics: Active Job Openings, Total Applications Received, Shortlisted Candidates, and Pending Reviews.
  * Quick shortcuts to create new jobs, register company profiles, and view incoming applicant pools.
* **Company Profile Management**:
  * Manage multiple enterprise profiles (name, description, industry, company size, founded year, location, website).
  * **Interactive Live Preview Form**: Visual side-by-side card rendering in real time as company information and logo are entered.
  * Active/Inactive visibility toggles.
* **Job Creation & Lifecycle Control**:
  * Post, edit, pause, and close listings with detailed job parameters (work mode, vacancies, salary range, required skills).
  * **Live Preview Job Card**: Instant candidate-view preview card rendered alongside the editing form.
* **Applicant Tracking System (ATS)**:
  * Centralized candidate pipeline filterable by job and status.
  * Applicant profile modal with contact details, education, experience, and uploaded resume viewer.
  * 7-stage hiring workflow status changer with instantaneous backend synchronization.

---

### 🛡️ Authentication & Security
* **Role-Based Access Control (RBAC)**: Strict client-side and server-side route guards enforcing separate candidate and recruiter workflows.
* **Secure JWT Sessions**: JSON Web Tokens signed with secret keys and validated via bearer middleware.
* **Password Encryption**: Salted password hashing powered by `bcryptjs`.
* **API Security & Hardening**:
  * HTTP security headers configured via `helmet`.
  * CORS origin protection with support for multiple client environments.
  * Centralized async error handling and standard JSON response envelopes.

---

## 🛠️ Tech Stack Architecture

### Frontend
* **Framework**: React 19 (`react`, `react-dom`)
* **Build Tool**: Vite 8 (`vite`)
* **Styling**: Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/postcss`, `postcss`)
* **Routing**: React Router DOM v7 (`react-router-dom`)
* **Icons**: Lucide React (`lucide-react`)
* **HTTP Client**: Axios (`axios`)
* **Code Quality**: Oxlint (`oxlint`)

### Backend
* **Runtime**: Node.js (v18+)
* **Framework**: Express.js 5 (`express`)
* **Database**: MongoDB with Mongoose ODM 9 (`mongoose`)
* **Auth**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
* **File Uploads**: Multer (`multer`) with Cloudinary SDK (`cloudinary`) and local static file fallback
* **Security & Utility**: Helmet (`helmet`), CORS (`cors`), Dotenv (`dotenv`)
* **Development**: Nodemon (`nodemon`)

---

## 📁 Project Directory Structure

```text
MERN-Job-Portal/
├── backend/
│   ├── src/
│   │   ├── config/              # MongoDB connection & Cloudinary setup
│   │   ├── controllers/         # Business logic (auth, job, company, application)
│   │   ├── middleware/          # Auth verification, RBAC guards, Multer upload & error handlers
│   │   ├── models/              # Mongoose schemas (User, Company, Job, Application)
│   │   ├── routes/              # Express API route declarations
│   │   └── utils/               # JWT token generator & database seeder script
│   ├── uploads/                 # Static file upload storage fallback
│   ├── .env.example             # Backend environment template
│   ├── package.json             # Backend dependencies & npm scripts
│   └── server.js                # Express server entry point
│
└── frontend/
    ├── src/
    │   ├── assets/              # Static media & images
    │   ├── components/          
    │   │   ├── common/          # Navbar, Footer, ProtectedRoute
    │   │   └── layout/          # RecruiterLayout wrapper
    │   ├── context/             # AuthContext (user state, login, register, logout)
    │   ├── pages/               
    │   │   ├── auth/            # Login & Signup views with quick demo fills
    │   │   ├── candidate/       # Dashboard, Candidate Profile, Edit Profile, My Applications
    │   │   ├── public/          # Landing Page (Home), Job Discovery (Jobs), Job Details
    │   │   └── recruiter/       # Recruiter Dashboard, My Jobs, Job Form, Applicants (ATS), My Companies, Company Form
    │   ├── App.jsx              # Application router, role layouts, and page routing
    │   ├── index.css            # Tailwind CSS directives & custom styling
    │   └── main.jsx             # React DOM root mounting
    ├── index.html               # Main HTML entry
    ├── package.json             # Frontend dependencies & npm scripts
    └── vite.config.js           # Vite development and build settings
```

---

## 🗄️ Database Models Summary

| Model | Key Fields | Description |
| :--- | :--- | :--- |
| **User** | `name`, `email`, `password`, `role` (*candidate/recruiter*), `phone`, `location`, `bio`, `tagline`, `profilePhoto`, `skills`, `education`, `experience`, `resume`, `preferredJobType`, `expectedSalary` | User identity, credentials, candidate resume profile, and recruiter metadata. |
| **Company** | `name`, `description`, `industry`, `companySize`, `location`, `website`, `logo`, `status` (*Active/Inactive*), `createdBy` | Recruiter-owned corporate profiles associated with job posts. |
| **Job** | `title`, `company`, `recruiter`, `description`, `responsibilities`, `requirements`, `skills`, `location`, `jobType`, `experienceLevel`, `workMode`, `salary`, `vacancies`, `status` | Job listings supporting full-text query, filtering, and application intake. |
| **Application** | `job`, `applicant`, `status` (*Applied, In Review, Shortlisted, Interview, Offered, Hired, Rejected*), `resume`, `coverLetter` | Job applications with candidate references, resumes, and hiring workflow state. |

---

## 🌐 API Endpoint Reference

All backend API routes are served under `/api`.

### 🔑 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new Candidate or Recruiter account |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials and receive JWT |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current user profile and session data |
| `PUT` | `/api/auth/me` | Authenticated | Update user profile, skills, education, experience, or resume |

### 🏢 Companies (`/api/companies`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/companies` | Public | List all companies with query filters |
| `POST` | `/api/companies` | Recruiter | Create a new company profile |
| `GET` | `/api/companies/my` | Recruiter | List companies created by logged-in recruiter |
| `GET` | `/api/companies/:id` | Public | Get single company details |
| `PUT` | `/api/companies/:id` | Recruiter | Update existing company profile |
| `PATCH` | `/api/companies/:id/status` | Recruiter | Toggle company status (*Active / Inactive*) |
| `DELETE` | `/api/companies/:id` | Recruiter | Delete company profile |

### 💼 Jobs (`/api/jobs`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | Public | Query jobs with keyword, location, jobType, experience & salary filters |
| `GET` | `/api/jobs/stats` | Public | Get aggregate metrics (total jobs, applications, companies) |
| `GET` | `/api/jobs/my` | Recruiter | Retrieve jobs posted by the logged-in recruiter |
| `GET` | `/api/jobs/:id` | Public | Get detailed job opening by ID |
| `GET` | `/api/jobs/:id/similar` | Public | Retrieve recommended similar jobs |
| `POST` | `/api/jobs` | Recruiter | Publish a new job opening |
| `PUT` | `/api/jobs/:id` | Recruiter | Update an existing job opening |
| `PATCH` | `/api/jobs/:id/status` | Recruiter | Update job status (*active, paused, closed, draft*) |
| `DELETE` | `/api/jobs/:id` | Recruiter | Delete job listing |

### 📋 Applications (`/api/applications`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/applications/:jobId` | Candidate | Submit job application with resume & cover letter |
| `GET` | `/api/applications` | Candidate | List all applications submitted by candidate |
| `GET` | `/api/applications/dashboard` | Candidate | Candidate dashboard analytics & recent applications |
| `GET` | `/api/applications/recruiter-dashboard` | Recruiter | Recruiter hiring metrics and overview |
| `GET` | `/api/applications/job-applicants` | Recruiter | View applicants across all jobs or filter by `?jobId=` |
| `PUT` | `/api/applications/:id/status` | Recruiter | Progress application through the ATS hiring stages |

### 📁 Media & Uploads (`/api/upload`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/upload` | Public/Auth | Upload a document (PDF) or image (PNG, JPG) and receive URL |

---

## ⚡ Installation & Local Setup

### 1. Prerequisites
Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18.0.0 or higher)
* [npm](https://www.npmjs.com/) (v9.0.0 or higher)
* [MongoDB](https://www.mongodb.com/) (Local MongoDB community server or MongoDB Atlas connection string)
* *(Optional)* [Cloudinary Account](https://cloudinary.com/) (for cloud resume and logo hosting)

---

### 2. Clone the Repository
```bash
git clone https://github.com/HimanshuPaswan-2004/MERN-Job-Portal.git
cd MERN-Job-Portal
```

---

### 3. Backend Setup

1. Open a terminal and navigate to the `backend/` folder:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file in the `backend/` root directory by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` values:
   ```env
   PORT=8000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/jobportal?retryWrites=true&w=majority
   SECRET_KEY=your_super_secret_jwt_key_here
   FRONTEND_URL=http://localhost:5173

   # Optional Cloudinary Configuration
   CLOUD_NAME=your_cloudinary_cloud_name
   API_KEY=your_cloudinary_api_key
   API_SECRET=your_cloudinary_api_secret
   ```

4. **Seed the Database with Sample Data**:
   Populate users, companies, active jobs, and applications with pre-configured mock data:
   ```bash
   npm run seed
   ```

5. **Start the Backend Server**:
   ```bash
   npm run dev
   ```
   The backend API will run on `http://localhost:8000`.

---

### 4. Frontend Setup

1. Open a new terminal tab and navigate to the `frontend/` folder:
   ```bash
   cd frontend
   npm install
   ```

2. **Start the Vite Development Server**:
   ```bash
   npm run dev
   ```
   The frontend application will be live at `http://localhost:5173`.

---

## 🧭 Application Routes

### Public Routes
* `/` – Landing page with search, statistics, featured jobs, and categories
* `/jobs` – Browse all jobs with search and interactive multi-filter controls
* `/jobs/:id` – Detailed job posting with requirements and apply form
* `/login` – Account login with quick demo credentials
* `/signup` – Account registration for Candidates and Recruiters

### Candidate Routes (`candidate` role)
* `/candidate/dashboard` – Candidate metrics, recent applications, and quick actions
* `/candidate/profile` – Full resume and candidate profile preview
* `/candidate/profile/edit` – Interactive profile editor (skills, education, experience, resume)
* `/candidate/applications` – Application status tracking pipeline

### Recruiter Routes (`recruiter` role)
* `/recruiter/dashboard` – Hiring dashboard with aggregate stats and job shortcuts
* `/recruiter/companies` – List and manage owned company profiles
* `/recruiter/companies/new` – Register company with live visual preview
* `/recruiter/companies/:id/edit` – Edit company details and branding
* `/recruiter/jobs` – View and manage all posted jobs (active/paused/closed)
* `/recruiter/jobs/new` – Post job opening with live candidate card preview
* `/recruiter/jobs/:id/edit` – Edit existing job opening
* `/recruiter/applicants` – Full ATS applicant tracker with candidate modal & status changer
* `/recruiter/jobs/:jobId/applicants` – Applicants filtered by specific job opening

---

## 🤝 Contributing

Contributions, feedback, and suggestions are welcome!
1. Fork the Project repository.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📝 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

