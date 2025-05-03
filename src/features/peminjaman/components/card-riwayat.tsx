"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format, parseISO } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { toast } from "sonner"
import { useState, useRef } from "react"
import { Loader2, Camera } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileUploader } from "@/components/file-uploader"
import QrScanner from "qr-scanner"

interface CardRiwayatProps {
  id: string
  nomorSeriSepeda: string
  tanggalPeminjaman: string
  jangkaPeminjaman: string
  tanggalPengembalian: string
  statusId: number
  statusNama: string
  jenisSepeda: string
  merkSepeda: string
  onStatusUpdate: () => void
}

export function CardRiwayat({
  id,
  nomorSeriSepeda,
  tanggalPeminjaman,
  jangkaPeminjaman,
  tanggalPengembalian,
  statusId,
  statusNama,
  jenisSepeda,
  merkSepeda,
  onStatusUpdate,
}: CardRiwayatProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { supabase } = useSupabaseAuth()
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [scanner, setScanner] = useState<QrScanner>()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [qrFiles, setQrFiles] = useState<File[]>([])

  // Format tanggal
  const formatTanggal = (tanggal: string) => {
    try {
      return format(parseISO(tanggal), "d MMMM yyyy", { locale: localeId })
    } catch {
      return tanggal
    }
  }

  // Warna badge
  const getStatusColor = (statusId: number) => {
    switch (statusId) {
      case 1:
        return "bg-yellow-100 text-yellow-800"
      case 2:
        return "bg-green-100 text-green-800"
      case 3:
        return "bg-red-100 text-red-800"
      case 4:
        return "bg-blue-100 text-blue-800"
      case 5:
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Batalkan peminjaman (tetap pakai supabase)
  const handleCancel = async () => {
    if (!confirm("Apakah Anda yakin ingin membatalkan peminjaman ini?")) return
    setIsLoading(true)
    try {
      await supabase.from("Peminjaman").update({ statusId: 5 }).eq("id", id)
      await supabase.from("DataSepeda").update({ status: "Tersedia" }).eq("nomorSeri", nomorSeriSepeda)
      toast.success("Peminjaman berhasil dibatalkan")
      onStatusUpdate()
    } catch {
      toast.error("Gagal membatalkan peminjaman")
    } finally {
      setIsLoading(false)
    }
  }

  // Mulai kamera & QR-scanning otomatis
  const startCamera = async () => {
    setIsCameraActive(true)
    await new Promise(requestAnimationFrame)

    const videoEl = videoRef.current!
    // nonaktifkan PIP bila ada
    if ("disablePictureInPicture" in videoEl) {
      videoEl.disablePictureInPicture = true
    }

    const qr = new QrScanner(
      videoEl,
      (result) => {
        // result adalah string data QR
        if (result.data === nomorSeriSepeda) {
          toast.success("QR code sesuai nomor seri!")
          qr.stop()
          setScanner(undefined)
          setIsQRDialogOpen(false)
          onStatusUpdate()
        } else {
          toast.error("QR code tidak sesuai nomor seri.")
        }
      },
      {
        preferredCamera: "environment",
        maxScansPerSecond: 8,
      }
    )
    setScanner(qr)
    await qr.start()
  }

  // Hentikan kamera
  const stopCamera = () => {
    scanner?.stop()
    scanner?.destroy()
    setScanner(undefined)
    setIsCameraActive(false)
  }

  // Scan dari upload file
  const handleQRFile = async (files: File[]) => {
    if (!files.length) return
    setIsLoading(true)
    try {
      const file = files[0]
      // scanImage mengembalikan string atau null
      const data = await QrScanner.scanImage(file)
      if (data === nomorSeriSepeda) {
        toast.success("QR code sesuai nomor seri!")
        setIsQRDialogOpen(false)
        onStatusUpdate()
      } else {
        toast.error("QR code tidak sesuai nomor seri.")
      }
    } catch {
      toast.error("Gagal memindai file QR.")
    } finally {
      setIsLoading(false)
    }
  }

  const openDialog = () => {
    setIsQRDialogOpen(true)
  }
  const closeDialog = () => {
    stopCamera()
    setIsQRDialogOpen(false)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>Sepeda {merkSepeda} {jenisSepeda}</CardTitle>
            <Badge className={getStatusColor(statusId)}>{statusNama}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nomor Seri:</span>
            <span className="font-medium">{nomorSeriSepeda}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tanggal Peminjaman:</span>
            <span className="font-medium">{formatTanggal(tanggalPeminjaman)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Jangka Waktu:</span>
            <span className="font-medium">{jangkaPeminjaman}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tanggal Pengembalian:</span>
            <span className="font-medium">{formatTanggal(tanggalPengembalian)}</span>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          {statusId === 1 && (
            <Button variant="destructive" className="w-full" onClick={handleCancel} disabled={isLoading}>
              {isLoading
                ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> 
                : "Batalkan Peminjaman"}
            </Button>
          )}
          {statusId === 2 && (
            <Button variant="outline" className="w-full" onClick={openDialog} disabled={isLoading}>
              Upload / Scan QR Pengembalian
            </Button>
          )}
        </CardFooter>
      </Card>

      <Dialog open={isQRDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan QR Code Pengembalian</DialogTitle>
            <DialogDescription>
              Pilih opsi untuk scan langsung dari kamera atau upload file gambar QR.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {isCameraActive ? (
              <div className="relative rounded-lg overflow-hidden border border-input">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ transform: "scaleX(-1)" }}
                  className="w-full h-64 object-cover"
                />
                <div className="flex justify-end mt-2">
                  <Button variant="outline" onClick={stopCamera}>
                    Tutup Kamera
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={startCamera}
                  disabled={isLoading}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Buka Kamera
                </Button>

                <FileUploader
                  value={qrFiles}
                  onValueChange={setQrFiles}
                  onUpload={handleQRFile}
                  accept={{ "image/*": [] }}
                  maxSize={1024 * 1024 * 2}
                  maxFiles={1}
                />
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
