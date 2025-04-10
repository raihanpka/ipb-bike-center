////////////////////////////////////////////////////////////////////////////////
// 🛑 Database palsu untuk data sepeda
////////////////////////////////////////////////////////////////////////////////

import { faker } from '@faker-js/faker';
import { matchSorter } from 'match-sorter'; // Untuk filtering

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

// Data sepeda palsu
export const fakeDataSepeda = {
  records: [] as DataSepeda[], // Menyimpan daftar objek sepeda

  // Inisialisasi dengan data contoh
  initialize() {
    const sampleDataSepeda: DataSepeda[] = [];

    const merkSepedaList = ['Polygon', 'Pacific', 'Wimcycle', 'Turanza', 'United', 'Senator', 'Genio'];
    const jenisSepedaList = ['Gunung', 'Keranjang (City Bike)', 'Lipat', 'Elektrik'];
    const statusSepedaList = ['Tersedia', 'Dipinjam', 'Sedang Perawatan'];

    function generateRandomSepedaData(id: number): DataSepeda {
      return {
        nomorSeri: `IPB${id.toString().padStart(3, '0')}`,
        merk: faker.helpers.arrayElement(merkSepedaList),
        jenis: faker.helpers.arrayElement(jenisSepedaList),
        status: faker.helpers.arrayElement(statusSepedaList),
        tanggalPerawatanTerakhir: faker.date
          .between({ from: '2024-01-01', to: '2024-12-31' })
          .toISOString()
          .split('T')[0], // Format tanggal
        deskripsi: faker.commerce.productDescription()
      };
    }

    // Membuat data contoh
    for (let i = 1; i <= 20; i++) {
      sampleDataSepeda.push(generateRandomSepedaData(i));
    }

    this.records = sampleDataSepeda;
  },

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
    let sepeda = [...this.records];

    // Filter berdasarkan jenis sepeda
    if (jenis.length > 0) {
      sepeda = sepeda.filter((item) =>
        jenis.includes(item.jenis)
      );
    }

    // Filter berdasarkan status sepeda
    if (status) {
      sepeda = sepeda.filter((item) => item.status === status);
    }

    // Fungsi pencarian
    if (search) {
      sepeda = matchSorter(sepeda, search, {
        keys: ['merk', 'deskripsi', 'jenis']
      });
    }

    return sepeda;
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
      message: 'Data sepeda contoh untuk testing dan pembelajaran',
      total_sepeda: totalSepeda,
      offset,
      limit,
      sepeda: paginatedSepeda
    };
  },

  // Mendapatkan sepeda tertentu berdasarkan nomor seri
  async getSepedaByNomorSeri(nomorSeri: string) {
    await delay(1000); // Mensimulasikan delay

    // Mencari sepeda berdasarkan nomor seri
    const sepeda = this.records.find(
      (item) => item.nomorSeri === nomorSeri
    );

    if (!sepeda) {
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
      sepeda
    };
  },

  // Membuat data sepeda baru
  async createSepeda(data: Omit<DataSepeda, 'nomorSeri'> & { nomorSeri?: string }) {
    await delay(1000);
    
    // Generate nomor seri jika tidak disediakan
    const nomorSeri = data.nomorSeri || `IPB${(this.records.length + 1).toString().padStart(3, '0')}`;
    
    const newSepeda: DataSepeda = {
      nomorSeri,
      merk: data.merk,
      jenis: data.jenis,
      status: data.status,
      tanggalPerawatanTerakhir: data.tanggalPerawatanTerakhir,
      deskripsi: data.deskripsi
    };

    this.records.push(newSepeda);
    
    return {
      success: true,
      message: 'Data sepeda berhasil ditambahkan',
      sepeda: newSepeda
    };
  },

  // Memperbarui data sepeda
  async updateSepeda(nomorSeri: string, data: Partial<DataSepeda>) {
    await delay(1000);
    
    const index = this.records.findIndex(item => item.nomorSeri === nomorSeri);
    if (index === -1) {
      return {
        success: false,
        message: `Sepeda dengan nomor seri ${nomorSeri} tidak ditemukan`
      };
    }

    this.records[index] = {
      ...this.records[index],
      ...data
    };

    return {
      success: true,
      message: 'Data sepeda berhasil diperbarui',
      sepeda: this.records[index]
    };
  },

  // Menghapus data sepeda
  async deleteSepeda(nomorSeri: string) {
    await delay(1000);
    
    const index = this.records.findIndex(item => item.nomorSeri === nomorSeri);
    if (index === -1) {
      return {
        success: false,
        message: `Sepeda dengan nomor seri ${nomorSeri} tidak ditemukan`
      };
    }

    this.records.splice(index, 1);
    
    return {
      success: true,
      message: 'Data sepeda berhasil dihapus'
    };
  }
};

// Inisialisasi data contoh sepeda
fakeDataSepeda.initialize();
