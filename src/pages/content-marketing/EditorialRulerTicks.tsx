import React from 'react';
import { cn } from '../../lib/cn';

interface EditorialRulerTicksProps {
  side: 'left' | 'right';
  className?: string;
}

export const EditorialRulerTicks: React.FC<EditorialRulerTicksProps> = ({ side, className }) => {
  const tickCount = 48;

  return (
    <div
      aria-hidden="true"
      className={cn(
        'absolute top-0 bottom-0 pointer-events-none select-none flex flex-col justify-between py-12 z-20',
        side === 'left' ? 'left-2 sm:left-4 md:left-6 items-start' : 'right-2 sm:right-4 md:right-6 items-end',
        className
      )}
    >
      <div className="flex flex-col gap-3 sm:gap-4 h-full justify-evenly">
        {Array.from({ length: tickCount }).map((_, idx) => {
          const isMajor = idx % 5 === 0;
          const isMedium = idx % 5 === 2;

          return (
            <div
              key={idx}
              className={cn(
                'h-[1px] bg-[#EFE8D8] transition-opacity duration-300',
                isMajor
                  ? 'w-4 sm:w-5 opacity-25'
                  : isMedium
                    ? 'w-2.5 sm:w-3 opacity-15'
                    : 'w-1.5 sm:w-2 opacity-10'
              )}
            />
          );
        })}
      </div>
    </div>
  );
};
