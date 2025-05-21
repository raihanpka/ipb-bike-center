"use client"

import { useEffect, useState } from "react"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { kirimEmailKeterlambatan } from "@/app/api/kirim-email/action"
import { toast } from "sonner"

export function usePantauKeterlambatan() {
  const { supabase } = useSupabaseAuth()
  const [sedangMemantau, setSedangMemantau] = useState(false)

  useEffect(() => {
    if (!supabase) return

    setSedangMemantau(true)

    // Berlangganan perubahan pada tabel Peminjaman
    const langganan = supabase
      .channel("peminjaman-terlambat")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Peminjaman",
          filter: "statusId=eq.6",
        },
        async (payload) => {
          // Periksa apakah notifikasi sudah dikirim
          const { data: peminjaman } = await supabase
            .from("Peminjaman")
            .select("notifikasiTerkirim")
            .eq("id", payload.new.id)
            .single()

          // Hanya kirim notifikasi jika belum dikirim
          if (!peminjaman?.notifikasiTerkirim) {
            try {
              const hasil = await kirimEmailKeterlambatan(payload.new.id)
              if (hasil.sukses) {
                toast.success("Notifikasi keterlambatan telah dikirim", { richColors: true })
              } else {
                console.error("Gagal mengirim notifikasi keterlambatan:", hasil.error)
              }
            } catch (error) {
              console.error("Error mengirim notifikasi keterlambatan:", error)
            }
          }
        },
      )
      .subscribe()

    return () => {
      langganan.unsubscribe()
      setSedangMemantau(false)
    }
  }, [supabase])

  return { sedangMemantau }
}
