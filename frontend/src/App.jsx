import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Dummy components for now
const CandidateDashboard = () => <div className="text-center mt-10 text-xl">Candidate Dashboard</div>;

const MainLayout = ({ children }) => (
  <div className="container mx-auto px-4 py-8">
    {children}
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Wrap other routes in MainLayout for padding/container */}
            <Route path="/signup" element={<MainLayout><Signup /></MainLayout>} />
            <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
            
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
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
