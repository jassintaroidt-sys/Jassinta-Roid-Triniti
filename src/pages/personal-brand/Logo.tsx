import React, { useState } from 'react';

interface LogoProps {
  logo: string;
  documentNumber: string;
}

export const Logo: React.FC<LogoProps> = ({ logo, documentNumber }) => {
  const [loadError, setLoadError] = useState(false);
  const [srcIndex, setSrcIndex] = useState(0);

  const candidates = [
    `/assets/${logo}`,
    `/${logo}`,
    `/assets/logos/${logo}`,
  ];

  const handleImgError = () => {
    if (srcIndex + 1 < candidates.length) {
      setSrcIndex((prev) => prev + 1);
    } else {
      setLoadError(true);
    }
  };

  if (loadError) {
    // Elegant clean fallback mark: Document number insignia only
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-2 select-none pointer-events-none">
        <div className="w-10 h-10 rounded-full border border-black/80 flex items-center justify-center">
          <span className="font-mono text-xs font-bold text-black">
            {documentNumber}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-3 select-none pointer-events-none">
      <img
        src={candidates[srcIndex]}
        alt={`Document ${documentNumber}`}
        onError={handleImgError}
        draggable={false}
        className="max-w-full max-h-full object-contain pointer-events-none select-none"
        loading="lazy"
      />
    </div>
  );
};

export default Logo;
