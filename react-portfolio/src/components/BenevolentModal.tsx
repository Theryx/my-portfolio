import React, { useEffect } from 'react';

interface Venture {
  title: string;
  role: string;
  desc: string;
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

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        <div className="modal-body">
          <h2 className="modal-title" style={{ marginBottom: '8px' }}>{venture.title}</h2>
          <span style={{ display: 'block', color: 'var(--color-accent)', fontWeight: 600, marginBottom: '24px' }}>
            {venture.role}
          </span>
          <div className="journey-content">
            <p>{venture.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
