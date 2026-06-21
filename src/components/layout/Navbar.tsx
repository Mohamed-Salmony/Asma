import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import LanguageToggle from '../ui/LanguageToggle';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Layers, Box, LogIn, Crown, UserCheck, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  is3DMode: boolean;
  onToggle3D: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  user: any;
  onLogout: () => void;
}

export default function Navbar({ is3DMode, onToggle3D, activeSection, onNavigate, user, onLogout }: NavbarProps) {
  const { t, language } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', labelKey: 'nav.home' },
    { id: 'services', labelKey: 'nav.services' },
    { id: 'portfolio', labelKey: 'nav.portfolio' },
    { id: 'about', labelKey: 'nav.about' },
    { id: 'contact', labelKey: 'nav.contact' },
  ];

  return (
    <>
      <header
        id="navbar-header"
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled || is3DMode
            ? 'bg-brand-navy/85 backdrop-blur-md border-b border-brand-blue/15 shadow-lg py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Logo Left - SVG rendering matching AAT Logo style */}
          <div 
            id="navbar-logo-hub"
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate('hero')}
          >
            <img 
              src="/assets/asma_logo.svg" 
              alt="ASMA Advanced Technology Logo" 
              className="h-10 w-auto object-contain transition-all duration-300 group-hover:scale-[1.05]" 
            />
            
            <div className="hidden lg:flex flex-col border-l border-brand-blue/20 pl-3 ml-1 h-8 justify-center">
              <span className="text-xs font-bold leading-none text-white tracking-widest uppercase">
                ASMA
              </span>
              <span className="text-[9px] text-brand-teal font-medium tracking-tight mt-0.5">
                Advanced Technology
              </span>
            </div>
          </div>

          {/* Nav Links Center (Hidden on small mobile) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-brand-navy/40 border border-brand-blue/10 rounded-full px-5 py-1.5 backdrop-blur-sm">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative p-2 px-4 rounded-full text-xs font-semibold tracking-wide transition-all focus:outline-none ${
                    isActive
                      ? 'text-white font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-gradient-to-r from-brand-blue/35 to-brand-teal/20 rounded-full border border-brand-blue/30"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{t(item.labelKey)}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Accessories Panel */}
          <div className="hidden md:flex items-center gap-3">
            {/* 3D Scroll Perspective Trigger Button */}
            <button
              id="navbar-toggle-3d"
              onClick={onToggle3D}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold tracking-wide transition-all duration-300 focus:outline-none ${
                is3DMode
                  ? 'border-brand-gold bg-brand-gold/15 text-brand-gold shadow-[0_0_12px_rgba(201,162,39,0.25)]'
                  : 'border-brand-blue/35 bg-brand-blue/5 hover:border-brand-teal text-white'
              }`}
              title={is3DMode ? t('nav.toggle3DOn') : t('nav.toggle3DOff')}
            >
              <Box className={`w-3.5 h-3.5 ${is3DMode ? 'animate-spin-slow' : ''}`} />
              <span>{is3DMode ? '3D Active' : '3D Mode'}</span>
            </button>

            {/* Language Selection */}
            <LanguageToggle />

            {/* AI Studio Client/Admin Portals triggers */}
            {user ? (
              <div className="flex items-center gap-2">
                {user.email === 'mohamedsamysalmony@gmail.com' ? (
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="px-4 py-2 border border-brand-gold bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold font-bold text-xs rounded-full flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Crown className="w-3.5 h-3.5 text-brand-gold" />
                    <span>{language === 'ar' ? 'الإدارة' : 'HQ Admin'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate('contact')}
                    className="px-4 py-2 border border-brand-blue/30 bg-brand-blue/5 hover:bg-brand-blue/15 text-slate-200 font-semibold text-xs rounded-full flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-brand-teal" />
                    <span>{language === 'ar' ? 'بوابة الشركاء' : 'Partner Space'}</span>
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => onNavigate('auth')}
                className="px-4 py-2 border border-brand-blue/30 bg-brand-navy-light hover:bg-brand-blue/10 text-white font-medium text-xs rounded-full flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-brand-teal" />
                <span>{language === 'ar' ? 'الولوج للموقع' : 'Client Login'}</span>
              </button>
            )}

            {/* CTA action button */}
            <button
              id="navbar-btn-cta"
              onClick={() => onNavigate('contact')}
              className="px-5 py-2 text-xs font-bold tracking-wide rounded-full text-white bg-gradient-to-r from-brand-blue to-brand-teal hover:shadow-lg hover:shadow-brand-blue/30 scale-100 hover:scale-[1.03] transition-all"
            >
              {t('nav.startProject')}
            </button>
          </div>

          {/* Hamburger Mobile Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onToggle3D}
              className={`p-1.5 rounded-lg border focus:outline-none ${
                is3DMode ? 'border-brand-gold text-brand-gold' : 'border-brand-blue/30 text-white'
              }`}
              aria-label="Toggle 3D"
            >
              <Box className="w-5 h-5" />
            </button>
            <LanguageToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 border border-brand-blue/20 rounded-xl text-white focus:outline-none hover:bg-brand-blue/10"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-navigation-panel"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed top-[64px] inset-x-0 z-40 bg-brand-navy/95 border-b border-brand-blue/20 py-6 px-4 backdrop-blur-lg flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate(item.id);
                  }}
                  className={`p-3 rounded-xl text-sm font-semibold tracking-wide text-left ${
                    activeSection === item.id
                      ? 'bg-brand-blue/15 text-brand-blue border-l-4 border-brand-blue'
                      : 'text-gray-300 hover:bg-brand-blue/5'
                  }`}
                >
                  {t(item.labelKey)}
                </button>
              ))}
            </div>

            <div className="border-t border-brand-blue/10 pt-4 flex flex-col gap-3">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onToggle3D();
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold cursor-pointer ${
                  is3DMode
                    ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                    : 'border-brand-blue/30 text-white'
                }`}
              >
                <Box className="w-4 h-4" />
                <span>{is3DMode ? t('nav.toggle3DOn') : t('nav.toggle3DOff')}</span>
              </button>

              {user ? (
                <>
                  {user.email === 'mohamedsamysalmony@gmail.com' ? (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onNavigate('dashboard');
                      }}
                      className="w-full py-3 rounded-xl border border-brand-gold bg-brand-gold/10 text-center text-sm font-bold text-brand-gold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Crown className="w-4 h-4 text-brand-gold" />
                      <span>{language === 'ar' ? 'لوحة تحكم الإدارة' : 'HQ Admin Terminal'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onNavigate('contact');
                      }}
                      className="w-full py-3 rounded-xl border border-brand-blue/30 bg-brand-navy-light text-center text-sm font-bold text-white flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4 text-brand-teal" />
                      <span>{language === 'ar' ? 'بوابة الشركاء' : 'Partner Space'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full py-3 rounded-xl border border-rose-500/20 bg-rose-500/10 text-center text-sm font-bold text-rose-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('auth');
                  }}
                  className="w-full py-3 rounded-xl border border-brand-blue/30 bg-brand-navy-light text-center text-sm font-bold text-white flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-brand-teal" />
                  <span>{language === 'ar' ? 'تسجيل الدخول / إنشاء حساب' : 'Client Login / Register'}</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate('contact');
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-teal text-center text-sm font-bold text-white shadow-xl cursor-pointer"
              >
                {t('nav.startProject')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
