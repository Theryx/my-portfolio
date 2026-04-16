import { useState } from 'react';
import { PageTransition } from '../components/PageTransition';
import linkedInPdf from '../assets/img/Linked in Profile.pdf';
import { Download } from 'lucide-react';

export default function Contact() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('sending');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      // Using Web3Forms (free tier: https://web3forms.com)
      // Replace YOUR_ACCESS_KEY with your actual key from web3forms.com
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: 'YOUR_ACCESS_KEY', // TODO: Replace with your Web3Forms access key
          ...data,
        }),
      });

      if (response.ok) {
        setFormStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  };

  const faqs = [
    {
      question: 'What is your design process?',
      answer: 'Direct and data-driven. I focus on the core problem, wireframe solutions, test, and deliver high-fidelity designs ready for engineering.',
    },
    {
      question: 'What technologies do you use?',
      answer: "I design in Figma and Adobe Creative Suite, and I'm currently learning front-end development with Angular and React. I also use Mixpanel for analytics.",
    },
    {
      question: 'Are you open to speaking engagements?',
      answer: 'Absolutely. I love public speaking, networking, and sharing insights on fintech, design, and tech ecosystems in Africa.',
    },
  ];

  return (
    <PageTransition>
      <section className="contact">
        <div className="container">
          <div className="contact__inner">
            <div>
              <h2 className="section__title" style={{ textAlign: 'left' }}>Let&apos;s build something impactful.</h2>

              <form className="contact__form" onSubmit={handleSubmit}>
                <div className="contact__form-group">
                  <label htmlFor="name" className="contact__label">Name</label>
                  <input type="text" id="name" name="name" className="contact__input" placeholder="John Doe" required aria-required="true" />
                </div>
                <div className="contact__form-group">
                  <label htmlFor="email" className="contact__label">Email</label>
                  <input type="email" id="email" name="email" className="contact__input" placeholder="john@example.com" required aria-required="true" />
                </div>
                <div className="contact__form-group">
                  <label htmlFor="message" className="contact__label">Message</label>
                  <textarea id="message" name="message" className="contact__input contact__textarea" placeholder="How can I help you?" required aria-required="true"></textarea>
                </div>
                <button type="submit" className="btn btn--primary" style={{ width: '100%', marginTop: 'var(--spacing-md)' }} disabled={formStatus === 'sending'}>
                  {formStatus === 'sending' ? 'Sending...' : formStatus === 'success' ? 'Message Sent!' : 'Send Message'}
                </button>
                {formStatus === 'success' && (
                  <p className="contact__success" role="status">Thank you! Your message has been sent.</p>
                )}
                {formStatus === 'error' && (
                  <p className="contact__error" role="alert">Something went wrong. Please try again or email me directly.</p>
                )}
              </form>

              <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <a
                  href={linkedInPdf}
                  download="Ndouken_ThERYX_LinkedIn_Profile.pdf"
                  className="btn btn--secondary"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-sm)' }}
                  aria-label="Download CV / Resume (PDF)"
                >
                  <Download size={20} aria-hidden="true" />
                  Download CV / Resume
                </a>
              </div>
            </div>

            <div className="contact__info">
              <h3 className="contact__info-title">Direct Contact</h3>
              <div className="contact__info-item">
                <span className="contact__info-label">Location</span>
                <span className="contact__info-value">Douala, Cameroon</span>
              </div>
              <div className="contact__info-item">
                <span className="contact__info-label">Languages</span>
                <span className="contact__info-value">English & French</span>
              </div>
              <div className="contact__info-item">
                <span className="contact__info-label">Email</span>
                <a href="mailto:ndouken@gmail.com" className="contact__info-value">ndouken@gmail.com</a>
              </div>

              <div className="contact__socials">
                <a href="https://www.linkedin.com/in/ndoukentheryx" target="_blank" rel="noopener noreferrer" className="contact__social-link" aria-label="LinkedIn Profile (opens in new tab)">LinkedIn</a>
                <a href="https://github.com/Theryx" target="_blank" rel="noopener noreferrer" className="contact__social-link" aria-label="GitHub Profile (opens in new tab)">GitHub</a>
                <a href="https://x.com/NTheryx" target="_blank" rel="noopener noreferrer" className="contact__social-link" aria-label="X / Twitter Profile (opens in new tab)">X / Twitter</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq">
        <div className="container">
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
    </PageTransition>
  );
}
