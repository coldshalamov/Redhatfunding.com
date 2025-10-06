import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal = ({ open, onClose, title, children }: ModalProps) => {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-lift">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-line px-3 py-1 text-sm font-semibold text-muted transition hover:text-ink"
          >
            Close
          </button>
        </div>
        <div className="mt-4 text-sm text-ink">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
