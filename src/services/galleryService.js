/**
 * ===== GALLERY SERVICE (PUBLIC) =====
 * Mengambil galeri aktif untuk halaman publik.
 */
import { supabase } from '../lib/supabase';

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
 * Mengambil semua item galeri yang aktif (untuk publik).
 * @returns {Promise<Array>}
 */
export async function getActiveGalleries() {
  const { data, error } = await supabase.from('galleries').select(GALLERY_SELECT).eq('is_active', true).order('position', { ascending: true }).order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Gagal mengambil galeri: ${error.message}`);
  }

  return data ?? [];
}
