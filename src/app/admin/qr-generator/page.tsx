"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { QRCodeGenerator } from "@/components/qr-code-generator"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export default function QRGeneratorPage() {
  const { user, isLoaded } = useUser()
  const [selectedSepeda, setSelectedSepeda] = useState<string>("")
  const [sepedaList, setSepedaList] = useState<{ nomorSeri: string; merk: string; jenis: string }[]>([])
  const [loading, setLoading] = useState(true)
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

  // Fetch daftar sepeda saat komponen dimount
  useEffect(() => {
    const fetchSepeda = async () => {
      if (!isAdmin) return

      try {
        const { data, error } = await supabase.from("DataSepeda").select("nomorSeri, merk, jenis").order("nomorSeri")

        if (error) throw error
        setSepedaList(data || [])
      } catch (error) {
        console.error("Error fetching sepeda:", error)
      } finally {
        setLoading(false)
      }
    }

    if (isAdmin && !loading) {
      fetchSepeda()
    }
  }, [isAdmin, loading])

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

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Generator QR Code Sepeda</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pilih Sepeda</CardTitle>
            <CardDescription>Pilih sepeda untuk membuat QR Code</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedSepeda} onValueChange={setSelectedSepeda}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih sepeda" />
              </SelectTrigger>
              <SelectContent>
                {sepedaList.map((sepeda) => (
                  <SelectItem key={sepeda.nomorSeri} value={sepeda.nomorSeri}>
                    {sepeda.nomorSeri} - {sepeda.merk} {sepeda.jenis}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <QRCodeGenerator defaultValue={selectedSepeda} />
      </div>
    </div>
  )
}
