# IPB Bike Center (Next + Clerk + Shadcn)

---

## Tech Stack yang kami gunakan

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: on progress
- **Authentication/User Management**: [Clerk](https://clerk.com)
- **CSS Framework**: [TailwindCSS](https://tailwindcss.com/)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/)
- **Cloud Deployment**: [Vercel](https://vercel.com/)
- **Document Generation**: on progress
- **Graph Visualization**: [ApexCharts](https://apexcharts.com/)

---

## Getting Started

Pertama, clone/salin repositori nya:

```bash
git clone https://github.com/raihanpka/ipb-bike-center.git
cd ipb-bike-center
```

Lalu, Install dependencies nya:

```bash
npm install
# atau
yarn
```

## Setup Environment Variables

1. Go to [Clerk](https://clerk.com)
2. Create a new project
3. Enable **Authentication** (Email/Password or other provider)
4. Copy your Clerk API keys and paste them into a `.env.local` file:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
```

Setelah terisi, untuk memulai server untuk development jalankan:

```bash
npm run dev
```

Aplikasi ini akan berjalan pada [http://localhost:3000](http://localhost:3000) secara lokal

---

## Kontribusi

1. Fork repositori ini
2. Buat branch baru:
   ```bash
   git checkout -b feat/nama-fitur
   ```
3. Modifikasi sesuai perubahan yang kamu inginkan ✨
4. Commit lalu push:
   ```bash
   git commit -m "Add your feature"
   git push origin feat/nama-fitur
   ```
5. Ajukan Pull Request ✅

---

## Lisensi

MIT License. Feel free to fork and build your own ✌️

---

Dibuat oleh Kelompok 1
