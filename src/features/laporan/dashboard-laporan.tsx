"use client"

import { useState, useEffect } from "react"
import { ReportSummaryCards } from "./cards-laporan"
import { ReportFilter } from "./filter-laporan"
import { ReportTable } from "./tabel-laporan"
import { ReportDownload } from "./download-laporan"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function ReportDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  interface Peminjaman {
    id: number
    userId: number
    nomorSeriSepeda: string
    tanggalPeminjaman: string
    jangkaPeminjaman: number
    tanggalPengembalian: string | null
    statusId: number
    nomorTeleponAktif: string
    createdAt: string
    updatedAt: string
    Users: {
      nama: string
      email: string
    }
    DataSepeda: {
      merk: string
      jenis: string
      nomorSeri?: string
    }
    StatusPeminjaman: {
      nama: string
    }
  }

  const [peminjamanData, setPeminjamanData] = useState<Peminjaman[]>([])
  const [filteredData, setFilteredData] = useState<Peminjaman[]>([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

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
          createdAt,
          updatedAt,
            Users:Users (nama, email),
            DataSepeda:DataSepeda (merk, jenis, nomorSeri),
            StatusPeminjaman:StatusPeminjaman (nama)
        `)
        .order("tanggalPeminjaman", { ascending: false })

      if (error) {
        toast.error("Error fetching data:" + error.message)
        return
      }

      setPeminjamanData(
        (data || []).map((item: any) => ({
          ...item,
          Users: Array.isArray(item.Users) ? item.Users[0] : item.Users,
          DataSepeda: Array.isArray(item.DataSepeda) ? item.DataSepeda[0] : item.DataSepeda,
          StatusPeminjaman: Array.isArray(item.StatusPeminjaman) ? item.StatusPeminjaman[0] : item.StatusPeminjaman,
        })),
      )
      setIsLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    const filtered = peminjamanData.filter((item) => {
      const peminjamanDate = new Date(item.tanggalPeminjaman)
      return peminjamanDate.getMonth() + 1 === selectedMonth && peminjamanDate.getFullYear() === selectedYear
    })
    setFilteredData(filtered)
  }, [peminjamanData, selectedMonth, selectedYear])

  const handleFilterChange = (month: number, year: number) => {
    setSelectedMonth(month)
    setSelectedYear(year)
  }

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[120px] sm:h-[200px] w-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Skeleton className="h-[100px] sm:h-[120px]" />
            <Skeleton className="h-[100px] sm:h-[120px]" />
            <Skeleton className="h-[100px] sm:h-[120px]" />
          </div>
        </div>
      ) : (
        <>
          <ReportFilter onFilterChange={handleFilterChange} selectedMonth={selectedMonth} selectedYear={selectedYear} />

          <ReportSummaryCards data={filteredData.map((item) => ({ ...item, userId: item.userId.toString() }))} />

          <Tabs defaultValue="table" className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="table" className="flex-1">
                Tabel Data
              </TabsTrigger>
              <TabsTrigger value="download" className="flex-1">
                Unduh Laporan
              </TabsTrigger>
            </TabsList>
            <TabsContent value="table" className="mt-0">
              <ReportTable
                data={filteredData.map((item) => ({
                  ...item,
                  id: item.id.toString(),
                  tanggalPengembalian: item.tanggalPengembalian || "",
                  jangkaPeminjaman: item.jangkaPeminjaman.toString(),
                  DataSepeda: {
                    ...item.DataSepeda,
                    nomorSeri: item.DataSepeda?.nomorSeri ?? item.nomorSeriSepeda ?? "",
                  },
                }))}
              />
            </TabsContent>
            <TabsContent value="download" className="mt-0">
              <ReportDownload
                data={filteredData.map((item) => ({
                  ...item,
                  userId: item.userId.toString(),
                  tanggalPengembalian: item.tanggalPengembalian || "",
                  DataSepeda: {
                    ...item.DataSepeda,
                    nomorSeri: item.DataSepeda?.nomorSeri ?? item.nomorSeriSepeda ?? "",
                  },
                }))}
                month={selectedMonth}
                year={selectedYear}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
