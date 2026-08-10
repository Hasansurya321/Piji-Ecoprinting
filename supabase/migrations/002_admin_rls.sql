-- ============================================================
-- 002_admin_rls.sql
-- Row Level Security untuk Panel Admin EcoPrint
-- Jalankan SETELAH 001_admin_schema.sql
-- ============================================================

-- ============================================================
-- HELPER: cek apakah user saat ini admin
-- security definer untuk menghindari recursion pada policy profiles
-- ============================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- ============================================================
-- ENABLE RLS SEMUA TABEL
-- ============================================================
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_specifications enable row level security;
alter table public.gallery_categories enable row level security;
alter table public.galleries enable row level security;

-- ============================================================
-- PROFILES
-- User bisa baca profil sendiri; admin bisa baca yang diperlukan.
-- Tidak ada update role via publik (role diubah manual/backend).
-- ============================================================
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  using (id = auth.uid());

drop policy if exists "profiles_select_admin" on public.profiles;
create policy "profiles_select_admin"
  on public.profiles
  for select
  using (public.is_admin());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles
  for insert
  with check (id = auth.uid());

drop policy if exists "profiles_update_own_non_role" on public.profiles;
create policy "profiles_update_own_non_role"
  on public.profiles
  for update
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select role from public.profiles where id = auth.uid())
  );

-- ============================================================
-- CATEGORIES (publik baca; admin semua)
-- ============================================================
drop policy if exists "categories_select_public" on public.categories;
create policy "categories_select_public"
  on public.categories
  for select
  to anon, authenticated
  using (true);

drop policy if exists "categories_admin_all" on public.categories;
create policy "categories_admin_all"
  on public.categories
  for all
  using (public.is_admin());

-- ============================================================
-- PRODUCTS (publik baca aktif; admin semua)
-- ============================================================
drop policy if exists "products_select_public" on public.products;
create policy "products_select_public"
  on public.products
  for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "products_admin_all" on public.products;
create policy "products_admin_all"
  on public.products
  for all
  using (public.is_admin());

-- ============================================================
-- PRODUCT_IMAGES (publik baca milik produk aktif; admin semua)
-- ============================================================
drop policy if exists "product_images_select_public" on public.product_images;
create policy "product_images_select_public"
  on public.product_images
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.products
      where products.id = product_images.product_id
        and products.is_active = true
    )
  );

drop policy if exists "product_images_admin_all" on public.product_images;
create policy "product_images_admin_all"
  on public.product_images
  for all
  using (public.is_admin());

-- ============================================================
-- PRODUCT_SPECIFICATIONS (publik baca milik produk aktif; admin semua)
-- ============================================================
drop policy if exists "product_specifications_select_public" on public.product_specifications;
create policy "product_specifications_select_public"
  on public.product_specifications
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.products
      where products.id = product_specifications.product_id
        and products.is_active = true
    )
  );

drop policy if exists "product_specifications_admin_all" on public.product_specifications;
create policy "product_specifications_admin_all"
  on public.product_specifications
  for all
  using (public.is_admin());

-- ============================================================
-- GALLERY_CATEGORIES (publik baca; admin semua)
-- ============================================================
drop policy if exists "gallery_categories_select_public" on public.gallery_categories;
create policy "gallery_categories_select_public"
  on public.gallery_categories
  for select
  to anon, authenticated
  using (true);

drop policy if exists "gallery_categories_admin_all" on public.gallery_categories;
create policy "gallery_categories_admin_all"
  on public.gallery_categories
  for all
  using (public.is_admin());

-- ============================================================
-- GALLERIES (publik baca aktif; admin semua)
-- ============================================================
drop policy if exists "galleries_select_public" on public.galleries;
create policy "galleries_select_public"
  on public.galleries
  for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "galleries_admin_all" on public.galleries;
create policy "galleries_admin_all"
  on public.galleries
  for all
  using (public.is_admin());