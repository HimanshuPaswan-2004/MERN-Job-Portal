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

// Dummy components for now
const CandidateDashboard = () => <div className="text-center mt-10 text-xl">Candidate Dashboard</div>;
const Home = () => <div className="text-center text-2xl mt-10">Welcome to JobPortal</div>;

const Navigation = () => {
  const { user, logout } = useAuth();
  
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">JobPortal</Link>
      <nav className="space-x-4">
        {user ? (
          <>
            <span className="text-gray-600">Hello, {user.name}</span>
            <button onClick={logout} className="text-red-500 hover:underline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
            <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            
            {/* Candidate Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
              <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
            </Route>
            
            {/* Recruiter Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
              <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
              <Route path="/recruiter/companies" element={<MyCompanies />} />
              <Route path="/recruiter/companies/new" element={<CompanyForm />} />
              <Route path="/recruiter/companies/:id/edit" element={<CompanyForm />} />
              <Route path="/recruiter/jobs" element={<MyJobs />} />
              <Route path="/recruiter/jobs/new" element={<JobForm />} />
              <Route path="/recruiter/jobs/:id/edit" element={<JobForm />} />
            </Route>
          </Routes>
        </main>
        
        <footer className="bg-gray-800 text-white text-center p-4">
          &copy; 2026 JobPortal
        </footer>
      </div>
    </Router>
  );
}

export default App;
