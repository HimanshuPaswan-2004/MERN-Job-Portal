import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import CandidateDashboard from './pages/CandidateDashboard';
import CandidateProfile from './pages/CandidateProfile';
import RecruiterDashboard from './pages/RecruiterDashboard';
import MyCompanies from './pages/MyCompanies';
import CompanyForm from './pages/CompanyForm';
import MyJobs from './pages/MyJobs';
import JobForm from './pages/JobForm';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Dummy components for now
import { Home as HomeIcon, Search, FileText, User as UserIcon, FileCode, Bookmark, Bell, Settings, LogOut, Briefcase } from 'lucide-react';

const SidebarItem = ({ icon, label, to, isActive }) => (
  <Link to={to || "#"} className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors ${isActive ? 'bg-orange-50 text-brand-600 font-bold' : 'text-gray-600 font-medium hover:bg-gray-50 hover:text-brand-600'}`}>
    {icon}
    <span>{label}</span>
  </Link>
);

const CandidateLayout = ({ children }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  
  return (
  <div className="flex min-h-screen bg-[#fcf9f2]">
    {/* Sidebar */}
    <aside className="w-64 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col fixed h-full z-10 pt-20">
      <div className="p-4 flex-grow overflow-y-auto">
        <SidebarItem icon={<HomeIcon size={20}/>} label="Dashboard" to="/candidate/dashboard" isActive={isActive('/candidate/dashboard') || isActive('/candidates/dashboard')} />
        <SidebarItem icon={<Search size={20}/>} label="Browse Jobs" to="/jobs" isActive={isActive('/jobs')} />
        <SidebarItem icon={<FileText size={20}/>} label="My Applications" to="#" isActive={isActive('/candidate/applications')} />
        <SidebarItem icon={<UserIcon size={20}/>} label="My Profile" to="/candidate/profile" isActive={isActive('/candidate/profile')} />
        <SidebarItem icon={<FileCode size={20}/>} label="Resume" />
        <SidebarItem icon={<Bookmark size={20}/>} label="Saved Jobs" />
        <SidebarItem icon={<Bell size={20}/>} label="Job Alerts" />
        
        <div className="mt-8 mb-4 px-4 bg-orange-50 rounded-2xl p-4 text-center border border-orange-100">
           <div className="w-10 h-10 bg-brand-100 text-brand-600 flex items-center justify-center rounded-full mx-auto mb-3"><Briefcase size={20}/></div>
           <h4 className="font-bold text-gray-900 text-sm mb-1">Get noticed by top companies</h4>
           <p className="text-xs text-gray-500 mb-3">Complete your profile and increase your chances of getting hired.</p>
           <button className="w-full bg-brand-600 text-white font-bold text-xs py-2 rounded-lg">Complete Profile &rarr;</button>
        </div>
      </div>
      <div className="p-4 border-t border-gray-100">
        <SidebarItem icon={<Settings size={20}/>} label="Settings" />
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 font-medium hover:bg-red-50 hover:text-red-600 transition-colors">
          <LogOut size={20}/>
          <span>Logout</span>
        </button>
      </div>
    </aside>
    {/* Main Content Area */}
    <main className="flex-1 ml-64 p-6 pt-24 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </main>
  </div>
  );
};

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
          <Route path="/jobs/:id" element={<JobDetails />} />
          
          {/* Auth routes without MainLayout (they are full screen themselves) */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          
          {/* Candidate Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
            <Route path="/candidate/dashboard" element={<CandidateLayout><CandidateDashboard /></CandidateLayout>} />
            <Route path="/candidates/dashboard" element={<CandidateLayout><CandidateDashboard /></CandidateLayout>} />
            <Route path="/candidate/profile" element={<CandidateLayout><CandidateProfile /></CandidateLayout>} />
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
