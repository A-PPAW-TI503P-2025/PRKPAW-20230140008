import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam'; // Import Webcam [cite: 110]
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Konfigurasi Icon Peta
let DefaultIcon = L.icon({
    iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const PresensiPage = () => {
  // State Lokasi & Status
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // State & Ref untuk Kamera [cite: 115-116]
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);

  // Ambil Lokasi saat komponen dimuat
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setCoords({ lat: position.coords.latitude, lng: position.coords.longitude }),
        (error) => setStatus("Gagal lokasi: " + error.message)
      );
    } else { setStatus("Geolocation tidak didukung."); }
  }, []);

  // --- FUNGSI KAMERA ---
  // Menangkap gambar dari webcam [cite: 117-120]
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  // --- FUNGSI CHECK-IN ---
  const handleCheckIn = async () => {
    // Validasi: Lokasi dan Foto harus ada [cite: 122]
    if (!coords) return alert("Lokasi belum ditemukan!");
    if (!image) return alert("Harap ambil foto selfie terlebih dahulu!");
    
    setLoading(true);
    setStatus("Sedang memproses presensi...");

    try {
      const token = localStorage.getItem('token');

      // 1. Konversi Base64 ke Blob (File object) [cite: 127]
      const blob = await (await fetch(image)).blob();

      // 2. Siapkan FormData untuk dikirim ke Backend [cite: 129-132]
      const formData = new FormData();
      formData.append('latitude', coords.lat);
      formData.append('longitude', coords.lng);
      formData.append('image', blob, 'selfie.jpg'); // Key 'image' sesuai dengan upload.single('image') di backend

      // 3. Kirim ke Server
      await axios.post('http://localhost:3000/api/presensi/check-in', 
        formData, 
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' // Header khusus upload file [cite: 22]
          } 
        }
      );
      setStatus("✅ Check-in berhasil dengan Foto!");
    } catch (error) { 
        console.error(error);
        setStatus("❌ Check-in gagal: " + (error.response?.data?.message || error.message)); 
    } finally { 
        setLoading(false); 
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/api/presensi/check-out', {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus("✅ Check-out berhasil!");
    } catch (error) { setStatus("❌ Check-out gagal: " + (error.response?.data?.message || error.message)); }
    finally { setLoading(false); }
  };

  return (
    <div className="container mx-auto p-6 max-w-xl"> {/* max-w disesuaikan agar rapi di HP */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Presensi Harian</h2>
      
      {/* Notifikasi Status */}
      {status && <div className={`p-4 mb-4 rounded-md text-center font-medium ${status.includes('berhasil') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{status}</div>}

      {/* --- BAGIAN 1: PETA --- */}
      {coords ? (
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg mb-4 h-64">
          <MapContainer center={[coords.lat, coords.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
            <Marker position={[coords.lat, coords.lng]}><Popup>Lokasi Kamu</Popup></Marker>
          </MapContainer>
        </div>
      ) : <div className="bg-yellow-100 p-4 rounded mb-6 text-center">📍 Sedang mencari lokasi...</div>}

      {/* --- BAGIAN 2: KAMERA --- [cite: 146] */}
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-black mb-4 relative h-64 flex justify-center items-center">
        {image ? (
          // Jika sudah ada foto, tampilkan hasil [cite: 148]
          <img src={image} alt="Selfie" className="w-full h-full object-cover" />
        ) : (
          // Jika belum, tampilkan kamera [cite: 150]
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* --- BAGIAN 3: TOMBOL KONTROL --- */}
      <div className="flex flex-col gap-3">
        {/* Tombol Ambil/Ulang Foto [cite: 159-167] */}
        <div className="mb-2">
            {!image ? (
                <button onClick={capture} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow">
                    📸 Ambil Foto
                </button>
            ) : (
                <button onClick={() => setImage(null)} className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded shadow">
                    🔄 Foto Ulang
                </button>
            )}
        </div>

        {/* Tombol Check-In & Check-Out */}
        <div className="flex gap-4">
            <button onClick={handleCheckIn} disabled={loading || !coords || !image}
            className={`flex-1 py-3 rounded-lg font-bold text-white shadow-md transition ${loading || !coords || !image ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>
            ✅ Check-In
            </button>
            
            <button onClick={handleCheckOut} disabled={loading}
            className={`flex-1 py-3 rounded-lg font-bold text-white shadow-md transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}>
            ❌ Check-Out
            </button>
        </div>
      </div>
    </div>
  );
};

export default PresensiPage;