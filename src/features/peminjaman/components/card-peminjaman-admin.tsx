"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { id as LocaleId } from "date-fns/locale"
import { Bike, Calendar, Clock, User, Check, X, Phone, Eye } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

type PeminjamanAdminCardProps = {
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
  onStatusUpdate: () => void
}

export function CardPeminjamanAdmin({
  id,
  userId,
  nomorSeriSepeda,
  tanggalPeminjaman,
  jangkaPeminjaman,
  tanggalPengembalian,
  statusId,
  statusNama,
  jenisSepeda,
  merkSepeda,
  namaUser,
  emailUser,
  nomorTeleponAktif,
  fotoPeminjam,
  fotoKTM,
  fotoQRPengembalian,
  onStatusUpdate,
}: PeminjamanAdminCardProps) {
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleApprove = async () => {
    setIsSubmitting(true)

    try {
      // Update status peminjaman
      const { error: peminjamanError } = await supabase
        .from("Peminjaman")
        .update({ statusId: 2 }) // 2 = Disetujui
        .eq("id", id)

      if (peminjamanError) throw peminjamanError

      // Update status sepeda
      const { error: sepedaError } = await supabase
        .from("DataSepeda")
        .update({ status: "Dipinjam" })
        .eq("nomorSeri", nomorSeriSepeda)

      if (sepedaError) throw sepedaError

      toast.success("Peminjaman berhasil disetujui")
      onStatusUpdate()
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat menyetujui peminjaman")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    setIsSubmitting(true)

    try {
      // Update status peminjaman
      const { error: peminjamanError } = await supabase
        .from("Peminjaman")
        .update({ statusId: 3 }) // 3 = Ditolak
        .eq("id", id)

      if (peminjamanError) throw peminjamanError

      // Update status sepeda
      const { error: sepedaError } = await supabase
        .from("DataSepeda")
        .update({ status: "Tersedia" })
        .eq("nomorSeri", nomorSeriSepeda)

      if (sepedaError) throw sepedaError

      toast.success("Peminjaman berhasil ditolak")
      onStatusUpdate()
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat menolak peminjaman")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleComplete = async () => {
    setIsSubmitting(true)

    try {
      // Update status peminjaman
      const { error: peminjamanError } = await supabase
        .from("Peminjaman")
        .update({ statusId: 4 }) // 4 = Selesai
        .eq("id", id)

      if (peminjamanError) throw peminjamanError

      // Update status sepeda
      const { error: sepedaError } = await supabase
        .from("DataSepeda")
        .update({ status: "Tersedia" })
        .eq("nomorSeri", nomorSeriSepeda)

      if (sepedaError) throw sepedaError

      toast.success("Peminjaman berhasil diselesaikan")
      onStatusUpdate()
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat menyelesaikan peminjaman")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (statusId: number) => {
    switch (statusId) {
      case 1: // Menunggu Persetujuan
        return "bg-yellow-100 text-yellow-800"
      case 2: // Disetujui
        return "bg-green-100 text-green-800"
      case 3: // Ditolak
        return "bg-red-100 text-red-800"
      case 4: // Selesai
        return "bg-blue-100 text-blue-800"
      case 5: // Dibatalkan
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">
              {merkSepeda} {jenisSepeda}
            </CardTitle>
            <Badge className={getStatusColor(statusId)}>{statusNama}</Badge>
          </div>
          <CardDescription>ID: {id.slice(0, 8)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">{namaUser}</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">{nomorTeleponAktif}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">
              Tanggal: {format(new Date(tanggalPeminjaman), "dd MMMM yyyy", { locale: LocaleId })}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">Jangka Waktu: {jangkaPeminjaman === "Harian" ? "1 Hari" : "2 Bulan"}</span>
          </div>
          <div className="flex items-center">
            <Bike className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">No. Seri: {nomorSeriSepeda}</span>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 justify-end">
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
            onClick={() => setIsDetailDialogOpen(true)}
          >
            <Eye className="h-4 w-4" /> Detail
          </Button>

          {statusId === 1 && ( // Menunggu Persetujuan
            <>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
                onClick={handleReject}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4" /> Tolak
              </Button>
              <Button size="sm" className="flex items-center gap-1" onClick={handleApprove} disabled={isSubmitting}>
                <Check className="h-4 w-4" /> Setujui
              </Button>
            </>
          )}

          {statusId === 2 && ( // Disetujui
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
              onClick={handleComplete}
              disabled={isSubmitting}
            >
              <Check className="h-4 w-4" /> Selesai
            </Button>
          )}
        </CardFooter>
      </Card>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detail Peminjaman</DialogTitle>
            <DialogDescription>Detail lengkap peminjaman sepeda</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Informasi Peminjam</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Nama:</span> {namaUser}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> {emailUser}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">No. Telepon:</span> {nomorTeleponAktif}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Informasi Sepeda</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Merk:</span> {merkSepeda}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Jenis:</span> {jenisSepeda}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">No. Seri:</span> {nomorSeriSepeda}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Informasi Peminjaman</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Tanggal Peminjaman:</span>{" "}
                    {format(new Date(tanggalPeminjaman), "dd MMMM yyyy", { locale: LocaleId })}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Jangka Waktu:</span>{" "}
                    {jangkaPeminjaman === "Harian" ? "1 Hari" : "2 Bulan"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Tanggal Pengembalian:</span>{" "}
                    {format(new Date(tanggalPengembalian), "dd MMMM yyyy", { locale: LocaleId })}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Status:</span>{" "}
                    <Badge className={getStatusColor(statusId)}>{statusNama}</Badge>
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Foto Peminjam</h3>
                {fotoPeminjam ? (
                  <div className="border rounded-md overflow-hidden">
                    <Image
                      src={fotoPeminjam || "/placeholder.svg"}
                      alt="Foto Peminjam"
                      width={300}
                      height={300}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Tidak ada foto peminjam</p>
                )}
              </div>
              <div>
                <h3 className="font-medium mb-2">Foto KTM</h3>
                {fotoKTM ? (
                  <div className="border rounded-md overflow-hidden">
                    <Image
                      src={fotoKTM || "/placeholder.svg"}
                      alt="Foto KTM"
                      width={300}
                      height={300}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Tidak ada foto KTM</p>
                )}
              </div>
              {fotoQRPengembalian && (
                <div>
                  <h3 className="font-medium mb-2">Foto QR Pengembalian</h3>
                  <div className="border rounded-md overflow-hidden">
                    <Image
                      src={fotoQRPengembalian || "/placeholder.svg"}
                      alt="Foto QR Pengembalian"
                      width={300}
                      height={300}
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
