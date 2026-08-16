# 🚀 MERN Stack Job Portal (Enterprise Architecture)

Welcome to the **MERN Stack Job Portal**, a modern, production-ready web application built using the complete MERN stack (MongoDB, Express.js, React.js, Node.js). This project is designed with an enterprise-level architecture from scratch to provide a flawless experience for both candidates and recruiters.

## 🌟 Key Features

- **For Candidates:** Advanced job search, comprehensive filters (Location, Salary, Job Type), profile building, resume uploads, and real-time application tracking.
- **For Recruiters:** Intuitive dashboard, company management, rich-text job postings, and real-time notifications for applicant tracking.
- **Security:** Secure authentication via JSON Web Tokens (JWT) stored in HttpOnly cookies, password hashing with Bcrypt, and strict route protections.
- **Modern UI:** Built with React, Vite, Tailwind CSS, Shadcn UI, and Framer Motion for a premium, glassmorphic, and dynamic user experience.
- **Robust Backend:** Optimized MongoDB schemas, Mongoose ODM, and Cloudinary integration for scalable media storage.

## 📂 Documentation

For a detailed understanding of how this project is structured and built step-by-step, please refer to our `docs/` folder:

- [Master Implementation Plan](./docs/implementation_plan.md): The overall architecture and database schema design.
- [Day-wise Task Tracker](./docs/task.md): Detailed progress tracker for building the app.
- [Real-World Project Guide](./docs/real_world_job_portal_guide.md): The ultimate blueprint for building this enterprise job portal from scratch.

## 🛠️ Technology Stack

| Frontend | Backend | Database | Tools & Others |
|----------|---------|----------|----------------|
| React.js (Vite) | Node.js | MongoDB | Git & GitHub |
| Tailwind CSS | Express.js | Mongoose | Cloudinary |
| Shadcn UI | JWT | | Nodemon |
| Redux Toolkit | Bcrypt | | Framer Motion |

## 🚀 Getting Started

To run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/HimanshuPaswan-2004/MERN-Job-Portal.git
cd MERN-Job-Portal
```

### 2. Setup the Backend
Navigate to the `backend` directory and install dependencies:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and add your MongoDB connection string, JWT Secret, and Cloudinary keys:
```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Setup the Frontend
Open a new terminal window, navigate to the `frontend` directory, and install dependencies:
```bash
cd frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```

### 4. Open the App
Visit `http://localhost:5173` in your browser.

---
*Built with ❤️ and the MERN Stack.*
