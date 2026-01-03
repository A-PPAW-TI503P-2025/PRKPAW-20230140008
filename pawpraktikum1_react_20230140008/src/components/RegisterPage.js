import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('mahasiswa'); 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null); setSuccess(null); setLoading(true);

    if (password.length < 8) {
      setError('Password harus minimal 8 karakter.'); setLoading(false); return;
    }

    try {
      // PERBAIKAN: Port 3000
      await axios.post('http://localhost:3001/api/auth/register', {
        name: name,
        email: email,
        password: password,
        role: role
      });

      setSuccess('Pendaftaran berhasil! Mengarahkan ke Login...');
      setTimeout(() => { navigate('/login'); }, 2000); 
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Pendaftaran gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        <h2 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Buat Akun Baru
        </h2>
        {success && <p className="text-green-700 bg-green-100 p-2 rounded mb-4 text-center">{success}</p>}
        {error && <p className="text-red-600 bg-red-50 p-2 rounded mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Peran:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} required className="w-full px-4 py-3 border rounded-lg">
              <option value="mahasiswa">Mahasiswa</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 border rounded-lg" />
          </div>
          <button type="submit" disabled={loading} className={`w-full py-3 px-4 font-bold text-white rounded-lg shadow-lg ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}>
            {loading ? 'Mendaftarkan...' : 'Daftar'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Sudah punya akun? <Link to="/login" className="font-bold text-blue-600 hover:underline">Login di sini</Link></p>
        </div>
      </div>
    </div>
  );
}
export default RegisterPage;