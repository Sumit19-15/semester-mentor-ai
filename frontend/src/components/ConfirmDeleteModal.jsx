import { X, AlertTriangle } from 'lucide-react';

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface rounded-xl shadow-lg w-full max-w-md overflow-hidden flex flex-col border border-outline-variant">
        <div className="flex justify-between items-center p-4 border-b border-outline-variant/50">
          <h2 className="font-headline-sm text-[18px] font-bold text-on-surface flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-error" />
            {title || "Confirm Delete"}
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-secondary hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <p className="font-body-md text-[14px] text-on-surface">
            {message || "Are you sure you want to delete this item? This action cannot be undone."}
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-label-md text-[14px] font-semibold text-secondary hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={async () => {
                try {
                  await onConfirm();
                } finally {
                  onClose();
                }
              }}
              className="px-5 py-2 bg-error text-on-error rounded-lg font-label-md text-[14px] font-semibold hover:opacity-90 transition-all shadow-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
