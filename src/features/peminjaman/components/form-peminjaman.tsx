"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, addDays, addMonths } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { FileUploader } from "@/components/file-uploader"
import { uploadFileToStorage } from "@/lib/upload-utils"
import { toast } from "sonner"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"

type JenisSepeda = string

export function FormPeminjaman() {
  const router = useRouter()
  const { user } = useUser()
  const { supabase, loading: authLoading } = useSupabaseAuth()

  const [tanggalPeminjaman, setTanggalPeminjaman] = useState<Date | undefined>(undefined)
  const [jangkaPeminjaman, setJangkaPeminjaman] = useState<string>("Harian")
  const [jenisSepeda, setJenisSepeda] = useState<string>("")
  const [nomorTelepon, setNomorTelepon] = useState<string>("")
  const [fotoPeminjam, setFotoPeminjam] = useState<File[]>([])
  const [fotoKTM, setFotoKTM] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [jenisSepedaOptions, setJenisSepedaOptions] = useState<JenisSepeda[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch jenis sepeda saat komponen dimount
  useEffect(() => {
    const fetchJenisSepeda = async () => {
      try {
        // Versi yang disederhanakan - ambil semua sepeda dengan filter status "Tersedia"
        const { data } = await supabase.from("DataSepeda").select("jenis").eq("status", "Tersedia").order("jenis")

        if (!data || data.length === 0) {
          // Jika tidak ada data, gunakan data dummy untuk testing
          setJenisSepedaOptions(["Gunung", "Lipat", "Keranjang"])
          toast.warning("Menggunakan data sepeda default")
          return
        }

        // Ambil jenis sepeda unik
        const uniqueJenis = Array.from(new Set(data.map((item) => item.jenis)))
        setJenisSepedaOptions(uniqueJenis)
      } catch (error) {
        console.log("Gagal memuat data jenis sepeda, menggunakan data default")
        // Gunakan data dummy jika terjadi error
        setJenisSepedaOptions(["Gunung", "Lipat", "Keranjang"])
        toast.warning("Menggunakan data sepeda default")
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading) {
      fetchJenisSepeda()
    }
  }, [supabase, authLoading])

  // Hitung tanggal pengembalian berdasarkan jangka waktu
  const hitungTanggalPengembalian = useCallback((tanggal: Date, jangka: string) => {
    if (jangka === "Harian") {
      return addDays(tanggal, 1)
    } else {
      return addMonths(tanggal, 2)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!tanggalPeminjaman || !jangkaPeminjaman || !jenisSepeda || !nomorTelepon) {
      toast.error("Mohon lengkapi semua field")
      return
    }

    if (fotoPeminjam.length === 0) {
      toast.error("Mohon upload foto diri Anda")
      return
    }

    if (fotoKTM.length === 0) {
      toast.error("Mohon upload foto KTM Anda")
      return
    }

    if (!user?.id) {
      toast.error("Sesi pengguna tidak valid, silakan login ulang")
      return
    }

    setIsSubmitting(true)

    try {
      // Hitung tanggal pengembalian
      const tanggalPengembalian = hitungTanggalPengembalian(tanggalPeminjaman, jangkaPeminjaman)

      // Upload foto peminjam
      const fotoPeminjamUrl = await uploadFileToStorage(supabase, fotoPeminjam[0], "peminjaman", `peminjam/${user.id}`)

      // Upload foto KTM
      const fotoKTMUrl = await uploadFileToStorage(supabase, fotoKTM[0], "peminjaman", `ktm/${user.id}`)

      if (!fotoPeminjamUrl || !fotoKTMUrl) {
        throw new Error("Gagal mengupload foto")
      }

      // Cari sepeda yang tersedia dengan jenis yang dipilih
      const { data: availableBikes, error: bikesError } = await supabase
        .from("DataSepeda")
        .select("nomorSeri")
        .eq("jenis", jenisSepeda)
        .eq("status", "Tersedia")
        .limit(1)

      if (bikesError || !availableBikes || availableBikes.length === 0) {
        throw new Error("Tidak ada sepeda tersedia untuk jenis yang dipilih")
      }

      const nomorSeriSepeda = availableBikes[0].nomorSeri

      // Simpan data peminjaman
      const { error } = await supabase.from("Peminjaman").insert({
        userId: user.id, // Use Clerk ID directly
        nomorSeriSepeda,
        tanggalPeminjaman: format(tanggalPeminjaman, "yyyy-MM-dd"),
        jangkaPeminjaman,
        tanggalPengembalian: format(tanggalPengembalian, "yyyy-MM-dd"),
        statusId: 1, // 1 = Menunggu Persetujuan
        nomorTeleponAktif: nomorTelepon,
        fotoPeminjam: fotoPeminjamUrl,
        fotoKTM: fotoKTMUrl,
      })

      if (error) throw error

      // Update status sepeda menjadi 'menunggu persetujuan'
      const { error: updateError } = await supabase
        .from("DataSepeda")
        .update({ status: "Dipinjam" })
        .eq("nomorSeri", nomorSeriSepeda)

      if (updateError) throw updateError

      toast.success("Pengajuan peminjaman sepeda berhasil diajukan")

      // Reset form
      setTanggalPeminjaman(undefined)
      setJangkaPeminjaman("Harian")
      setJenisSepeda("")
      setNomorTelepon("")
      setFotoPeminjam([])
      setFotoKTM([])

      // Redirect ke halaman riwayat peminjaman
      router.push("/dashboard/peminjaman/riwayat")
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat mengajukan peminjaman")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFotoPeminjamUpload = async (files: File[]) => {
    return Promise.resolve()
  }

  const handleFotoKTMUpload = async (files: File[]) => {
    return Promise.resolve()
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Memuat data...</span>
      </div>
    )
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className="text-2xl">Pengajuan Peminjaman Sepeda</CardTitle>
        <CardDescription>Silakan isi form berikut untuk mengajukan peminjaman sepeda</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="tanggal">Tanggal Peminjaman</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !tanggalPeminjaman && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {tanggalPeminjaman ? format(tanggalPeminjaman, "PPP") : "Pilih tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={tanggalPeminjaman}
                  onSelect={setTanggalPeminjaman}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Jangka Waktu Peminjaman</Label>
            <RadioGroup
              value={jangkaPeminjaman}
              onValueChange={setJangkaPeminjaman}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Harian" id="Harian" />
                <Label htmlFor="Harian">Harian (1 Hari)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2bulan" id="2bulan" />
                <Label htmlFor="2bulan">2 Bulan</Label>
              </div>
            </RadioGroup>
            <p className="text-sm text-muted-foreground mt-1">
              {jangkaPeminjaman === "Harian"
                ? "Sepeda harus dikembalikan pada hari berikutnya"
                : "Sepeda harus dikembalikan dalam 2 bulan"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jenisSepeda">Jenis Sepeda</Label>
            <Select value={jenisSepeda} onValueChange={setJenisSepeda}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis sepeda" />
              </SelectTrigger>
              <SelectContent>
                {jenisSepedaOptions.map((jenis) => (
                  <SelectItem key={jenis} value={jenis}>
                    Sepeda {jenis}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nomorTelepon">Nomor Telepon Aktif</Label>
            <Input
              id="nomorTelepon"
              type="tel"
              value={nomorTelepon}
              onChange={(e) => setNomorTelepon(e.target.value)}
              placeholder="Masukkan nomor telepon aktif"
            />
          </div>

          <div className="space-y-2">
            <Label>Foto Diri</Label>
            <FileUploader
              value={fotoPeminjam}
              onValueChange={setFotoPeminjam}
              onUpload={handleFotoPeminjamUpload}
              accept={{ "image/*": [] }}
              maxSize={1024 * 1024 * 2} // 2MB
              maxFiles={1}
            />
            <p className="text-xs text-muted-foreground">Upload foto diri Anda dengan wajah terlihat jelas</p>
          </div>

          <div className="space-y-2">
            <Label>Foto KTM</Label>
            <FileUploader
              value={fotoKTM}
              onValueChange={setFotoKTM}
              onUpload={handleFotoKTMUpload}
              accept={{ "image/*": [] }}
              maxSize={1024 * 1024 * 2} // 2MB
              maxFiles={1}
            />
            <p className="text-xs text-muted-foreground mb-4">Upload foto KTM Anda dengan informasi terlihat jelas</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Ajukan Peminjaman"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
