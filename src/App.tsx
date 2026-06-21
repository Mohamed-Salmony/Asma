"use client";

import React, { useState, useEffect, useRef } from 'react';
import { LanguageProvider, useLanguage } from './hooks/useLanguage';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WhatsAppButton from './components/ui/WhatsAppButton';

// Firebase core configuration
import { auth, isRealFirebase } from './firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Home landing sections
import Hero from './components/home/Hero';
import StatsBar from './components/home/StatsBar';
import ServicesGrid from './components/home/ServicesGrid';
import dynamic from 'next/dynamic';
const TechOrbit = dynamic(() => import('./components/home/TechOrbit'), { ssr: false });
import WhyUs from './components/home/WhyUs';
import Process from './components/home/Process';
import Packages from './components/home/Packages';
import ContactCTA from './components/home/ContactCTA';

// Detailed subpage views
import ServicesView from './components/views/ServicesView';
import AboutView from './components/views/AboutView';
import PortfolioView from './components/views/PortfolioView';
import ContactView from './components/views/ContactView';
import AuthView from './components/views/AuthView';
import DashboardView from './components/views/DashboardView';
import AIChatbotWidget from './components/ui/AIChatbotWidget';

import { motion, AnimatePresence } from 'motion/react';
import { ToggleLeft, ToggleRight, Sparkles, MoveRight, MoveLeft, HelpCircle } from 'lucide-react';

