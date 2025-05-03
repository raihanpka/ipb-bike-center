// lib/supabase.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Supabase environment variables are not set")
}

// 1) Buat satu instance Supabase global
export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    // 2) Override fetch global — header Authorization akan di-attach
    //    setiap kali fungsi `setAuthToken` dipanggil untuk setSession
    global: {
      fetch: async (input, init = {}) => {
        // Supabase client sendiri akan lakukan fetch di sini,
        // dan jika kamu sudah memanggil `injectAuthToken`,
        // maka header Authorization akan ter-set otomatis
        return fetch(input, init)
      },
    },
  }
)

/**
 * Panggil ini setiap kali kamu memperoleh Clerk JWT di komponen
 * (contoh: dari `useAuth().getToken()`), sebelum melakukan operasi Supabase.
 */
export function injectAuthToken(token: string) {
  // Supabase v2: pakai setSession untuk inject access_token
  supabase.auth.setSession({ access_token: token, refresh_token: "" })
}
