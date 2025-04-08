import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './auth';
import { Login } from './Login';
import FreeTaxFilerDashboard from './components/organizations/FreeTaxFilerDashboard';
import OnlineTaxFilerDashboard from './components/organizations/OnlineTaxFilerDashboard';
import USeTaxFilerDashboard from './components/organizations/USeTaxFilerDashboard';
import AIUSTaxDashboard from './components/organizations/AIUSTaxDashboard';
import TestComponents from './components/TestComponents';

function App() {
  const { user } = useAuth();

  // Special test route that bypasses authentication
  if (window.location.pathname === '/test') {
    return (
      <>
        <ToastContainer />
        <TestComponents />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <ToastContainer />
        <Login />
      </>
    );
  }

  // Get selected organization from localStorage
  const selectedOrg = localStorage.getItem('selectedOrganization');
  if (!selectedOrg) {
    return <Navigate to="/" replace />;
  }

  const org = JSON.parse(selectedOrg);
  
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Navigate to={`/${org.slug}`} replace />} />
        <Route path="/free-tax-filer" element={<FreeTaxFilerDashboard />} />
        <Route path="/online-tax-filer" element={<OnlineTaxFilerDashboard />} />
        <Route path="/use-tax-filer" element={<USeTaxFilerDashboard />} />
        <Route path="/aius-tax" element={<AIUSTaxDashboard />} />
        <Route path="/test" element={<TestComponents />} />
        <Route path="*" element={<Navigate to={`/${org.slug}`} replace />} />
      </Routes>
    </>
  );
}

export default App;