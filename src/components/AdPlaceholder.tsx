import React, { useEffect, useRef } from 'react';

interface AdPlaceholderProps {
  format?: 'leaderboard' | 'rectangle' | 'banner';
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  format = 'leaderboard',
  className = '',
}) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    adRef.current.innerHTML = '';

    const optionsScript = document.createElement('script');
    optionsScript.innerHTML = `
      atOptions = {
        'key': 'af0f7db56779c2234fa68a8dbf952e0c',
        'format': 'iframe',
        'height': 50,
        'width': 320,
        'params': {}
      };
    `;

    const adScript = document.createElement('script');
    adScript.src =
      'https://www.highrevenuformat.com/af0f7db56779c2234fa68a8dbf952e0c/invoke.js';
    adScript.async = true;

    adRef.current.appendChild(optionsScript);
    adRef.current.appendChild(adScript);

    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div
      className={`w-full flex justify-center items-center my-4 ${className}`}
      aria-label="Advertisement"
    >
      <div ref={adRef} />
    </div>
  );
};
