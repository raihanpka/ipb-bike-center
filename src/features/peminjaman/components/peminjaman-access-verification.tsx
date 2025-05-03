"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

type PeminjamanAccessVerificationProps = {
  peminjamanId: string
  children: React.ReactNode
}

export function PeminjamanAccessVerification({ peminjamanId, children }: PeminjamanAccessVerificationProps) {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/peminjaman/${peminjamanId}/access`)
        const data = await response.json()

        setHasAccess(data.hasAccess)
      } catch (error) {
        console.error("Error checking access:", error)
        setHasAccess(false)
      } finally {
        setLoading(false)
      }
    }

    if (isLoaded) {
      checkAccess()
    }
  }, [user, isLoaded, peminjamanId])

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading...</span>
      </div>
    )
  }

  if (!hasAccess) {
    router.push("/peminjaman/riwayat")
    return null
  }

  return <>{children}</>
}
