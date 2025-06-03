# 🚲 IPB Bike Center

https://github.com/raihanpka/ipb-bike-center/assets/88744379-314d-481e-90e0-948c4d124697

https://github.com/raihanpka/ipb-bike-center/assets/1375fabc-43e2-4ef8-b43c-594d40eef6fc

---

## 📌 Diagram

```mermaid
classDiagram
    %% === ENTITAS UTAMA ===
    class User {
        +String id
        +String nama
        +String email
        +String nomorTelepon
        +String role
        +String createdAt
        +String updatedAt
        +Boolean deleted
        +login()
        +logout()
        +updateProfile()
        +lihatRiwayatPeminjaman()
        +scanQR()
    }

    class DataSepeda {
        +String nomorSeri
        +String merk
        +String jenis
        +String status
        +String tanggalPerawatanTerakhir
        +String deskripsi
        +updateStatus()
        +perawatan()
        +tambahSepeda()
        +editSepeda()
        +hapusSepeda()
    }

    class StatusPeminjaman {
        +Number id
        +String nama
        +String createdAt
        +String updatedAt
    }

    class Peminjaman {
        +String id
        +String userId
        +String nomorSeriSepeda
        +String tanggalPeminjaman
        +String jangkaPeminjaman
        +String tanggalPengembalian
        +Number statusId
        +String nomorTeleponAktif
        +String fotoPeminjam
        +String fotoKTM
        +String suratPeminjaman
        +Boolean notifikasiTerkirim
        +String createdAt
        +String updatedAt
        +ajukan()
        +approve()
        +tolak()
        +selesai()
        +batalkan()
        +prosesPengembalian()
        +cekKeterlambatan()
    }

    class EmailKeterlambatan {
        +kirimEmailKeterlambatanByServer()
        +formatTanggal()
        +hitungKeterlambatan()
    }

    class DashboardLaporan {
        +generateStatistik()
        +filterLaporan()
        +lihatDetailLaporan()
    }

    %% === FLOW UTAMA ===
    class FormPeminjamanUser {
        +ajukanPeminjaman()
        +uploadBerkas()
        +validasiInput()
        +hitungTanggalPengembalian()
    }

    class CardPeminjamanAdmin {
        +approve()
        +tolak()
        +selesai()
        +cekKeterlambatan()
        +updateStatus()
        +lihatDataUser()
        +lihatDetailPeminjaman()
        +downloadSurat()
    }

    class CardRiwayatPeminjamanUser {
        +batalkan()
        +prosesPengembalian()
        +scanQR()
        +lihatDetail()
        +uploadBukti()
    }

    %% === RELASI DATA ===
    User "1" -- "*" Peminjaman : memiliki
    DataSepeda "1" -- "*" Peminjaman : dipinjam
    StatusPeminjaman "1" -- "*" Peminjaman : status

    %% === FLOW/PROSES ===
    FormPeminjamanUser ..> Peminjaman : ajukan()
    FormPeminjamanUser ..> DataSepeda : updateStatus('Dipinjam')
    FormPeminjamanUser ..> User : uploadBerkas()
    CardPeminjamanAdmin ..> Peminjaman : approve()/tolak()/selesai()
    CardPeminjamanAdmin ..> DataSepeda : updateStatus('Tersedia'/'Dipinjam')
    CardPeminjamanAdmin ..> User : lihatDataUser()
    CardPeminjamanAdmin ..> EmailKeterlambatan : kirimEmailKeterlambatanByServer()
    CardPeminjamanAdmin ..> DashboardLaporan : generateStatistik()
        
    CardRiwayatPeminjamanUser ..> Peminjaman : batalkan()/prosesPengembalian()
    CardRiwayatPeminjamanUser ..> DataSepeda : updateStatus('Tersedia')
    CardRiwayatPeminjamanUser ..> User : scanQR()

    %% === NOTIFIKASI/EMAIL ===
    Peminjaman ..> EmailKeterlambatan : triggerKeterlambatan()
    EmailKeterlambatan ..> User : kirimEmail()
```

---

## ✨ Fitur Utama

- Layanan Peminjaman & Pengembalian Sepeda (✅)
- Autentikasi & Manajemen Akun Pengguna (✅)
- Dashboard Admin dan Pengguna (✅)
- Manajemen Data Sepeda bagi Admin (✅)
- Laporan Peminjaman & Generate Dokumen PDF bagi Admin (✅)
- Notifikasi Keterlambatan Pengembalian Sepeda via Email (✅)
- Fitur Tiket untuk Melaporkan Masalah pada Sepeda (🟡)

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [Supabase](https://supabase.com)
- **Authentication**: [Clerk](https://clerk.com)
- **CSS Framework**: [TailwindCSS](https://tailwindcss.com/)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/)
- **Cloud Deployment**: [Vercel](https://vercel.com/)
- **Document Generation**: [jsPDF](https://www.npmjs.com/package/jspdf) & [jsPDF-autotable](https://www.npmjs.com/package/jspdf-autotable)
- **Email API**: [Resend](https://resend.com)

---

## 🚀 Getting Started

### 1. Clone repositori

```bash
git clone https://github.com/raihanpka/ipb-bike-center.git
cd ipb-bike-center
```

### 2. Install dependencies

```bash
pnpm install
# atau
npm install
```

### 3. Setup Environment Variables

Salin file `.env.local.example` menjadi `.env.local` lalu isi sesuai kebutuhan.

### 4. Jalankan server development

```bash
npm run dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

---

## 💻 Pengembangan Lokal

1. Clone kode
2. Install dependencies
3. Setup environment variables
4. Jalankan `npm run dev`

---

## 🤝 Kontribusi

1. Fork repositori ini
2. Buat branch baru:
   ```bash
   git checkout -b feat/nama-fitur
   ```
3. Lakukan perubahan yang diinginkan
4. Commit & push:
   ```bash
   git commit -m "Add your feature"
   git push origin feat/nama-fitur
   ```
5. Ajukan Pull Request

---

## 📄 Lisensi

MIT License. Dibuat oleh Kelompok 1 - Paralel 2 ✌️

