"use client"

import PageContainer from "@/components/layout/page-container"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { CardRiwayat } from "@/features/peminjaman/components/card-riwayat"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

type Peminjaman = {
  id: string
  nomorSeriSepeda: string
  tanggalPeminjaman: string
  jangkaPeminjaman: string
  tanggalPengembalian: string
  statusId: number
  statusNama: string
  jenisSepeda: string
  merkSepeda: string
}

export default function RiwayatPeminjamanPage() {
  const { user, isLoaded } = useUser()
  const [peminjaman, setPeminjaman] = useState<Peminjaman[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPeminjaman = async () => {
    if (!user) return

    try {
      // Ambil data utama peminjaman
      const { data, error } = await supabase
        .from("Peminjaman")
        .select(`
          id,
          nomorSeriSepeda,
          tanggalPeminjaman,
          jangkaPeminjaman,
          tanggalPengembalian,
          statusId
        `)
        .eq("userId", user.id)
        .order("createdAt", { ascending: false })

      if (error) throw error

      if (!data || data.length === 0) {
        setPeminjaman([])
        return
      }

      // Ambil data tambahan untuk setiap peminjaman
      const enhancedData = await Promise.all(
        data.map(async (item) => {
          let statusNama = "Tidak diketahui"
          let jenisSepeda = "Tidak diketahui"
          let merkSepeda = "Tidak diketahui"

          // Ambil nama status
          try {
            const { data: statusData } = await supabase
              .from("StatusPeminjaman")
              .select("nama")
              .eq("id", item.statusId)
              .single()
            if (statusData) {
              statusNama = statusData.nama
            }
          } catch (e) {
            // ignore
          }

          // Ambil data sepeda
          try {
            const { data: sepedaData } = await supabase
              .from("DataSepeda")
              .select("jenis, merk")
              .eq("nomorSeri", item.nomorSeriSepeda)
              .single()
            if (sepedaData) {
              jenisSepeda = sepedaData.jenis
              merkSepeda = sepedaData.merk
            }
          } catch (e) {
            // ignore
          }

          return {
            ...item,
            statusNama,
            jenisSepeda,
            merkSepeda,
          }
        })
      )

      setPeminjaman(enhancedData)
    } catch (error) {
      console.error("Error fetching peminjaman:", error)
      toast.error("Gagal memuat data peminjaman", {richColors: true})
      setPeminjaman([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isLoaded && user) {
      fetchPeminjaman()
    } else if (isLoaded && !user) {
      setLoading(false)
    }
  }, [user, isLoaded])

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading...</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold">Silakan login untuk melihat riwayat peminjaman</h1>
      </div>
    )
  }

  const peminjamanAktif = peminjaman.filter((item) => item.statusId === 1 || item.statusId === 2)
  const peminjamanSelesai = peminjaman.filter(
    (item) => item.statusId === 3 || item.statusId === 4 || item.statusId === 5,
  )

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col space-y-4 px-2 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center sm:text-left">
        Riwayat Peminjaman
      </h1>

      
      <Tabs defaultValue="aktif" className="mb-4 sm:mb-6 justify-center sm:justify-center">
        <div className="flex justify-center sm:justify-start">
        <TabsList className="flex flex-wrap sm:flex-wrap gap-2 justify-center sm:justify-center mb-8">
          <TabsTrigger value="aktif">
            Peminjaman Aktif ({peminjamanAktif.length})
            </TabsTrigger>
          <TabsTrigger value="selesai">
            Peminjaman Selesai ({peminjamanSelesai.length})
            </TabsTrigger>
        </TabsList>
        </div>
        <TabsContent value="aktif">
          {peminjamanAktif.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Belum ada peminjaman aktif</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {peminjamanAktif.map((item) => (
                <CardRiwayat
                  key={item.id}
                  id={item.id}
                  nomorSeriSepeda={item.nomorSeriSepeda}
                  tanggalPeminjaman={item.tanggalPeminjaman}
                  jangkaPeminjaman={item.jangkaPeminjaman}
                  tanggalPengembalian={item.tanggalPengembalian}
                  statusId={item.statusId}
                  statusNama={item.statusNama}
                  jenisSepeda={item.jenisSepeda}
                  merkSepeda={item.merkSepeda}
                  onStatusUpdate={fetchPeminjaman}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="selesai">
          {peminjamanSelesai.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Belum ada riwayat peminjaman selesai</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {peminjamanSelesai.map((item) => (
                <CardRiwayat
                  key={item.id}
                  id={item.id}
                  nomorSeriSepeda={item.nomorSeriSepeda}
                  tanggalPeminjaman={item.tanggalPeminjaman}
                  jangkaPeminjaman={item.jangkaPeminjaman}
                  tanggalPengembalian={item.tanggalPengembalian}
                  statusId={item.statusId}
                  statusNama={item.statusNama}
                  jenisSepeda={item.jenisSepeda}
                  merkSepeda={item.merkSepeda}
                  onStatusUpdate={fetchPeminjaman}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  </PageContainer>
  )
} 
