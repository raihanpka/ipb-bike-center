"use client"

import { useAuth, useUser } from "@clerk/nextjs"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { useCallback, useEffect, useState, useRef } from "react"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function useSupabaseAuth() {
  const { getToken } = useAuth()
  const { user, isLoaded } = useUser()
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient>(() => createClient(supabaseUrl, supabaseKey))
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // Use a ref to track if we've already initialized the client for this user
  const initializedRef = useRef(false)
  // Store the current user ID to detect changes
  const userIdRef = useRef<string | null>(null)

  // Function to get Supabase client with Clerk token
  const getSupabaseClient = useCallback(async () => {
    if (!user) {
      return createClient(supabaseUrl, supabaseKey)
    }

    try {
      const token = await getToken({ template: "supabase" })

      return createClient(supabaseUrl, supabaseKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      })
    } catch (error) {
      console.error("Error getting Supabase client:", error)
      return createClient(supabaseUrl, supabaseKey)
    }
  }, [user, getToken])

  // Check if user is admin
  const checkAdminStatus = useCallback(async () => {
    try {
      // If no user, user is not admin
      if (!user) {
        setIsAdmin(false)
        return
      }

      // Check from Clerk metadata
      if (user.publicMetadata?.role === "admin") {
        setIsAdmin(true)
        return
      }

      // Check from Supabase database
      const { data, error } = await supabaseClient.from("Users").select("role").eq("id", user.id).maybeSingle()

      if (error) {
        console.error("Error querying Users table:", error)
        setIsAdmin(false)
        return
      }

      setIsAdmin(data?.role === "admin")
    } catch (error) {
      console.error("Error checking admin status:", error)
      setIsAdmin(false)
    } finally {
      setLoading(false)
    }
  }, [user, supabaseClient])

  // Update Supabase client when user changes
  useEffect(() => {
    // Only run this effect when Clerk has loaded
    if (!isLoaded) return

    // Check if the user ID has changed
    const currentUserId = user?.id || null
    const userChanged = currentUserId !== userIdRef.current

    // Only update the client if the user has changed or we haven't initialized yet
    if (userChanged || !initializedRef.current) {
      const updateClient = async () => {
        setLoading(true)
        try {
          const client = await getSupabaseClient()
          setSupabaseClient(client)
          // Update our refs
          userIdRef.current = currentUserId
          initializedRef.current = true
          // Check admin status after client is updated
          await checkAdminStatus()
        } catch (error) {
          console.error("Error in updateClient:", error)
          setLoading(false)
        }
      }

      updateClient()
    }
  }, [isLoaded, user, getSupabaseClient, checkAdminStatus])

  return {
    supabase: supabaseClient,
    isAdmin,
    loading,
    getSupabaseClient,
  }
}
