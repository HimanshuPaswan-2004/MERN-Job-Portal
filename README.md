# 💼 JobPortal – Full-Stack MERN Job Portal Application

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

A modern, full-stack **Job Portal Web Application** built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) styled with **Tailwind CSS v4** and powered by **Lucide Icons**. 

This platform seamlessly connects **Job Seekers (Candidates)** with **Employers (Recruiters)** through an intuitive, role-tailored interface featuring complete Application Tracking (ATS), role-based access control (RBAC), interactive job and company creation forms with live previews, real-time filtering, dynamic analytics, and file/resume management.

---

## 🌟 Key Features

### 🔐 1. Authentication & Security
- **Role-Based Access Control (RBAC)**: Custom workflows, navigation, and protected routes for **Candidate** and **Recruiter** roles.
- **JWT Authentication & Password Hashing**: Secured via JSON Web Tokens (`jsonwebtoken`) and `bcryptjs` password encryption.
- **Express Security**: Integrated HTTP security headers using `helmet` and custom CORS policy configuration.

---

### 👤 2. Candidate Portal
- **Interactive Landing Page**: Hero section, live platform statistics counters (Jobs, Applications, Companies), featured categories, and rapid search bar.
- **Advanced Job Discovery**:
  - Full-text search across job titles, descriptions, and skills.
  - Multi-criteria filtering by Job Type (*Full-time, Part-time, Internship, Contract, Remote*), Experience Level (*Fresher, 1-2 years, 2-4 years, 5+ years*), Location, and Salary range sliders.
- **Job Details & Recommendations**:
  - In-depth job view showcasing key responsibilities, required skills, salary range, company overview, and similar job recommendations.
  - One-click application process with optional cover letter submission.
- **Profile & Resume Management**:
  - Personal profile editor (Bio, phone, location, LinkedIn/GitHub links, educational history, work experience, preferred job type, and target salary).
  - Cloudinary-backed resume uploading with PDF preview and direct document management.
- **Applications Tracking Dashboard**:
  - Real-time tracker for application status (*Applied, In Review, Shortlisted, Interview, Offered, Hired, Rejected*).
  - Stat cards summarizing total, active, shortlisted, and hired applications.

---

### 🏢 3. Recruiter & Employer Portal
- **Recruiter Analytics Dashboard**:
  - Dynamic metrics tracking total posted jobs, active openings, total candidate applications, pending reviews, and shortlisted talent.
  - Quick-action shortcuts to post jobs, manage companies, and view applicant pools.
- **Company Management**:
  - Register and manage multiple company profiles (name, industry, company size, founded year, location, website, social links).
  - **Live Preview Company Form**: Instant side-by-side preview card while entering company metadata and uploading logos.
  - Active/Inactive company status toggles.
- **Job Management**:
  - Post, edit, pause, close, or delete job listings.
  - **Live Preview Job Form**: Real-time render of candidate-facing job cards while typing requirements, salary bounds, work mode, and experience criteria.
- **Applicant Tracking System (ATS)**:
  - Centralized job applicant table with searchable and filterable candidate records.
  - Direct candidate profile modal and resume access.
  - Real-time status update pipeline (*Applied ➔ In Review ➔ Shortlisted ➔ Interview ➔ Offered ➔ Hired / Rejected*).

---

## 🛠️ Tech Stack Architecture

### **Frontend**
- **Framework**: React 19 (Vite 8)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`) & PostCSS
- **Icons**: Lucide React (`lucide-react`)
- **Routing**: React Router DOM v7 (`react-router-dom`)
- **HTTP Client**: Axios (`axios`)
- **Linter**: Oxlint (`oxlint`)

### **Backend**
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js 5 (`express`)
- **Database**: MongoDB with Mongoose ODM (`mongoose`)
- **Authentication**: JWT (`jsonwebtoken`) & `bcryptjs`
- **File & Media Storage**: Cloudinary (`cloudinary`) with Multer (`multer`)
- **Security & Utilities**: Helmet (`helmet`), CORS (`cors`), Dotenv (`dotenv`)
- **Dev Server**: Nodemon (`nodemon`)

---

## 📁 Project Directory Structure

```text
MERN-Job-Portal/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection & Cloudinary configuration
│   │   ├── controllers/     # Controller logic (auth, job, company, application)
│   │   ├── middleware/      # JWT auth, role validation, file upload & error handling
│   │   ├── models/          # Mongoose Schemas (User, Company, Job, Application)
│   │   ├── routes/          # Express route definitions
│   │   └── utils/           # JWT generator & database seeder script
│   ├── uploads/             # Static file storage fallback
│   ├── .env.example         # Environment variable template
│   ├── package.json         # Backend dependencies & scripts
│   └── server.js            # Express application entry point
│
└── frontend/
    ├── src/
    │   ├── assets/          # Static images & graphics
    │   ├── components/      
    │   │   ├── common/      # Navbar, Footer, ProtectedRoute
    │   │   └── layout/      # RecruiterLayout wrapper
    │   ├── context/         # AuthContext provider & global auth state
    │   ├── pages/           
    │   │   ├── auth/        # Login & Signup screens
    │   │   ├── candidate/   # Candidate Dashboard, Profile, Edit Profile, My Applications
    │   │   ├── public/      # Home, Job Discovery, Job Details
    │   │   └── recruiter/   # Recruiter Dashboard, My Jobs, Job Form, Applicants, Companies, Company Form
    │   ├── App.jsx          # Router & layout provider configuration
    │   ├── index.css        # Global CSS & Tailwind directives
    │   └── main.jsx         # React DOM root renderer
    ├── index.html
    ├── package.json         # Frontend dependencies & scripts
    └── vite.config.js       # Vite build configuration
