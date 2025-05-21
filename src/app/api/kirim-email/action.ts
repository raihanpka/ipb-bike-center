"use server"

import { Resend } from "resend"
import { EmailKeterlambatan } from "@/components/emails/email-keterlambatan"
import { createClient } from "@supabase/supabase-js"
import { format, differenceInDays, parseISO } from "date-fns"
import { id as localeId } from "date-fns/locale"

// Inisialisasi Resend dengan API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Inisialisasi klien Supabase
const urlSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL!
const kunciLayananSupabase = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(urlSupabase, kunciLayananSupabase)

export async function kirimEmailKeterlambatan(idPeminjaman: string) {
  try {
    // Ambil data peminjaman dari Supabase dengan JOIN ke tabel terkait
    const { data: peminjaman, error } = await supabase
      .from("Peminjaman")
      .select(`
        id,
        userId,
        nomorSeriSepeda,
        tanggalPeminjaman,
        jangkaPeminjaman,
        tanggalPengembalian,
        statusId,
        DataSepeda:nomorSeriSepeda (
          merkSepeda,
          jenisSepeda
        ),
        Users:userId (
          nama,
          email,
          nomorTeleponAktif
        ),
        notifikasiTerkirim
      `)
      .eq("id", idPeminjaman)
      .eq("statusId", 6) // Hanya kirim untuk peminjaman terlambat
      .single()

    if (error || !peminjaman) {
      console.error("Error mengambil data peminjaman:", error)
      return { sukses: false, error: "Data peminjaman tidak ditemukan" }
    }

    // Format tanggal untuk email
    const tanggalPeminjamanFormat = format(parseISO(peminjaman.tanggalPeminjaman), "d MMMM yyyy", { locale: localeId })
    const tanggalPengembalianFormat = format(parseISO(peminjaman.tanggalPengembalian), "d MMMM yyyy", {
      locale: localeId,
    })

    // Hitung hari keterlambatan
    const hariTerlambat = differenceInDays(new Date(), parseISO(peminjaman.tanggalPengembalian))

    // Kirim email menggunakan Resend
    const { data, error: errorKirim } = await resend.emails.send({
      from: "IPB Bike Center <no-reply@info-center.com>",
      to: [peminjaman.Users[0].email],
      subject: "Pemberitahuan Keterlambatan Pengembalian Sepeda",
      react: EmailKeterlambatan({
        namaUser: peminjaman.Users[0].nama,
        merkSepeda: peminjaman.DataSepeda[0].merkSepeda,
        jenisSepeda: peminjaman.DataSepeda[0].jenisSepeda,
        nomorSeriSepeda: peminjaman.nomorSeriSepeda,
        tanggalPeminjaman: tanggalPeminjamanFormat,
        tanggalPengembalian: tanggalPengembalianFormat,
        hariTerlambat: hariTerlambat > 0 ? hariTerlambat : 1,
      }),
    })

    if (errorKirim) {
      console.error("Error mengirim email:", errorKirim)
      return { sukses: false, error: errorKirim }
    }

    // Update catatan peminjaman untuk menandai bahwa notifikasi telah dikirim
    await supabase.from("Peminjaman").update({ notifikasiTerkirim: true }).eq("id", idPeminjaman)

    return { sukses: true, data }
  } catch (error) {
    console.error("Error dalam kirimEmailKeterlambatan:", error)
    return { sukses: false, error }
  }
}
