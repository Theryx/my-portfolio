import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

/* ─── Dialogs ───────────────────────────────────────────────────────────── */

// Keeps keyboard focus inside an open dialog, closes it on Escape, and puts
// focus back where it was when the dialog closes.
function useDialogFocus(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; });

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const node = ref.current;
    const focusables = () =>
      Array.from(node?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
      ) ?? []);
    (node?.querySelector<HTMLElement>('[data-autofocus]') ?? focusables()[0])?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); closeRef.current(); return; }
      if (e.key !== 'Tab') return;
      const list = focusables();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    node?.addEventListener('keydown', onKey);
    return () => {
      node?.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, []);

  return ref;
}

export function ConfirmDialog({ title, children, confirmLabel = 'Confirm', danger, onConfirm, onCancel }: {
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useDialogFocus(onCancel);
  const titleId = useId();
  return (
    <div className="cms-overlay" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div ref={ref} className="cms-dialog" role="alertdialog" aria-modal="true" aria-labelledby={titleId}>
        <h2 id={titleId}>{title}</h2>
        <div>{children}</div>
        <div className="cms-dialog__actions">
          <button type="button" className="cms-btn" onClick={onCancel} data-autofocus>Cancel</button>
          <button type="button" className={`cms-btn ${danger ? 'cms-btn--danger' : 'cms-btn--primary'}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Modal({ title, onClose, children, footer, narrow, headExtra }: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  narrow?: boolean;
  headExtra?: ReactNode;
}) {
  const ref = useDialogFocus(onClose);
  const titleId = useId();
  return (
    <div className="cms-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} className={`cms-modal${narrow ? ' cms-modal--narrow' : ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="cms-modal__head">
          <h2 id={titleId} className="cms-modal__title">{title}</h2>
          {headExtra}
          <button type="button" className="cms-icon-btn" onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>
        <div className="cms-modal__body">{children}</div>
        {footer && <div className="cms-modal__foot">{footer}</div>}
      </div>
    </div>
  );
}
