import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const MainNavbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* --- LOGO --- */}
        <Link to="/" className="text-white text-xl font-bold hover:text-blue-100 transition">
          Aplikasi Presensi
        </Link>

        {/* --- MENU TENGAH (Dashboard | Presensi | Laporan) --- */}
        <div className="hidden md:flex items-center space-x-8">
          
          <Link to="/dashboard" className="text-white hover:text-blue-200 font-medium transition text-lg">
            Dashboard
          </Link>
          
          <Link to="/presensi" className="text-white hover:text-blue-200 font-medium transition text-lg">
            Presensi
          </Link>

          {/* Menu ini otomatis muncul di sebelah kanan 'Presensi' jika user adalah Admin */}
          {user && user.role === "admin" && (
            <Link to="/reports" className="text-white hover:text-blue-200 font-medium transition text-lg">
              Laporan Admin
            </Link>
          )}

        </div>

        {/* --- BAGIAN KANAN (User / Logout) --- */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-white hidden sm:block">
                Halo, <span className="font-bold">{user.nama}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow transition duration-200"
            >
              Login
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
};

export default MainNavbar;