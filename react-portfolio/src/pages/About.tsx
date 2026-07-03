import { PageTransition } from '../components/PageTransition';
import { useProfile } from '../context/ProfileContext';
import myProfile from '../assets/img/My profile.jfif';
import givingLecture from '../assets/img/theryx giving a lecture to a comunity of open source.png';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MapPin, Languages, Fish, Quote } from 'lucide-react';
import { lightboxTrigger } from '../lib/a11y';
import { gridVariants, tileVariants } from '../lib/motion';
import { profilePresets } from '../data/profileCopy';

const DEFAULT_FAQS = [
  { question: 'How do you approach building a product?', answer: "Honestly I'm not sure I have a fixed process. Ok I would say it depends. Sometimes rough, sometimes straight to the point — from research and interface through to the code. The truth is that books say one thing but reality says otherwise." },
  { question: 'Are you open to speaking engagements?', answer: 'Absolutely. I love public speaking, networking, and sharing insights on fintech, design, and tech ecosystems in Africa.' },
];

const DEFAULT_SPEAKING_INTRO_PARAS = [
  'In 2022, I was invited by the **OSS Cameroon** community to present the findings of my research on the **State of the Design Ecosystem in Cameroon**.',
  'The objective of the talk was to provide data-driven insights into our local industry while passionately encouraging more designers to bridge the gap between design and development by contributing to **Open Source** projects.',
];

// Lightweight inline-bold renderer for **bold** segments in the speaking intro.
function renderBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export default function About() {
  const { profile } = useProfile();
  const [selectedImage, setSelectedImage] = useState<{ src: string; caption: string } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Custom cursor state for interactive cards
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorLabel, setCursorLabel] = useState('');
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Custom cursor label on hover — mirrors the home page bento cards.
  const hoverable = (label: string) => ({
    onMouseEnter: () => {
      setIsHovering(true);
      setCursorLabel(label);
    },
    onMouseLeave: () => {
      setIsHovering(false);
      setCursorLabel('');
    },
  });

  // Per-profile About sections, with the default arrays as fallback.
  const preset = profile ? profilePresets[profile.id]?.about : undefined;
  const faqs = preset?.faqs ?? DEFAULT_FAQS;
  const speakingParas = preset?.speakingIntro
    ? [preset.speakingIntro]
    : DEFAULT_SPEAKING_INTRO_PARAS;

  const handleImageClick = (src: string, caption: string) => {
    setSelectedImage({ src, caption });
  };

  return (
    <PageTransition>
      {isHovering && (
        <div
          className="custom-cursor-label"
          style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
        >
          {cursorLabel}
        </div>
      )}

      {/* ── Bento intro mosaic ── */}
      <section className="about">
        <div className="container">
          <span className="section-sticker section-sticker--accent">Nice to meet you</span>
          <h2 className="section__title" style={{ textAlign: 'left' }}>About me</h2>
          <motion.div
            className="about-bento"
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <motion.div className="bento-card about-bento__main" variants={tileVariants} {...hoverable('a little about me')}>
              <img src={myProfile} alt="Ndouken Theryx" className="about-bento__photo" loading="lazy" />
              <div>
                <p className="about__text">
                  {profile?.bio || 'I am a product designer who also builds — I work across UX, interface, and front-end code to ship digital products end to end. I have been building and leading the design team at PaySika since December 2021, alongside co-founding ventures and shipping real-world applications.'}
                </p>
                <p className="about__text about-bento__tagline">
                  {profile?.tagline || 'I bridge the gap between design and development. I believe in clean design, simple language, and practical problem-solving.'}
                </p>
              </div>
            </motion.div>

            <motion.div className="bento-card bento-card--mini" variants={tileVariants} {...hoverable('born & based here')}>
              <span className="bento-card__mini-icon bento-card__pin">
                <MapPin size={20} aria-hidden="true" />
                <span className="bento-card__pin-pulse" aria-hidden="true" />
              </span>
              <span className="bento-card__mini-value">Douala</span>
              <span className="bento-card__mini-label">Cameroon 🇨🇲</span>
            </motion.div>

            <motion.div className="bento-card bento-card--mini" variants={tileVariants} {...hoverable('oui & yes 🙂')}>
              <span className="bento-card__mini-icon">
                <Languages size={20} aria-hidden="true" />
              </span>
              <span className="bento-card__mini-value">EN & FR</span>
              <span className="bento-card__mini-label">Bilingual, fully fluent</span>
            </motion.div>

            <motion.div className="bento-card bento-card--mini bento-card--fish" variants={tileVariants} {...hoverable('fun fact 🐟')}>
              <span className="bento-card__mini-icon bento-card__fish">
                <Fish size={20} aria-hidden="true" />
              </span>
              <span className="bento-card__mini-label">Fun fact</span>
              <p className="bento-card__now-text">I value direct opinions, simple language, and a good plate of fish.</p>
            </motion.div>

            {profile?.philosophy_text && (
              <motion.div className="bento-card about-bento__philosophy" variants={tileVariants} {...hoverable('how I think')}>
                <Quote size={18} aria-hidden="true" className="about-bento__quote-icon" />
                <h3 className="about-bento__philosophy-title">{profile.philosophy_title}</h3>
                <p className="about-bento__philosophy-text">{profile.philosophy_text}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="speaking">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}>
            <span className="section-sticker">On stage</span>
            <h2 className="section__title">Research & Speaking</h2>
            <div className="speaking__content">
              <img
                src={givingLecture}
                alt="Theryx presenting research at OSS Cameroon"
                className="speaking__image"
                loading="lazy"
                {...lightboxTrigger(() => handleImageClick(givingLecture, "Presenting research on the Cameroon Design Ecosystem at the 2022 OSS Cameroon meetup."), 'Enlarge speaking photo')}
                style={{ cursor: 'pointer' }}
              />
              <div className="speaking__text">
                {speakingParas.map((para, i) => (
                  <p key={i}>{renderBold(para)}</p>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="faq">
        <div className="container">
          <span className="section-sticker">You asked</span>
          <h2 className="section__title">Frequently Asked Questions</h2>
          <div className="faq__list">
            {faqs.map((faq, index) => (
              <div className="faq__item" key={index}>
                <button
                  className="faq__question"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaq === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span>{faq.question}</span>
                  <span aria-hidden="true">▼</span>
                </button>
                {openFaq === index && (
                  <div className="faq__answer" id={`faq-answer-${index}`} role="region">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="image-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="image-lightbox__content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="image-lightbox__close" onClick={() => setSelectedImage(null)}>&times;</button>
              <img src={selectedImage.src} alt={selectedImage.caption} />
              <div className="image-lightbox__caption">
                <p>{selectedImage.caption}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
