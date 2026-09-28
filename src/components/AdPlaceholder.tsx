import React, { useEffect, useRef } from 'react';

interface AdPlaceholderProps {
  format?: 'leaderboard' | 'rectangle' | 'banner';
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  className = '',
}) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    const isMobile = window.innerWidth < 768;

    const optionsScript = document.createElement('script');

    if (isMobile) {
      optionsScript.innerHTML = `
        atOptions = {
          'key': 'af0f7db56779c2234fa68a8dbf952e0c',
          'format': 'iframe',
          'height': 50,
          'width': 320,
          'params': {}
        };
      `;
    } else {
      optionsScript.innerHTML = `
        atOptions = {
          'key': '191cde02ec029f1f9c53a295d47d2e31',
          'format': 'iframe',
          'height': 90,
          'width': 728,
          'params': {}
        };
      `;
    }

    const adScript = document.createElement('script');
    adScript.src = isMobile
      ? 'https://www.highrevenuformat.com/af0f7db56779c2234fa68a8dbf952e0c/invoke.js'
      : 'https://www.highrevenueformat.com/191cde02ec029f1f9c53a295d47d2e31/invoke.js';

    adScript.async = true;

    adRef.current.innerHTML = '';
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
      className={`w-full flex justify-center items-center my-4 overflow-hidden ${className}`}
      aria-label="Advertisement"
    >
      <div ref={adRef} />
    </div>
  );
};
