# ==============================================================================

# ECOPRINT WEBSITE

# SECTION REDESIGN SPECIFICATION

# CIRCULAR ECONOMY & ZERO WASTE

# FILE : 08_SECTION_SPEC_CIRCULAR_ECONOMY.md

# VERSION : 1.0

# STATUS : FUTURE-PROOF ARCHITECTURE SPECIFICATION

# ==============================================================================

# PERINGATAN

Dokumen ini adalah spesifikasi khusus untuk redesign section

"Sirkular Ekonomi & Zero Waste".

Dokumen ini melengkapi dokumen kontrak project (00 s.d. 07).

Apabila terdapat konflik dengan dokumen kontrak lain,

dokumen ini berlaku khusus untuk section Sirkular Ekonomi & Zero Waste.

Dokumen ini memiliki prioritas TERTINGGI untuk section tersebut.

Dokumen lain tetap berlaku untuk seluruh section lainnya.

Dokumen ini tidak mengubah Design System.

Dokumen ini tidak mengubah Layout Contract global.

Dokumen ini tidak mengubah urutan section.

Dokumen ini hanya mengatur bagaimana section Sirkular Ekonomi

harus diarsitekturkan agar siap untuk animasi scroll split/merge.

==============================================================================

# TUJUAN

==============================================================================

Section "Sirkular Ekonomi & Zero Waste" harus dianggap sebagai

SATU KOMPOSISI VISUAL UTUH.

Komposisi tersebut secara konseptual terdiri dari dua panel:

panel kiri (LEFT HALF) dan panel kanan (RIGHT HALF).

Kedua panel harus dibangun sebagai satu desain yang kontinu,

bukan dua desain berbeda yang ditempel.

Gambar referensi kedua adalah "closed state" / kondisi akhir

ketika dua bagian telah menyatu sempurna.

Closed state ini adalah dasar utama saat membangun section.

==============================================================================

# KONSEP PERILAKU ANIMASI

==============================================================================

Pada kondisi awal, sebelum user benar-benar mencapai section,

kedua panel berada dalam keadaan terbelah presisi

pada garis vertikal tengah.

Panel kiri bergeser ke kiri.

Panel kanan bergeser ke kanan.

Ketika user scroll semakin mendekati section,

kedua panel perlahan bergerak menuju tengah.

Saat section mencapai posisi fokus yang ditentukan di viewport,

keduanya menyatu sempurna dan membentuk desain utuh.

==============================================================================

# ILUSTRASI PERILAKU

==============================================================================

KONDISI AWAL / SECTION BELUM MASUK

┌──────── LEFT HALF ────────┐ ┌────── RIGHT HALF ──────┐
│ │ │ │
│ bagian kiri │ │ bagian kanan │
│ │ │ │
└───────────────────────────┘ └─────────────────────────┘

                ↑
        garis belah tengah

KETIKA SCROLL MENDEKATI

┌──────── LEFT HALF ─────────┐ ┌──────── RIGHT HALF ────────┐
│ │ │ │
│ │ → ← │
│ │ │ │
└────────────────────────────┘ └─────────────────────────────┘

PADA TITIK FOKUS

┌──────────────────────────────────────────────────────────────┐
│ │
│ SIRKULAR EKONOMI & ZERO WASTE │
│ │
│ CARD 05 CARD 01 CARD 02 │
│ │
│ CIRCLE │
│ │
│ CARD 04 CARD 03 │
│ │
└──────────────────────────────────────────────────────────────┘
↑
sambungan tepat di tengah

==============================================================================

# JENIS ANIMASI

==============================================================================

TIDAK cukup menggunakan trigger "masuk viewport → jalankan sekali".

Yang diinginkan adalah gerakan yang mengikuti scroll secara progresif.

Implementasi menggunakan SCROLL-LINKED ANIMATION.

Posisi kedua panel benar-benar mengikuti seberapa dekat user terhadap section.

Scroll progress 0%

LEFT = translateX(-...)

RIGHT = translateX(+...)

Scroll progress 50%

LEFT = semakin dekat

RIGHT = semakin dekat

Scroll progress 100%

LEFT = translateX(0)

RIGHT = translateX(0)

==============================================================================

# PERILAKU TERHADAP SCROLL

==============================================================================

Section masih jauh

        ↓

terpisah 100%

Section mulai terlihat

        ↓

terpisah 70%

Section masuk lebih dalam

        ↓

terpisah 35%

Section tepat pada posisi fokus

        ↓

menyatu 100%

Setelah menyatu, section tetap menyatu selama user melewatinya.

Apabila nanti diinginkan efek "keluar lalu terbelah kembali",

itu dibuat sebagai fase animasi kedua tersendiri.

Fase tersebut TIDAK termasuk dalam scope dokumen ini.

==============================================================================

# ARSITEKTUR DOM

==============================================================================

JANGAN membelah masing-masing elemen secara sembarangan.

Yang dianimasikan adalah dua wrapper visual besar.

Struktur konseptual:

<section className="circular-economy">

  <div className="circular-economy__scene">

    <div className="circular-economy__half circular-economy__half--left">

      ...

    </div>

    <div className="circular-economy__half circular-economy__half--right">

      ...

    </div>

  </div>

</section>

Desain akhir tetap harus terlihat sebagai satu infografis utuh.

Titik pembelahan harus berada tepat pada:

left: 50%;

Secara transform:

transform-origin: center;

Kedua sisi harus menggunakan ukuran yang benar-benar identik:

LEFT = 50%

RIGHT = 50%

