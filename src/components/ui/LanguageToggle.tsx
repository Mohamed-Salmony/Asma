import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      id="btn-language-toggle"
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-blue/30 bg-brand-navy/60 hover:bg-brand-blue/10 hover:border-brand-teal transition-all duration-300 text-sm font-medium text-white shadow-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
      aria-label="Toggle language"
    >
      <Globe className="w-4 h-4 text-brand-teal" />
      <span>{language === 'ar' ? 'English' : 'العربية'}</span>
    </button>
  );
}
