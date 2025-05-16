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

/**
 * Fungsi untuk mengubah format tanggal dari yy-mm-dd menjadi dd-mm-yy
 * @param dateStr - String tanggal dalam format yy-mm-dd atau ISO
 * @returns String tanggal dalam format dd-mm-yy
 */
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';

  try {
    const date = new Date(dateStr);

    // Pastikan tanggal valid
    if (isNaN(date.getTime())) return dateStr;

    // Format tanggal ke dd-mm-yy
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${day}-${month}-${year}`;
  } catch {
    return dateStr; // Kembalikan string asli jika ada kesalahan
  }
}

/**
 * Fungsi untuk mentransformasi data dari Supabase
 * @param data - Data mentah dari Supabase
 * @returns Data yang sudah diformat
 */
export function transformSepedaData(data: any): DataSepeda {
  return {
    nomorSeri: data.nomorSeri || '',
    merk: data.merk || '',
    jenis: data.jenis || '',
    status: data.status || '',
    tanggalPerawatanTerakhir: formatDate(data.tanggalPerawatanTerakhir),
    deskripsi: data.deskripsi || ''
  };
}

/**
 * Fungsi untuk mentransformasi array data dari Supabase
 */
export function transformSepedaArray(dataArray: any[]): DataSepeda[] {
  if (!Array.isArray(dataArray)) return [];
  return dataArray.map((item) => transformSepedaData(item));
}

// Data sepeda
export const ambilDataSepeda = {
  // Mendapatkan semua sepeda dengan filter dan pencarian opsional
  async getAll({
    nomorSeri,
    search,
    jenis,
    status
  }: {
    nomorSeri?: string;
    search?: string;
    jenis?: string[];
    status?: string;
  }) {
    let query = supabase.from('DataSepeda').select('*');

    // Filter berdasarkan nomor seri
    if (nomorSeri) {
      query = query.eq('nomorSeri', nomorSeri);
    }

    // Filter berdasarkan jenis jika ada
    if (jenis && jenis.length > 0) {
      query = query.in('jenis', jenis);
    }

    // Mengurutkan berdasarkan nomorSeri secara ascending
    query = query.order('nomorSeri', { ascending: true });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }

    // Transform data sebelum pencarian
    const transformedData = transformSepedaArray(data || []);

    // Fungsi pencarian
    if (search && transformedData.length > 0) {
      return matchSorter(transformedData, search, {
        keys: ['merk', 'jenis']
      });
    }

    return transformedData;
  },

  // Mendapatkan hasil dengan paginasi
  async getSepeda({
    page = 1,
    limit = 10,
    jenis,
    search,
    nomorSeri,
    status
  }: {
    page?: number;
    limit?: number;
    jenis?: string;
    status?: string;
    search?: string;
    nomorSeri?: string;
  }) {
    await delay(1000);
    const jenisSepedaArray = jenis ? jenis.split('.') : [];
    const allSepeda = await this.getAll({
      jenis: jenisSepedaArray,
      search,
      nomorSeri,
      status
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

  // Fungsi khusus untuk TanStack Table dengan data yang sudah ditransformasi
  async getSepedaForTable({
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
    const result = await this.getSepeda({ page, limit, jenis, status, search });

    return {
      ...result,
      // Data sudah ditransformasi dalam getSepeda
      sepeda: result.sepeda.map((item: DataSepeda) => ({
        ...item,
        id: item.nomorSeri // Menambahkan ID untuk TanStack Table
      }))
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

    // Transform data
    const transformedData = transformSepedaData(data);

    // Waktu saat ini
    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `Sepeda dengan nomor seri ${nomorSeri} ditemukan`,
      sepeda: transformedData
    };
  },

  // Membuat data sepeda baru
  async createSepeda(
    data: Omit<DataSepeda, 'nomorSeri'> & { nomorSeri?: string }
  ) {
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

    // Transform data
    const transformedData = transformSepedaData(newData);

    return {
      success: true,
      message: 'Data sepeda berhasil ditambahkan',
      sepeda: transformedData
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

    // Transform data
    const transformedData = transformSepedaData(updatedData);

    return {
      success: true,
      message: 'Data sepeda berhasil diperbarui',
      sepeda: transformedData
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
