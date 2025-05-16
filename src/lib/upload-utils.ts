// lib/upload-utils.ts
import type { SupabaseClient } from '@supabase/supabase-js';

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
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}/${Date.now()}.${fileExt}`;

    const { error } = await client.storage.from(bucket).upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type
    });

    if (error) throw error;

    const { data: urlData } = client.storage
      .from(bucket)
      .getPublicUrl(fileName);

    if (!urlData.publicUrl) throw new Error('Gagal mendapatkan URL publik');

    return urlData.publicUrl;
  } catch (err: any) {
    throw new Error(`Gagal mengupload file: ${err.message}`);
  }
}

/**
 * Delete file dari Supabase Storage.
 * @param client  SupabaseClient hasil dari useSupabaseAuth()
 * @param bucket  Nama bucket (misal 'peminjaman')
 * @param path    Path target di bucket, misal 'peminjam/{userId}'
 */

async function listAllFilesRecursively(
  client: SupabaseClient,
  bucket: string,
  folder: string
): Promise<string[]> {
  const filePaths: string[] = [];
  const queue: string[] = [folder];

  while (queue.length > 0) {
    const currentFolder = queue.pop()!;
    const { data, error } = await client.storage
      .from(bucket)
      .list(currentFolder, { limit: 1000 });

    if (error) throw error;

    for (const item of data) {
      const fullPath = `${currentFolder}/${item.name}`;
      if (item.metadata) {
        // File
        filePaths.push(fullPath);
      } else {
        // Folder, antri untuk dijelajahi
        queue.push(fullPath);
      }
    }
  }

  return filePaths;
}

export async function deleteFileFromStorage(
  client: SupabaseClient,
  bucket: string,
  folderPath: string
): Promise<void> {
  const prefix = folderPath.endsWith('/')
    ? folderPath.slice(0, -1)
    : folderPath;

  try {
    const allFilePaths = await listAllFilesRecursively(client, bucket, prefix);

    if (allFilePaths.length === 0) return;

    const { error: removeError } = await client.storage
      .from(bucket)
      .remove(allFilePaths);
    if (removeError) throw removeError;
  } catch (err: any) {
    throw new Error(`Gagal menghapus folder dan isinya: ${err.message}`);
  }
}