==============================================================================

# ATURAN TEKNIS UTAMA

==============================================================================

1.

Gunakan strict 50% / 50% split.

2.

Pertahankan tinggi yang identik untuk kedua half.

3.

Sejajarkan garis belah tepat pada x = 50%.

4.

Hindari elemen yang geometrinya rusak ketika di-mask pada tengah.

5.

Grafis lingkaran pusat (core circle) harus dibangun

agar bagian kiri dan kanannya tersambung kembali dengan sempurna.

6.

Elemen background dekoratif juga harus kontinu visual di seam.

7.

Jangan membekukan komposisi menjadi satu gambar background

yang tidak dapat dibelah.

8.

Struktur DOM dan CSS harus siap menerima

nilai transform: translateX() yang independen per half.

9.

Jaga animasi tetap pada transform,

bukan mengubah width/margin, demi performa.

10.

Siapkan overflow: hidden / masking dengan hati-hati

agar seam tengah tetap bersih.

==============================================================================

# MAIN CIRCLE (FOCAL POINT)

==============================================================================

Circle utama Sirkular Ekonomi harus dirancang lebih hati-hati.

TIDAK disarankan membuat dua circle yang berbeda.

Circle tersebut secara visual terbelah menjadi:

left-mask dan right-mask dari satu komposisi yang sama.

Ketika kedua wrapper bertemu,

lingkarannya kembali menjadi lingkaran sempurna.

Efek menyatu menjadi jauh lebih meyakinkan.

==============================================================================

# ELEMEN DEKORATIF & SVG CONNECTION

==============================================================================

Ornamen daun dan SVG connection layer

harus tetap kontinu visual melintasi seam tengah.

Elemen yang memotong garis x = 50%

harus dirancang agar tidak terlihat patah

ketika kedua half berada pada posisi menyatu.

==============================================================================

# LARANGAN

==============================================================================

DILARANG:

- Membuat dua desain berbeda yang ditempel.

- Membuat dua circle terpisah untuk bagian kiri dan kanan.

- Mengubah width/margin untuk animasi.

- Membekukan komposisi menjadi satu background image utuh.

- Menambahkan entrance animation arbitrer

  yang bertentangan dengan perilaku split/merge ini.

- Memisahkan setengah elemen secara sembarangan

  di luar dua wrapper half besar.

- Mengubah urutan, jumlah, dan konten card.

- Mengubah teks yang sudah ada.

==============================================================================

# PRIORITAS STRUKTURAL

==============================================================================

Prioritas utama:

membuat section siap untuk scroll-linked horizontal merge animation

yang presisi.

Desain harus dibangun sebagai "closed state":

kondisi akhir ketika dua bagian telah menyatu.

==============================================================================

# IMPORTANT — PREPARE THIS SECTION FOR A FUTURE SCROLL-DRIVEN SPLIT/MERGE ANIMATION.

==============================================================================

The entire Circular Economy section must be architected as one seamless

visual composition that can be divided precisely at the vertical 50% center

line into a LEFT visual half and RIGHT visual half.

Do not design the two halves as independent layouts. They must form one

perfectly continuous composition when translateX(0) is reached.

The future animation behavior will be:

before the section reaches its focus position, the LEFT half is displaced

toward the left;

the RIGHT half is displaced toward the right;

while the user scrolls toward the section, both halves progressively move

toward the center;

at the target viewport position, both halves must meet exactly at the

vertical center line and reconstruct the complete Circular Economy

composition with no visible gap, overlap, jumping, or misalignment.

Therefore:

use a strict 50% / 50% split;

maintain identical heights for both halves;

align the split at exactly x = 50%;

avoid elements whose geometry would break when masked at the center;

central circular graphics must be built so their left and right portions

reconnect perfectly;

decorative background elements must also remain visually continuous across

the seam;

do not permanently bake the composition into one indivisible background

image;

structure the DOM and CSS so both halves can later receive independent

transform: translateX() values;

keep animation on transform rather than changing width/margins to preserve

performance;

prepare overflow: hidden/masking carefully so the center seam remains clean.

Do not implement arbitrary entrance animations that conflict with this

future split/merge behavior. The structural priority is making this section

ready for a precise scroll-linked horizontal merge animation.

==============================================================================

# SELF REVIEW CHECKLIST

==============================================================================

Sebelum section dinyatakan sesuai spesifikasi,

AI wajib memastikan:

☐ Komposisi dibangun sebagai satu kesatuan visual utuh.

☐ Struktur siap dibagi pada x = 50%.

☐ Terdapat dua wrapper half dengan tinggi identik.

☐ Masing-masing half dapat menerima translateX() independen.

☐ Core circle dapat terbelah dan tersambung kembali sempurna.

☐ Dekorasi dan SVG connections kontinu di seam.

☐ Tidak ada bake ke satu background image utuh.

☐ Animasi berbasis transform.

☐ Tidak ada entrance animation yang bentrok.

☐ Card, teks, dan konten tidak diubah.

==============================================================================

# DEFINITION OF DONE

==============================================================================

Section dianggap sesuai spesifikasi ini apabila:

☐ Seluruh aturan teknis utama terpenuhi.

☐ Closed state (posisi menyatu) tampil sempurna.

☐ Seam tengah bersih tanpa gap, overlap, jumping, atau misalignment.

☐ Struktur siap untuk animasi scroll-linked di fase berikutnya.

Jika salah satu poin belum terpenuhi,

maka section BELUM selesai.

==============================================================================

# END OF FILE

==============================================================================
