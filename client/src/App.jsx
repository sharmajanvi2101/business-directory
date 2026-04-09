import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddBusiness from './pages/AddBusiness';
import Profile from './pages/Profile';
import Search from './pages/Search';
import BusinessDetail from './pages/BusinessDetail';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Footer from './components/Footer';
import SubAdminDashboard from './pages/SubAdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import Favorites from './pages/Favorites';
import About from './pages/About';
import OwnerDashboard from './pages/OwnerDashboard';
import BusinessWebsite from './pages/BusinessWebsite';
import LandingPageBuilder from './pages/LandingPageBuilder';
import ScrollToTop from './components/ScrollToTop';
import Compare from './pages/Compare';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Security from './pages/Security';
import TermsOfService from './pages/TermsOfService';

// Placeholder Pages
const Placeholder = ({ title }) => (
  <div className="pt-32 min-h-screen flex flex-col items-center justify-center p-4">
    <h1 className="text-3xl font-bold mb-4">{title}</h1>
    <p className="text-gray-500">This page is currently under development.</p>
  </div>
);

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/add-business" element={<AddBusiness />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/security" element={<Security />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/search" element={<Search />} />
        <Route path="/compare" element={<Compare />} />

        {/* Public only routes (redirect to home if logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Private routes (redirect to login if not logged in) */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/business/:id" element={<BusinessDetail />} />
          <Route path="/business/builder/:id" element={<LandingPageBuilder />} />
          <Route path="/dashboard" element={<Placeholder title="Business Dashboard" />} />
        </Route>

        <Route path="/b/:slug" element={<BusinessWebsite />} />
        <Route path="/store/:slug" element={<BusinessWebsite />} />
        {/* Master Admin restricted route */}
        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<SuperAdminDashboard />} />
        </Route>

        {/* Sub-Admin restricted route */}
        <Route element={<PrivateRoute allowedRoles={['admin', 'subadmin']} />}>
          <Route path="/subadmin" element={<SubAdminDashboard />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function AppContent() {
  const location = useLocation();
  const isDashboard = ['/admin', '/subadmin', '/owner/dashboard'].some(path => location.pathname.startsWith(path));
  const isMiniSite = ['/b/', '/store/'].some(path => location.pathname.startsWith(path));

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <ScrollToTop />
      {!isMiniSite && <Navbar />}
      <main className="flex-grow pt-0">
        <AnimatedRoutes />
      </main>
      {!isMiniSite && !isDashboard && <Footer />}
      <Toaster position="bottom-right" />
    </div>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </Router>
  );
}

export default App;
