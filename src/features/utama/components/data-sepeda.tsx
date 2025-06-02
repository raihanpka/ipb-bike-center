import { supabase } from '@/lib/supabase';

export async function JumlahSepedaTersedia(): Promise<number> {
  const { count, error } = await supabase
    .from('DataSepeda')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Tersedia');

  if (error) {
    throw new Error(`Gagal mendapatkan jumlah sepeda: ${error.message}`);
  }

  return count || 0;
}

export async function JumlahSepedaDipinjam(): Promise<number> {
  const { count, error } = await supabase
    .from('Peminjaman')
    .select('*', { count: 'exact', head: true })
    .eq('statusId', 2);

  if (error) {
    throw new Error(`Gagal mendapatkan peminjaman aktif: ${error.message}`);
  }

  return count || 0;
}

export async function JumlahMenungguPersetujuan(): Promise<number> {
  const { count, error } = await supabase
    .from('Peminjaman')
    .select('*', { count: 'exact', head: true })
    .eq('statusId', 1);

  if (error) {
    throw new Error(
      `Gagal mendapatkan status menunggu persetujuan: ${error.message}`
    );
  }

  return count || 0;
}

export async function JumlahPeminjamanBulanan(): Promise<number> {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // First day of current month
  const firstDay = new Date(year, month, 1);
  // Last day of current month
  const lastDay = new Date(year, month + 1, 0);

  // Format to YYYY-MM-DD
  const formatDate = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')}`;

  const firstDayStr = formatDate(firstDay);
  const lastDayStr = formatDate(lastDay);

  const { count, error } = await supabase
    .from('Peminjaman')
    .select('*', { count: 'exact', head: true })
    .gte('tanggalPeminjaman', firstDayStr)
    .lte('tanggalPeminjaman', lastDayStr)
    .in('statusId', [2, 6]);

  if (error) {
    throw new Error(
      `Gagal mendapatkan jumlah peminjaman bulanan: ${error.message}`
    );
  }

  return count || 0;
}