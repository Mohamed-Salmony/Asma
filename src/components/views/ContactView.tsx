import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { submitLead } from '../../firebase/config';
import { Mail, Phone, MapPin, CheckCircle, AlertCircle, Send, Award, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContactViewProps {
  onBack: () => void;
}

export default function ContactView({ onBack }: ContactViewProps) {
  const { t, language } = useLanguage();

  // Form input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');

  // Status indicators
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    // Form client validation
    if (!name.trim() || !email.trim() || !service || !message.trim()) {
      setToast({
        type: 'error',
        msg: language === 'ar' ? 'الرجاء ملء جميع الحقول المطلوبة النجمية (*)' : 'Please fill out all required fields marked with (*).'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitLead({
        name,
        email,
        phone: phone || undefined,
        service,
        budget: budget || undefined,
        message
      });

      if (res.success) {
        setToast({
          type: 'success',
          msg: t('contact.successMessage')
        });
        setName('');
        setEmail('');
        setPhone('');
        setService('');
        setBudget('');
        setMessage('');
      }
    } catch (err) {
      console.error(err);
      setToast({
        type: 'error',
        msg: t('contact.errorMessage')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="view-contact-root" className="min-h-screen bg-brand-navy pt-28 pb-20 overflow-hidden islamic-grid-premium">
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
          <span className="text-xs font-black tracking-widest text-brand-teal uppercase px-3 py-1 rounded-full bg-brand-blue/10 w-fit block border border-brand-teal/20">
            {t('contact.badge')}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white">
            {t('contact.title')}
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed font-semibold">
            {t('contact.subtitle')}
          </p>
        </div>

        {/* Layout split (Grid columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mb-16">
          
          {/* Left Block (Contact addresses) */}
          <div className="lg:col-span-5 p-8 rounded-3xl border border-brand-blue/10 bg-[#061026]/80 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                Riyadh Corporate Channels
              </h3>

              <div className="space-y-5">
                {/* Physical office locator info */}
                <div className="flex gap-4">
                  <div className="p-3 rounded-xl bg-brand-blue/10 text-brand-blue border border-brand-blue/20 shrink-0 h-fit">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">{t('contact.info.addressTitle')}</span>
                    <p className="text-sm text-gray-300 mt-1 leading-relaxed">
                      {t('contact.info.addressText')}
                    </p>
                  </div>
                </div>

                {/* Telephone */}
                <div className="flex gap-4">
                  <div className="p-3 rounded-xl bg-brand-teal/10 text-brand-teal border border-brand-teal/20 shrink-0 h-fit">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">{t('contact.info.phoneTitle')}</span>
                    <div className="text-sm text-brand-teal font-mono font-bold mt-1">
                      <div>011-200-2006</div>
                      <div>053-153-4385</div>
                    </div>
                  </div>
                </div>

                {/* Corporate email */}
                <div className="flex gap-4">
                  <div className="p-3 rounded-xl bg-brand-blue/10 text-brand-blue border border-brand-blue/20 shrink-0 h-fit">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">{t('contact.info.emailTitle')}</span>
                    <div className="text-sm text-gray-300 font-mono mt-1">
                      info@asmatechsa.com
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Saudi licensure regulatory box */}
            <div className="p-4 rounded-xl border border-brand-gold/20 bg-brand-gold/5 space-y-1">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
                {t('contact.info.crTitle')}
              </h4>
              <p className="text-xs text-gray-400">
                Commercial Registration CR: 7003024853. Approved as a local certified cybersecurity and tech development contractor.
              </p>
            </div>
          </div>

          {/* Right Block (Contact form) */}
          <div className="lg:col-span-7 p-8 rounded-3xl border border-brand-blue/10 bg-brand-navy/60 backdrop-blur-md relative overflow-hidden">
            <h3 className="text-lg font-bold text-white mb-6">
              {t('contact.formHeading')}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Input Name */}
                <div className="space-y-1.5ClassName">
                  <label htmlFor="view-input-name" className="text-xs text-gray-400 font-semibold block uppercase">
                    {t('contact.fields.name')} <span className="text-brand-blue">*</span>
                  </label>
                  <input
                    id="view-input-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Eng. Ahmed Al-Otaibi"
                    className="w-full p-3.5 bg-brand-navy/80 border border-brand-blue/15 rounded-xl text-white text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all font-semibold"
                  />
                </div>

                {/* Input Email */}
                <div className="space-y-1.5ClassName">
                  <label htmlFor="view-input-email" className="text-xs text-gray-400 font-semibold block uppercase">
                    {t('contact.fields.email')} <span className="text-brand-blue">*</span>
                  </label>
                  <input
                    id="view-input-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ahmed@company.sa"
                    className="w-full p-3.5 bg-brand-navy/80 border border-brand-blue/15 rounded-xl text-white text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all font-semibold"
                  />
                </div>

                {/* Input Phone */}
                <div className="space-y-1.5ClassName">
                  <label htmlFor="view-input-phone" className="text-xs text-gray-400 font-semibold block uppercase">
                    {t('contact.fields.phone')}
                  </label>
                  <input
                    id="view-input-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0531534385"
                    className="w-full p-3.5 bg-brand-navy/80 border border-brand-blue/15 rounded-xl text-white text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all font-mono"
                  />
                </div>

                {/* Input Service type selection */}
                <div className="space-y-1.5ClassName">
                  <label htmlFor="view-select-service" className="text-xs text-gray-400 font-semibold block uppercase">
                    {t('contact.fields.service')} <span className="text-brand-blue">*</span>
                  </label>
                  <select
                    id="view-select-service"
                    required
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full p-3.5 bg-brand-navy/80 border border-brand-blue/15 rounded-xl text-white text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all font-semibold"
                  >
                    <option value="" disabled>{t('contact.servicesOptions.select')}</option>
                    <option value="web">{t('contact.servicesOptions.web')}</option>
                    <option value="mobile">{t('contact.servicesOptions.mobile')}</option>
                    <option value="desktop">{t('contact.servicesOptions.desktop')}</option>
                    <option value="ai">{t('contact.servicesOptions.ai')}</option>
                    <option value="marketing">{t('contact.servicesOptions.marketing')}</option>
                    <option value="motion">{t('contact.servicesOptions.motion')}</option>
                  </select>
                </div>

              </div>

              {/* Input Budget selection */}
              <div className="space-y-1.5ClassName">
                <label htmlFor="view-select-budget" className="text-xs text-gray-400 font-semibold block uppercase">
                  {t('contact.fields.budget')}
                </label>
                <select
                  id="view-select-budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full p-3.5 bg-brand-navy/80 border border-brand-blue/15 rounded-xl text-white text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all font-semibold"
                >
                  <option value="" disabled>{t('contact.budgetOptions.select')}</option>
                  <option value="tier1">{t('contact.budgetOptions.tier1')}</option>
                  <option value="tier2">{t('contact.budgetOptions.tier2')}</option>
                  <option value="tier3">{t('contact.budgetOptions.tier3')}</option>
                </select>
              </div>

              {/* Input Message description text */}
              <div className="space-y-1.5ClassName">
                <label htmlFor="view-input-message" className="text-xs text-gray-400 font-semibold block uppercase">
                  {t('contact.fields.message')} <span className="text-brand-blue">*</span>
                </label>
                <textarea
                  id="view-input-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your project specifications, timeframe, and goals..."
                  className="w-full p-3.5 bg-brand-navy/80 border border-brand-blue/15 rounded-xl text-white text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all font-semibold resize-none"
                />
              </div>

              {/* Interactive Status Alerts */}
              <AnimatePresence>
                {toast && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className={`p-4 rounded-xl flex items-start gap-3 border ${
                      toast.type === 'success'
                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                        : 'bg-red-500/10 border-red-500/30 text-red-500'
                    }`}
                  >
                    {toast.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    )}
                    <span className="text-xs md:text-sm font-semibold">{toast.msg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit CTA button */}
              <button
                id="view-btn-submit"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 text-xs font-black uppercase tracking-wider rounded-xl text-white bg-gradient-to-r from-brand-blue to-brand-teal hover:shadow-lg hover:shadow-brand-blue/20 transition-all disabled:opacity-45 flex items-center justify-center gap-1.5 scale-100 active:scale-[0.98] cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>{t('contact.fields.submitting')}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t('contact.fields.submit')}</span>
                  </>
                )}
              </button>

            </form>
          </div>

        </div>

        {/* Section 2: Virtual Office Geoloaction Map Locator */}
        <div className="p-8 rounded-3xl border border-brand-blue/15 bg-brand-navy/40 overflow-hidden relative min-h-[350px] flex flex-col justify-between">
          <div className="absolute inset-0 grayscale contrast-125 opacity-10 pointer-events-none bg-[radial-gradient(#1b7fe8_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 max-w-md space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-teal animate-ping" />
              <span>AAT Al Khaleejiah HQ Locator</span>
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Office 106, Al Khaleejiah Center, Izdhar District, Riyadh, Saudi Arabia.<br />
              WGS-84 Coordinates: <strong>24.757049, 46.721415</strong>
            </p>
          </div>

          {/* Styled Radar Center Grid SVG Map Mockup */}
          <div className="relative h-48 w-full border border-brand-blue/10 bg-[#061026]/80 rounded-2xl flex items-center justify-center overflow-hidden">
            {/* Animated Radar scan circle */}
            <div className="absolute w-80 h-80 rounded-full border border-brand-blue/20 animate-ping opacity-35" />
            <div className="absolute w-48 h-48 rounded-full border border-brand-blue/10 animate-pulse-slow" />
            
            <div className="absolute h-full w-[1px] bg-brand-blue/10" />
            <div className="absolute w-full h-[1px] bg-brand-blue/10" />

            {/* Glowing marker pin */}
            <div className="relative flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-brand-blue border-2 border-white flex items-center justify-center animate-bounce shadow-xl shadow-brand-blue/50">
                <MapPin className="w-3 h-3 text-white" />
              </div>
              <span className="text-[9px] font-mono font-black text-brand-teal bg-[#0c142c] border border-brand-blue/20 px-2.5 py-0.5 rounded-full mt-1.5 shadow">
                Office 106, Izdhar
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
