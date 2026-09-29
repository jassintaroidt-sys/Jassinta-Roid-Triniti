import React, { useState, useRef, useEffect } from 'react';
import { DocumentItem } from './data';
import { Logo } from './Logo';
import { cn } from '../../lib/cn';

interface DocumentProps {
  item: DocumentItem;
  initialX: number;
  initialY: number;
  onBringToFront: (id: number) => void;
  onPositionChange: (id: number, x: number, y: number) => void;
}

export const Document: React.FC<DocumentProps> = ({
  item,
  initialX,
  initialY,
  onBringToFront,
  onPositionChange,
}) => {
  const [posX, setPosX] = useState(initialX);
  const [posY, setPosY] = useState(initialY);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Sync if initial props change (e.g. on window resize before drag)
  useEffect(() => {
    setPosX(initialX);
    setPosY(initialY);
  }, [initialX, initialY]);

  // Pointer drag tracking refs
  const dragStartRef = useRef<{
    pointerX: number;
    pointerY: number;
    docX: number;
    docY: number;
  }>({ pointerX: 0, pointerY: 0, docX: 0, docY: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only primary mouse button or touch
    if (e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    // Capture pointer so fast movements never lose the document
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Fallback if not supported
    }

    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      docX: posX,
      docY: posY,
    };

    setIsDragging(true);
    onBringToFront(item.id);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    e.preventDefault();
    e.stopPropagation();

    const deltaX = e.clientX - dragStartRef.current.pointerX;
    const deltaY = e.clientY - dragStartRef.current.pointerY;

    const nextX = dragStartRef.current.docX + deltaX;
    const nextY = dragStartRef.current.docY + deltaY;

    setPosX(nextX);
    setPosY(nextY);
    onPositionChange(item.id, nextX, nextY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    setIsDragging(false);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        left: `${posX}px`,
        top: `${posY}px`,
        width: `${item.width}px`,
        height: `${item.height}px`,
        transform: `rotate(${item.rotation}deg) scale(${isDragging ? 1.05 : isHovered ? 1.02 : 1})`,
        zIndex: item.zIndex,
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
      className={cn(
        'bg-[#FFFFFF] border border-[#111111] transition-[box-shadow,transform] duration-150 flex flex-col justify-between p-3 select-none',
        isDragging
          ? 'cursor-grabbing shadow-[0_28px_56px_rgba(0,0,0,0.22),0_8px_16px_rgba(0,0,0,0.1)]'
          : 'cursor-grab shadow-[0_8px_20px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.14)]'
      )}
    >
      {/* Top Document Header: Minimalist number tag */}
      <div className="flex items-center justify-between pointer-events-none select-none">
        <span className="font-mono text-[10px] text-black/40 font-semibold tracking-wider">
          {item.documentNumber}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] opacity-80" />
      </div>

      {/* Main Body: Authentic Logo */}
      <div className="flex-1 w-full flex items-center justify-center pointer-events-none select-none overflow-hidden my-1">
        <Logo
          logo={item.logo}
          documentNumber={item.documentNumber}
        />
      </div>

      {/* Bottom Subtle Paper Drafting Mark */}
      <div className="flex items-center justify-between pointer-events-none select-none text-[8px] font-mono text-black/25">
        <span>DOC</span>
        <span>+</span>
      </div>
    </div>
  );
};

export default Document;
