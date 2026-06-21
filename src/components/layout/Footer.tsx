import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Facebook, Twitter, Linkedin, Phone, Mail, MapPin, Award, CheckCircle } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { t, language } = useLanguage();

  return (
    <footer id="footer-section" className="relative bg-[#060b1b] border-t border-brand-blue/15 pt-16 pb-12 overflow-hidden islamic-grid-premium">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-5">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('hero')}>
              <img 
                src="/assets/asma_logo.svg" 
                alt="ASMA Advanced Technology Logo" 
                className="h-10 w-auto object-contain transition-all duration-300 group-hover:scale-[1.05]" 
              />
              <div className="flex flex-col border-l border-brand-blue/25 pl-3">
                <span className="text-xs font-bold text-white tracking-widest uppercase">ASMA</span>
                <span className="text-[9px] text-brand-teal font-semibold">Advanced Technology</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-400 leading-relaxed">
              {t('footer.desc')}
            </p>

            {/* Vision 2030 Shield Badge */}
            <div className="flex items-center gap-2.5 p-2 px-3 rounded-lg bg-brand-navy/60 border border-brand-blue/15 w-fit">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-teal animate-pulse" />
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-brand-teal">
                {t('hero.visionBadge')}
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="text-sm font-bold uppercase text-white tracking-widest border-b border-brand-blue/10 pb-3 mb-5">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { id: 'hero', key: 'nav.home' },
                { id: 'services', key: 'nav.services' },
                { id: 'portfolio', key: 'nav.portfolio' },
                { id: 'about', key: 'nav.about' },
                { id: 'contact', key: 'nav.contact' }
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="text-gray-400 hover:text-brand-blue transition-colors duration-200 outline-none flex items-center gap-1.5"
                  >
                    <span className="text-xs text-brand-teal">{language === 'ar' ? '◀' : '▶'}</span>
                    <span>{t(link.key)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services Shortlist */}
          <div>
            <h4 className="text-sm font-bold uppercase text-white tracking-widest border-b border-brand-blue/10 pb-3 mb-5">
              {t('footer.servicesTitle')}
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { id: 'services', label: t('services.web.title') },
                { id: 'services', label: t('services.mobile.title') },
                { id: 'services', label: t('services.desktop.title') },
                { id: 'services', label: t('services.ai.title') },
                { id: 'services', label: t('services.marketing.title') },
                { id: 'services', label: t('services.motion.title') }
              ].map((srv, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onNavigate('services')}
                    className="text-gray-400 hover:text-brand-teal transition-colors duration-200 outline-none text-left"
                  >
                    {srv.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Riyadh Local Offices */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase text-white tracking-widest border-b border-brand-blue/10 pb-3 mb-5">
              {t('footer.contactTitle')}
            </h4>
            
            <div className="flex items-start gap-2.5 text-sm">
              <MapPin className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
              <span className="text-gray-400 leading-relaxed">
                {t('contact.info.addressText')}
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-sm">
              <Phone className="w-5 h-5 text-brand-teal shrink-0" />
              <div className="text-gray-400 font-mono">
                <div>011-200-2006</div>
                <div>053-153-4385</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-sm">
              <Mail className="w-5 h-5 text-brand-blue shrink-0" />
              <span className="text-gray-400 font-mono">
                info@asmatechsa.com
              </span>
            </div>
          </div>

        </div>

        {/* Legal & CR Notice Footer Row */}
        <div className="border-t border-brand-blue/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-brand-gold" />
            <span>{t('contact.info.crText')}</span>
            <span className="hidden md:inline text-brand-blue/30">|</span>
            <span className="hidden md:inline">{t('footer.rights')}</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-teal transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="https://wa.me/966531534385" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.455L0 24zm6.59-4.846c1.66.986 3.285 1.503 4.887 1.505 5.518 0 10.007-4.478 10.01-9.986.001-2.67-1.031-5.176-2.905-7.05C16.658 1.745 14.16 1.71 11.492 11.492c-5.513 0-10.004 4.479-10.007 9.988-.001 1.83.499 3.613 1.447 5.191L1.87 22.135l5.777-1.514zM16.6 13.06c-.253-.127-1.497-.738-1.728-.822-.232-.085-.401-.127-.57.127-.168.254-.653.822-.799.99-.147.169-.294.19-.547.063-.253-.127-1.07-.394-2.037-1.257-.753-.671-1.261-1.502-1.41-1.755-.147-.254-.016-.39.111-.517.114-.115.253-.294.38-.443.126-.147.168-.253.253-.422.084-.168.041-.316-.021-.443-.063-.127-.57-1.373-.78-1.884-.206-.497-.413-.429-.57-.437-.147-.008-.316-.008-.485-.008-.168 0-.443.063-.674.316-.232.253-.884.864-.884 2.11s.906 2.443 1.033 2.612c.126.168 1.782 2.718 4.318 3.812.603.26 1.074.415 1.44.532.606.193 1.157.166 1.593.101.485-.072 1.497-.611 1.707-1.201.21-.59.21-1.097.147-1.201-.063-.105-.232-.147-.485-.274z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-4 text-center md:hidden text-[10px] text-gray-500">
          <span>{t('footer.rights')}</span>
        </div>
      </div>
    </footer>
  );
}
