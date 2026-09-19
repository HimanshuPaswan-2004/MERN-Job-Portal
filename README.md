# 💼 JobPortal – Full-Stack MERN Job Portal Application

A modern, enterprise-ready, full-stack **Job Portal** platform built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) and styled with **Tailwind CSS** and **Lucide Icons**. 

This platform connects **Job Seekers (Candidates)** with **Employers (Recruiters)** through an intuitive, interactive, and visually stunning interface with full application tracking (ATS), role-based dashboards, live previews, and file management.

---

## 🚀 Key Features Overview

### 🔐 1. Authentication & Authorization
- **Role-Based Access Control**: Separate workflows and dashboards for **Candidate** and **Recruiter**.
- **JWT Authentication**: Secure user session handling with JSON Web Tokens.
- **Glassmorphic Auth UI**: Custom designed login and registration interfaces.
- **Profile Avatar Support**: Seamless profile picture upload and management.

---

### 👤 2. Candidate Portal
- **Interactive Landing Page**: Hero section, real-time platform statistics counter, featured job categories, and quick search.
- **Candidate Dashboard**: Overview of application stats, recent applications, saved jobs, and quick navigation.
- **Advanced Job Discovery & Search**:
  - Live keyword & title search.
  - Multi-select filters: Job Type (Full-time, Part-time, Remote, Internship, Contract), Experience Level, Location, and dynamic Salary Range slider.
  - Responsive layout with sticky sidebar filters and modern job cards.
- **Detailed Job View**: Complete job overview including company details, salary, requirements, location badge, similar job recommendations, and instant "Apply" button.
- **Profile & Resume Builder**:
  - Personal info, professional summary/bio, skills tags, work experience, and education.
  - Social media integration (LinkedIn, GitHub, Portfolio).
  - Resume File Upload (.pdf / .docx) powered by Cloudinary/Multer.
- **"My Applications" Tracker**: Filter applied jobs by status (*Pending, Shortlisted, Accepted, Rejected*), application timeline, and status feedback.

---

### 🏢 3. Recruiter & Employer Portal
- **Recruiter Dashboard**: Analytics metrics covering total jobs posted, total applicants, active hiring pipelines, and pending application reviews.
- **Company Management**:
  - **My Companies**: List of all recruiter registered companies with quick status badges.
  - **Create / Edit Company**: Form with live preview card widget, company logo upload, description, location, website URL, industry type, and employee scale.
- **Job Management**:
  - **My Jobs Page**: View and manage all posted jobs, applicant counts per job, and quick job status toggles.
  - **Post / Edit Job Page**: Structured job post creation with live post preview widget, custom tags/requirements, salary ranges, experience criteria, and helpful recruiter tips sidebar.
- **Applicant Tracking System (ATS)**:
  - Centralized table to inspect candidate profiles and download uploaded resumes.
  - Quick action status dropdown to change application states (*Pending -> Accepted / Rejected*) with immediate candidate notification integration.

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
- **Framework**: [React 18](https://reactjs.org/) (built with [Vite](https://vitejs.dev/))
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Custom CSS Variables
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router DOM v6](https://reactrouter.com/)
- **HTTP Client**: Axios / Fetch API

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose ODM](https://mongoosejs.com/)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs` for password hashing
- **File Uploads**: `multer` & `cloudinary` (for Resumes and Logos)

---

## 📁 Project Directory Structure

```text
MERN-Job-Portal/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & Cloudinary configurations
│   │   ├── controllers/     # Application logic (Auth, Job, Company, Application)
│   │   ├── middleware/      # Auth verification & Multer file handling
│   │   ├── models/          # Mongoose Schemas (User, Company, Job, Application)
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Auxiliary business logic services
│   │   └── utils/           # Helper functions & async handlers
│   ├── .env.example         # Sample environment configurations
│   ├── package.json
│   └── server.js            # Express server entry point
│
└── frontend/
    ├── src/
    │   ├── assets/          # Static assets & illustrations
    │   ├── components/      # Shared components (Navbar, Footer, ProtectedRoute, etc.)
    │   ├── context/         # Auth & App context state providers
    │   ├── pages/           # Page views:
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx / Signup.jsx
    │   │   ├── Jobs.jsx / JobDetails.jsx
    │   │   ├── CandidateDashboard.jsx / CandidateProfile.jsx / EditProfile.jsx
    │   │   ├── MyApplications.jsx
    │   │   ├── RecruiterDashboard.jsx / MyJobs.jsx / JobForm.jsx
    │   │   └── MyCompanies.jsx / CompanyForm.jsx
    │   ├── utils/           # API helpers & constants
    │   ├── App.jsx          # Route definitions & layout wrappers
    │   └── main.jsx         # React application entry point
    ├── index.html
    ├── package.json
    └── tailwind.config.js
```

---

## 🗄️ Database Models Summary

| Model | Key Fields | Description |
| :--- | :--- | :--- |
| **User** | `fullname`, `email`, `password`, `role` (candidate/recruiter), `profile` (bio, skills, resume, company) | Stores user authentication & candidate/recruiter profile data |
| **Company** | `name`, `description`, `website`, `location`, `logo`, `userId` | Stores company information registered by recruiters |
| **Job** | `title`, `description`, `requirements`, `salary`, `location`, `jobType`, `experience`, `company`, `created_by` | Stores job listings created by recruiters |
| **Application** | `job`, `applicant`, `status` (*pending/accepted/rejected*) | Tracks job applications submitted by candidates |

---

## 🌐 API Reference

### Auth Routes (`/api/v1/auth`)
- `POST /register` – Register a new Candidate or Recruiter
- `POST /login` – Authenticate user & issue JWT token
- `GET /logout` – Clear user session
- `PUT /profile/update` – Update user profile details, skills, and upload resume

### Company Routes (`/api/v1/companies`)
- `POST /register` – Register a new company profile
- `GET /get` – Fetch all companies registered by logged-in recruiter
- `GET /get/:id` – Fetch company details by ID
- `PUT /update/:id` – Update company details & logo

### Job Routes (`/api/v1/jobs`)
- `POST /post` – Post a new job (Recruiter only)
- `GET /get` – Get all active jobs (Supports keyword, location, salary, experience, jobType filters)
- `GET /get/:id` – Get single job details & recommendations
- `GET /getadminjobs` – Get all jobs posted by logged-in recruiter
- `GET /stats` – Fetch platform statistics for landing page

### Application Routes (`/api/v1/applications`)
- `POST /apply/:id` – Apply for a specific job (Candidate only)
- `GET /get` – Get all applications submitted by candidate
- `GET /:id/applicants` – Get all candidates who applied for a specific job (Recruiter only)
- `PUT /status/:id/update` – Update application status (*accepted / rejected*)

---

## ⚡ Installation & Setup Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16+ installed)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)
- Cloudinary Account (for file & image storage)

### 2. Clone Repository
```bash
git clone https://github.com/HimanshuPaswan-2004/MERN-Job-Portal.git
cd MERN-Job-Portal
```

### 3. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start backend development server:
```bash
npm run dev
```

### 4. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

The application will be accessible at `http://localhost:5173`.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page or submit a pull request.

---

## 📝 License

This project is licensed under the MIT License.
