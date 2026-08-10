import Header from '../components/layout/Header';
import HeroSection from '../sections/hero/HeroSection';
import ProductCatalogSection from '../sections/products/ProductCatalogSection';
import EcoprintProcessSection from '../sections/ecoprint-process/EcoprintProcessSection';
import CircularEconomySection from '../sections/ecoprint-process/CircularEconomySection';
import GalleryHomeSection from '../sections/gallery/GalleryHomeSection';
import AboutSection from '../sections/about/AboutSection';
import FooterSection from '../sections/footer/FooterSection';

function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* ===== SECTION 1: HERO ===== */}
        <HeroSection />

        {/* ===== SECTION 2: KATALOG PRODUK ===== */}
        <ProductCatalogSection />

        {/* ===== SECTION 3: SIRKULAR EKONOMI & ZERO WASTE ===== */}
        <CircularEconomySection />

        {/* ===== SECTION 4: GALERI ===== */}
        <GalleryHomeSection />

        {/* ===== SECTION 5: TENTANG KAMI ===== */}
        <AboutSection />

        {/* ===== SECTION 6: DARI DAUN MENJADI KARYA (COPY) ===== */}
        <EcoprintProcessSection sectionId="proses-ecoprint-copy" variant="light" />
      </main>
      <FooterSection />
    </>
  );
}

export default HomePage;
