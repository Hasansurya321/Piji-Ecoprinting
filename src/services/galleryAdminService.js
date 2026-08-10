/**
 * ===== GALLERY ADMIN SERVICE =====
 * Operasi CRUD galeri untuk panel admin.
 */
import { supabase } from '../lib/supabase';
import { deleteImage } from './storageService';

const GALLERY_SELECT = `
  id,
  category_id,
  title,
  slug,
  description,
  image_url,
  image_path,
  alt_text,
  position,
  is_active,
  created_at,
  updated_at,
  gallery_categories (
    id,
    name,
    slug
  )
`;

/**
 * Mengambil semua item galeri (termasuk non-aktif) untuk admin.
 * @returns {Promise<Array>}
 */
export async function getAllGalleries() {
  try {
    const { data, error } = await supabase.from('galleries').select(GALLERY_SELECT).order('position', { ascending: true });

    if (error) {
      console.error('[galleryAdminService] getAllGalleries error:', error.message);
      return [];
    }

    return data ?? [];
  } catch (err) {
    console.error('[galleryAdminService] getAllGalleries exception:', err.message);
    return [];
  }
}

/**
 * Mengambil satu item galeri berdasarkan id.
 * @param {string|number} id
 * @returns {Promise<object|null>}
 */
export async function getGalleryById(id) {
  try {
    const { data, error } = await supabase.from('galleries').select(GALLERY_SELECT).eq('id', id).single();

    if (error) {
      console.error('[galleryAdminService] getGalleryById error:', error.message);
      return null;
    }

    return data ?? null;
  } catch (err) {
    console.error('[galleryAdminService] getGalleryById exception:', err.message);
    return null;
  }
}

/**
 * Mengambil daftar kategori galeri.
 * @returns {Promise<Array>}
 */
export async function getGalleryCategories() {
  try {
    const { data, error } = await supabase.from('gallery_categories').select('id, name, slug').order('name', { ascending: true });

    if (error) {
      console.error('[galleryAdminService] getGalleryCategories error:', error.message);
      return [];
    }

    return data ?? [];
  } catch (err) {
    console.error('[galleryAdminService] getGalleryCategories exception:', err.message);
    return [];
  }
}

/**
 * Membuat item galeri baru.
 * @param {object} payload
 * @returns {Promise<{ gallery: object|null, error: string|null }>}
 */
export async function createGallery(payload) {
  const { title, slug, categoryId, description, image_url, image_path, alt_text, position = 0, isActive = true } = payload;

  try {
    const { data: gallery, error } = await supabase
      .from('galleries')
      .insert({
        category_id: categoryId || null,
        title,
        slug,
        description: description ?? '',
        image_url: image_url ?? '',
        image_path: image_path ?? '',
        alt_text: alt_text ?? '',
        position,
        is_active: isActive,
      })
      .select('id')
      .single();

    if (error) {
      return { gallery: null, error: `Gagal menyimpan galeri: ${error.message}` };
    }

    return { gallery, error: null };
  } catch (err) {
    return { gallery: null, error: `Gagal menyimpan galeri: ${err.message}` };
  }
}

/**
 * Memperbarui item galeri.
 * @param {string|number} id
 * @param {object} payload
 * @returns {Promise<{ success: boolean, error: string|null }>}
 */
export async function updateGallery(id, payload) {
  const { title, slug, categoryId, description, image_url, image_path, alt_text, position = 0, isActive = true } = payload;

  try {
    const { error } = await supabase
      .from('galleries')
      .update({
        category_id: categoryId || null,
        title,
        slug,
        description: description ?? '',
        image_url: image_url ?? '',
        image_path: image_path ?? '',
        alt_text: alt_text ?? '',
        position,
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      return { success: false, error: `Gagal memperbarui galeri: ${error.message}` };
    }

    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: `Gagal memperbarui galeri: ${err.message}` };
  }
}

/**
 * Menghapus item galeri beserta file di Storage.
 * @param {string|number} id
 * @returns {Promise<{ success: boolean, error: string|null }>}
 */
export async function deleteGallery(id) {
  try {
    // 1. Ambil image_path
    const { data: gallery, error: fetchError } = await supabase.from('galleries').select('image_path').eq('id', id).single();

    if (fetchError) {
      return { success: false, error: `Gagal mengambil data galeri: ${fetchError.message}` };
    }

    // 2. Hapus file dari Storage
    if (gallery?.image_path) {
      const deleted = await deleteImage('gallery-images', gallery.image_path);
      if (!deleted) {
        return { success: false, error: 'Data galeri tersimpan, tetapi file gambar gagal dihapus. Periksa storage.' };
      }
    }

    // 3. Hapus record galeri
    const { error: deleteError } = await supabase.from('galleries').delete().eq('id', id);

    if (deleteError) {
      return { success: false, error: `Gagal menghapus galeri: ${deleteError.message}` };
    }

    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: `Gagal menghapus galeri: ${err.message}` };
  }
}
