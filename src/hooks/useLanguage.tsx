"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import arTranslations from '../locales/ar.json';
import enTranslations from '../locales/en.json';

type Language = 'ar' | 'en';
type Direction = 'rtl' | 'ltr';

interface LanguageContextProps {
  language: Language;
  direction: Direction;
  t: (key: string) => string;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const translations: Record<Language, any> = {
  ar: arTranslations,
  en: enTranslations,
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Arabic for Saudi market as requested, or check localStorage
  const [language, setLanguageState] = useState<Language>('ar');

  const [direction, setDirection] = useState<Direction>('rtl');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aat_lang');
      if (saved === 'ar' || saved === 'en') {
        setLanguageState(saved);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aat_lang', lang);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    setDirection(dir);
    
    // Update HTML tags
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    
    // Remove old classes and add new ones for font alignment
    if (language === 'ar') {
      document.body.classList.remove('font-sans');
      document.body.classList.add('font-cairo');
    } else {
      document.body.classList.remove('font-cairo');
      document.body.classList.add('font-sans');
    }
  }, [language]);

  // Nested translation helper
  const t = (path: string): string => {
    const keys = path.split('.');
    let current = translations[language];
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to English translation key if Arabic doesn't exist
        let fallback = translations['en'];
        let subCurrent = fallback;
        for (const subKey of keys) {
          if (subCurrent && typeof subCurrent === 'object' && subKey in subCurrent) {
            subCurrent = subCurrent[subKey];
          } else {
            return path; // Return keyword if absolute mismatch
          }
        }
        return subCurrent;
      }
    }
    
    return typeof current === 'string' ? current : path;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, t, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
