import React, { useState } from 'react';

interface LogoProps {
  logo: string;
  documentNumber: string;
}

export const Logo: React.FC<LogoProps> = ({ logo, documentNumber }) => {
  const [loadError, setLoadError] = useState(false);

  const src = `/images/${encodeURIComponent(logo)}`;

  if (loadError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-2 select-none">
        <div className="w-10 h-10 rounded-full border border-black/80 flex items-center justify-center">
          <span className="font-mono text-xs font-bold text-black">
            {documentNumber}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-3 select-none">
      <img
        src={src}
        alt={`Document ${documentNumber}`}
        onError={() => setLoadError(true)}
        draggable={false}
        className="max-w-full max-h-full object-contain select-none"
        loading="lazy"
      />
    </div>
  );
};