```

---

## 🗄️ Database Schemas Summary

| Model | Key Fields | Purpose |
| :--- | :--- | :--- |
| **User** | `name`, `email`, `password`, `role` (*candidate/recruiter*), `phone`, `location`, `bio`, `profilePhoto`, `skills`, `education`, `experience`, `resume`, `socialLinks` | Manages user authentication details and profile resume payload. |
| **Company** | `name`, `description`, `industry`, `companySize`, `location`, `website`, `logo`, `socialLinks`, `status`, `createdBy` | Stores recruiter-owned company listings and media assets. |
| **Job** | `title`, `company`, `recruiter`, `description`, `location`, `jobType`, `experienceLevel`, `salary`, `skills`, `vacancies`, `status` | Contains active and archived job posts with search indexes. |
| **Application** | `job`, `applicant`, `status` (*Applied, In Review, Shortlisted, Interview, Offered, Hired, Rejected*), `resume`, `coverLetter` | Tracks candidate job applications with duplicate submission prevention. |

---

## 🌐 API Endpoint Reference

All backend API routes are prefixed with `/api`.

### 🔑 Authentication Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a candidate or recruiter account |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve logged-in user profile details |
| `PUT` | `/api/auth/me` | Private | Update user profile details, skills, or resume |

### 🏢 Company Routes (`/api/companies`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/companies` | Public | Fetch all companies |
| `POST` | `/api/companies` | Recruiter | Create a new company profile (with optional logo upload) |
| `GET` | `/api/companies/my` | Recruiter | Get companies created by the logged-in recruiter |
| `GET` | `/api/companies/:id` | Public | Get detailed company information by ID |
| `PUT` | `/api/companies/:id` | Recruiter | Update company profile metadata & logo |
| `PATCH` | `/api/companies/:id/status` | Recruiter | Toggle company status (*Active / Inactive*) |
| `DELETE` | `/api/companies/:id` | Recruiter | Remove a company profile |

### 💼 Job Routes (`/api/jobs`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | Public | Query jobs with keyword, type, experience, & salary filters |
| `GET` | `/api/jobs/stats` | Public | Fetch aggregate job portal statistics |
| `GET` | `/api/jobs/my` | Recruiter | Fetch all jobs posted by logged-in recruiter |
| `GET` | `/api/jobs/:id` | Public | Get single job details by ID |
| `GET` | `/api/jobs/:id/similar` | Public | Get recommended similar jobs |
| `POST` | `/api/jobs` | Recruiter | Create a new job listing |
| `PUT` | `/api/jobs/:id` | Recruiter | Update an existing job listing |
| `PATCH` | `/api/jobs/:id/status` | Recruiter | Update job status (*draft, active, paused, closed*) |
| `DELETE` | `/api/jobs/:id` | Recruiter | Delete job listing |

### 📋 Application Routes (`/api/applications`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/applications/:jobId` | Candidate | Apply for a job opening |
| `GET` | `/api/applications` | Candidate | Get list of user's submitted applications |
| `GET` | `/api/applications/dashboard` | Candidate | Get candidate overview & application stats |
| `GET` | `/api/applications/recruiter-dashboard` | Recruiter | Get recruiter portal overview & hiring metrics |
| `GET` | `/api/applications/job-applicants` | Recruiter | Fetch applicants across jobs or filter by specific `jobId` |
| `PUT` | `/api/applications/:id/status` | Recruiter | Update application status in hiring workflow |

### 📁 Upload Routes (`/api/upload`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/upload` | Public | Upload single file asset and receive public URL path |

---

## ⚡ Installation & Local Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas Connection String)
- Cloudinary Account (for resume documents & company logo hosting)

### 2. Clone Repository
```bash
git clone https://github.com/HimanshuPaswan-2004/MERN-Job-Portal.git
cd MERN-Job-Portal
```

### 3. Backend Setup
Navigate into the `backend/` directory and install node modules:
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` (refer to `.env.example`):
```env
PORT=8000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/jobportal?retryWrites=true&w=majority
SECRET_KEY=your_jwt_secret_key_here
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

*(Optional)* Seed sample candidate, recruiter, company, and job data into database:
```bash
npm run seed
```

Launch the backend development server:
```bash
npm run dev
```
The backend server will run on `http://localhost:8000`.

### 4. Frontend Setup
Open a new terminal tab/window, navigate to `frontend/`, and install dependencies:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```
The client application will be accessible at `http://localhost:5173`.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to open an issue or submit a pull request on [GitHub](https://github.com/HimanshuPaswan-2004/MERN-Job-Portal).

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
