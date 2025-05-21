import { type NextRequest, NextResponse } from "next/server"
import { periksaPeminjamanTerlambat } from "@/lib/periksa-peminjaman-terlambat"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    // Verifikasi otorisasi jika diperlukan
    const headerAuth = request.headers.get("authorization")
    if (!process.env.CRON_SECRET || headerAuth !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 })
    }

    // Jalankan pemeriksaan terlambat
    const hasil = await periksaPeminjamanTerlambat()

    if (!hasil.sukses) {
      return NextResponse.json({ error: hasil.error }, { status: 500 })
    }

    return NextResponse.json(hasil.data)
  } catch (error) {
    console.error("Error dalam route periksa-terlambat:", error)
    return NextResponse.json({ error: "Kesalahan server internal" }, { status: 500 })
  }
}
