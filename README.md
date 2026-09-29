# 💼 JobPortal – Full-Stack MERN Job Portal Application

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.style=for-the-badge)](LICENSE)

A modern, enterprise-ready, full-stack **Job Portal Web Application** built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) and styled with **Tailwind CSS v4** and **Lucide Icons**. 

This platform connects **Job Seekers (Candidates)** with **Employers (Recruiters)** through an intuitive, interactive, and visually stunning interface equipped with full Application Tracking (ATS), role-based dashboards, live job/company preview widgets, and Cloudinary-powered file management.

---

## 🌟 Key Features

### 🔐 1. Authentication & Security
- **Role-Based Access Control (RBAC)**: Distinct user flows, pages, and navigation for **Candidates** and **Recruiters**.
- **Secure JWT Authentication**: HTTP Cookie & Header token authentication powered by `jsonwebtoken` and `bcryptjs` password hashing.
- **Glassmorphic Auth UI**: Custom modern login and registration interfaces with instant validation and role toggles.
- **Helmet Middleware**: Built-in HTTP security headers for production safety.

---

### 👤 2. Candidate Portal
- **Interactive Landing Page**: Hero section, live platform statistics counters, popular job categories, and quick role search.
- **Advanced Job Discovery**:
  - Live keyword & title search bar.
  - Multi-select filters: Job Type (*Full-time, Part-time, Remote, Internship, Contract*), Experience level, Location filter, and interactive Salary Range slider.
  - Sticky sidebar navigation and responsive job cards with key requirements tags.
- **Detailed Job Overview**:
  - Full job description, key responsibilities, salary ranges, location badges, company profiles, and instant one-click **Apply** button.
  - Similar job recommendations engine.
- **Candidate Profile & Resume Manager**:
  - Comprehensive profile builder (Full name, bio/summary, skills tags, experience, education, social profile links).
  - Cloudinary-backed Resume upload & management (.pdf / .docx formats).
- **"My Applications" Dashboard**:
  - Real-time tracker monitoring application status (*Pending, Shortlisted, Accepted, Rejected*).
  - Filter applications by state with live status badge indicators.

---

### 🏢 3. Recruiter & Employer Portal
- **Recruiter Analytics Dashboard**:
  - Live metric cards tracking total posted jobs, total candidate applications, active hiring pipelines, and pending reviews.
- **Company Management**:
  - **Company Directory**: View all registered companies associated with the recruiter.
  - **Live Preview Company Form**: Instant side-by-side card preview while creating or editing company details, logo uploads, website links, location, and industry tags.
- **Job Post Management**:
  - **My Jobs List**: Manage posted job listings, view per-job applicant counters, and toggle job availability.
  - **Interactive Job Form**: Real-time job card preview widget while filling in title, salary range, experience criteria, job type, and custom requirements.
- **Applicant Tracking System (ATS)**:
  - Centralized candidate table per job.
  - Direct resume view and download options for evaluating candidates.
  - Interactive status dropdown (*Accepted / Rejected*) with immediate candidate portal status updates.

---

## 🛠️ Tech Stack Architecture

### **Frontend**
- **Core**: React 19 (Vite 8)
- **Styling**: Tailwind CSS v4 & PostCSS
- **Icons**: Lucide React (`lucide-react`)
- **Routing**: React Router DOM v7 (`react-router-dom`)
- **HTTP Client**: Axios (`axios`)
- **Linter**: Oxlint (`oxlint`)

### **Backend**
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js 5 (`express`)
- **Database**: MongoDB with Mongoose ODM (`mongoose`)
- **Authentication**: JWT (`jsonwebtoken`) & Password Hashing (`bcryptjs`)
- **File Storage**: Cloudinary (`cloudinary`) with Multer (`multer`)
- **Security**: Helmet (`helmet`) & CORS (`cors`)
- **Development**: Nodemon (`nodemon`)

---

## 📁 Project Directory Structure

