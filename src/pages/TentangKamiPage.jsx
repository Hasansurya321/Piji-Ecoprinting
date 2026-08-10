import { useEffect, useRef } from 'react';
import Header from '../components/layout/Header';
import FooterSection from '../sections/footer/FooterSection';
import { heroData, visiData, sistemData, organisasiData, mitraData, sirkularData, dampakData } from '../data/tentangKamiData';
import './TentangKamiPage.css';

// ===== LUCIDE ICONS =====
import {
  Leaf,
  Users,
  Home,
  BookOpen,
  Package,
  CheckCircle,
  ShoppingBag,
  TrendingUp,
  Crown,
  Hammer,
  GraduationCap,
  ShieldCheck,
  Megaphone,
  Wallet,
  Globe,
  Handshake,
  Trees,
  Wheat,
  HeartHandshake,
  Sparkles,
  Recycle,
  ChevronRight,
} from 'lucide-react';

// ===== ICON MAP =====
const iconMap = {
  users: Users,
  leaf: Leaf,
  home: Home,
  bookOpen: BookOpen,
  package: Package,
  checkCircle: CheckCircle,
  shoppingBag: ShoppingBag,
  trendingUp: TrendingUp,
  crown: Crown,
  hammer: Hammer,
  graduationCap: GraduationCap,
  shieldCheck: ShieldCheck,
  megaphone: Megaphone,
  wallet: Wallet,
  globe: Globe,
  handshake: Handshake,
  trees: Trees,
  wheat: Wheat,
  heartHandshake: HeartHandshake,
  sparkles: Sparkles,
  recycle: Recycle,
};

function Icon({ name, className = '' }) {
  const Comp = iconMap[name];
  if (!Comp) return null;
  return <Comp className={className} strokeWidth={1.4} />;
}

