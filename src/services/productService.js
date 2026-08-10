import { supabase } from '../lib/supabase';

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(
      `
      id,
      name,
      slug,
      description,
      price,
      stock,
      image_url,
      created_at,
      categories (
        id,
        name,
        slug
      )
    `,
    )
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Gagal mengambil produk: ${error.message}`);
  }

  return data ?? [];
}

export async function getProductBySlug(slug) {
  const { data, error } = await supabase
    .from('products')
    .select(
      `
      id,
      name,
      slug,
      description,
      price,
      stock,
      image_url,
      created_at,
      categories (
        id,
        name,
        slug
      )
    `,
    )
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    throw new Error(`Gagal mengambil detail produk: ${error.message}`);
  }

  return data;
}
