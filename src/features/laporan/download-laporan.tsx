"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileDown, Loader2 } from "lucide-react"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { formatDate } from "@/lib/format"
import { toast } from "sonner"

interface ReportData {
  userId: string
  Users?: { nama: string }
  DataSepeda?: { merk: string; jenis: string; nomorSeri: string }
  tanggalPeminjaman: string
  tanggalPengembalian: string
  StatusPeminjaman?: { nama: string }
  jangkaPeminjaman: number
}

export function ReportDownload({ data, month, year }: { data: ReportData[]; month: number; year: number }) {
  const [isGenerating, setIsGenerating] = useState(false)

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ]

  const generatePDF = async () => {
    setIsGenerating(true)

    try {
      // Create a new PDF document
      const doc = new jsPDF()

      // Add title
      doc.setFontSize(16)
      doc.text(`Laporan Peminjaman Sepeda IPB Bike Center`, 14, 20)

      // Add period
      doc.setFontSize(12)
      doc.text(`Periode: ${monthNames[month - 1]} ${year}`, 14, 30)

      // Add summary information
      const totalPeminjaman = data.length
      const selesaiCount = data.filter(
        (item) => item.StatusPeminjaman?.nama === "Selesai" || item.StatusPeminjaman?.nama === "Dikembalikan",
      ).length
      const berlangsungCount = data.filter(
        (item) => item.StatusPeminjaman?.nama === "Dipinjam" || item.StatusPeminjaman?.nama === "Disetujui",
      ).length
      const uniqueUsers = new Set(data.map((item) => item.userId)).size

      doc.text(`Total Peminjaman: ${totalPeminjaman}`, 14, 40)
      doc.text(`Peminjaman Selesai: ${selesaiCount}`, 14, 47)
      doc.text(`Peminjaman Berlangsung: ${berlangsungCount}`, 14, 54)
      doc.text(`Jumlah Peminjam Unik: ${uniqueUsers}`, 14, 61)

      // Add table
      const tableData = data.map((item) => [
        item.Users?.nama || "N/A",
        `${item.DataSepeda?.merk || "N/A"} (${item.DataSepeda?.jenis || "N/A"}) (${item.DataSepeda?.nomorSeri || "N/A"})`,
        formatDate(item.tanggalPeminjaman),
        formatDate(item.tanggalPengembalian),
        item.StatusPeminjaman?.nama || "N/A",
        item.jangkaPeminjaman,
      ])

      autoTable(doc, {
        startY: 70,
        head: [["Nama Peminjam", "Sepeda", "Tanggal Pinjam", "Tanggal Kembali", "Status", "Durasi"]],
        body: tableData,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 9 },
      })

      // Add footer
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.text(
          `Laporan dibuat pada ${new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}`,
          14,
          doc.internal.pageSize.height - 10,
        )
        doc.text(`Halaman ${i} dari ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10)
      }

      // Save the PDF
      doc.save(`Laporan_Peminjaman_${monthNames[month - 1]}_${year}.pdf`)
    } catch (error) {
      toast.error(`Error dalam membuat PDF: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card>
      <CardHeader className="px-4 pt-4 pb-2 sm:px-6 sm:pt-6 sm:pb-4">
        <CardTitle>Unduh Laporan PDF</CardTitle>
        <CardDescription>
          Unduh laporan peminjaman sepeda dalam format PDF untuk periode {monthNames[month - 1]} {year}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 py-2 sm:px-6 sm:py-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border rounded-md p-4">
              <p className="text-sm font-medium">Total Peminjaman</p>
              <p className="text-2xl font-bold">{data.length}</p>
            </div>
            <div className="border rounded-md p-4">
              <p className="text-sm font-medium">Periode</p>
              <p className="text-2xl font-bold">
                {monthNames[month - 1]} {year}
              </p>
            </div>
          </div>

          <div className="border rounded-md p-3 sm:p-4">
            <p className="text-sm font-medium mb-1 sm:mb-2">Informasi yang akan diunduh:</p>
            <ul className="list-disc list-inside text-xs sm:text-sm space-y-0.5 sm:space-y-1">
              <li>Data peminjam (nama)</li>
              <li>Data sepeda (merk dan jenis)</li>
              <li>Tanggal peminjaman dan pengembalian</li>
              <li>Status peminjaman</li>
              <li>Durasi peminjaman</li>
              <li>Ringkasan statistik peminjaman</li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-2 sm:px-6 sm:pb-6 sm:pt-4">
        <Button onClick={generatePDF} disabled={isGenerating || data.length === 0} className="w-full">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sedang Membuat PDF...
            </>
          ) : (
            <>
              <FileDown className="mr-2 h-4 w-4" />
              Unduh Laporan PDF
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
