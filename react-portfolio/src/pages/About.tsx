import { PageTransition } from '../components/PageTransition';
import { useProfile } from '../context/ProfileContext';
import myProfile from '../assets/img/My profile.jfif';
import givingLecture from '../assets/img/theryx giving a lecture to a comunity of open source.png';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { MapPin, Languages, Fish } from 'lucide-react';
import { lightboxTrigger } from '../lib/a11y';
import { gridVariants, tileVariants } from '../lib/motion';
import { profilePresets } from '../data/profileCopy';

const DEFAULT_FAQS = [
  { question: 'How do you approach building a product?', answer: "Honestly I'm not sure I have a fixed process. Ok I would say it depends. Sometimes rough, sometimes straight to the point, from research and interface through to the code. The truth is that books say one thing but reality says otherwise." },
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

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Per-profile About content. Prefer the CMS-edited about_content, then the
  // bundled preset, then the hardcoded site defaults.
  const preset = profile ? profilePresets[profile.id]?.about : undefined;
  const about = profile?.about_content ?? {};
  const faqs = about.faqs?.length ? about.faqs : (preset?.faqs ?? DEFAULT_FAQS);
  // Split on any line break (single or blank-line, incl. CRLF) so each
  // paragraph the author entered renders as its own <p>.
  const splitParagraphs = (text: string) =>
    text.replace(/\r\n/g, '\n').split(/\n+/).map((p) => p.trim()).filter(Boolean);
  const speakingParas = about.speaking_intro
    ? splitParagraphs(about.speaking_intro)
    : preset?.speakingIntro
      ? splitParagraphs(preset.speakingIntro)
      : DEFAULT_SPEAKING_INTRO_PARAS;
  // Build the collage image list. We prefer the new speaking_images array;
  // fall back to the legacy single field, then to the bundled asset. The
  // page always renders up to 3 tiles — if the admin leaves a slot empty,
  // we pad with the first available image so the layout stays balanced.
  const rawSpeakingImages = (about.speaking_images && about.speaking_images.length > 0)
    ? about.speaking_images
    : (about.speaking_image ? [about.speaking_image] : [givingLecture]);
  const validSpeakingImages = rawSpeakingImages.filter((u) => u && /^(https?:\/\/|\/)/.test(u));
  const speakingImages = validSpeakingImages.length > 0 ? validSpeakingImages : [givingLecture];
  const paddedSpeakingImages = [
    speakingImages[0],
    speakingImages[1] ?? speakingImages[0],
    speakingImages[2] ?? speakingImages[1] ?? speakingImages[0],
  ];
  const location = about.location || 'Douala';
  const locationLabel = about.location_label || 'Cameroon 🇨🇲';
  const languages = about.languages || 'EN & FR';
  const languagesLabel = about.languages_label || 'Bilingual, fully fluent';
  const funFact = about.fun_fact || 'I value direct opinions, simple language, and a good plate of fish.';

  const handleImageClick = (src: string, caption: string) => {
    setSelectedImage({ src, caption });
  };

  return (
    <PageTransition>
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
            <motion.div className="bento-card about-bento__main" variants={tileVariants}>
              <img src={myProfile} alt="Ndouken Theryx" className="about-bento__photo" loading="lazy" />
              <p className="about__text">
                {profile?.bio || 'I am a product designer who also builds: I work across UX, interface, and front-end code to ship digital products end to end. I have been building and leading the design team at PaySika since December 2021, alongside co-founding ventures and shipping real-world applications.'}
              </p>
              <p className="about__text about-bento__tagline">
                {profile?.tagline || 'I bridge the gap between design and development. I believe in clean design, simple language, and practical problem-solving.'}
              </p>
            </motion.div>

            <motion.div className="bento-card bento-card--mini" variants={tileVariants}>
              <span className="bento-card__mini-icon bento-card__pin">
                <MapPin size={20} aria-hidden="true" />
                <span className="bento-card__pin-pulse" aria-hidden="true" />
              </span>
              <span className="bento-card__mini-value">{location}</span>
              <span className="bento-card__mini-label">{locationLabel}</span>
            </motion.div>

            <motion.div className="bento-card bento-card--mini" variants={tileVariants}>
              <span className="bento-card__mini-icon">
                <Languages size={20} aria-hidden="true" />
              </span>
              <span className="bento-card__mini-value">{languages}</span>
              <span className="bento-card__mini-label">{languagesLabel}</span>
            </motion.div>

            <motion.div className="bento-card bento-card--mini bento-card--fish" variants={tileVariants}>
              <span className="bento-card__mini-icon bento-card__fish">
                <Fish size={20} aria-hidden="true" />
              </span>
              <span className="bento-card__mini-label">Fun fact</span>
              <p className="bento-card__now-text">{funFact}</p>
            </motion.div>

          </motion.div>
        </div>
      </section>

      <section className="speaking">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}>
            <span className="section-sticker">On stage</span>
            <h2 className="section__title">Research & Speaking</h2>
            <div className="speaking__content">
              <div className="speaking__collage">
                <img
                  src={paddedSpeakingImages[0]}
                  alt="Theryx presenting research"
                  className="speaking__image"
                  loading="lazy"
                  {...lightboxTrigger(() => handleImageClick(paddedSpeakingImages[0], 'Research & speaking'), 'Enlarge speaking photo')}
                  style={{ cursor: 'pointer', objectPosition: 'center 30%' }}
                />
                <img
                  src={paddedSpeakingImages[1]}
                  alt=""
                  className="speaking__image"
                  loading="lazy"
                  aria-hidden="true"
                  style={{ objectPosition: 'right center' }}
                />
                <img
                  src={paddedSpeakingImages[2]}
                  alt=""
                  className="speaking__image"
                  loading="lazy"
                  aria-hidden="true"
                  style={{ objectPosition: 'left center' }}
                />
              </div>
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
