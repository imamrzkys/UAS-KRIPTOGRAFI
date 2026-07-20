# 🔐 CryptoFlow — Simulator Kriptografi Simetris Terpadu

> **Tugas UAS Mata Kuliah Kriptografi — Semester 6**  
> Imam Rizki Saputra · 301230013 · Teknik Informatika UNIBBA · 2026

---

## 📌 Deskripsi

**CryptoFlow** adalah aplikasi web simulator kriptografi simetris terpadu yang menggabungkan 4 algoritma:

| Modul | Algoritma | Blok | Kunci | Rounds |
|-------|-----------|------|-------|--------|
| DES | Data Encryption Standard | 64-bit | 64-bit | 16 Feistel |
| S-DES | Simplified DES | 8-bit | 10-bit | 2 Feistel |
| AES-128 | Advanced Encryption Standard | 128-bit | 128-bit | 10 |
| S-AES | Simplified AES | 16-bit | 16-bit | 2 |

Setiap modul dilengkapi **visualisasi step-by-step** dari seluruh proses enkripsi dan dekripsi — mulai dari key schedule, initial permutation, substitusi S-Box, hingga final ciphertext.

---

## 🚀 Demo Live

**[cryptoflow.vercel.app](https://uas-kriptografi.vercel.app)** *(deployed via Vercel)*

---

## 🛠️ Tech Stack

- **React 18** + **Vite 6**
- **Tailwind CSS v3** (neobrutalism pastel theme)
- **React Router v6** (client-side routing)
- **Framer Motion** (page transitions)
- **Lucide React** (icons)

---

## 📁 Struktur Proyek

```
crypto-unified/
├── public/
│   └── favicon.svg          ← Favicon "CF" neobrutalism
├── src/
│   ├── App.jsx              ← Router utama (5 routes)
│   ├── index.css            ← Global neobrutalism CSS + Tailwind
│   ├── pages/
│   │   └── Landing.jsx      ← Halaman utama (4 algorithm cards)
│   ├── components/shared/
│   │   └── Navbar.jsx       ← Shared navbar (landing)
│   └── modules/
│       ├── des/             ← DES simulator (TUGAS 11)
│       ├── sdes/            ← S-DES simulator (TUGAS 12)
│       ├── aes/             ← AES-128 simulator (TUGAS 13)
│       └── saes/            ← S-AES simulator (TUGAS 14)
├── vercel.json              ← Vercel SPA routing config
└── vite.config.js
```

---

## ⚙️ Menjalankan Lokal

```bash
# Clone repo
git clone https://github.com/imamrzkys/UAS-KRIPTOGRAFI.git
cd UAS-KRIPTOGRAFI

# Install dependencies
npm install

# Dev server
npm run dev
# → http://localhost:5173

# Build produksi
npm run build

# Preview build
npm run preview
```

---

## 🎨 Desain

Tema **Neobrutalism Pastel Cerah**:
- Border hitam tebal `4px solid #111111` di semua elemen
- Shadow offset hitam `4px 4px 0px #111111`
- Palet: `#FF8FD8` (pink) · `#5FE3C4` (tosca) · `#FFE156` (kuning) · `#7EC8FF` (biru)
- Font: **Space Grotesk** (display) + **Space Mono** (monospace)

---

## 📋 Catatan

> ⚠️ **Logika algoritma tidak diubah.** Engine DES, S-DES, AES-128, dan S-AES identik dengan proyek asli masing-masing (TUGAS 11–14). Perubahan hanya pada layer UI dan routing.

---

*Dibuat dengan ❤️ oleh Imam Rizki Saputra untuk UAS Kriptografi 2026*
