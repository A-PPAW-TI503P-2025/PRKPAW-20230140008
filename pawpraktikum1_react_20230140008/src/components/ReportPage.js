import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReportPage = () => {
  const [reports, setReports] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // State untuk Popup Foto

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        // Pastikan PORT 3000 sesuai backend
        const response = await axios.get('http://localhost:3000/api/presensi/report', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setReports(response.data.data);
      } catch (error) {
        console.error("Gagal ambil data:", error);
      }
    };
    fetchReports();
  }, []);

  // Helper: Membersihkan path gambar (mengubah backslash Windows '\' jadi slash '/')
  const getImageUrl = (path) => {
    if (!path) return null;
    const cleanPath = path.replace(/\\/g, '/');
    return `http://localhost:3000/${cleanPath}`;
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Laporan Presensi Admin</h2>
      
      <div className="overflow-hidden shadow-xl rounded-lg border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left font-semibold">No</th>
              <th className="py-3 px-4 text-left font-semibold">Nama</th>
              <th className="py-3 px-4 text-left font-semibold">Check-In</th>
              <th className="py-3 px-4 text-left font-semibold">Check-Out</th>
              {/* Kolom Baru: Bukti Foto */}
              <th className="py-3 px-4 text-center font-semibold">Bukti Foto</th>
              <th className="py-3 px-4 text-center font-semibold">Live Map</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reports.map((report, index) => (
              <tr key={report.id} className="hover:bg-blue-50 transition duration-150">
                <td className="py-3 px-4 text-gray-700">{index + 1}</td>
                
                <td className="py-3 px-4 font-medium text-gray-900">
                  {report.User ? report.User.nama : 'User dihapus'}
                </td>
                
                <td className="py-3 px-4 text-gray-600">
                  {new Date(report.checkIn).toLocaleString('id-ID')}
                </td>
                
                <td className="py-3 px-4 text-gray-600">
                  {report.checkOut ? new Date(report.checkOut).toLocaleString('id-ID') : '-'}
                </td>

                {/* --- KOLOM FOTO --- */}
                <td className="py-3 px-4 text-center">
                  {report.buktiFoto ? (
                    <img 
                      src={getImageUrl(report.buktiFoto)} 
                      alt="Bukti" 
                      className="w-12 h-12 object-cover rounded border border-gray-300 cursor-pointer mx-auto hover:scale-110 transition"
                      onClick={() => setSelectedImage(getImageUrl(report.buktiFoto))}
                    />
                  ) : (
                    <span className="text-xs text-gray-400 italic">No Photo</span>
                  )}
                </td>

                {/* --- KOLOM PETA --- */}
                <td className="py-3 px-4 text-center">
                  {report.latitude && report.longitude ? (
                    <a 
                      // Link Google Maps Standar
                      href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-1 px-3 rounded shadow transition"
                    >
                      📍 Lihat Peta
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400 italic border border-gray-200 px-2 py-1 rounded">
                      Lokasi Kosong
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL POPUP UNTUK FOTO FULL SCREEN --- */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)} // Klik background untuk tutup
        >
          <div className="relative max-w-3xl w-full bg-white p-2 rounded-lg">
            <button 
              className="absolute -top-10 right-0 text-white text-3xl font-bold hover:text-red-500"
              onClick={() => setSelectedImage(null)}
            >
              &times; Tutup
            </button>
            <img 
                src={selectedImage} 
                alt="Full Size Bukti" 
                className="w-full h-auto rounded-lg shadow-2xl" 
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default ReportPage;