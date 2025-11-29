import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Komponen yang sudah kamu buat
import MainNavbar from './components/MainNavbar';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import PresensiPage from './components/AttendancePage'; // Perhatikan nama filenya AttendancePage.js
import ReportPage from './components/ReportPage';

function App() {
  return (
    <Router>
      {/* Navbar ditaruh di sini agar muncul di semua halaman */}
      <MainNavbar /> 
      
      <div className="py-4">
        <Routes>
          {/* Route untuk halaman Login & Register */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Route Utama */}
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Route Fitur */}
          <Route path="/presensi" element={<PresensiPage />} />
          <Route path="/reports" element={<ReportPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;