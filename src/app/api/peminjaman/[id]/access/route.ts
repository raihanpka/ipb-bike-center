import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId: clerkUserId } = await auth()
  const peminjamanId = params.id

  if (!clerkUserId) {
    return NextResponse.json({ hasAccess: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Check if user is admin
    const { data: userData, error: userError } = await supabase
      .from("Users")
      .select("role")
      .eq("id", clerkUserId)
      .maybeSingle()

    if (userError) {
      console.error("Error checking user role:", userError)
    }

    const isAdmin = userData?.role === "admin"

    // Check if peminjaman belongs to user
    const { data: peminjamanData, error: peminjamanError } = await supabase
      .from("Peminjaman")
      .select("userId")
      .eq("id", peminjamanId)
      .maybeSingle()

    if (peminjamanError) {
      return NextResponse.json({ hasAccess: false, error: "Peminjaman not found" }, { status: 404 })
    }

    // User has access if they're admin or the peminjaman belongs to them
    const hasAccess = isAdmin || peminjamanData?.userId === clerkUserId

    return NextResponse.json({ hasAccess })
  } catch (error) {
    console.error("Error checking access:", error)
    return NextResponse.json({ hasAccess: false, error: "Failed to verify access" }, { status: 500 })
  }
}
