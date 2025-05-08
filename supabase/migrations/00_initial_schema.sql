-- ============================================================================
-- Skema Awal Database untuk Sistem Peminjaman Sepeda
-- 
-- Tabel:
-- 1. DataSepeda
--    - Menyimpan data sepeda, termasuk nomor seri, merk, jenis, status, tanggal perawatan terakhir, dan deskripsi.
--    - nomorSeri sebagai primary key dan unique.
--
-- 2. StatusPeminjaman
--    - Menyimpan status peminjaman (misal: dipinjam, dikembalikan, dll).
--    - Memiliki kolom nama yang unik, serta timestamp createdAt dan updatedAt.
--
-- 3. Users
--    - Menyimpan data pengguna, seperti id, email, nama, nomor telepon, role, dan status deleted.
--    - Memiliki kolom createdAt dan updatedAt untuk pencatatan waktu.
--
-- 4. Peminjaman
--    - Menyimpan data peminjaman sepeda, termasuk userId, nomor seri sepeda, tanggal peminjaman, jangka waktu, tanggal pengembalian, status, nomor telepon aktif, serta foto-foto terkait.
--    - Memiliki relasi foreign key ke tabel DataSepeda, StatusPeminjaman, dan Users.
--    - Kolom createdAt dan updatedAt untuk pencatatan waktu.
--
-- Fungsi & Trigger:
-- - update_timestamp: Fungsi untuk memperbarui kolom updatedAt secara otomatis setiap kali terjadi update pada tabel Peminjaman.
-- - Trigger update_timestamp: Memanggil fungsi update_timestamp sebelum data pada tabel Peminjaman diupdate.
-- ============================================================================

CREATE TABLE public."DataSepeda" (
  "nomorSeri" character varying NOT NULL,
  merk character varying NULL,
  jenis character varying NULL,
  status character varying NULL,
  "tanggalPerawatanTerakhir" date NULL,
  deskripsi text NULL,
  CONSTRAINT DataSepeda_pkey PRIMARY KEY ("nomorSeri"),
  CONSTRAINT DataSepeda_nomorSeri_key UNIQUE ("nomorSeri")
) WITH (OIDS=FALSE);

CREATE TABLE public."StatusPeminjaman" (
  id serial NOT NULL,
  nama character varying NOT NULL,
  "createdAt" timestamp with time zone NULL DEFAULT now(),
  "updatedAt" timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT StatusPeminjaman_pkey PRIMARY KEY (id),
  CONSTRAINT StatusPeminjaman_nama_key UNIQUE (nama)
) WITH (OIDS=FALSE);

CREATE TABLE public."Users" (
  id text NOT NULL,
  email character varying NOT NULL,
  nama character varying NOT NULL,
  "nomorTelepon" character varying NULL,
  role character varying NULL DEFAULT 'user'::character varying,
  "createdAt" timestamp with time zone NULL DEFAULT now(),
  "updatedAt" timestamp with time zone NULL DEFAULT now(),
  deleted boolean NULL DEFAULT false,
  CONSTRAINT Users_pkey PRIMARY KEY (id)
) WITH (OIDS=FALSE);

CREATE TABLE public."Peminjaman" (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  "userId" text NOT NULL,
  "nomorSeriSepeda" character varying NOT NULL,
  "tanggalPeminjaman" date NOT NULL,
  "jangkaPeminjaman" character varying NOT NULL,
  "tanggalPengembalian" date NOT NULL,
  "statusId" integer NOT NULL,
  "nomorTeleponAktif" character varying NOT NULL,
  "fotoPeminjam" character varying NULL,
  "fotoKTM" character varying NULL,
  "suratPeminjaman" character varying NULL,
  "createdAt" timestamp with time zone NULL DEFAULT now(),
  "updatedAt" timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT Peminjaman_pkey PRIMARY KEY (id),
  CONSTRAINT Peminjaman_nomorSeriSepeda_fkey FOREIGN KEY ("nomorSeriSepeda") REFERENCES "DataSepeda"("nomorSeri") ON DELETE CASCADE,
  CONSTRAINT Peminjaman_statusId_fkey FOREIGN KEY ("statusId") REFERENCES "StatusPeminjaman"(id),
  CONSTRAINT Peminjaman_userId_fkey FOREIGN KEY ("userId") REFERENCES "Users"(id) ON DELETE CASCADE
) WITH (OIDS=FALSE);

CREATE FUNCTION public."update_timestamp"() 
RETURNS trigger AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_timestamp
BEFORE UPDATE ON public."Peminjaman"
FOR EACH ROW EXECUTE FUNCTION public."update_timestamp"();