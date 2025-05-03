"use client"

import { useUser } from "@clerk/nextjs"
import { FormPeminjaman } from "@/features/peminjaman/components/form-peminjaman"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PeminjamanPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading...</span>
      </div>
    )
  }

  if (!user) {
    router.push("/sign-in")
    return null
  }

  return (
    <div className="container mx-auto py-10 px-4 overflow-y-auto">
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto pb-6">
        <FormPeminjaman />
      </div>
    </div>
  )
}
