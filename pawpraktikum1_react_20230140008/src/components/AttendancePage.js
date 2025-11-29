import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const PresensiPage = () => {
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setCoords({ lat: position.coords.latitude, lng: position.coords.longitude }),
        (error) => setStatus("Gagal lokasi: " + error.message)
      );
    } else { setStatus("Geolocation tidak didukung."); }
  }, []);

  const handleCheckIn = async () => {
    if (!coords) return alert("Lokasi belum ada.");
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // PERBAIKAN: Port 3000
      await axios.post('http://localhost:3000/api/presensi/check-in', 
        { latitude: coords.lat, longitude: coords.lng }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus("Check-in berhasil!");
    } catch (error) { setStatus("Check-in gagal: " + (error.response?.data?.message || error.message)); }
    finally { setLoading(false); }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // PERBAIKAN: Port 3000
      await axios.post('http://localhost:3000/api/presensi/check-out', {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus("Check-out berhasil!");
    } catch (error) { setStatus("Check-out gagal: " + (error.response?.data?.message || error.message)); }
    finally { setLoading(false); }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Halaman Presensi</h2>
      {status && <div className={`p-4 mb-4 rounded-md ${status.includes('berhasil') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{status}</div>}

      {coords ? (
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg mb-6 h-80">
          <MapContainer center={[coords.lat, coords.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
            <Marker position={[coords.lat, coords.lng]}><Popup>Lokasi Kamu</Popup></Marker>
          </MapContainer>
        </div>
      ) : <div className="bg-yellow-100 p-4 rounded mb-6">Sedang mengambil lokasi...</div>}

      <div className="flex gap-4">
        <button onClick={handleCheckIn} disabled={loading || !coords}
          className={`flex-1 py-3 rounded-lg font-bold text-white shadow-md transition ${loading || !coords ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
          ✅ Check-In
        </button>
        <button onClick={handleCheckOut} disabled={loading}
          className={`flex-1 py-3 rounded-lg font-bold text-white shadow-md transition ${loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'}`}>
          ❌ Check-Out
        </button>
      </div>
    </div>
  );
};
export default PresensiPage;