import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  const peminjamanId = params.id

  if (!userId) {
    return NextResponse.json({ hasAccess: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Cek apakah user adalah admin
    const { data: userData, error: userError } = await supabase.from("Users").select("role").eq("id", userId).single()

    if (userError) throw userError

    const isAdmin = userData?.role === "admin"

    // Cek apakah peminjaman milik user atau user adalah admin
    const { data: peminjamanData, error: peminjamanError } = await supabase
      .from("Peminjaman")
      .select("userId")
      .eq("id", peminjamanId)
      .single()

    if (peminjamanError) {
      return NextResponse.json({ hasAccess: false, error: "Peminjaman not found" }, { status: 404 })
    }

    const hasAccess = isAdmin || peminjamanData.userId === userId

    return NextResponse.json({ hasAccess })
  } catch (error) {
    console.error("Error checking access:", error)
    return NextResponse.json({ hasAccess: false, error: "Server error" }, { status: 500 })
  }
}
