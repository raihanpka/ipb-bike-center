import { createClient } from "@supabase/supabase-js"

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseURL || !supabaseKey) {
  throw new Error("Supabase environment variables are not set")
}

export const supabase = createClient(
  supabaseURL,
  supabaseKey,
  {
    global: {
      // set custom fetch untuk inject Authorization header
      fetch: async (input, init) => {
        // getToken hanya bisa di hook, jadi kita delegasikan di komponen
        return fetch(input, init)
      }
    }
  }
)