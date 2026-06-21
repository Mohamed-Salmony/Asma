import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Compass, ShieldCheck, Heart, Award, ArrowLeft, ArrowRight, CheckCircle2, Star, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface AboutViewProps {
  onBack: () => void;
  onInquire: () => void;
}

export default function AboutView({ onBack, onInquire }: AboutViewProps) {
  const { t, language } = useLanguage();

  const teamPlaceholder = [
    {
      name: language === 'ar' ? 'المهندس عبدالرحمن الاسمري' : 'Eng. Abdulrahman Al-Asmari',
      role: language === 'ar' ? 'المؤسس والرئيس التنفيذي' : 'Founder & Chief Executive Officer',
      avatarColor: 'bg-brand-blue/20 text-brand-blue border-brand-blue/40'
    },
    {
      name: language === 'ar' ? 'سند المطيري' : 'Sanad Al-Mutairi',
      role: language === 'ar' ? 'رئيس الإدارة التقنية' : 'Chief Technology Officer',
      avatarColor: 'bg-brand-teal/20 text-brand-teal border-brand-teal/40'
    },
    {
      name: language === 'ar' ? 'نورة الغامدي' : 'Noura Al-Ghamdi',
      role: language === 'ar' ? 'رئيسة تصميم واجهات المستخدم' : 'Head of UI/UX Engineering',
      avatarColor: 'bg-brand-gold/20 text-brand-gold border-brand-gold/40'
    }
  ];

  return (
    <div id="view-about-root" className="min-h-screen bg-brand-navy pt-28 pb-20 overflow-hidden islamic-grid-premium">
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
        <div className="max-w-4xl mb-16 space-y-4">
          <span className="text-xs font-black tracking-widest text-[#C9A227] uppercase px-3 py-1 rounded-full bg-brand-gold/10 w-fit block border border-brand-gold/25">
            {t('aboutUs.badge')}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            {t('aboutUs.title')}
          </h1>
          <p className="text-lg text-brand-teal font-semibold">
            {t('aboutUs.subtitle')}
          </p>
        </div>

        {/* Narrative Flow Grid (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mb-20">
          
          {/* Legacy Narrative (7 Columns) */}
          <div className="lg:col-span-7 space-y-6 text-sm md:text-base text-gray-300 leading-relaxed">
            <p className="font-semibold text-white">
              {t('aboutUs.paragraph1')}
            </p>
            <p>
              {t('aboutUs.paragraph2')}
            </p>
            
            <div className="pt-4 grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#0a1532] border border-brand-blue/15 rounded-2xl block text-center">
                <span className="text-2xl font-mono font-black text-brand-blue">2009</span>
                <p className="text-xs text-gray-400 mt-2">Established in Riyadh, KSA</p>
              </div>

              <div className="p-4 bg-[#0a1532] border border-brand-blue/15 rounded-2xl block text-center">
                <span className="text-2xl font-mono font-black text-brand-gold">CR No.</span>
                <p className="text-xs text-gray-400 mt-2">7003024853</p>
              </div>
            </div>
          </div>

          {/* Vision 2030 Block Integration (5 Columns) */}
          <div className="lg:col-span-5 p-8 rounded-3xl border border-brand-teal/20 bg-brand-teal/5 relative overflow-hidden self-center">
            {/* Ambient pulse bullet */}
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-brand-green animate-ping" />
            
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
              <span>{t('aboutUs.vision2030.title')}</span>
            </h3>

            <p className="text-xs md:text-sm text-gray-300 leading-relaxed mb-6">
              {t('aboutUs.vision2030.desc')}
            </p>

            {/* Saudi Flag Theme Accents */}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-brand-gold/10 border border-brand-gold/20">
              <Award className="w-5 h-5 text-brand-gold shrink-0" />
              <span className="text-xs font-bold text-brand-gold font-sans tracking-wide uppercase">
                {t('hero.visionBadge')}
              </span>
            </div>
          </div>

        </div>

        {/* Section 2: Values (Excellence, Innovation, Partnership, Quality) */}
        <div className="mb-20">
          <h2 className="text-xl md:text-2xl font-black text-white text-center mb-10">
            {t('aboutUs.ourValues')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="p-6 rounded-2xl border border-brand-blue/10 bg-brand-navy/60 space-y-4">
                <div className="p-2.5 rounded-xl bg-brand-blue/10 text-brand-teal w-fit">
                  <span className="text-xs font-mono font-black">{`0${num}`}</span>
                </div>
                <h4 className="text-base font-bold text-white">
                  {t(`aboutUs.value${num}.title`)}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {t(`aboutUs.value${num}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Executive Team (Placeholder) */}
        <div className="mb-10">
          <h2 className="text-xl md:text-2xl font-black text-white text-center mb-10 flex items-center justify-center gap-2">
            <Users className="w-5 h-5 text-brand-teal" />
            <span>{language === 'ar' ? 'فريقنا التنفيذي بالرياض' : 'Our Riyadh Executive Team'}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {teamPlaceholder.map((leader, i) => (
              <div key={i} className="p-6 rounded-2xl border border-brand-blue/10 bg-[#061026]/70 text-center space-y-4">
                <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center border text-lg font-black font-mono ${leader.avatarColor}`}>
                  {leader.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    {leader.name}
                  </h4>
                  <span className="text-xs text-brand-teal">
                    {leader.role}
                  </span>
                </div>
                <div className="text-[10px] text-gray-500 font-mono">
                  Riyadh HQ • Active
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
