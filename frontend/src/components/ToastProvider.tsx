import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

interface Toast {
  id: number;
  message: string;
  tone: 'success' | 'error';
}

interface ToastContextValue {
  notify: (message: string, tone?: Toast['tone']) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const remove = useCallback((id: number) => {
    const timeoutId = timers.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timers.current.delete(id);
    }
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, tone: Toast['tone'] = 'success') => {
      const id = Date.now();
      const timeoutId = window.setTimeout(() => {
        remove(id);
      }, 5000);
      timers.current.set(id, timeoutId);
      setToasts((current) => [...current, { id, message, tone }]);
    },
    [remove]
  );

  useEffect(() => {
    const timersMap = timers.current;
    return () => {
      timersMap.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      timersMap.clear();
    };
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div aria-live="polite" aria-atomic="true" className="fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              role="status"
              className={`flex w-full max-w-sm items-center justify-between rounded-3xl px-4 py-3 text-sm font-semibold text-white shadow-lift ${
                toast.tone === 'success' ? 'bg-success' : 'bg-error'
              }`}
            >
              <span>{toast.message}</span>
              <button
                type="button"
                onClick={() => remove(toast.id)}
                className="ml-4 rounded-full bg-white/20 px-2 py-1 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/80"
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export default ToastProvider;