function AppContent() {
  const { language, t } = useLanguage();
  const [currentSection, setCurrentSection] = useState<string>('home'); // 'home' | 'services' | 'about' | 'portfolio' | 'contact' | 'auth' | 'dashboard'
  const [is3DMode, setIs3DMode] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);

  // Auth state listener conforming to real-time sync principles
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });

    // Check localStorage fallback for offline simulation
    if (!isRealFirebase) {
      try {
        const storedUsers = JSON.parse(localStorage.getItem('aat_sim_users') || '[]');
        if (storedUsers.length > 0) {
          // Mock login as the owner on simulation mode for gorgeous display
          setUser({
            uid: "sim_usr_owner",
            email: "mohamedsamysalmony@gmail.com",
            displayName: "Mohamed Samy (Owner)",
            photoURL: ""
          });
        }
      } catch (err) {
        console.error("Simulation retrieval issue:", err);
      }
    }

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      if (auth && isRealFirebase) {
        await signOut(auth);
      }
      localStorage.removeItem('aat_sim_users');
      setUser(null);
      setCurrentSection('home');
    } catch (err) {
      console.error("Logout runtime trace error:", err);
    }
  };

  // Glow cursor coordinate tracking state
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorHover, setCursorHover] = useState(false);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleHoverStart = () => setCursorHover(true);
    const handleHoverEnd = () => setCursorHover(false);

    window.addEventListener('mousemove', updateCursor);

    // Apply interactive hover feedback listeners to all buttons and links
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleHoverStart);
      el.addEventListener('mouseleave', handleHoverEnd);
    });

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverStart);
        el.removeEventListener('mouseleave', handleHoverEnd);
      });
    };
  }, [currentSection, is3DMode]);

  // Seamless router anchors
  const navigateTo = (sectionId: string) => {
    if (sectionId === 'hero') {
      setCurrentSection('home');
      setTimeout(() => {
        const el = document.getElementById('hero');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }

    if (['services', 'about', 'portfolio', 'contact'].includes(sectionId)) {
      setCurrentSection(sectionId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentSection('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  // 3D Scroll mode state structure
  // In 3D Scroll mode, we render the 5 core sections in an interactive 3D slider system
  const [active3DIndex, setActive3DIndex] = useState(0);
  const sections3D = [
    { title: 'AAT Digital Solutions', comp: <Hero onNavigate={navigateTo} /> },
    { title: 'Advanced Technology Tech Services', comp: <ServicesGrid onNavigate={navigateTo} /> },
    { title: 'Core Tech Stack Orbit', comp: <TechOrbit /> },
    { title: 'Why Choose AAT', comp: <WhyUs /> },
    { title: 'Pricing Packages', comp: <Packages onNavigate={navigateTo} /> },
    { title: 'Riyadh Contact Form', comp: <ContactCTA /> }
  ];

  return (
    <div
      className={`min-h-screen bg-brand-navy text-white selection:bg-brand-teal selection:text-brand-navy font-sans antialiased overflow-x-hidden ${
        language === 'ar' ? 'font-cairo' : 'font-sans'
      }`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* 1. Custom Pointer Tracker Cursor element (Desktop only) */}
      <div
        className="fixed w-8 h-8 rounded-full border-2 border-brand-teal/80 pointer-events-none z-50 transition-all duration-75 mix-blend-screen -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          transform: `translate(-50%, -50%) scale(${cursorHover ? 1.5 : 1})`,
          backgroundColor: cursorHover ? 'rgba(0, 153, 168, 0.25)' : 'transparent',
          boxShadow: cursorHover ? '0 0 20px rgba(0, 153, 168, 0.6)' : '0 0 10px rgba(27, 127, 232, 0.4)'
        }}
      />

      {/* 2. Top Bar Sticky Navbar */}
      <Navbar
        onNavigate={navigateTo}
        activeSection={currentSection}
        is3DMode={is3DMode}
        onToggle3D={() => setIs3DMode(!is3DMode)}
        user={user}
        onLogout={handleLogout}
      />

      {/* 3. Core Page Content */}
      <AnimatePresence mode="wait">
        {is3DMode ? (
          /* CINEMATIC 3D PERSPECTIVE SCROLL MODE */
          <motion.div
            key="3d-scroller-theater"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pt-20 pb-10 bg-[#040815] z-30 overflow-hidden flex flex-col justify-between"
          >
            {/* Visual background star particles floating */}
            <div className="absolute inset-0 bg-[#040815] grayscale contrast-125 opacity-20 pointer-events-none bg-[radial-gradient(#1b7fe8_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full bg-brand-blue/5 blur-[120px] pointer-events-none" />

            {/* 3D Space Canvas Perspective Theater */}
            <div className="grow flex items-center justify-center px-4 relative" style={{ perspective: '1600px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active3DIndex}
                  initial={{ opacity: 0, rotateY: 45, translateZ: -300, scale: 0.8 }}
                  animate={{ opacity: 1, rotateY: 0, translateZ: 0, scale: 1 }}
                  exit={{ opacity: 0, rotateY: -45, translateZ: -300, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  className="w-full max-w-5xl h-[70vh] rounded-3xl border border-brand-blue/25 bg-[#080f24]/90 overflow-y-auto shadow-2xl relative z-10 custom-scrollbar-premium"
                >
                  {/* Embedded slide section */}
                  {sections3D[active3DIndex].comp}
                </motion.div>
              </AnimatePresence>

              {/* Orbiting technology nodes backplane decor */}
              <div className="absolute top-4 outline-none pointer-events-none">
                <span className="text-[10px] font-black uppercase text-brand-gold bg-brand-gold/10 border border-brand-gold/30 px-3.5 py-1.5 rounded-full inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-ping" />
                  <span>Interactive 3D Scrolling Orbit Enabled</span>
                </span>
              </div>
            </div>

            {/* Cinematic Slide Controller Bar */}
            <div className="max-w-md mx-auto w-full px-4 flex items-center justify-between z-40">
              <button
                id="btn-3d-prev"
                onClick={() => setActive3DIndex((prev) => Math.max(0, prev - 1))}
                disabled={active3DIndex === 0}
                className="p-3 rounded-full border border-brand-blue/20 bg-brand-navy hover:bg-brand-blue/25 disabled:opacity-30 text-white cursor-pointer"
              >
                {language === 'ar' ? <MoveRight className="w-4 h-4" /> : <MoveLeft className="w-4 h-4" />}
              </button>

              <div className="flex gap-2">
                {sections3D.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActive3DIndex(idx)}
                    className={`w-3.5 h-3.5 rounded-full border border-brand-blue/30 transition-all ${
                      active3DIndex === idx ? 'bg-brand-teal scale-110 w-6' : 'bg-brand-navy hover:bg-brand-blue/30'
                    }`}
                  />
                ))}
              </div>

              <button
                id="btn-3d-next"
                onClick={() => setActive3DIndex((prev) => Math.min(sections3D.length - 1, prev + 1))}
                disabled={active3DIndex === sections3D.length - 1}
                className="p-3 rounded-full border border-brand-blue/20 bg-brand-navy hover:bg-brand-blue/25 disabled:opacity-30 text-white cursor-pointer"
              >
                {language === 'ar' ? <MoveLeft className="w-4 h-4" /> : <MoveRight className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        ) : (
          /* STANDARD FULLY-RESPONSIVE MULTI-PAGE DESCRIPTOR DISPATCHER */
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            {currentSection === 'home' && (
              <>
                <Hero onNavigate={navigateTo} />
                <StatsBar />
                <ServicesGrid onNavigate={navigateTo} />
                <TechOrbit />
                <WhyUs />
                <Process />
                <Packages onNavigate={navigateTo} />
                <ContactCTA />
                <Footer onNavigate={navigateTo} />
              </>
            )}

            {currentSection === 'services' && (
              <>
                <ServicesView onBack={() => navigateTo('hero')} onInquire={() => navigateTo('contact')} />
                <Footer onNavigate={navigateTo} />
              </>
            )}

            {currentSection === 'about' && (
              <>
                <AboutView onBack={() => navigateTo('hero')} onInquire={() => navigateTo('contact')} />
                <Footer onNavigate={navigateTo} />
              </>
            )}

            {currentSection === 'portfolio' && (
              <>
                <PortfolioView onBack={() => navigateTo('hero')} onInquire={() => navigateTo('contact')} />
                <Footer onNavigate={navigateTo} />
              </>
            )}

            {currentSection === 'contact' && (
              <>
                <ContactView onBack={() => navigateTo('hero')} />
                <Footer onNavigate={navigateTo} />
              </>
            )}

            {currentSection === 'auth' && (
              <>
                <AuthView 
                  onBack={() => navigateTo('hero')} 
                  onSuccess={(authenticatedUser) => {
                    setUser(authenticatedUser);
                    if (authenticatedUser.email === 'mohamedsamysalmony@gmail.com') {
                      navigateTo('dashboard');
                    } else {
                      navigateTo('hero');
                    }
                  }}
                />
                <Footer onNavigate={navigateTo} />
              </>
            )}

            {currentSection === 'dashboard' && (
              <>
                {user && user.email === 'mohamedsamysalmony@gmail.com' ? (
                  <DashboardView 
                    user={user} 
                    onLogout={handleLogout} 
                    onBack={() => navigateTo('hero')} 
                  />
                ) : (
                  <div className="min-h-[80vh] flex items-center justify-center text-center p-6 bg-[#040815]">
                    <div className="max-w-md p-8 rounded-3xl border border-rose-500/10 bg-rose-500/5 text-rose-300">
                      <h4 className="text-lg font-black uppercase tracking-wider mb-2">Access Restrained</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Under Saudi Digital sovereign targets, administrative permissions are fully sandboxed. Sign in with owner credentials to access parameters.
                      </p>
                    </div>
                  </div>
                )}
                <Footer onNavigate={navigateTo} />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. WhatsApp floating chat trigger button and AI Chatbot */}
      <WhatsAppButton />
      <AIChatbotWidget />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
