# Ahlan Affiliate

Prototype mobile-first untuk program referral dan partnership Ahlan Les Bahasa Arab. Sistem ini mencatat attribution referral, mengelola pipeline calon peserta, membuat komisi setelah pembayaran, dan menyediakan dashboard affiliate serta simulator ekonomi program.

## Fitur utama

- Link referral (`/daftar?ref=NAUFAL`) dengan validasi kode dan pendaftaran yang tersimpan di SQLite.
- Dashboard admin: lead, status, nilai kelas, verifikasi pembayaran, affiliate, program, dan komisi.
- Pencegahan komisi duplikat: satu komisi unik per lead dan hanya dibuat ketika status menjadi `LUNAS`.
- Portal affiliate Naufal dengan referral URL, QR, share WhatsApp, serta data peserta yang diprivasi.
- Dashboard management dan simulator komisi langsung.
- Seed data September 2026, termasuk skenario Suyadi direferensikan Naufal.

## Stack dan arsitektur

Next.js App Router + TypeScript, Prisma ORM, SQLite, Zod, Lucide, dan QRCode React. UI ada di `app/` dan `components/`, business logic murni di `lib/`, mutasi tervalidasi ada di `server/actions.ts`, dan skema/data demo ada di `prisma/`.

Untuk produksi, ubah provider Prisma dari `sqlite` menjadi `postgresql`, isi `DATABASE_URL` dengan PostgreSQL/Supabase/Neon/Vercel Postgres, lalu jalankan migrasi. Tidak ada URL localhost yang dipakai untuk link referral; atur `NEXT_PUBLIC_APP_URL` pada deployment.

## Menjalankan lokal

```bash
npm install
cp .env.example .env
npx prisma generate
npm run db:push
npm run db:seed
npm run dev
```

Buka `http://localhost:3000`. Gunakan `/demo-login` untuk berpindah peran. Contoh link referral: `http://localhost:3000/daftar?ref=NAUFAL`.

## Verifikasi

```bash
npm run lint
npm run test
npm run build
```

## Deployment

Set `NEXT_PUBLIC_APP_URL=https://domain-anda` dan `DATABASE_URL`. SQLite cocok untuk presentasi lokal; gunakan PostgreSQL untuk deployment persistent/serverless. Logo resmi Ahlan tersimpan terpusat di `public/brand/ahlan-logo.png` dan dirender melalui komponen `components/brand/AhlanLogo.tsx`.
