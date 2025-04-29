import { supabase } from "@/lib/supabase";

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
    .from('DataSepeda')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Dipinjam');

  if (error) {
    throw new Error(`Gagal mendapatkan jumlah sepeda: ${error.message}`);
  }

  return count || 0;
}

