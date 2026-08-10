import { Shirt, Leaf, Recycle, Handshake, Sprout } from 'lucide-react';
import './CircularEconomySection.css';

const circularStages = [
  {
    key: 'production',
    number: '01',
    title: 'Produksi Ecoprint',
    description: 'Kain diproduksi menggunakan pewarna alami dari daun dan tumbuhan.',
    icon: Shirt,
  },
  {
    key: 'waste',
    number: '02',
    title: 'Limbah Organik',
    description: 'Sisa daun dan bahan alami dikumpulkan, bukan dibuang.',
    icon: Leaf,
  },
  {
    key: 'compost',
    number: '03',
    title: 'Pengolahan Kompos',
    description: 'Limbah organik diolah menjadi kompos ramah lingkungan.',
    icon: Recycle,
  },
  {
    key: 'partner',
    number: '04',
    title: 'Kolaborasi Mitra',
    description: 'Kompos dimanfaatkan bersama mitra lokal seperti Piji Farm.',
    icon: Handshake,
  },
  {
    key: 'nature',
    number: '05',
    title: 'Alam Kembali Subur',
    description: 'Kompos menyuburkan tanaman sehingga tercipta siklus berkelanjutan.',
    icon: Sprout,
  },
];

/**
 * Satu komposisi visual utuh (closed state).
 * Dirender dua kali: sekali di LEFT HALF dan sekali di RIGHT HALF.
 * Masing-masing half menampilkan separuh komposisi melalui clip-path,
 * sehingga pada posisi menyatu (translateX = 0) keduanya membentuk
 * infografis yang sempurna tanpa gap, overlap, atau misalignment.
 */
function CircularComposition({ isPrimary = false }) {
  return (
    <>
      {/* ===== DECORATIVE ORNAMENTS ===== */}
      <span className="circular-economy__leaf circular-economy__leaf--top-right" aria-hidden="true" />
      <span className="circular-economy__leaf circular-economy__leaf--bottom-left" aria-hidden="true" />
      <span className="circular-economy__leaf circular-economy__leaf--top-left" aria-hidden="true" />
      <span className="circular-economy__leaf circular-economy__leaf--bottom-right" aria-hidden="true" />
      <span className="circular-economy__curve" aria-hidden="true" />

      {/* ===== SVG CONNECTION LAYER ===== */}
      <svg className="circular-economy__connections" viewBox="0 0 1200 600" aria-hidden="true">
        {/* 01 -> 02 (kurva kanan atas) */}
        <path className="circular-economy__path" d="M 600 180 C 760 180 830 237 830 313" markerEnd="url(#circular-economy-arrow)" />

        {/* 02 -> 03 (vertikal dashed) */}
        <path className="circular-economy__path circular-economy__path--dashed" d="M 830 450 L 830 500" markerEnd="url(#circular-economy-arrow)" />

        {/* 03 -> center (kurva bawah kanan) */}
        <path className="circular-economy__path" d="M 750 531 C 700 553 630 557 600 527" markerEnd="url(#circular-economy-arrow)" />

        {/* center -> 04 (kurva bawah kiri) */}
        <path className="circular-economy__path" d="M 600 527 C 570 557 500 553 450 531" markerEnd="url(#circular-economy-arrow)" />

        {/* 04 -> 05 (kurva kiri) */}
        <path className="circular-economy__path" d="M 370 500 C 340 466 340 450 370 313" markerEnd="url(#circular-economy-arrow)" />

        {/* 05 -> 01 (kurva besar kiri atas) */}
        <path className="circular-economy__path" d="M 370 237 C 370 180 440 180 600 180" markerEnd="url(#circular-economy-arrow)" />

        {/* 01 -> center (garis vertikal pendek) */}
        <path className="circular-economy__path" d="M 600 237 L 600 262" markerEnd="url(#circular-economy-arrow)" />

        {/* ===== DECORATIVE DOTS (5-8 titik) ===== */}
        <circle className="circular-economy__dot" cx="780" cy="237" r="4" />
        <circle className="circular-economy__dot" cx="830" cy="411" r="4" />
        <circle className="circular-economy__dot" cx="690" cy="559" r="4" />
        <circle className="circular-economy__dot" cx="510" cy="559" r="4" />
        <circle className="circular-economy__dot" cx="370" cy="411" r="4" />
        <circle className="circular-economy__dot" cx="420" cy="237" r="4" />
      </svg>

      {/* ===== FIVE CARDS ===== */}
      {circularStages.map((stage) => {
        const Icon = stage.icon;

        return (
          <article key={stage.key} className={`circular-economy__card circular-economy__card--${stage.key}`}>
            <div className="circular-economy__card-icon">
              <Icon size={32} strokeWidth={1.6} />
            </div>

            <div className="circular-economy__card-body">
              <h3 className="circular-economy__card-title">
                <span className="circular-economy__card-number">{stage.number}</span>
                {stage.title}
              </h3>
              <p className="circular-economy__card-desc">{stage.description}</p>
            </div>
          </article>
        );
      })}

      {/* ===== MAIN CIRCLE (focal point) ===== */}
      <div className="circular-economy__core" id={isPrimary ? 'sirkular-ekonomi-title' : undefined}>
        <div className="circular-economy__core-inner" aria-hidden="true">
          <Leaf size={22} strokeWidth={1.3} />
          <Recycle size={34} strokeWidth={1.4} />
        </div>

        <h2 className="circular-economy__core-title">
          Sirkular
          <br />
          Ekonomi
        </h2>

        <p className="circular-economy__core-sub"> & Zero Waste</p>

        <p className="circular-economy__core-desc">Dari alam, kembali ke alam, untuk masa depan yang berkelanjutan.</p>
      </div>
    </>
  );
}

function CircularEconomySection({ sectionId = 'proses-ecoprint' }) {
  return (
    <section id={sectionId} className="circular-economy" aria-labelledby="sirkular-ekonomi-title">
      {/* ===== SCENE WRAPPER (split/merge ready - satu koordinat) ===== */}
      <div className="circular-economy__scene">
        <div className="circular-economy__visual">
          {/* ===== SHARED SVG DEFS (id unik, direferensikan kedua half) ===== */}
          <svg className="circular-economy__defs" width="0" height="0" aria-hidden="true">
            <defs>
              <marker id="circular-economy-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 Z" />
              </marker>
            </defs>
          </svg>

          {/* ===== LEFT HALF (50%) ===== */}
          <div className="circular-economy__half circular-economy__half--left">
            <div className="circular-economy__stage">
              <CircularComposition isPrimary />
            </div>
          </div>

          {/* ===== RIGHT HALF (50%) — duplikat visual untuk split/merge ===== */}
          <div className="circular-economy__half circular-economy__half--right" aria-hidden="true">
            <div className="circular-economy__stage circular-economy__stage--right">
              <CircularComposition />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CircularEconomySection;
