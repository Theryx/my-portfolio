import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Venture {
  title: string;
  role: string;
  desc: string;
  logo?: string;
}

interface BenevolentModalProps {
  isOpen: boolean;
  onClose: () => void;
  venture: Venture | null;
}

export const BenevolentModal: React.FC<BenevolentModalProps> = ({ isOpen, onClose, venture }) => {
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

  if (!isOpen || !venture) return null;

  // Portal to <body> so the fixed backdrop escapes the page-transition wrapper's
  // transform (see JourneyModal for the full rationale).
  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        <div className="modal-body">
          {venture.logo && (
            <div style={{ marginBottom: '16px' }}>
              <img src={venture.logo} alt={`${venture.title} logo`} style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '8px' }} />
            </div>
          )}
          <h2 className="modal-title" style={{ marginBottom: '8px' }}>{venture.title}</h2>
          <span style={{ display: 'block', color: 'var(--color-accent)', fontWeight: 600, marginBottom: '24px' }}>
            {venture.role}
          </span>
          <div className="journey-content">
            <p>{venture.desc}</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
