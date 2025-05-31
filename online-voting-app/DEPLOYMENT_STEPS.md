# Langkah-Langkah Deploy Aplikasi Online Voting

Dokumen ini berisi panduan langkah demi langkah untuk melakukan deploy Aplikasi Online Voting menggunakan Firebase Hosting sesuai dengan Pedoman Umum Ejaan Indonesia (PUEI).

---

## Persiapan

- Akun Google
- Node.js dan npm sudah terpasang di komputer Anda
- Pemahaman dasar penggunaan command line (CLI)

---

## Langkah 1: Membuat Proyek Firebase

1. Buka [Firebase Console](https://console.firebase.google.com/).
2. Klik **Tambahkan proyek**.
3. Masukkan nama proyek (misalnya, `online-voting-app`).
4. Ikuti petunjuk untuk membuat proyek. Anda dapat menonaktifkan Google Analytics jika diinginkan.
5. Setelah proyek dibuat, Anda akan diarahkan ke dashboard proyek.

---

## Langkah 2: Mengonfigurasi Layanan Firebase

1. Di Firebase Console, buka menu **Build > Authentication**.
2. Klik **Mulai** dan aktifkan metode masuk **Email/Password**.
3. Setelah diaktifkan, klik **Users** dan kemudian klik **Add User**.
4. Buat akun admin dengan mengisi:
   - Email: (email admin Anda)
   - Password: (password yang kuat)
   - Simpan kredensial ini dengan aman karena akan digunakan untuk login ke aplikasi.
5. Buka menu **Build > Firestore Database**.
6. Klik **Buat database** dan pilih mode produksi atau pengujian sesuai kebutuhan.
7. Atur aturan dan indeks Firestore yang diperlukan aplikasi Anda.

**Catatan Penting**: Pastikan untuk membuat akun admin sebelum melakukan deploy aplikasi, karena ini akan menjadi satu-satunya cara untuk mengakses dashboard admin.

---

## Langkah 3: Mendapatkan Konfigurasi Firebase

1. Di Firebase Console, buka **Pengaturan proyek** (ikon roda gigi di samping Overview Proyek).
2. Gulir ke bagian **Aplikasi Anda**.
3. Jika belum menambahkan aplikasi web, klik **Tambahkan aplikasi** dan pilih **Web**.
4. Daftarkan aplikasi dengan nama (misalnya, `online-voting-web`).
5. Firebase akan menampilkan objek konfigurasi yang berisi kunci seperti `apiKey`, `authDomain`, `projectId`, dan lain-lain.
6. Salin konfigurasi tersebut.

---

## Langkah 4: Memperbarui `firebase-config.js`

1. Buka file `firebase-config.js` di proyek Anda.
2. Ganti nilai placeholder pada objek `firebaseConfig` dengan nilai asli dari Firebase Console.

Contoh:

```js
const firebaseConfig = {
    apiKey: "API_KEY_ASLI_ANDA",
    authDomain: "AUTH_DOMAIN_ASLI_ANDA",
    projectId: "PROJECT_ID_ASLI_ANDA",
    storageBucket: "STORAGE_BUCKET_ASLI_ANDA",
    messagingSenderId: "MESSAGING_SENDER_ID_ASLI_ANDA",
    appId: "APP_ID_ASLI_ANDA"
};
```

---

## Langkah 5: Menginstal Firebase CLI

1. Buka terminal atau command prompt.
2. Pasang Firebase CLI secara global dengan perintah:

```bash
npm install -g firebase-tools
```

3. Pastikan instalasi berhasil dengan menjalankan:

```bash
firebase --version
```

---

## Langkah 6: Menginisialisasi Firebase Hosting

1. Di terminal, masuk ke direktori proyek Anda (tempat `index.html` berada):

```bash
cd path/to/online-voting-app
```

2. Login ke Firebase:

```bash
firebase login
```

3. Inisialisasi Firebase di proyek Anda:

```bash
firebase init
```

4. Saat proses inisialisasi:
   - Pilih **Hosting** dengan menekan spasi lalu Enter.
   - Pilih proyek Firebase yang sudah Anda buat.
   - Atur direktori publik ke `.` (direktori saat ini).
   - Pilih **Tidak** untuk konfigurasi sebagai aplikasi satu halaman (kecuali aplikasi Anda membutuhkannya).
   - Pilih **Tidak** untuk menimpa `index.html` jika diminta.

---

## Langkah 7: Melakukan Deploy Aplikasi

1. Jalankan perintah berikut untuk melakukan deploy aplikasi ke Firebase Hosting:

```bash
firebase deploy
```

2. Setelah deploy selesai, Firebase akan memberikan URL hosting tempat aplikasi Anda dapat diakses.

---

## Langkah 8: Memeriksa Hasil Deploy

1. Buka URL hosting yang diberikan di browser.
2. Uji fungsi aplikasi untuk memastikan semuanya berjalan dengan baik.

---

## Catatan Tambahan

- Setiap kali Anda melakukan perubahan pada aplikasi, jalankan kembali `firebase deploy` untuk memperbarui situs.
- Pastikan aturan Firestore dan pengaturan Authentication sudah sesuai untuk penggunaan produksi.
- Untuk fitur Firebase Hosting yang lebih lanjut, kunjungi [dokumentasi Firebase Hosting](https://firebase.google.com/docs/hosting).

---

Panduan ini menyelesaikan proses deploy aplikasi Online Voting.
