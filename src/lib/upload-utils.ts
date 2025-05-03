import { supabase } from "@/lib/supabase"

export async function uploadFileToStorage(file: File, bucket: string, path: string): Promise<string | null> {
  try {
    // Buat nama file unik
    const fileExt = file.name.split(".").pop()
    const fileName = `${path}/${Date.now()}.${fileExt}`

    // Upload file ke Supabase Storage dengan opsi yang lebih lengkap
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
      cacheControl: "3600",
      upsert: true, // Gunakan upsert: true untuk menimpa file jika sudah ada
      contentType: file.type, // Tambahkan content type
    })

    if (error) {
      // Jika error adalah karena file sudah ada, coba dengan nama file yang berbeda
      if (error.message.includes("The resource already exists")) {
        const newFileName = `${path}/${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`
        const { data: retryData, error: retryError } = await supabase.storage.from(bucket).upload(newFileName, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        })

        if (retryError) {
          console.error("Error uploading file (retry):", retryError)
          throw retryError
        }

        // Dapatkan URL publik dari file
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(newFileName)
        return urlData.publicUrl
      }

      console.error("Error uploading file:", error)
      throw error
    }

    // Dapatkan URL publik dari file
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName)

    if (!urlData || !urlData.publicUrl) {
      throw new Error("Gagal mendapatkan URL publik file")
    }

    return urlData.publicUrl
  } catch (error: any) {
    console.error("Error uploading file:", error)

    // Tampilkan pesan error yang lebih spesifik
    if (error.message) {
      throw new Error(`Gagal mengupload file: ${error.message}`)
    } else {
      throw new Error("Gagal mengupload file ke storage")
    }
  }
}

export async function deleteFileFromStorage(bucket: string, path: string): Promise<boolean> {
  try {
    // Hapus file dari Supabase Storage
    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      console.error("Error deleting file:", error)
      throw error
    }

    return true
  } catch (error) {
    console.error("Error deleting file:", error)
    return false
  }
}