// ===== ANIMATION HOOK =====
function useFadeIn() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('tk-fade-in-visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

// ===== ORNAMENT COMPONENT =====
function Ornament({ position, dark }) {
  const color = dark ? 'rgba(169, 181, 141, 0.12)' : 'rgba(97, 114, 88, 0.10)';
  const size = position.includes('small') ? 80 : position.includes('large') ? 160 : 120;

  return (
    <div className={`tk-ornament tk-ornament--${position}`} aria-hidden="true">
      <Leaf size={size} strokeWidth={0.8} style={{ color }} />
    </div>
  );
}

// ===== SECTION WRAPPER =====
function Section({ children, className = '', dark = false, id }) {
  const fadeRef = useFadeIn();

  return (
    <section id={id} className={`tk-section ${dark ? 'tk-section--dark' : 'tk-section--light'} ${className}`} ref={fadeRef}>
      <div className="tk-container">{children}</div>
    </section>
  );
}

// ===== SECTION TITLE =====
function SectionTitle({ title, dark = false }) {
  return (
    <div className="tk-section-header">
      <div className={`tk-section-header__line ${dark ? 'tk-section-header__line--light' : ''}`} />
      <h2 className={`tk-section-title ${dark ? 'tk-section-title--light' : ''}`}>{title}</h2>
      <div className={`tk-section-header__line ${dark ? 'tk-section-header__line--light' : ''}`} />
    </div>
  );
}

function SectionOrnament() {
  return (
    <div className="tk-section-ornament" aria-hidden="true">
      <Leaf size={24} strokeWidth={1.2} />
    </div>
  );
}

// ===== MAIN PAGE =====
function TentangKamiPage() {
  return (
    <>
      <Header />
      <main className="tk-page">
        {/* ===== 1. HERO ===== */}
        <section className="tk-hero">
          <Ornament position="top-right" />
          <Ornament position="bottom-left" />
          <div className="tk-container">
            <div className="tk-hero__grid">
              <div className="tk-hero__content">
                {/* Badge capsule with white bg, green border */}
                <div className="tk-hero__badge">
                  <Leaf size={14} strokeWidth={1.8} />
                  <span>{heroData.badge}</span>
                </div>
                {/* Heading serif besar */}
                <h1 className="tk-hero__title">
                  {heroData.heading[0]}
                  <br />
                  {heroData.heading[1]}
                </h1>
                {/* Subjudul bold */}
                <p className="tk-hero__subtitle">{heroData.subheading}</p>
                {/* Deskripsi */}
                <p className="tk-hero__desc">{heroData.description}</p>
                {/* Tombol hijau pill dengan shadow */}
                <a href="#visi" className="tk-hero__btn">
                  <Leaf size={18} strokeWidth={1.6} />
                  <span>{heroData.buttonText}</span>
                </a>
              </div>
              <div className="tk-hero__image-wrapper">
                <div className="tk-hero__image">
                  <img src="https://placehold.co/800x550/f4efe4/26452d?text=Ecoprint+Desa+Piji" alt="Proses Ecoprint Desa Piji" loading="eager" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 2. VISI KAMI ===== */}
        <Section dark id="visi">
          <Ornament position="left" dark />
          <Ornament position="right" dark />
          <SectionTitle title={visiData.title} dark />
          <SectionOrnament />
          <div className="tk-visi__grid">
            {visiData.items.map((item, idx) => (
              <div key={idx} className="tk-visi__card">
                <div className="tk-visi__icon">
                  <Icon name={item.icon} className="tk-visi__icon-svg" />
                </div>
                <h3 className="tk-visi__card-title">{item.title}</h3>
                <p className="tk-visi__card-desc">{item.description}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ===== 3. BAGAIMANA SISTEM KAMI BEKERJA ===== */}
        <section className="tk-section tk-section--light tk-sistem" ref={useFadeIn()}>
          <div className="tk-container">
            <SectionTitle title={sistemData.title} />
            <SectionOrnament />
            <div className="tk-sistem__desktop">
              {sistemData.items.map((item, idx) => (
                <div key={idx} className="tk-sistem__step-wrapper">
                  <div className="tk-sistem__step">
                    <div className="tk-sistem__circle">
                      <Icon name={item.icon} className="tk-sistem__icon" />
                    </div>
                    <h3 className="tk-sistem__step-title">{item.title}</h3>
                    <p className="tk-sistem__step-desc">{item.description}</p>
                  </div>
                  {idx < sistemData.items.length - 1 && (
                    <div className="tk-sistem__arrow" aria-hidden="true">
                      {/* Dashed line with arrow */}
                      <div className="tk-sistem__arrow-line">
                        <ChevronRight size={16} className="tk-sistem__arrow-head" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="tk-sistem__mobile">
              {sistemData.items.map((item, idx) => (
                <div key={idx} className="tk-sistem__mobile-step">
                  <div className="tk-sistem__mobile-circle">
                    <Icon name={item.icon} className="tk-sistem__icon" />
                  </div>
                  <div className="tk-sistem__mobile-text">
                    <h3 className="tk-sistem__step-title">{item.title}</h3>
                    <p className="tk-sistem__step-desc">{item.description}</p>
                  </div>
                  {idx < sistemData.items.length - 1 && (
                    <div className="tk-sistem__mobile-arrow" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#26452d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6,9 12,15 18,9" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 4. STRUKTUR ORGANISASI ===== */}
        <Section dark>
          <Ornament position="bottom-right" dark />
          <SectionTitle title={organisasiData.title} dark />
          <SectionOrnament />
          <div className="tk-organisasi__grid">
            {organisasiData.items.map((item, idx) => (
              <div key={idx} className="tk-organisasi__card">
                <div className="tk-organisasi__card-icon">
                  <Icon name={item.icon} className="tk-organisasi__icon-svg" />
                </div>
                <div className="tk-organisasi__card-text">
                  <h3 className="tk-organisasi__card-title">{item.title}</h3>
                  <p className="tk-organisasi__card-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ===== 5. MITRA LOKAL ===== */}
        <section className="tk-section tk-section--light tk-mitra" ref={useFadeIn()}>
          <Ornament position="right-large" />
          <div className="tk-container">
            <SectionTitle title={mitraData.title} />
            <SectionOrnament />
            <div className="tk-mitra__grid">
              {mitraData.items.map((item, idx) => (
                <div key={idx} className="tk-mitra__card">
                  <Icon name={item.icon} className="tk-mitra__card-icon" />
                  <h3 className="tk-mitra__card-title">{item.title}</h3>
                  <p className="tk-mitra__card-desc">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 6. EKONOMI SIRKULAR ===== */}
        <Section dark className="tk-sirkular-section">
          <Ornament position="right-large" dark />
          <SectionTitle title={sirkularData.title} dark />
          <SectionOrnament />
          <div className="tk-sirkular__grid">
            <div className="tk-sirkular__text">
              <p className="tk-sirkular__desc">{sirkularData.description}</p>
            </div>
            <div className="tk-sirkular__diagram">
              <CircularDiagram />
            </div>
          </div>
        </Section>

        {/* ===== 7. DAMPAK UNTUK WARGA ===== */}
        <section className="tk-section tk-section--light tk-dampak" ref={useFadeIn()}>
          <Ornament position="bottom-left" />
          <div className="tk-container">
            <SectionTitle title={dampakData.title} />
            <SectionOrnament />
            <div className="tk-dampak__grid">
              {dampakData.items.map((item, idx) => (
                <div key={idx} className="tk-dampak__card">
                  <Icon name={item.icon} className="tk-dampak__card-icon" />
                  <span className="tk-dampak__card-number">{item.number}</span>
                  <h3 className="tk-dampak__card-title">{item.label}</h3>
                  <p className="tk-dampak__card-desc">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </>
  );
}

// ===== CIRCULAR DIAGRAM SVG =====
function CircularDiagram() {
  const nodes = sirkularData.nodes;
  const radius = 130;
  const centerX = 230;
  const centerY = 230;
  const nodeRadius = 40;
  const total = nodes.length;
  const angleStep = (2 * Math.PI) / total;

  const positions = nodes.map((_, i) => ({
    x: centerX + radius * Math.cos(i * angleStep - Math.PI / 2),
    y: centerY + radius * Math.sin(i * angleStep - Math.PI / 2),
  }));

  return (
    <svg viewBox="0 0 460 460" className="tk-sirkular__svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrowGreen" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="rgba(248,242,231,0.6)" />
        </marker>
      </defs>

      {/* Circular connection lines with arrows */}
      {positions.map((pos, i) => {
        const next = positions[(i + 1) % total];
        const dx = next.x - pos.x;
        const dy = next.y - pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ux = dx / dist;
        const uy = dy / dist;

        // Shorten line to not overlap with nodes
        const x1 = pos.x + ux * nodeRadius;
        const y1 = pos.y + uy * nodeRadius;
        const x2 = next.x - ux * nodeRadius;
        const y2 = next.y - uy * nodeRadius;

        return <line key={`line-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(248,242,231,0.4)" strokeWidth="1.5" strokeDasharray="5,4" markerEnd="url(#arrowGreen)" />;
      })}

      {/* Center circle */}
      <circle cx={centerX} cy={centerY} r={52} fill="rgba(248,242,231,0.12)" stroke="rgba(248,242,231,0.5)" strokeWidth="1.5" />
      <text x={centerX} y={centerY - 10} textAnchor="middle" fill="#f8f2e7" fontSize="13" fontWeight="700" fontFamily="Georgia, serif">
        <tspan x={centerX} dy="0">
          Zero Waste
        </tspan>
        <tspan x={centerX} dy="18">
          Ecoprint
        </tspan>
      </text>

      {/* Node circles */}
      {positions.map((pos, i) => (
        <g key={`node-${i}`}>
          <circle cx={pos.x} cy={pos.y} r={nodeRadius} fill="rgba(248,242,231,0.1)" stroke="rgba(248,242,231,0.4)" strokeWidth="1.2" />
          <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central" fill="#f8f2e7" fontSize="10" fontWeight="500" fontFamily="system-ui, sans-serif">
            {nodes[i].split(' ').map((word, wi) => (
              <tspan key={wi} x={pos.x} dy={wi === 0 ? '-5' : '14'}>
                {word}
              </tspan>
            ))}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default TentangKamiPage;
