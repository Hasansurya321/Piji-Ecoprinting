# ==============================================================================

# ECOPRINT WEBSITE

# COMPONENT CONTRACT

# FILE : 03_COMPONENT_CONTRACT.md

# VERSION : 1.0

# STATUS : COMPONENT SYSTEM

# ==============================================================================

# PERINGATAN

Dokumen ini mengatur seluruh aturan pembuatan React Component.

Tujuan utama dokumen ini adalah menjaga agar seluruh component memiliki
konsistensi struktur, penamaan, tanggung jawab, dan kualitas kode.

AI WAJIB mengikuti seluruh aturan pada dokumen ini.

AI tidak diperbolehkan membuat component berdasarkan kebiasaan pribadi.

AI tidak diperbolehkan membuat component yang tidak memiliki tujuan jelas.

Apabila terdapat konflik antara implementasi AI dan dokumen ini,
maka dokumen ini memiliki prioritas tertinggi.

==============================================================================

# TUJUAN COMPONENT SYSTEM

==============================================================================

Component harus memiliki karakter berikut.

Reusable.

Simple.

Readable.

Independent.

Predictable.

Maintainable.

Component bukan dibuat untuk menunjukkan kompleksitas.

Component dibuat agar project mudah dikembangkan.

==============================================================================

# COMPONENT PHILOSOPHY

==============================================================================

Setiap component harus memiliki satu tanggung jawab.

One Component.

One Responsibility.

Jangan membuat component yang menangani terlalu banyak hal.

Apabila component mulai sulit dibaca,
pecah menjadi component yang lebih kecil.

==============================================================================

# COMPONENT STRUCTURE

==============================================================================

Seluruh component harus mengikuti struktur berikut.

Imports.

Constants.

Hooks.

Functions.

Return JSX.

Export Default.

Urutan tersebut tidak boleh berubah.

==============================================================================

# COMPONENT NAMING

==============================================================================

Seluruh component menggunakan PascalCase.

Contoh.

Navbar

HeroSection

ProductCard

GallerySection

Footer

Container

SectionHeading

Button

Tidak boleh menggunakan nama umum seperti.

Component1

Card1

Item

Content

Box

Test

NewComponent

==============================================================================

# FILE NAMING

==============================================================================

Nama file harus sama dengan nama component.

Contoh.

Navbar.jsx

Footer.jsx

HeroSection.jsx

GalleryCard.jsx

ProductCard.jsx

==============================================================================

# COMPONENT DIRECTORY

==============================================================================

Gunakan struktur berikut.

components/

layout/

common/

home/

ui/

Tidak diperbolehkan membuat folder acak.

==============================================================================

# COMPONENT SIZE

==============================================================================

Target ukuran component.

Ideal

50–150 baris.

Masih dapat diterima

150–250 baris.

Apabila lebih dari 250 baris,

AI WAJIB mempertimbangkan pemecahan component.

==============================================================================

# COMPONENT RESPONSIBILITY

==============================================================================

Setiap component hanya boleh memiliki
satu tanggung jawab utama.

Contoh.

Navbar

Hanya mengatur navbar.

HeroSection

Hanya mengatur hero.

ProductCard

Hanya mengatur satu kartu produk.

Footer

Hanya mengatur footer.

==============================================================================

# COMPONENT COMMUNICATION

==============================================================================

Komunikasi antar component dilakukan melalui.

Props.

Children.

Tidak menggunakan global state
untuk kebutuhan sederhana.

==============================================================================

# COMPONENT REUSABILITY

==============================================================================

Apabila sebuah UI muncul minimal dua kali,

AI WAJIB mempertimbangkan reusable component.

Contoh.

Button.

SectionHeading.

Container.

Divider.

IconButton.

Card.

Apabila hanya digunakan sekali,

tidak wajib dibuat reusable.

==============================================================================

# CONTAINER COMPONENT

==============================================================================

Container adalah component wajib.

Seluruh section menggunakan Container.

Container mengatur.

Max Width.

Horizontal Padding.

Center Alignment.

Component lain tidak boleh membuat container sendiri.

==============================================================================

# SECTION COMPONENT

==============================================================================

Setiap section dibuat sebagai component terpisah.

Contoh.

HeroSection

ProductSection

AboutSection

ProcessSection

GallerySection

Footer

Tidak boleh digabung menjadi satu file besar.

==============================================================================

# SECTION HEADING COMPONENT

==============================================================================

Section Heading dibuat reusable.

Isi component.

Section Label.

Section Title.

Optional Description.

Optional Ornament.

Seluruh section menggunakan component ini.

==============================================================================

# BUTTON COMPONENT

==============================================================================

Button dibuat reusable.

Button memiliki variasi.

Primary.

Secondary.

Outline.

Ghost.

Button tidak boleh memiliki styling berbeda
pada setiap section.

==============================================================================

# CARD COMPONENT

==============================================================================

Setiap jenis card dibuat terpisah.

ProductCard.

GalleryCard.

InstagramCard.

BenefitCard.

Jangan menggunakan satu card
untuk semua kebutuhan.

