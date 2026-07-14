import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Profile } from '../lib/api';

interface JourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | null;
}

export const JourneyModal: React.FC<JourneyModalProps> = ({ isOpen, onClose, profile }) => {
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

  // Rendered through a portal to <body> so the fixed-position backdrop escapes
  // the page-transition wrapper's transform (a transformed ancestor would
  // otherwise become its containing block and mis-anchor / clip the modal).
  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        <div className="modal-body">
          <h2 className="modal-title">Heyyy 👋</h2>

          <div className="journey-content">
            {/* Lead paragraph — the full version of the text truncated on the intro card. */}
            <p>
              {profile?.hero_title ? (
                <>
                  I am <strong>Ndouken Theryx</strong>, <strong>{profile.hero_title}</strong>. {profile.hero_subtitle}
                </>
              ) : (
                <>
                  I am <strong>Ndouken Theryx</strong>, a <strong>Product Designer &amp; Builder</strong> who
                  designs and ships digital products end to end, where thoughtful design meets solid engineering.
                </>
              )}
            </p>
            {profile?.philosophy_text && <p>{profile.philosophy_text}</p>}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
