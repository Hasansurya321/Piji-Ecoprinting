/**
 * ===== PRODUCT ADMIN SERVICE =====
 * Operasi CRUD produk untuk panel admin.
 * Semua query Supabase dikumpulkan di sini (bukan tersebar di komponen).
 */
import { supabase } from '../lib/supabase';
import { deleteImages } from './storageService';

const PRODUCT_SELECT = `
  id,
  category_id,
  name,
  slug,
  short_description,
  description,
  price,
  stock,
  image_url,
  image_path,
  shopee_url,
  whatsapp_url,
  is_active,
  created_at,
  updated_at,
  categories (
    id,
    name,
    slug
  ),
  product_images (
    id,
    product_id,
    image_url,
    image_path,
    alt_text,
    position,
    is_primary
  ),
  product_specifications (
    id,
    product_id,
    label,
    value,
    position
  )
`;

/**
 * Mengambil semua produk (termasuk non-aktif) untuk admin.
 * @returns {Promise<Array>}
 */
export async function getAllProducts() {
  try {
    const { data, error } = await supabase.from('products').select(PRODUCT_SELECT).order('created_at', { ascending: false });

    if (error) {
      // Fallback aman: jika tabel belum tersedia, kembalikan array kosong.
      console.error('[productAdminService] getAllProducts error:', error.message);
      return [];
    }

    return data ?? [];
  } catch (err) {
    console.error('[productAdminService] getAllProducts exception:', err.message);
    return [];
  }
}

/**
 * Mengambil satu produk lengkap berdasarkan id (termasuk relasi).
 * @param {string|number} id
 * @returns {Promise<object|null>}
 */
export async function getProductById(id) {
  try {
    const { data, error } = await supabase.from('products').select(PRODUCT_SELECT).eq('id', id).single();

    if (error) {
      console.error('[productAdminService] getProductById error:', error.message);
      return null;
    }

    return data ?? null;
  } catch (err) {
    console.error('[productAdminService] getProductById exception:', err.message);
    return null;
  }
}

/**
 * Mengambil daftar kategori.
 * @returns {Promise<Array>}
 */
export async function getCategories() {
  try {
    const { data, error } = await supabase.from('categories').select('id, name, slug').order('name', { ascending: true });

    if (error) {
      console.error('[productAdminService] getCategories error:', error.message);
      return [];
    }

    return data ?? [];
  } catch (err) {
    console.error('[productAdminService] getCategories exception:', err.message);
    return [];
  }
}

/**
 * Membuat produk baru beserta spesifikasi & gambar.
 * @param {object} payload
 * @returns {Promise<{ product: object|null, error: string|null }>}
 */
export async function createProduct(payload) {
  const { name, slug, categoryId, price, stock, shortDescription, description, image_url = '', image_path = '', shopeeUrl = '', whatsappUrl = '', isActive = true, specifications = [], images = [] } = payload;

  try {
    const { data: product, error } = await supabase
      .from('products')
      .insert({
        category_id: categoryId || null,
        name,
        slug,
        short_description: shortDescription,
        description,
        price,
        stock,
        image_url,
        image_path,
        shopee_url: shopeeUrl,
        whatsapp_url: whatsappUrl,
        is_active: isActive,
      })
      .select('id')
      .single();

    if (error) {
      return { product: null, error: `Gagal menyimpan produk: ${error.message}` };
    }

    // Simpan spesifikasi
    if (specifications.length > 0) {
      const specRows = specifications.map((spec, idx) => ({
        product_id: product.id,
        label: spec.label,
        value: spec.value,
        position: idx,
      }));
      const { error: specError } = await supabase.from('product_specifications').insert(specRows);
      if (specError) {
        console.error('[productAdminService] createProduct specs error:', specError.message);
      }
    }

    // Simpan gambar tambahan (selain gambar utama)
    const extraImages = images.filter((img) => !img.is_primary);
    if (extraImages.length > 0) {
      const imageRows = extraImages.map((img, idx) => ({
        product_id: product.id,
        image_url: img.image_url,
        image_path: img.image_path ?? '',
        alt_text: img.alt_text ?? name,
        position: idx,
        is_primary: false,
      }));
      const { error: imgError } = await supabase.from('product_images').insert(imageRows);
      if (imgError) {
        console.error('[productAdminService] createProduct images error:', imgError.message);
      }
    }

    return { product, error: null };
  } catch (err) {
    return { product: null, error: `Gagal menyimpan produk: ${err.message}` };
  }
}