==============================================================================

# ICON COMPONENT

==============================================================================

Gunakan icon library yang sama.

Ukuran icon konsisten.

Stroke konsisten.

Warna mengikuti design system.

==============================================================================

# IMAGE COMPONENT

==============================================================================

Image harus menggunakan.

Lazy Loading.

Object Fit Cover.

Alt Text.

Width dan Height yang jelas.

Tidak boleh ada image
yang kehilangan rasio.

==============================================================================

# DATA MAPPING

==============================================================================

Apabila terdapat data berulang,

gunakan map().

Contoh.

Navigation Menu.

Benefits.

Products.

Gallery.

Process Steps.

Jangan membuat elemen satu per satu.

==============================================================================

# STATIC DATA

==============================================================================

Data statis dipisahkan dari component.

Contoh.

data/

products.js

gallery.js

benefits.js

process.js

navigation.js

Component hanya melakukan rendering.

==============================================================================

# PROPS RULE

==============================================================================

Props harus sederhana.

Gunakan nama yang jelas.

Contoh.

title

description

image

category

link

icon

Jangan menggunakan.

data1

obj

temp

item2

==============================================================================

# JSX RULE

==============================================================================

JSX harus mudah dibaca.

Gunakan indentasi konsisten.

Pisahkan block besar.

Jangan membuat nested JSX berlebihan.

==============================================================================

# CLASSNAME RULE

==============================================================================

Gunakan class yang konsisten.

Jangan menggunakan class acak.

Gunakan utility class secara terstruktur.

Urutkan class berdasarkan.

Layout.

Spacing.

Typography.

Color.

Effect.

==============================================================================

# CONDITIONAL RENDERING

==============================================================================

Gunakan conditional rendering
hanya bila benar-benar diperlukan.

Jangan membuat kondisi
yang tidak digunakan.

==============================================================================

# HOOK RULE

==============================================================================

Gunakan Hook React
hanya jika memang diperlukan.

Jangan menggunakan.

useMemo

useCallback

useRef

tanpa alasan yang jelas.

==============================================================================

# STATE RULE

==============================================================================

State hanya digunakan
untuk data yang berubah.

Jangan menyimpan
data statis di state.

==============================================================================

# EFFECT RULE

==============================================================================

Gunakan useEffect
hanya jika memang diperlukan.

Jangan membuat useEffect kosong.

Jangan membuat dependency
yang tidak digunakan.

==============================================================================

# EVENT HANDLER

==============================================================================

Nama event handler harus jelas.

Contoh.

handleMenuClick

handleScrollTop

handleOpenMenu

handleCloseMenu

Jangan menggunakan.

click()

test()

run()

==============================================================================

# RESPONSIVE COMPONENT

==============================================================================

Component harus tetap reusable
pada seluruh breakpoint.

Jangan membuat component baru
hanya untuk mobile.

Gunakan CSS.

==============================================================================

# PERFORMANCE RULE

==============================================================================

Jangan melakukan optimasi berlebihan.

Prioritas utama adalah
kemudahan membaca kode.

Optimasi dilakukan
hanya jika benar-benar diperlukan.

==============================================================================

# COMMENT RULE

==============================================================================

Jangan memenuhi kode
dengan komentar.

Komentar hanya digunakan
untuk menjelaskan logika kompleks.

==============================================================================

# IMPORT ORDER

==============================================================================

Urutan import.

React.

Third Party Library.

Assets.

Components.

Hooks.

Utils.

Data.

CSS.

==============================================================================

# COMPONENT QUALITY

==============================================================================

Setiap component harus memenuhi.

Readable.

Reusable.

Maintainable.

Predictable.

Consistent.

==============================================================================

# COMPONENT CHECKLIST

==============================================================================

Sebelum menyatakan component selesai,
AI wajib mengecek.

☐ Nama component benar.

☐ Nama file benar.

☐ Satu tanggung jawab.

☐ Tidak terlalu besar.

☐ Props jelas.

☐ JSX rapi.

☐ Styling konsisten.

☐ Responsive.

☐ Tidak ada code duplication.

☐ Tidak ada hardcode yang tidak perlu.

==============================================================================

# ABSOLUTE COMPONENT LOCK

==============================================================================

AI DILARANG.

Menggabungkan seluruh section
ke dalam satu file.

Menggunakan satu component
untuk semua card.

Menggunakan inline style.

Menduplikasi component.

Menduplikasi data.

Menyimpan data statis
di dalam component.

Menggunakan state
yang tidak diperlukan.

Membuat component
tanpa tujuan.

Melakukan refactor besar
di luar fase implementasi.

==============================================================================

# DEFINITION OF DONE

==============================================================================

Sebuah component dianggap selesai apabila.

Struktur benar.

Responsibility jelas.

Reusable apabila diperlukan.

Kode mudah dibaca.

Tidak ada duplikasi.

Mengikuti Design System.

Mengikuti Layout Contract.

Mengikuti Agent Contract.

Jika salah satu belum terpenuhi,

maka component BELUM selesai.

==============================================================================

# END OF FILE

==============================================================================
