"use client"

import { usePantauKeterlambatan } from "@/hooks/use-pantau-keterlambatan"
import { useEffect } from "react"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { kirimEmailKeterlambatan } from "@/app/api/kirim-email/action"

export function SistemNotifikasiKeterlambatan() {
  const { sedangMemantau } = usePantauKeterlambatan()
  const { supabase } = useSupabaseAuth()

  // Periksa peminjaman terlambat yang sudah ada tapi belum dinotifikasi
  useEffect(() => {
    async function periksaPeminjamanTerlambat() {
      if (!supabase) return

      try {
        const { data: peminjamanTerlambat, error } = await supabase
          .from("Peminjaman")
          .select("id, notifikasiTerkirim")
          .eq("statusId", 6)
          .eq("notifikasiTerkirim", false)

        if (error) {
          console.error("Error mengambil peminjaman terlambat:", error)
          return
        }

        for (const peminjaman of peminjamanTerlambat) {
          await kirimEmailKeterlambatan(peminjaman.id)
        }
      } catch (error) {
        console.error("Error memeriksa peminjaman terlambat yang ada:", error)
      }
    }

    periksaPeminjamanTerlambat()
  }, [supabase])

  // Komponen ini tidak merender apapun yang terlihat
  return null
}
