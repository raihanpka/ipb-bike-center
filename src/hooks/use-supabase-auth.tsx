"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export function useSupabaseAuth() {
  const { user, isLoaded } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // Cek apakah user adalah admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user || !isLoaded) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      try {
        // Cek dari metadata Clerk (cara paling sederhana dan cepat)
        if (user.publicMetadata?.role === "admin") {
          setIsAdmin(true)
          setLoading(false)
          return
        }

        // Jika tidak ada di metadata, coba cek di database
        // Ini opsional, bisa dihapus jika hanya mengandalkan Clerk metadata
        try {
          const { data } = await supabase.from("Users").select("role").eq("id", user.id).maybeSingle()

          setIsAdmin(data?.role === "admin")
        } catch (dbError) {
          console.log("Tidak bisa mengecek role dari database, hanya menggunakan Clerk metadata")
        }
      } catch (error) {
        console.log("Error checking admin status, defaulting to non-admin")
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [user, isLoaded])

  return {
    supabase,
    isAdmin,
    loading,
    user,
  }
}
