import { supabase } from "@/lib/supabase"
import { parseISO } from "date-fns"

function isTerlambat(tanggalPengembalian: string): boolean {
    const pengembalianDate = parseISO(tanggalPengembalian);

    // Waktu sekarang dalam WIB (UTC+7)
    const now = new Date();
    const nowWIB = new Date(now.getTime() + 7 * 60 * 60 * 1000);

    // Hari dalam minggu (0 = Minggu, 1 = Senin, ..., 6 = Sabtu)
    const dayOfWeek = nowWIB.getUTCDay();

    // Minggu tidak dihitung keterlambatan
    if (dayOfWeek === 0) return false;

    // Batas jam keterlambatan
    let batasJam: number;
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        // Senin-Jumat
        batasJam = 16;
    } else if (dayOfWeek === 6) {
        // Sabtu
        batasJam = 12;
    } else {
        return false;
    }

    // Buat batas waktu pada hari ini di WIB
    const batasWaktu = new Date(nowWIB);
    batasWaktu.setUTCHours(batasJam - 7, 0, 0, 0); // -7 karena sudah di-offset ke WIB

    // Jika tanggal pengembalian sudah lewat batas waktu hari ini
    return pengembalianDate < batasWaktu;
}

export async function periksaPeminjamanTerlambat() {
  try {
    // Ambil peminjaman aktif (statusId = 2)
    const { data: peminjamanAktif, error } = await supabase
      .from("Peminjaman")
      .select("id, tanggalPengembalian")
      .eq("statusId", 2) // Peminjaman aktif

    if (error) {
      console.error("Error mengambil peminjaman aktif:", error)
      return { sukses: false, error }
    }

    const idPeminjamanTerlambat: string[] = []

    for (const peminjaman of peminjamanAktif) {
      if (isTerlambat(peminjaman.tanggalPengembalian)) {
        idPeminjamanTerlambat.push(peminjaman.id)
      }
    }

    // Update peminjaman terlambat
    if (idPeminjamanTerlambat.length > 0) {
      const { error: errorUpdate } = await supabase
        .from("Peminjaman")
        .update({ statusId: 6 }) // Set ke status terlambat
        .in("id", idPeminjamanTerlambat)

      if (errorUpdate) {
        console.error("Error mengupdate peminjaman terlambat:", errorUpdate)
        return { sukses: false, error: errorUpdate }
      }
    }

    return {
      sukses: true,
      data: {
        diperiksa: peminjamanAktif.length,
        terlambat: idPeminjamanTerlambat.length,
        idTerlambat: idPeminjamanTerlambat,
      },
    }
  } catch (error) {
    console.error("Error dalam periksaPeminjamanTerlambat:", error)
    return { sukses: false, error }
  }
}
