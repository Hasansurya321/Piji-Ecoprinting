-- ============================================================
-- 001_admin_schema.sql (REVISI — kompatibel schema existing)
-- Schema untuk Panel Admin EcoPrint
--
-- PERBAIKAN UTAMA:
-- 1. FK tabel baru mengikuti tipe data produk/categories existing
--    (project ini memakai products.id UUID → product_id jadi UUID,
--     bukan bigint)
-- 2. Non-destructive: tidak DROP TABLE, tidak ubah PK existing,
--    hanya ADD COLUMN IF NOT EXISTS untuk kolom tambahan
-- 3. Idempoten & aman dijalankan ulang
-- Jalankan di Supabase SQL Editor (urutan 001 → 003)
-- ============================================================

-- ============================================================
-- TABEL PROFILES
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- TABEL CATEGORIES (existing — tidak diubah, hanya ditambah bila perlu)
-- ============================================================
create table if not exists public.categories (
  id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- ============================================================
-- TABEL PRODUCTS (existing — TIDAK diubah struktur PK/tipe)
-- ============================================================
create table if not exists public.products (
  id bigint generated always as identity primary key,
  category_id bigint references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  price numeric not null default 0 check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  image_url text,
  image_path text,
  shopee_url text,
  whatsapp_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tambahkan kolom if not exists (aman: tidak menyentuh kolom existing)
alter table public.products add column if not exists short_description text;
alter table public.products add column if not exists shopee_url text;
alter table public.products add column if not exists whatsapp_url text;
alter table public.products add column if not exists image_url text;
alter table public.products add column if not exists image_path text;
alter table public.products add column if not exists description text;
alter table public.products add column if not exists price numeric not null default 0;
alter table public.products add column if not exists stock integer not null default 0;
alter table public.products add column if not exists is_active boolean not null default true;
alter table public.products add column if not exists category_id bigint references public.categories(id) on delete set null;

-- ============================================================
-- TABEL PRODUCT_IMAGES (baru — FK mengikuti tipe products.id)
-- ============================================================
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,  -- placeholder: tipe sesungguhnya diubah via DO block di bawah
  image_url text not null,
  image_path text,
  alt_text text,
  position integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

-- Ubah tipe product_id mengikuti tipe persis products.id, lalu tambah FK
do $$
declare
  v_type text;
  v_has_col boolean;
begin
  -- Ambil tipe kolom id dari tabel products (existing)
  select format_type(a.atttypid, a.atttypmod)
    into v_type
    from pg_attribute a
    join pg_class c on c.oid = a.attrelid
    join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public'
     and c.relname = 'products'
     and a.attname = 'id'
   limit 1;

  if v_type is null then
    raise exception 'Kolom public.products.id tidak ditemukan';
  end if;

  -- Cek apakah kolom product_id sudah bertipe benar / sudah ada
  select count(*) > 0
    into v_has_col
    from pg_attribute a
    join pg_class c on c.oid = a.attrelid
    join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public'
     and c.relname = 'product_images'
     and a.attname = 'product_id';

  if v_has_col then
    -- Samakan tipe kolom dengan tipe products.id
    execute format('alter table public.product_images alter column product_id drop default');
    execute format('alter table public.product_images alter column product_id type %s using product_id::%s', v_type, v_type);
  end if;
end $$;

-- FK: product_images.product_id → products.id (hanya jika belum ada)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'product_images_product_id_fkey'
      and conrelid = 'public.product_images'::regclass
  ) then
    execute format(
      'alter table public.product_images add constraint product_images_product_id_fkey
         foreign key (product_id) references public.products(id) on delete cascade'
    );
  end if;
end $$;

-- ============================================================
-- TABEL PRODUCT_SPECIFICATIONS (baru — FK mengikuti tipe products.id)
-- ============================================================
create table if not exists public.product_specifications (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,  -- placeholder: tipe sesungguhnya diubah via DO block di bawah
  label text not null,
  value text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

-- Ubah tipe product_id mengikuti tipe persis products.id
do $$
declare
  v_type text;
  v_has_col boolean;
begin
  select format_type(a.atttypid, a.atttypmod)
    into v_type
    from pg_attribute a
    join pg_class c on c.oid = a.attrelid
    join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public'
     and c.relname = 'products'
     and a.attname = 'id'
   limit 1;

  if v_type is null then
    raise exception 'Kolom public.products.id tidak ditemukan';
  end if;

  select count(*) > 0
    into v_has_col
    from pg_attribute a
    join pg_class c on c.oid = a.attrelid
    join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public'
     and c.relname = 'product_specifications'
     and a.attname = 'product_id';

  if v_has_col then
    execute format('alter table public.product_specifications alter column product_id drop default');
    execute format('alter table public.product_specifications alter column product_id type %s using product_id::%s', v_type, v_type);
  end if;
end $$;

-- FK: product_specifications.product_id → products.id (hanya jika belum ada)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'product_specifications_product_id_fkey'
      and conrelid = 'public.product_specifications'::regclass
  ) then
    execute format(
      'alter table public.product_specifications add constraint product_specifications_product_id_fkey
         foreign key (product_id) references public.products(id) on delete cascade'
    );
  end if;
end $$;

-- ============================================================
-- TABEL GALLERY_CATEGORIES (baru)
-- ============================================================
create table if not exists public.gallery_categories (
  id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- ============================================================
-- TABEL GALLERIES (baru)
-- ============================================================
create table if not exists public.galleries (
  id bigint generated always as identity primary key,
  category_id bigint references public.gallery_categories(id) on delete set null,
  title text not null,
  slug text not null unique,
  description text,
  image_url text,
  image_path text,
  alt_text text,
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- INDEX
-- ============================================================
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_is_active on public.products(is_active);
create index if not exists idx_galleries_slug on public.galleries(slug);
create index if not exists idx_galleries_category_id on public.galleries(category_id);
create index if not exists idx_galleries_is_active on public.galleries(is_active);
create index if not exists idx_product_images_product_id on public.product_images(product_id);
create index if not exists idx_product_specifications_product_id on public.product_specifications(product_id);
create index if not exists idx_profiles_role on public.profiles(role);

-- ============================================================
-- SEED KATEGORI PRODUK (on conflict do nothing — tidak menghapus lama)
-- ============================================================
insert into public.categories (name, slug)
values
  ('Fashion', 'fashion'),
  ('Tas', 'tas'),
  ('Aksesoris', 'aksesoris'),
  ('Home Decor', 'home-decor'),
  ('Kain Meteran', 'kain-meteran'),
  ('Souvenir', 'souvenir')
on conflict (slug) do nothing;

-- ============================================================
-- SEED KATEGORI GALERI
-- ============================================================
insert into public.gallery_categories (name, slug)
values
  ('Proses Ecoprint', 'proses-ecoprint'),
  ('Workshop', 'workshop'),
  ('Produk', 'produk'),
  ('Pameran', 'pameran'),
  ('Kegiatan UMKM', 'kegiatan-umkm')
on conflict (slug) do nothing;