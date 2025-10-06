import { ReactNode } from 'react';
import clsx from 'clsx';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
}

const FormField = ({ label, htmlFor, hint, error, children, required }: FormFieldProps) => (
  <div className="space-y-2">
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-ink">
      {label}
      {required && <span className="ml-1 text-brand">*</span>}
    </label>
    {hint && <p className="text-sm text-muted">{hint}</p>}
    <div className={clsx('relative', error && 'after:absolute after:-bottom-2 after:left-0 after:text-xs after:text-error')}>
      {children}
    </div>
    {error && <p className="text-sm text-error" role="alert">{error}</p>}
  </div>
);

export default FormField;
