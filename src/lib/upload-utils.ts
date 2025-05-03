// lib/upload-utils.ts
import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Upload file ke Supabase Storage.
 * @param client  SupabaseClient hasil dari useSupabaseAuth()
 * @param file    File yang akan di-upload
 * @param bucket  Nama bucket (misal 'peminjaman')
 * @param path    Path target di bucket, misal 'peminjam/{userId}'
 */
export async function uploadFileToStorage(
  client: SupabaseClient,
  file: File,
  bucket: string,
  path: string
): Promise<string> {
  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `${path}/${Date.now()}.${fileExt}`

    const { error } = await client
      .storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type,
      })

    if (error) throw error

    const { data: urlData } = client
      .storage
      .from(bucket)
      .getPublicUrl(fileName)

    if (!urlData.publicUrl) throw new Error("Gagal mendapatkan URL publik")

    return urlData.publicUrl
  } catch (err: any) {
    console.error("Error uploading file:", err)
    throw new Error(`Gagal mengupload file: ${err.message}`)
  }
}
