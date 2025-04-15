////////////////////////////////////////////////////////////////////////////////
// Database API
////////////////////////////////////////////////////////////////////////////////

import { matchSorter } from 'match-sorter'; // Untuk filtering
import { supabase } from '@/lib/supabase'; // Supabase client

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mendefinisikan bentuk DataSepeda
export type DataSepeda = {
  nomorSeri: string;
  merk: string;
  jenis: string;
  status: string;
  tanggalPerawatanTerakhir: string;
  deskripsi: string;
};

// Data sepeda
export const ambilDataSepeda = {
  // Mendapatkan semua sepeda dengan filter dan pencarian opsional
  async getAll({
    jenis = [],
    status,
    search
  }: {
    jenis?: string[];
    status?: string;
    search?: string;
  }) {
    let query = supabase.from('DataSepeda').select('*');

    // Filter berdasarkan jenis sepeda
    if (jenis.length > 0) {
      query = query.in('jenis', jenis);
    }

    // Filter berdasarkan status sepeda
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }

    // Fungsi pencarian
    if (search && data) {
      return matchSorter(data, search, {
        keys: ['merk', 'deskripsi', 'jenis']
      });
    }

    return data || [];
  },

  // Mendapatkan hasil dengan paginasi
  async getSepeda({
    page = 1,
    limit = 10,
    jenis,
    status,
    search
  }: {
    page?: number;
    limit?: number;
    jenis?: string;
    status?: string;
    search?: string;
  }) {
    await delay(1000);
    const jenisSepedaArray = jenis ? jenis.split('.') : [];
    const allSepeda = await this.getAll({
      jenis: jenisSepedaArray,
      status,
      search
    });
    const totalSepeda = allSepeda.length;

    // Logika paginasi
    const offset = (page - 1) * limit;
    const paginatedSepeda = allSepeda.slice(offset, offset + limit);

    // Waktu saat ini (mock)
    const currentTime = new Date().toISOString();

    // Mengembalikan respons paginasi
    return {
      success: true,
      time: currentTime,
      message: 'Data sepeda dari database Supabase',
      total_sepeda: totalSepeda,
      offset,
      limit,
      sepeda: paginatedSepeda
    };
  },

  // Mendapatkan sepeda tertentu berdasarkan nomor seri
  async getSepedaByNomorSeri(nomorSeri: string) {
    await delay(1000); // Mensimulasikan delay

    const { data, error } = await supabase
      .from('DataSepeda')
      .select('*')
      .eq('nomorSeri', nomorSeri)
      .single();

    if (error || !data) {
      return {
        success: false,
        message: `Sepeda dengan nomor seri ${nomorSeri} tidak ditemukan`
      };
    }

    // Waktu saat ini (mock)
    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `Sepeda dengan nomor seri ${nomorSeri} ditemukan`,
      sepeda: data
    };
  },

  // Membuat data sepeda baru
  async createSepeda(data: Omit<DataSepeda, 'nomorSeri'> & { nomorSeri?: string }) {
    await delay(1000);

    const { data: newData, error } = await supabase
      .from('DataSepeda')
      .insert([data])
      .select()
      .single();

    if (error) {
      return {
        success: false,
        message: `Gagal menambahkan data sepeda: ${error.message}`
      };
    }

    return {
      success: true,
      message: 'Data sepeda berhasil ditambahkan',
      sepeda: newData
    };
  },

  // Memperbarui data sepeda
  async updateSepeda(nomorSeri: string, data: Partial<DataSepeda>) {
    await delay(1000);

    const { data: updatedData, error } = await supabase
      .from('DataSepeda')
      .update(data)
      .eq('nomorSeri', nomorSeri)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        message: `Gagal memperbarui data sepeda: ${error.message}`
      };
    }

    return {
      success: true,
      message: 'Data sepeda berhasil diperbarui',
      sepeda: updatedData
    };
  },

  // Menghapus data sepeda
  async deleteSepeda(nomorSeri: string) {
    await delay(1000);

    const { error } = await supabase
      .from('DataSepeda')
      .delete()
      .eq('nomorSeri', nomorSeri);

    if (error) {
      return {
        success: false,
        message: `Gagal menghapus data sepeda: ${error.message}`
      };
    }

    return {
      success: true,
      message: 'Data sepeda berhasil dihapus'
    };
  }
};
