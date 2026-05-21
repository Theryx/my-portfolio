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
          <h2 className="modal-title">My Journey</h2>
          
          <div className="journey-content">
            <p>
              I am Ndouken Theryx, a passionate Design Engineer and Tech Entrepreneur who 
              believes that the best digital products sit at the perfect intersection of 
              human-centered design and robust engineering.
            </p>
            <p>
              My journey began with a fascination for how people interact with technology. 
              I realized early on that brilliant code is only half the equation; without 
              an intuitive and delightful user experience, even the most powerful software 
              fails to make an impact. This realization pushed me to master both the 
              intricacies of front-end engineering and the empathy-driven process of UX design.
            </p>
            <p>
              Over the years, I've had the privilege of building platforms that serve thousands 
              of users. As a founder, I've learned to balance technical perfection with 
              business objectives, ensuring that every product I touch not only looks stunning 
              but also delivers measurable value.
            </p>
            <p>
              I specialize in bridging the gap between design teams and development teams, translating 
              complex user requirements into scalable, performant architectures. Whether it's crafting 
              a micro-interaction that makes a user smile, or optimizing a complex data flow, 
              my goal is always to create experiences that feel seamless, natural, and empowering.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
