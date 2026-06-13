import React, { useEffect } from 'react';

interface JourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JourneyModal: React.FC<JourneyModalProps> = ({ isOpen, onClose }) => {
  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        <div className="modal-body">
          <h2 className="modal-title">Heyyy 👋</h2>

          <div className="journey-content">
            <p>
              I'm Ndouken Theryx — a Product Designer &amp; Tech Entrepreneur based in Cameroon.
              For the past 4 years I led design at PaySika, shaping end-to-end digital products
              where UX/UI design and frontend engineering meet.
            </p>
            <p>
              Alongside that I've co-founded tech ventures, and I'm now shipping my next one with
              AI-assisted design and code. I care about products that feel seamless, trustworthy,
              and genuinely useful.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
