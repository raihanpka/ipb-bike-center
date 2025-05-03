"use client"

import PageContainer from "@/components/layout/page-container"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { CardPeminjamanAdmin } from "@/features/peminjaman/components/card-peminjaman-admin"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Loader2, Search } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

type Peminjaman = {
  id: string
  userId: string
  nomorSeriSepeda: string
  tanggalPeminjaman: string
  jangkaPeminjaman: string
  tanggalPengembalian: string
  statusId: number
  statusNama: string
  jenisSepeda: string
  merkSepeda: string
  namaUser: string
  emailUser: string
  nomorTeleponAktif: string
  fotoPeminjam: string | null
  fotoKTM: string | null
  fotoQRPengembalian: string | null
}

export default function KelolaPeminjamanPage() {
  const { user, isLoaded } = useUser()
  const [peminjaman, setPeminjaman] = useState<Peminjaman[]>([])
  const [filteredPeminjaman, setFilteredPeminjaman] = useState<Peminjaman[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)

  // Cek apakah user adalah admin
  useEffect(() => {
    if (user && isLoaded) {
      // Cek dari metadata Clerk
      setIsAdmin(user.publicMetadata?.role === "admin")
      setLoading(false)
    } else if (isLoaded) {
      setLoading(false)
    }
  }, [user, isLoaded])

  const fetchPeminjaman = async () => {
    if (!isAdmin) return

    try {
      // Versi yang disederhanakan - hanya ambil data yang penting
      const { data, error } = await supabase
        .from("Peminjaman")
        .select(`
          id,
          userId,
          nomorSeriSepeda,
          tanggalPeminjaman,
          jangkaPeminjaman,
          tanggalPengembalian,
          statusId,
          nomorTeleponAktif,
          fotoPeminjam,
          fotoKTM,
          fotoQRPengembalian
        `)
        .order("createdAt", { ascending: false })

      if (error) throw error

      // Jika tidak ada data, tampilkan pesan
      if (!data || data.length === 0) {
        setPeminjaman([])
        setFilteredPeminjaman([])
        return
      }

      // Ambil data tambahan yang diperlukan
      const enhancedData = await Promise.all(
        data.map(async (item) => {
          // Default values jika gagal mengambil data tambahan
          let statusNama = "Tidak diketahui"
          let jenisSepeda = "Tidak diketahui"
          let merkSepeda = "Tidak diketahui"
          let namaUser = "Tidak diketahui"
          let emailUser = "Tidak diketahui"

          // Coba ambil status peminjaman
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
            console.log("Gagal mengambil data status")
          }

          // Coba ambil data sepeda
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
            console.log("Gagal mengambil data sepeda")
          }

          // Coba ambil data user
          try {
            const { data: userData } = await supabase.from("Users").select("nama, email").eq("id", item.userId).single()

            if (userData) {
              namaUser = userData.nama
              emailUser = userData.email
            }
          } catch (e) {
            console.log("Gagal mengambil data user")
          }

          return {
            ...item,
            statusNama,
            jenisSepeda,
            merkSepeda,
            namaUser,
            emailUser,
          }
        }),
      )

      setPeminjaman(enhancedData)
      setFilteredPeminjaman(enhancedData)
    } catch (error) {
      console.log("Gagal memuat data peminjaman")
      toast.error("Gagal memuat data peminjaman")
      setPeminjaman([])
      setFilteredPeminjaman([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAdmin && !loading) {
      fetchPeminjaman()
    }
  }, [isAdmin, loading])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPeminjaman(peminjaman)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = peminjaman.filter(
        (item) =>
          item.namaUser.toLowerCase().includes(query) ||
          item.nomorSeriSepeda.toLowerCase().includes(query) ||
          item.merkSepeda.toLowerCase().includes(query) ||
          item.jenisSepeda.toLowerCase().includes(query) ||
          item.nomorTeleponAktif.includes(query),
      )
      setFilteredPeminjaman(filtered)
    }
  }, [searchQuery, peminjaman])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading...</span>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold">Anda tidak memiliki akses ke halaman ini</h1>
      </div>
    )
  }

  const peminjamanMenunggu = filteredPeminjaman.filter((item) => item.statusId === 1)
  const peminjamanAktif = filteredPeminjaman.filter((item) => item.statusId === 2)
  const peminjamanSelesai = filteredPeminjaman.filter(
    (item) => item.statusId === 3 || item.statusId === 4 || item.statusId === 5,
  )

  return (
  <PageContainer scrollable={false}>
    <div className='flex flex-1 flex-col space-y-4'>
      <h1 className="text-3xl font-bold mb-6">Kelola Peminjaman Sepeda</h1>

      <div className="relative mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Cari berdasarkan nama, nomor seri, merk, jenis, atau nomor telepon..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="menunggu" className="mb-6">
        <TabsList>
          <TabsTrigger value="menunggu">Menunggu Persetujuan ({peminjamanMenunggu.length})</TabsTrigger>
          <TabsTrigger value="aktif">Peminjaman Aktif ({peminjamanAktif.length})</TabsTrigger>
          <TabsTrigger value="selesai">Peminjaman Selesai ({peminjamanSelesai.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="menunggu">
          {peminjamanMenunggu.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Tidak ada peminjaman yang menunggu persetujuan</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {peminjamanMenunggu.map((item) => (
                <CardPeminjamanAdmin key={item.id} {...item} onStatusUpdate={fetchPeminjaman} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="aktif">
          {peminjamanAktif.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Tidak ada peminjaman aktif</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {peminjamanAktif.map((item) => (
                <CardPeminjamanAdmin key={item.id} {...item} onStatusUpdate={fetchPeminjaman} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="selesai">
          {peminjamanSelesai.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Tidak ada peminjaman selesai</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {peminjamanSelesai.map((item) => (
                <CardPeminjamanAdmin key={item.id} {...item} onStatusUpdate={fetchPeminjaman} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  </PageContainer>
  )
}
