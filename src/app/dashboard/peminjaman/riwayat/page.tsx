"use client"

import PageContainer from "@/components/layout/page-container"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { CardRiwayat } from "@/features/peminjaman/components/card-riwayat"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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
  const { user, isLoaded: isClerkLoaded } = useUser()
  const { supabase, supabaseUserId, loading: isAuthLoading, error: authError, refreshAuth } = useSupabaseAuth()
  const [peminjaman, setPeminjaman] = useState<Peminjaman[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPeminjaman = async () => {
    if (!user || !supabaseUserId) return

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from("Peminjaman")
        .select(`
          id,
          nomorSeriSepeda,
          tanggalPeminjaman,
          jangkaPeminjaman,
          tanggalPengembalian,
          statusId,
          StatusPeminjaman (
            nama
          ),
          DataSepeda (
            jenis,
            merk
          )
        `)
        .eq("userId", supabaseUserId)
        .order("createdAt", { ascending: false })

      if (error) throw error

      const formattedData = data.map((item) => ({
        id: item.id,
        nomorSeriSepeda: item.nomorSeriSepeda,
        tanggalPeminjaman: item.tanggalPeminjaman,
        jangkaPeminjaman: item.jangkaPeminjaman,
        tanggalPengembalian: item.tanggalPengembalian,
        statusId: item.statusId,
        statusNama: item.StatusPeminjaman?.[0]?.nama || "Tidak diketahui",
        jenisSepeda: item.DataSepeda?.[0]?.jenis || "Tidak diketahui",
        merkSepeda: item.DataSepeda?.[0]?.merk || "Tidak diketahui",
      }))

      setPeminjaman(formattedData)
    } catch (err) {
      console.error("Error fetching peminjaman:", err)
      setError("Gagal memuat data peminjaman")
      toast.error("Gagal memuat data peminjaman")
    } finally {
      setLoading(false)
    }
  }

  // Try to refresh auth if supabaseUserId is null but user is loaded
  useEffect(() => {
    if (isClerkLoaded && user && !supabaseUserId && !isAuthLoading) {
      refreshAuth().catch((err) => {
        console.error("Failed to refresh auth:", err)
      })
    }
  }, [isClerkLoaded, user, supabaseUserId, isAuthLoading, refreshAuth])

  useEffect(() => {
    if (isClerkLoaded && !isAuthLoading && user && supabaseUserId) {
      fetchPeminjaman()
    } else if (isClerkLoaded && !user) {
      setLoading(false)
    }
  }, [user, isClerkLoaded, isAuthLoading, supabaseUserId])

  if (!isClerkLoaded || isAuthLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading...</span>
      </div>
    )
  }

  if (authError) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto my-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Terjadi kesalahan saat memuat data pengguna. Silakan refresh halaman atau login ulang.
        </AlertDescription>
      </Alert>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold">Silakan login untuk melihat riwayat peminjaman</h1>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto my-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  const peminjamanAktif = peminjaman.filter((item) => item.statusId === 1 || item.statusId === 2)
  const peminjamanSelesai = peminjaman.filter(
    (item) => item.statusId === 3 || item.statusId === 4 || item.statusId === 5,
  )

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <h1 className="text-3xl font-bold mb-6">Riwayat Peminjaman</h1>

        <Tabs defaultValue="aktif" className="mb-6">
          <TabsList>
            <TabsTrigger value="aktif">Peminjaman Aktif</TabsTrigger>
            <TabsTrigger value="selesai">Peminjaman Selesai</TabsTrigger>
          </TabsList>
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
