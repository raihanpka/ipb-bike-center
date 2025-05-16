export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      Users: {
        Row: {
          id: string;
          email: string;
          nama: string;
          nomorTelepon: string | null;
          role: string;
          createdAt: string;
          updatedAt: string;
          deleted: boolean;
        };
        Insert: {
          id: string;
          email: string;
          nama: string;
          nomorTelepon?: string | null;
          role?: string;
          createdAt?: string;
          updatedAt?: string;
          deleted?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          nama?: string;
          nomorTelepon?: string | null;
          role?: string;
          createdAt?: string;
          updatedAt?: string;
          deleted?: boolean;
        };
      };
      DataSepeda: {
        Row: {
          nomorSeri: string;
          merk: string;
          jenis: string;
          status: string;
          tanggalPerawatanTerakhir: string;
          deskripsi: string | null;
        };
        Insert: {
          nomorSeri: string;
          merk: string;
          jenis: string;
          status: string;
          tanggalPerawatanTerakhir: string;
          deskripsi?: string | null;
        };
        Update: {
          nomorSeri?: string;
          merk?: string;
          jenis?: string;
          status?: string;
          tanggalPerawatanTerakhir?: string;
          deskripsi?: string | null;
        };
      };
      StatusPeminjaman: {
        Row: {
          id: number;
          nama: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: number;
          nama: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: number;
          nama?: string;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      Peminjaman: {
        Row: {
          id: string;
          userId: string;
          nomorSeriSepeda: string;
          tanggalPeminjaman: string;
          jangkaPeminjaman: string;
          tanggalPengembalian: string;
          statusId: number;
          nomorTeleponAktif: string;
          fotoPeminjam: string | null;
          fotoKTM: string | null;
          suratPeminjaman: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          userId: string;
          nomorSeriSepeda: string;
          tanggalPeminjaman: string;
          jangkaPeminjaman: string;
          tanggalPengembalian: string;
          statusId: number;
          nomorTeleponAktif: string;
          fotoPeminjam?: string | null;
          fotoKTM?: string | null;
          suratPeminjaman?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          userId?: string;
          nomorSeriSepeda?: string;
          tanggalPeminjaman?: string;
          jangkaPeminjaman?: string;
          tanggalPengembalian?: string;
          statusId?: number;
          nomorTeleponAktif?: string;
          fotoPeminjam?: string | null;
          fotoKTM?: string | null;
          suratPeminjaman?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      RiwayatPerawatan: {
        Row: {
          id: string;
          nomorSeriSepeda: string;
          tanggalPerawatan: string;
          deskripsi: string;
          teknisiId: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          nomorSeriSepeda: string;
          tanggalPerawatan: string;
          deskripsi: string;
          teknisiId?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          nomorSeriSepeda?: string;
          tanggalPerawatan?: string;
          deskripsi?: string;
          teknisiId?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
