import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './auth';
import { Login } from './Login';
import FreeTaxFilerDashboard from './components/organizations/FreeTaxFilerDashboard';
import OnlineTaxFilerDashboard from './components/organizations/OnlineTaxFilerDashboard';
import USeTaxFilerDashboard from './components/organizations/USeTaxFilerDashboard';
import AIUSTaxDashboard from './components/organizations/AIUSTaxDashboard';

function App() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/free-tax-filer" element={<FreeTaxFilerDashboard />} />
        <Route path="/online-tax-filer" element={<OnlineTaxFilerDashboard />} />
        <Route path="/use-tax-filer" element={<USeTaxFilerDashboard />} />
        <Route path="/aius-tax" element={<AIUSTaxDashboard />} />
        <Route path="/" element={<Navigate to="/free-tax-filer" replace />} />
        <Route path="*" element={<Navigate to="/free-tax-filer" replace />} />
      </Routes>
    </Router>
  );
}

export default App;