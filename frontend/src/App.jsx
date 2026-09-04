import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import RecruiterDashboard from './pages/RecruiterDashboard';
import MyCompanies from './pages/MyCompanies';
import CompanyForm from './pages/CompanyForm';
import MyJobs from './pages/MyJobs';
import JobForm from './pages/JobForm';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Dummy components for now
const CandidateDashboard = () => <div className="text-center mt-10 text-xl">Candidate Dashboard</div>;

const MainLayout = ({ children }) => (
  <div className="container mx-auto px-4 py-8">
    {children}
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!isAuthPage && <Navbar />}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          
          {/* Auth routes without MainLayout (they are full screen themselves) */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          
          {/* Candidate Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
            <Route path="/candidate/dashboard" element={<MainLayout><CandidateDashboard /></MainLayout>} />
          </Route>
          
          {/* Recruiter Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
            <Route path="/recruiter/dashboard" element={<MainLayout><RecruiterDashboard /></MainLayout>} />
            <Route path="/recruiter/companies" element={<MainLayout><MyCompanies /></MainLayout>} />
            <Route path="/recruiter/companies/new" element={<MainLayout><CompanyForm /></MainLayout>} />
            <Route path="/recruiter/companies/:id/edit" element={<MainLayout><CompanyForm /></MainLayout>} />
            <Route path="/recruiter/jobs" element={<MainLayout><MyJobs /></MainLayout>} />
            <Route path="/recruiter/jobs/new" element={<MainLayout><JobForm /></MainLayout>} />
            <Route path="/recruiter/jobs/:id/edit" element={<MainLayout><JobForm /></MainLayout>} />
          </Route>
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
