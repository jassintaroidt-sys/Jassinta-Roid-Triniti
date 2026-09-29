import React from 'react';
import { cn } from '../lib/cn';

export interface TocButtonProps {
  onClick: () => void;
  position?: 'top-right' | 'bottom-right' | 'hidden';
  className?: string;
  isOpen?: boolean;
}

export const TocButton: React.FC<TocButtonProps> = ({
  onClick,
  position = 'bottom-right',
  className,
  isOpen = false,
}) => {
  if (position === 'hidden') return null;

  const positionClasses =
    position === 'top-right'
      ? 'top-6 right-6 md:top-8 md:right-8'
      : 'bottom-14 right-6 md:bottom-16 md:right-8';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Toggle index menu"
      aria-expanded={isOpen}
      data-cursor="INDEX"
      className={cn(
        'fixed z-40 flex items-center gap-2.5 px-3.5 py-2 text-micro text-[#FFFFFF] transition-all duration-300 hover:text-[#D7261E] active:scale-95 group',
        'bg-[#000000]/85 backdrop-blur-md border border-white/20 hover:border-[#D7261E]/60 shadow-[0_4px_16px_rgba(0,0,0,0.5)]',
        positionClasses,
        className
      )}
      style={{
        paddingTop: position === 'top-right' ? 'calc(0.5rem + env(safe-area-inset-top, 0px))' : undefined,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#D7261E] transition-transform duration-300 group-hover:scale-125" />
      <span className="tracking-widest font-medium text-[#FFFFFF]">MENU</span>
    </button>
  );
};