/**
 * Memperbarui produk beserta spesifikasi & gambar.
 * @param {string|number} id
 * @param {object} payload
 * @returns {Promise<{ success: boolean, error: string|null }>}
 */
export async function updateProduct(id, payload) {
  const { name, slug, categoryId, price, stock, shortDescription, description, image_url = '', image_path = '', shopeeUrl = '', whatsappUrl = '', isActive = true, specifications = [], images = [] } = payload;

  try {
    const { error: updateError } = await supabase
      .from('products')
      .update({
        category_id: categoryId || null,
        name,
        slug,
        short_description: shortDescription,
        description,
        price,
        stock,
        image_url,
        image_path,
        shopee_url: shopeeUrl,
        whatsapp_url: whatsappUrl,
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      return { success: false, error: `Gagal memperbarui produk: ${updateError.message}` };
    }

    // Ganti spesifikasi: hapus lama, insert baru
    const { error: deleteSpecError } = await supabase.from('product_specifications').delete().eq('product_id', id);
    if (deleteSpecError) {
      console.error('[productAdminService] updateProduct delete specs error:', deleteSpecError.message);
    }
    if (specifications.length > 0) {
      const specRows = specifications.map((spec, idx) => ({
        product_id: id,
        label: spec.label,
        value: spec.value,
        position: idx,
      }));
      const { error: insertSpecError } = await supabase.from('product_specifications').insert(specRows);
      if (insertSpecError) {
        console.error('[productAdminService] updateProduct insert specs error:', insertSpecError.message);
      }
    }

    // Ganti gambar tambahan: hapus lama, insert baru
    const { error: deleteImgError } = await supabase.from('product_images').delete().eq('product_id', id);
    if (deleteImgError) {
      console.error('[productAdminService] updateProduct delete images error:', deleteImgError.message);
    }
    const extraImages = images.filter((img) => !img.is_primary);
    if (extraImages.length > 0) {
      const imageRows = extraImages.map((img, idx) => ({
        product_id: id,
        image_url: img.image_url,
        image_path: img.image_path ?? '',
        alt_text: img.alt_text ?? name,
        position: idx,
        is_primary: false,
      }));
      const { error: insertImgError } = await supabase.from('product_images').insert(imageRows);
      if (insertImgError) {
        console.error('[productAdminService] updateProduct insert images error:', insertImgError.message);
      }
    }

    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: `Gagal memperbarui produk: ${err.message}` };
  }
}

/**
 * Menghapus produk beserta file di Storage.
 * @param {string|number} id
 * @returns {Promise<{ success: boolean, error: string|null }>}
 */
export async function deleteProduct(id) {
  try {
    // 1. Ambil produk untuk mendapatkan image_path
    const { data: product, error: fetchError } = await supabase.from('products').select('image_path').eq('id', id).single();

    if (fetchError) {
      return { success: false, error: `Gagal mengambil data produk: ${fetchError.message}` };
    }

    // 2. Ambil semua image_path gambar tambahan
    const { data: images, error: imagesError } = await supabase.from('product_images').select('image_path').eq('product_id', id);

    if (imagesError) {
      console.error('[productAdminService] deleteProduct images fetch error:', imagesError.message);
    }

    const allPaths = [product?.image_path, ...(images ?? []).map((img) => img.image_path)].filter(Boolean);

    // 3. Hapus file dari Storage
    if (allPaths.length > 0) {
      const { failed } = await deleteImages('product-images', allPaths);
      if (failed.length > 0) {
        return { success: false, error: 'Produk tersimpan, tetapi sebagian file gambar gagal dihapus. Periksa storage.' };
      }
    }

    // 4. Hapus produk dari database (relasi cascade membersihkan spesifikasi & gambar)
    const { error: deleteError } = await supabase.from('products').delete().eq('id', id);

    if (deleteError) {
      return { success: false, error: `Gagal menghapus produk: ${deleteError.message}` };
    }

    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: `Gagal menghapus produk: ${err.message}` };
  }
}
