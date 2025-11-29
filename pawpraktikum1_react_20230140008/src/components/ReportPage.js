import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReportPage = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        // Pastikan PORT 3000
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
                <td className="py-3 px-4 text-center">
                  {/* LOGIKA TOMBOL LIVE MAP */}
                  {report.latitude && report.longitude ? (
                    <a 
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
    </div>
  );
};

export default ReportPage;