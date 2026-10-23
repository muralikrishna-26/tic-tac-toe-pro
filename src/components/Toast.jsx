import { useEffect } from 'react';

const TOAST_MS = 2600;

export default function Toast({ toast, onDismiss }) {
  const id = toast?.id;

  useEffect(() => {
    if (id === undefined) return undefined;
    const timer = window.setTimeout(() => onDismiss(id), TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && (
        <p className="toast" key={toast.id}>
          {toast.message}
        </p>
      )}
    </div>
  );
}
