# 🧾 Tugas 3 – Routing & Middleware Express.js

## 📍 POST `/api/presensi/check-in`

### ✅ **Kondisi Sukses**
**Request:**
```http
POST http://localhost:3001/api/presensi/check-in
```

**Body:** *(kosong)*

**Response:**
```json
{
  "message": "Halo User Karyawan, check-in berhasil pukul 08:15:34 WIB",
  "data": {
    "userId": 123,
    "nama": "User Karyawan",
    "checkIn": "2025-10-18 08:15:34+07:00",
    "checkOut": null
  }
}
```

---

## 📍 POST `/api/presensi/check-in` (jika dilakukan lebih dari 1 kali)

### ⚠️ **Kondisi Error**
**Request:**
```http
POST http://localhost:3001/api/presensi/check-in
```

**Response:**
```json
{
  "message": "Anda sudah melakukan check-in hari ini."
}
```

**Status:** `400 Bad Request`

---

## 📍 POST `/api/presensi/check-out`

### ✅ **Kondisi Sukses**
**Request:**
```http
POST http://localhost:3001/api/presensi/check-out
```

**Body:** *(kosong)*

**Response:**
```json
{
  "message": "Selamat jalan User Karyawan, check-out berhasil pukul 17:01:55 WIB",
  "data": {
    "userId": 123,
    "nama": "User Karyawan",
    "checkIn": "2025-10-18 08:15:34+07:00",
    "checkOut": "2025-10-18 17:01:55+07:00"
  }
}
```

---

## 📍 POST `/api/presensi/check-out` (jika belum pernah check-in)

### ⚠️ **Kondisi Error**
**Request:**
```http
POST http://localhost:3001/api/presensi/check-out
```

**Response:**
```json
{
  "message": "Tidak ditemukan catatan check-in yang aktif untuk Anda."
}
```

**Status:** `404 Not Found`

---

## 📍 GET `/api/reports/daily`

### ❌ **Jika role bukan admin**
**Request:**
```http
GET http://localhost:3001/api/reports/daily
```

**Response:**
```json
{
  "message": "Akses ditolak: Hanya untuk admin"
}
```

**Status:** `403 Forbidden`

---

### ✅ **Jika role diubah menjadi admin**
> Edit file `permissionMiddleware.js` → ubah `role: 'karyawan'` menjadi `role: 'admin'`.

**Response:**
```json
{
  "reportDate": "19/10/2025",
  "data": [
    {
      "userId": 123,
      "nama": "User Karyawan",
      "checkIn": "2025-10-18T08:15:34.000Z",
      "checkOut": "2025-10-18T17:01:55.000Z"
    }
  ]
}
```

---

## ⚙️ **Catatan**
- Endpoint `/api/presensi/check-in` dan `/api/presensi/check-out` **tidak memerlukan body**, karena data user disimulasikan melalui middleware.
- Endpoint `/api/reports/daily` hanya bisa diakses oleh user dengan `role: admin`.