```text
MERN-Job-Portal/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection & Cloudinary setup
│   │   ├── controllers/     # Business logic (Auth, Job, Company, Application)
│   │   ├── middleware/      # Auth JWT verification, Multer file handling, Error handling
│   │   ├── models/          # Mongoose Schemas (User, Company, Job, Application)
│   │   ├── routes/          # Express route declarations
│   │   ├── services/        # Service layer & helpers
│   │   └── utils/           # Database seeders & utility functions
│   ├── .env                 # Environment secrets
│   ├── package.json         # Backend dependencies & npm scripts
│   └── server.js            # Express server entry point
│
└── frontend/
    ├── src/
    │   ├── assets/          # Static assets & graphics
    │   ├── components/      # Shared UI components (Navbar, Footer, ProtectedRoute, etc.)
    │   ├── context/         # Auth & global application state providers
    │   ├── pages/           # Page views & screen routes:
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx / Signup.jsx
    │   │   ├── Jobs.jsx / JobDetails.jsx
    │   │   ├── CandidateDashboard.jsx / CandidateProfile.jsx / EditProfile.jsx
    │   │   ├── MyApplications.jsx
    │   │   ├── RecruiterDashboard.jsx / MyJobs.jsx / JobForm.jsx / JobApplicants.jsx
    │   │   └── MyCompanies.jsx / CompanyForm.jsx
    │   ├── utils/           # API helper functions & constants
    │   ├── App.jsx          # App layout router & provider wrapper
    │   └── main.jsx         # React DOM root entry point
    ├── index.html
    ├── package.json         # Frontend dependencies & npm scripts
    ├── vite.config.js       # Vite bundler configuration
    └── tailwind.config.js   # Tailwind CSS configuration
```

---

## 🗄️ Database Schemas Summary

| Model | Primary Fields | Description |
| :--- | :--- | :--- |
| **User** | `fullname`, `email`, `password`, `role` (*candidate/recruiter*), `profile` (*bio, skills, resume, company*) | Stores user credentials & profile metadata |
| **Company** | `name`, `description`, `website`, `location`, `logo`, `userId` | Stores recruiter-owned company profiles |
| **Job** | `title`, `description`, `requirements`, `salary`, `location`, `jobType`, `experience`, `company`, `created_by` | Stores active and archived job openings |
| **Application** | `job`, `applicant`, `status` (*pending/accepted/rejected*) | Tracks job application submissions and status updates |

---

## 🌐 API Endpoint Reference

### 🔑 Authentication Routes (`/api/v1/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Create a candidate or recruiter account | Public |
| `POST` | `/login` | Authenticate user & issue JWT token | Public |
| `GET` | `/logout` | Terminate active user session | Private |
| `PUT` | `/profile/update` | Update profile information & upload resume | Private |

### 🏢 Company Routes (`/api/v1/companies`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register a new company profile | Recruiter |
| `GET` | `/get` | Fetch all companies created by logged-in recruiter | Recruiter |
| `GET` | `/get/:id` | Fetch specific company by ID | Private |
| `PUT` | `/update/:id` | Update company details & logo image | Recruiter |

### 💼 Job Routes (`/api/v1/jobs`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/post` | Create a new job listing | Recruiter |
| `GET` | `/get` | Fetch all active jobs with multi-filter parameters | Public |
| `GET` | `/get/:id` | Fetch detailed job info and recommendations | Public |
| `GET` | `/getadminjobs` | Fetch all jobs posted by logged-in recruiter | Recruiter |
| `GET` | `/stats` | Fetch aggregated platform statistics for landing page | Public |

### 📋 Application Routes (`/api/v1/applications`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/apply/:id` | Apply for a job | Candidate |
| `GET` | `/get` | Fetch all applied jobs for candidate | Candidate |
| `GET` | `/:id/applicants` | Fetch candidate applications for a specific job | Recruiter |
| `PUT` | `/status/:id/update` | Update application status (*accepted / rejected*) | Recruiter |

---

## ⚡ Installation & Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [MongoDB](https://www.mongodb.com/) (Local server instance or MongoDB Atlas cluster)
- Cloudinary Account (for resume documents & company logo hosting)

### 2. Clone Repository
```bash
git clone https://github.com/HimanshuPaswan-2004/MERN-Job-Portal.git
cd MERN-Job-Portal
```

### 3. Backend Setup
Navigate to the `backend` directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

*(Optional)* Seed sample database data:
```bash
npm run seed
```

Start the backend development server:
```bash
npm run dev
```

### 4. Frontend Setup
Open a new terminal tab/window, navigate to `frontend`, and install dependencies:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

---

## 🤝 Contributing

Contributions, issues, and feature requests are always welcome!  
Feel free to open an issue or submit a pull request.

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
