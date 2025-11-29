import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      const parsedUser = JSON.parse(decodedPayload);
      
      setUser(parsedUser); 

    } catch (error) {
      console.error('Token rusak atau tidak valid:', error);
      handleLogout();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border">
        
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          Dashboard
        </h2>
        
        {/* PERBAIKAN: Gunakan user.nama (bukan user.name) */}
        <p className="text-center text-gray-600 mb-6">
          Selamat datang kembali, <span className="font-bold">{user.nama || user.email}</span>!
        </p>

        <hr className="my-6" />

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-700">Info Akun Anda:</h3>
          {/* PERBAIKAN: Gunakan user.nama */}
          <p className="text-gray-600">
            <strong>Nama:</strong> {user.nama}
          </p>
          <p className="text-gray-600">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-gray-600">
            <strong>Role:</strong> <span className="capitalize font-medium">{user.role}</span>
          </p>
          <p className="text-gray-600">
            <strong>User ID:</strong> {user.id}
          </p>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full py-2 px-4 mt-8 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
        
      </div>
    </div>
  );
}

export default DashboardPage;