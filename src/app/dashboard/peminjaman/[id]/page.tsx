"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { id as LocaleId } from "date-fns/locale"
import { Calendar, Clock, Bike } from "lucide-react"
import { supabase } from "@/lib/supabase"

type PeminjamanDetailProps = {
  params: {
    id: string
  }
}

export default function PeminjamanDetailPage({ params }: PeminjamanDetailProps) {
  const { id } = params
  const { user, isLoaded } = useUser()
  const [peminjaman, setPeminjaman] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPeminjaman = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from("Peminjaman")
          .select(`
            id,
            tanggalPeminjaman,
            jangkaPeminjaman,
            tanggalPengembalian,
            status,
            DataSepeda (
              jenisSepeda,
              nomorSeri
            )
          `)
          .eq("id", id)
          .single()

        if (error) throw error

        setPeminjaman(data)
      } catch (error) {
        console.error("Error fetching peminjaman:", error)
      } finally {
        setLoading(false)
      }
    }

    if (isLoaded && user) {
      fetchPeminjaman()
    } else if (isLoaded && !user) {
      setLoading(false)
    }
  }, [user, isLoaded, id])

  if (!isLoaded || loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold">Silakan login untuk melihat detail peminjaman</h1>
      </div>
    )
  }

  if (!peminjaman) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold">Peminjaman tidak ditemukan</h1>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "menunggu":
        return "bg-yellow-100 text-yellow-800"
      case "disetujui":
        return "bg-green-100 text-green-800"
      case "ditolak":
        return "bg-red-100 text-red-800"
      case "selesai":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Detail Peminjaman</h1>

      <Card className="max-w-lg mx-auto">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{peminjaman.DataSepeda?.jenisSepeda || "Tidak diketahui"}</CardTitle>
            <Badge className={getStatusColor(peminjaman.status)}>
              {peminjaman.status.charAt(0).toUpperCase() + peminjaman.status.slice(1)}
            </Badge>
          </div>
          <CardDescription>ID: {peminjaman.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center">
            <Bike className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">Nomor Seri: {peminjaman.DataSepeda?.nomorSeri || "Tidak diketahui"}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">
              Tanggal Peminjaman: {format(new Date(peminjaman.tanggalPeminjaman), "dd MMMM yyyy", { locale: LocaleId })}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">
              Jangka Waktu: {peminjaman.jangkaPeminjaman === "harian" ? "1 Hari" : "2 Bulan"}
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">
              Tanggal Pengembalian: {format(new Date(peminjaman.tanggalPengembalian), "dd MMMM yyyy", { locale: LocaleId })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
