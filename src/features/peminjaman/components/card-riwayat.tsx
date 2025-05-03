"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format, parseISO } from "date-fns"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { toast } from "sonner"
import { useState, useRef } from "react"
import { Loader2, Camera, Upload } from "lucide-react"
import { uploadFileToStorage } from "@/lib/upload-utils"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileUploader } from "@/components/file-uploader"
import { id as localeId } from "date-fns/locale"
import { useUser } from "@clerk/nextjs"

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
  const { user } = useUser()
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [qrFiles, setQrFiles] = useState<File[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const formatTanggal = (tanggal: string) => {
    try {
      return format(parseISO(tanggal), "d MMMM yyyy", { locale: localeId })
    } catch (error) {
      return tanggal
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

  const handleCancel = async () => {
    if (!confirm("Apakah Anda yakin ingin membatalkan peminjaman ini?")) {
      return
    }

    setIsLoading(true)
    try {
      // Update status peminjaman menjadi Dibatalkan (5)
      const { error: updateError } = await supabase.from("Peminjaman").update({ statusId: 5 }).eq("id", id)

      if (updateError) throw updateError

      // Update status sepeda menjadi Tersedia
      const { error: sepedaError } = await supabase
        .from("DataSepeda")
        .update({ status: "Tersedia" })
        .eq("nomorSeri", nomorSeriSepeda)

      if (sepedaError) throw sepedaError

      toast.success("Peminjaman berhasil dibatalkan")
      onStatusUpdate()
    } catch (error) {
      console.error("Error cancelling peminjaman:", error)
      toast.error("Gagal membatalkan peminjaman")
    } finally {
      setIsLoading(false)
    }
  }

  const startCamera = async () => {
    try {
      if (!videoRef.current) return

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      })

      videoRef.current.srcObject = stream
      setIsCameraActive(true)
    } catch (error) {
      console.error("Error accessing camera:", error)
      toast.error("Gagal mengakses kamera. Pastikan Anda memberikan izin kamera.")
    }
  }

  const stopCamera = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return

    const stream = videoRef.current.srcObject as MediaStream
    const tracks = stream.getTracks()

    tracks.forEach((track) => track.stop())
    videoRef.current.srcObject = null
    setIsCameraActive(false)
  }

  const captureQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert canvas to blob
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          toast.error("Gagal mengambil gambar")
          return
        }

        const file = new File([blob], `qr-code-${Date.now()}.png`, { type: "image/png" })
        await uploadQRCode(file)
      },
      "image/png",
      0.9,
    )
  }

  const handleQRFileUpload = async (files: File[]) => {
    return Promise.resolve()
  }

  const uploadQRCode = async (file: File) => {
    if (!user?.id) {
      toast.error("User ID tidak valid")
      return
    }

    setIsLoading(true)
    try {
      // Upload QR code ke storage
      const qrCodeUrl = await uploadFileToStorage(supabase, file, "peminjaman", `qr/${user.id}`)

      if (!qrCodeUrl) {
        throw new Error("Gagal mengupload QR code")
      }

      // Update data peminjaman dengan URL QR code
      const { error } = await supabase.from("Peminjaman").update({ fotoQRPengembalian: qrCodeUrl }).eq("id", id)

      if (error) throw error

      toast.success("QR code berhasil diupload")
      stopCamera()
      setIsQRDialogOpen(false)
      onStatusUpdate()
    } catch (error: any) {
      console.error("Error uploading QR code:", error)
      toast.error(error.message || "Gagal mengupload QR code")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitQRUpload = async () => {
    if (qrFiles.length === 0) {
      toast.error("Silakan pilih file QR code terlebih dahulu")
      return
    }

    await uploadQRCode(qrFiles[0])
  }

  const handleDialogClose = () => {
    stopCamera()
    setIsQRDialogOpen(false)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">
              Sepeda {merkSepeda} {jenisSepeda}
            </CardTitle>
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
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Batalkan Peminjaman"
              )}
            </Button>
          )}
          {statusId === 2 && (
            <Button variant="outline" className="w-full" onClick={() => setIsQRDialogOpen(true)} disabled={isLoading}>
              Upload QR Pengembalian
            </Button>
          )}
        </CardFooter>
      </Card>

      <Dialog open={isQRDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload QR Code Pengembalian</DialogTitle>
            <DialogDescription>
              Silakan scan atau upload QR code untuk menyelesaikan proses pengembalian sepeda.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {isCameraActive ? (
              <div className="flex flex-col gap-4">
                <div className="relative rounded-lg overflow-hidden border border-input">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover" />
                </div>
                <canvas ref={canvasRef} className="hidden" />
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={stopCamera}>
                    Tutup Kamera
                  </Button>
                  <Button className="flex-1" onClick={captureQRCode} disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ambil Gambar"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full" onClick={startCamera}>
                  <Camera className="mr-2 h-4 w-4" />
                  Buka Kamera
                </Button>
                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <FileUploader
                      value={qrFiles}
                      onValueChange={setQrFiles}
                      onUpload={handleQRFileUpload}
                      accept={{ "image/*": [] }}
                      maxSize={1024 * 1024 * 2} // 2MB
                      maxFiles={1}
                    />
                    <p className="text-xs text-muted-foreground">Upload QR code pengembalian</p>
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleSubmitQRUpload}
                    disabled={qrFiles.length === 0 || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Upload QR
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
