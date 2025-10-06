import { ReactNode } from 'react';
import clsx from 'clsx';

interface ChoiceTileProps {
  selected?: boolean;
  onClick?: () => void;
  children: ReactNode;
  name?: string;
  value?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

const ChoiceTile = ({ selected, onClick, children, disabled, ariaLabel }: ChoiceTileProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={clsx(
        'tile flex h-full flex-col items-start gap-2 text-left',
        selected ? 'border-brand shadow-lift ring-2 ring-brand/40' : 'shadow-sm',
        disabled && 'cursor-not-allowed opacity-60'
      )}
      aria-pressed={selected}
    >
      {children}
    </button>
  );
};

export default ChoiceTile;
