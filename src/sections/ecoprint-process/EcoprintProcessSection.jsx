import { Fragment } from 'react';
import { Leaf, Hammer, ChefHat, Droplets, Sparkles } from 'lucide-react';
import './EcoprintProcessSection.css';

const processSteps = [
  {
    icon: Leaf,
    title: 'Pemilihan Daun',
    description: 'Daun dan bunga segar dipilih dengan cermat.',
  },
  {
    icon: Hammer,
    title: 'Pounding (Pemukulan)',
    description: 'Daun ditata di atas kain lalu dipukul untuk memindahkan warna alami.',
  },
  {
    icon: ChefHat,
    title: 'Pengukusan',
    description: 'Kain digulung dan dikukus untuk mengikat pigmen alami.',
  },
  {
    icon: Droplets,
    title: 'Pencucian',
    description: 'Kain dicuci untuk menghilangkan sisa daun dan kotoran.',
  },
  {
    icon: Sparkles,
    title: 'Karya Siap',
    description: 'Produk ecoprint siap digunakan dan dinikmati.',
  },
];

function EcoprintProcessSection({ sectionId = 'proses-ecoprint', variant = 'green' }) {
  const isLight = variant === 'light';
  const sectionClass = isLight ? 'ecoprint-process-section ecoprint-process-section--light' : 'ecoprint-process-section';

  return (
    <section className={sectionClass} id={sectionId}>
      <div className="ecoprint-process-section__container">
        {/* ===== HEADER ===== */}
        <div className="ecoprint-process-section__header">
          <span className="ecoprint-process-section__ornament" aria-hidden="true">
            <span className="ecoprint-process-section__line" />
            <Leaf className="ecoprint-process-section__leaf" size={16} strokeWidth={2} />
            <span className="ecoprint-process-section__line" />
          </span>
          <h3 className="ecoprint-process-section__title">Dari Daun Menjadi Karya</h3>
          <p className="ecoprint-process-section__subtitle">Lima tahapan sederhana yang mengubah dedaunan alami menjadi karya seni ecoprint yang bernilai.</p>
        </div>

        {/* ===== STEPS ===== */}
        <div className="ecoprint-process-section__steps">
          {processSteps.map((step, index) => {
            const IconComponent = step.icon;

            return (
              <Fragment key={index}>
                <div className="ecoprint-process-section__step">
                  {/* Icon Circle */}
                  <div className="ecoprint-process-section__step-icon">
                    <IconComponent className="ecoprint-process-section__step-icon-inner" size={32} strokeWidth={1.5} />
                  </div>

                  {/* Label */}
                  <h4 className="ecoprint-process-section__step-title">{step.title}</h4>

                  {/* Description */}
                  <p className="ecoprint-process-section__step-desc">{step.description}</p>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default EcoprintProcessSection;
