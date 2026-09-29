import React, { useState, useEffect, useRef } from 'react';
import { initialDocuments, DocumentItem } from './data';
import { Document } from './Document';

interface DocumentCanvasProps {
  containerWidth: number;
  containerHeight: number;
  isMobile?: boolean;
}

export const DocumentCanvas: React.FC<DocumentCanvasProps> = ({
  containerWidth,
  containerHeight,
  isMobile = false,
}) => {
  const [docs, setDocs] = useState<DocumentItem[]>(initialDocuments);
  const [highestZ, setHighestZ] = useState<number>(40);
  const hasInitializedRef = useRef(false);

  // Map percentages to pixels on first load or resize before interaction
  const [pixelPositions, setPixelPositions] = useState<Record<number, { x: number; y: number }>>({});
  const userInteractedDocsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (containerWidth <= 0 || containerHeight <= 0) return;

    setPixelPositions((prev) => {
      const next = { ...prev };
      docs.forEach((doc) => {
        // If user hasn't dragged this document yet, calculate responsive coordinate
        if (!userInteractedDocsRef.current.has(doc.id)) {
          // Adjust responsive scaling for mobile if needed
          const scaleFactor = isMobile ? 0.75 : 1;
          const initialPxX = isMobile
            ? (doc.x / 100) * (containerWidth - doc.width * scaleFactor)
            : (doc.x / 100) * (containerWidth - doc.width);

          const initialPxY = (doc.y / 100) * (containerHeight - doc.height);

          next[doc.id] = {
            x: Math.max(8, initialPxX),
            y: Math.max(16, initialPxY),
          };
        }
      });
      return next;
    });

    hasInitializedRef.current = true;
  }, [containerWidth, containerHeight, isMobile]);

  // Bring clicked document to highest layer
  const handleBringToFront = (id: number) => {
    setHighestZ((prevZ) => {
      const nextZ = prevZ + 1;
      setDocs((prevDocs) =>
        prevDocs.map((d) => (d.id === id ? { ...d, zIndex: nextZ } : d))
      );
      return nextZ;
    });
  };

  // Update position in state when user drags document
  const handlePositionChange = (id: number, newX: number, newY: number) => {
    userInteractedDocsRef.current.add(id);
    setPixelPositions((prev) => ({
      ...prev,
      [id]: { x: newX, y: newY },
    }));
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {docs.map((item) => {
        const pos = pixelPositions[item.id] || {
          x: (item.x / 100) * (containerWidth || 1000),
          y: (item.y / 100) * (containerHeight || 800),
        };

        const responsiveWidth = isMobile ? Math.min(item.width, 135) : item.width;
        const responsiveHeight = isMobile ? Math.min(item.height, 145) : item.height;

        const responsiveItem = {
          ...item,
          width: responsiveWidth,
          height: responsiveHeight,
        };

        return (
          <div key={item.id} className="pointer-events-auto">
            <Document
              item={responsiveItem}
              initialX={pos.x}
              initialY={pos.y}
              onBringToFront={handleBringToFront}
              onPositionChange={handlePositionChange}
            />
          </div>
        );
      })}
    </div>
  );
};

export default DocumentCanvas;
