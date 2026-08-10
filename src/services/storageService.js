import { supabase } from '../lib/supabase';

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

/**
 * Validate a file before upload.
 * @param {File} file - File to validate
 * @param {{ allowedExtensions?: string[], maxSize?: number }} [options]
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateFile(file, options = {}) {
  const allowedExtensions = options.allowedExtensions ?? ALLOWED_EXTENSIONS;
  const maxSize = options.maxSize ?? MAX_FILE_SIZE;

  if (!file) {
    return { valid: false, message: 'File tidak ditemukan.' };
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!allowedExtensions.includes(ext)) {
    return { valid: false, message: `Format file harus ${allowedExtensions.join(', ').toUpperCase()}.` };
  }

  if (file.size > maxSize) {
    return { valid: false, message: `Ukuran file maksimal ${Math.round(maxSize / 1024 / 1024)}MB.` };
  }

  return { valid: true };
}

/**
 * Build a storage path for a product or gallery image.
 * @param {string} bucket - bucket name ('product-images' | 'gallery-images')
 * @param {string} entityId - product/gallery id or 'temp'
 * @param {File} file - original file
 * @param {string} [prefix] - optional subfolder prefix
 * @returns {string} storage path
 */
export function buildStoragePath(bucket, entityId, file, prefix = '') {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const timestamp = Date.now();
  const safeName = `${timestamp}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const base = prefix ? `${prefix}/` : '';
  return `${base}${bucket}/${entityId}/${safeName}`;
}

/**
 * Upload a file to Supabase Storage.
 * @param {string} bucket - bucket name
 * @param {string} path - storage path
 * @param {File} file - file to upload
 * @returns {Promise<{ publicUrl: string, path: string }>}
 */
export async function uploadImage(bucket, path, file) {
  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (uploadError) {
    throw new Error(`Gagal mengunggah gambar: ${uploadError.message}`);
  }

  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path);

  return {
    publicUrl: publicData?.publicUrl ?? '',
    path,
  };
}

/**
 * Delete a file from Supabase Storage.
 * @param {string} bucket - bucket name
 * @param {string} path - storage path
 * @returns {Promise<boolean>}
 */
export async function deleteImage(bucket, path) {
  if (!path) return true;

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    console.error('Gagal menghapus file dari storage:', error.message);
    return false;
  }

  return true;
}

/**
 * Delete multiple files from Supabase Storage.
 * @param {string} bucket - bucket name
 * @param {string[]} paths - array of storage paths
 * @returns {Promise<{ success: string[], failed: string[] }>}
 */
export async function deleteImages(bucket, paths = []) {
  const success = [];
  const failed = [];

  for (const path of paths) {
    if (!path) continue;
    // eslint-disable-next-line no-await-in-loop
    const ok = await deleteImage(bucket, path);
    if (ok) {
      success.push(path);
    } else {
      failed.push(path);
    }
  }

  return { success, failed };
}
