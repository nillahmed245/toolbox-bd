import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useLanguage } from '../context/LanguageContext';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { t } = useLanguage();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-50 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-amber-600 text-white text-xs font-semibold shadow-xl border border-amber-500/50 animate-in slide-in-from-bottom-2 duration-200"
    >
      <span className="w-2 h-2 rounded-full bg-amber-200 animate-ping shrink-0" />
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>{t('offlineIndicator', 'Offline Mode — All client-side tools remain fully functional.')}</span>
    </div>
  );
};
