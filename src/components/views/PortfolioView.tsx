import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Filter, Star, Check, ArrowLeft, ArrowRight, X, ExternalLink, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PortfolioViewProps {
  onBack: () => void;
  onInquire: () => void;
}

export default function PortfolioView({ onBack, onInquire }: PortfolioViewProps) {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'All' | 'Web' | 'Mobile' | 'Desktop' | 'AI'>('All');
  const [selectedProjectIdx, setSelectedProjectIdx] = useState<number | null>(null);

  const filters = [
    { value: 'All', key: 'portfolio.all' },
    { value: 'Web', key: 'portfolio.web' },
    { value: 'Mobile', key: 'portfolio.mobile' },
    { value: 'Desktop', key: 'portfolio.desktop' },
    { value: 'AI', key: 'portfolio.ai' }
  ];

  // Projects definitions
  const projectsData = [
    {
      idx: 0,
      filter: 'Web',
      titleKey: 'portfolio.project1.title',
      categoryKey: 'portfolio.project1.category',
      descKey: 'portfolio.project1.desc',
      challengeKey: 'portfolio.project1.challenge',
      solutionKey: 'portfolio.project1.solution',
      techs: ['Next.js', 'React', 'ASP.NET Core', 'Redis Caching'],
      placeholderGradient: 'from-blue-600 via-indigo-600 to-cyan-500'
    },
    {
      idx: 1,
      filter: 'Mobile',
      titleKey: 'portfolio.project2.title',
      categoryKey: 'portfolio.project2.category',
      descKey: 'portfolio.project2.desc',
      challengeKey: 'portfolio.project2.challenge',
      solutionKey: 'portfolio.project2.solution',
      techs: ['Flutter', 'iOS SDK', 'Biometrics', 'SQL Cache'],
      placeholderGradient: 'from-teal-600 via-[#0199A8] to-blue-500'
    },
    {
      idx: 2,
      filter: 'Desktop',
      titleKey: 'portfolio.project3.title',
      categoryKey: 'portfolio.project3.category',
      descKey: 'portfolio.project3.desc',
      challengeKey: 'portfolio.project3.challenge',
      solutionKey: 'portfolio.project3.solution',
      techs: ['WPF', '.NET Core', 'SQL Server', 'Barcodes'],
      placeholderGradient: 'from-indigo-600 via-deep-blue to-purple-600'
    },
    {
      idx: 3,
      filter: 'AI',
      titleKey: 'portfolio.project4.title',
      categoryKey: 'portfolio.project4.category',
      descKey: 'portfolio.project4.desc',
      challengeKey: 'portfolio.project4.challenge',
      solutionKey: 'portfolio.project4.solution',
      techs: ['OpenAI GPT', 'n8n automation', 'D3.js metrics'],
      placeholderGradient: 'from-[#0D1B3E] via-purple-700 to-indigo-800'
    },
    {
      idx: 4,
      filter: 'Web',
      titleKey: 'portfolio.project5.title',
      categoryKey: 'portfolio.project5.category',
      descKey: 'portfolio.project5.desc',
      challengeKey: 'portfolio.project5.challenge',
      solutionKey: 'portfolio.project5.solution',
      techs: ['HTML Node.js', 'LiteDB', 'Tailwind', 'CDN'],
      placeholderGradient: 'from-blue-700 via-teal-700 to-indigo-600'
    },
    {
      idx: 5,
      filter: 'AI',
      titleKey: 'portfolio.project6.title',
      categoryKey: 'portfolio.project6.category',
      descKey: 'portfolio.project6.desc',
      challengeKey: 'portfolio.project6.challenge',
      solutionKey: 'portfolio.project6.solution',
      techs: ['Power BI Analytics', 'Predictive APIs', 'Python stats'],
      placeholderGradient: 'from-yellow-600 via-brand-gold to-[#030919]'
    }
  ];

  // Filtering criteria
  const filteredProjects = activeFilter === 'All' 
    ? projectsData 
    : projectsData.filter(proj => proj.filter === activeFilter);

  const activeProjectObj = selectedProjectIdx !== null ? projectsData[selectedProjectIdx] : null;

  return (
    <div id="view-portfolio-root" className="min-h-screen bg-brand-navy pt-28 pb-20 overflow-hidden islamic-grid-premium">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        
        {/* Back Link */}
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 mb-8 text-xs font-bold text-brand-teal hover:text-white transition-colors cursor-pointer"
        >
          {language === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
        </button>

        {/* Header Block */}
        <div className="max-w-4xl mb-12 space-y-4">
          <span className="text-xs font-black tracking-widest text-brand-blue uppercase px-3 py-1 rounded-full bg-brand-blue/10 w-fit block border border-brand-blue/20">
            {t('portfolio.badge')}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white">
            {t('portfolio.title')}
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            {t('portfolio.subtitle')}
          </p>
        </div>

        {/* Filter Navigation Menu */}
        <div className="flex flex-wrap items-center gap-2 mb-12 bg-brand-navy/60 p-2 border border-brand-blue/10 rounded-2xl w-fit">
          <Filter className="w-4 h-4 text-brand-teal ml-2.5 mr-1" />
          {filters.map((filt) => (
            <button
              key={filt.value}
              onClick={() => setActiveFilter(filt.value as any)}
              className={`p-2 px-4 rounded-xl text-xs font-bold tracking-wide transition-all outline-none focus:outline-none ${
                activeFilter === filt.value
                  ? 'bg-gradient-to-r from-brand-blue to-brand-teal text-white shadow'
                  : 'text-gray-400 hover:text-white hover:bg-brand-blue/5'
              }`}
            >
              {t(filt.key)}
            </button>
          ))}
        </div>

        {/* Dynamic Project Grid (Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj, i) => (
              <motion.div
                key={proj.idx}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="group relative rounded-2xl glow-card p-5 cursor-pointer border border-brand-blue/10 bg-[#061026]/60 flex flex-col justify-between h-[380px]"
                onClick={() => setSelectedProjectIdx(proj.idx)}
              >
                {/* Visual mockup banner placeholder */}
                <div className={`w-full h-40 rounded-xl bg-gradient-to-tr ${proj.placeholderGradient} relative overflow-hidden flex items-center justify-center border border-brand-blue/10 shadow`}>
                  <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Decorative logo sign */}
                  <div className="relative z-10 flex flex-col items-center">
                    <Box className="w-8 h-8 text-white/70 animate-float" />
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-1">AAT Sandbox</span>
                  </div>
                </div>

                {/* Info and Tags */}
                <div className="mt-4 grow flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-black uppercase text-brand-teal tracking-widest">
                      {t(proj.categoryKey)}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-brand-blue transition-colors mt-1">
                      {t(proj.titleKey)}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                      {t(proj.descKey)}
                    </p>
                  </div>

                  {/* Tech stack row */}
                  <div className="pt-4 border-t border-brand-blue/10 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {proj.techs.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-[9px] font-mono px-2 py-0.5 rounded bg-brand-blue/15 text-brand-blue border border-brand-blue/20 font-semibold"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <span className="text-xs text-brand-teal font-bold group-hover:translate-x-1 transition-all duration-300">
                      {t('portfolio.viewCase')} {language === 'ar' ? '←' : '→'}
                    </span>
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>

      {/* Case Study Detail Lightbox / Drawer */}
      <AnimatePresence>
        {activeProjectObj && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#040814]/90 backdrop-blur-md cursor-pointer"
              onClick={() => setSelectedProjectIdx(null)}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative w-full max-w-2xl bg-[#091124] border border-brand-blue/30 rounded-3xl p-6 md:p-8 overflow-hidden shadow-2xl space-y-6"
            >
              {/* Outer decorative light */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-blue/15 rounded-full blur-3xl pointer-events-none" />

              {/* Lightbox Header Close Control */}
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <span className="text-[10px] font-black uppercase text-brand-teal tracking-widest">
                    {t(activeProjectObj.categoryKey)}
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-white mt-1">
                    {t(activeProjectObj.titleKey)}
                  </h2>
                </div>

                <button
                  id="case-modal-close"
                  onClick={() => setSelectedProjectIdx(null)}
                  className="p-1 px-2.5 rounded-lg border border-brand-blue/25 bg-brand-navy/60 hover:bg-brand-blue/15 hover:border-brand-teal transition-all text-white hover:rotate-90 duration-300"
                  aria-label="Close Case Study"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mockup banner in Lightbox */}
              <div className={`w-full h-44 rounded-2xl bg-gradient-to-tr ${activeProjectObj.placeholderGradient} border border-brand-blue/20 relative flex items-center justify-center`}>
                <div className="absolute inset-0 bg-black/10" />
                <Box className="w-12 h-12 text-white/50 animate-pulse" />
              </div>

              {/* Case information challenge vs solution */}
              <div className="space-y-4 text-sm md:text-base leading-relaxed text-gray-300 relative z-10 font-medium">
                <div>
                  <span className="text-[10px] text-gray-500 font-extrabold block uppercase tracking-wider mb-1.5">
                    {language === 'ar' ? 'التحدي التقني مسبقًا:' : 'Historical Business Challenge:'}
                  </span>
                  <p className="text-xs md:text-sm text-gray-300">
                    {t(activeProjectObj.challengeKey)}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] text-brand-teal font-extrabold block uppercase tracking-wider mb-1.5">
                    {language === 'ar' ? 'الحل البرمجي المنفذ:' : 'Engineered Programming Solution:'}
                  </span>
                  <p className="text-xs md:text-sm text-white font-semibold">
                    {t(activeProjectObj.solutionKey)}
                  </p>
                </div>
              </div>

              {/* Project footer tags */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t border-brand-blue/10 relative z-10">
                <div>
                  <span className="text-[10px] text-gray-500 font-extrabold block uppercase tracking-wider mb-2">
                    {t('portfolio.techUsed')}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProjectObj.techs.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-[#0b142b] text-brand-blue border border-brand-blue/25"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  id="case-modal-inquire"
                  onClick={() => {
                    setSelectedProjectIdx(null);
                    onInquire();
                  }}
                  className="px-6 py-3 rounded-full font-bold text-xs tracking-wide text-white bg-gradient-to-r from-brand-blue to-brand-teal hover:shadow-lg hover:shadow-brand-blue/10 scale-100 hover:scale-[1.03] duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Inquire About Similar Solutions</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
