"use server"

import { Resend } from "resend"
import { EmailKeterlambatan } from "@/components/emails/email-keterlambatan"
import { format, differenceInDays, parseISO } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { supabase } from "@/lib/supabase"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function kirimEmailKeterlambatan(idPeminjaman: string) {
  try {
    // Ambil data peminjaman saja
    const { data: peminjaman, error } = await supabase
      .from("Peminjaman")
      .select("*")
      .eq("id", idPeminjaman)
      .eq("statusId", 6)
      .single()

    if (error || !peminjaman) {
      console.error("Error mengambil data peminjaman:", error)
      return { sukses: false, error: "Data peminjaman tidak ditemukan" }
    }

    // Ambil data user
    const { data: user, error: errorUser } = await supabase
      .from("Users")
      .select("nama, email, nomorTelepon")
      .eq("id", peminjaman.userId)
      .single()

    if (errorUser || !user?.email) {
      console.error("Data email pengguna tidak ditemukan")
      return { sukses: false, error: "Email pengguna tidak ditemukan" }
    }

    // Ambil data sepeda
    const { data: sepeda, error: errorSepeda } = await supabase
      .from("DataSepeda")
      .select("merk, jenis")
      .eq("nomorSeri", peminjaman.nomorSeriSepeda)
      .single()

    if (errorSepeda || !sepeda) {
      console.error("Data sepeda tidak ditemukan")
      return { sukses: false, error: "Data sepeda tidak ditemukan" }
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
      from: "IPB Bike Center <no-reply@info.ipbbike.my.id>",
      to: [user.email],
      subject: "Pemberitahuan Keterlambatan Pengembalian Sepeda",
      react: EmailKeterlambatan({
        namaUser: user.nama,
        merkSepeda: sepeda.merk,
        jenisSepeda: sepeda.jenis,
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
