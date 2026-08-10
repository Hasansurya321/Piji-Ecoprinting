-- ============================================================
-- 003_storage_policies.sql
-- Storage policy untuk Panel Admin EcoPrint
-- Jalankan SETELAH 001 & 002. Pastikan helper public.is_admin() ada.
-- ============================================================

-- ============================================================
-- BUCKET
-- Jalankan secara manual di dashboard bila perlu, atau via SQL:
--   insert into storage.buckets (id, name, public)
--   values ('product-images', 'product-images', true)
--   on conflict (id) do nothing;
--
--   insert into storage.buckets (id, name, public)
--   values ('gallery-images', 'gallery-images', true)
--   on conflict (id) do nothing;
-- ============================================================
insert into storage.buckets (id, name, public)
values
  ('product-images', 'product-images', true),
  ('gallery-images', 'gallery-images', true)
on conflict (id) do nothing;

-- ============================================================
-- PRODUCT-IMAGES
-- Publik hanya boleh baca object; admin boleh upload/ubah/hapus.
-- ============================================================
drop policy if exists "product_images_public_read" on storage.objects;
create policy "product_images_public_read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "product_images_admin_insert" on storage.objects;
create policy "product_images_admin_insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product_images_admin_update" on storage.objects;
create policy "product_images_admin_update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product_images_admin_delete" on storage.objects;
create policy "product_images_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

-- ============================================================
-- GALLERY-IMAGES
-- Publik hanya boleh baca object; admin boleh upload/ubah/hapus.
-- ============================================================
drop policy if exists "gallery_images_public_read" on storage.objects;
create policy "gallery_images_public_read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'gallery-images');

drop policy if exists "gallery_images_admin_insert" on storage.objects;
create policy "gallery_images_admin_insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'gallery-images' and public.is_admin());

drop policy if exists "gallery_images_admin_update" on storage.objects;
create policy "gallery_images_admin_update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'gallery-images' and public.is_admin());

drop policy if exists "gallery_images_admin_delete" on storage.objects;
create policy "gallery_images_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'gallery-images' and public.is_admin());