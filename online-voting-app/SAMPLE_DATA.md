# Data Sampel untuk Pengujian Aplikasi

Berikut adalah data sampel yang dapat digunakan untuk menguji fungsi aplikasi pemilihan online.

## 1. Konfigurasi Pemilihan

```javascript
const electionConfig = {
    electionName: "Pemilihan Ketua OSIS 2024",
    institutionName: "SMA Negeri 1 Contoh",
    startDate: "2024-02-01T08:00:00",
    endDate: "2024-02-01T15:00:00",
    schoolLogo: "https://example.com/logo-sekolah.png", // Ganti dengan URL logo sebenarnya
    agencyLogo: "https://example.com/logo-dinas.png"    // Ganti dengan URL logo sebenarnya
}
```

## 2. Data Kandidat

```javascript
const candidates = [
    {
        id: "candidate1",
        name: "Ahmad Rizki",
        class: "XII IPA 1",
        photoUrl: "https://example.com/photo1.jpg", // Ganti dengan URL foto sebenarnya
        visionMission: {
            vision: "Mewujudkan OSIS yang inovatif dan inspiratif",
            missions: [
                "Mengadakan program pengembangan leadership",
                "Meningkatkan kegiatan ekstrakurikuler",
                "Mengembangkan program literasi digital"
            ]
        },
        achievements: [
            "Juara 1 Olimpiade Sains Nasional 2023",
            "Ketua Klub Robotik 2022-2023"
        ]
    },
    {
        id: "candidate2",
        name: "Siti Nurhaliza",
        class: "XI IPS 2",
        photoUrl: "https://example.com/photo2.jpg", // Ganti dengan URL foto sebenarnya
        visionMission: {
            vision: "Membangun OSIS yang kolaboratif dan kreatif",
            missions: [
                "Menyelenggarakan festival seni dan budaya",
                "Membentuk forum diskusi antar kelas",
                "Mengadakan program peduli lingkungan"
            ]
        },
        achievements: [
            "Ketua Klub Jurnalistik 2023",
            "Juara 2 Lomba Debat Tingkat Provinsi"
        ]
    },
    {
        id: "candidate3",
        name: "Budi Santoso",
        class: "XII IPA 3",
        photoUrl: "https://example.com/photo3.jpg", // Ganti dengan URL foto sebenarnya
        visionMission: {
            vision: "Menciptakan lingkungan sekolah yang inklusif",
            missions: [
                "Mengadakan program mentoring akademik",
                "Membuat kegiatan sosial kemasyarakatan",
                "Mengembangkan sistem aspirasi siswa"
            ]
        },
        achievements: [
            "Koordinator PMR 2023",
            "Delegasi Forum Pelajar Nasional 2023"
        ]
    }
]
```

## 3. Data Pemilih

```javascript
const voters = [
    {
        id: "V001",
        name: "Deni Hermawan",
        class: "X IPA 1",
        nisn: "0051234567",
        password: "pass123" // Dalam implementasi nyata, gunakan hash password
    },
    {
        id: "V002",
        name: "Rina Wulandari",
        class: "XI IPS 1",
        nisn: "0051234568",
        password: "pass124"
    },
    {
        id: "V003",
        name: "Fajar Ramadhan",
        class: "XII IPA 2",
        nisn: "0051234569",
        password: "pass125"
    }
]
```

## 4. Data Admin

```javascript
const admins = [
    {
        id: "A001",
        email: "admin@example.com",
        password: "admin123", // Dalam implementasi nyata, gunakan hash password
        name: "Administrator Utama",
        role: "super_admin"
    },
    {
        id: "A002",
        email: "panitia@example.com",
        password: "panitia123",
        name: "Panitia Pemilihan",
        role: "admin"
    }
]
```

## Cara Penggunaan Data Sampel

### 1. Login Admin
- Email: admin@example.com
- Password: admin123

### 2. Login Pemilih
- NISN: 0051234567
- Password: pass123

### 3. Contoh Hasil Pemilihan
```javascript
const sampleResults = {
    totalVoters: 100,
    votesSubmitted: 75,
    candidateResults: [
        {
            candidateId: "candidate1",
            votes: 30,
            percentage: 40
        },
        {
            candidateId: "candidate2",
            votes: 25,
            percentage: 33.33
        },
        {
            candidateId: "candidate3",
            votes: 20,
            percentage: 26.67
        }
    ],
    lastUpdated: "2024-02-01T14:30:00"
}
```

## Catatan Penting

1. Data ini hanya untuk keperluan pengujian
2. Ganti semua password dengan yang lebih aman untuk penggunaan produksi
3. Gunakan URL gambar yang valid untuk logo dan foto kandidat
4. Sesuaikan tanggal pemilihan dengan waktu pengujian Anda

---

Anda dapat menggunakan data sampel ini untuk menguji berbagai fitur aplikasi seperti:
- Login admin dan pemilih
- Menampilkan data kandidat
- Proses pemilihan
- Menampilkan hasil pemilihan
- Validasi waktu pemilihan
