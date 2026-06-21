import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { submitLead } from '../../firebase/config';
import { Mail, Phone, MapPin, CheckCircle, AlertCircle, Send, Award, Box, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ContactCTA() {
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
    
    // Clear states
    setToast(null);

    // Simple validation
    if (!name.trim() || !email.trim() || !service || !message.trim()) {
      setToast({
        type: 'error',
        msg: language === 'ar' ? 'الرجاء ملء جميع الحقول المطلوبة النجمية (*)' : 'Please fill out all required fields marked with (*).'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Gateway call to Firestore/Local Storage backup audit trails
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
        // Clear input form
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
    <section id="contact" className="relative py-24 bg-brand-navy border-t border-brand-blue/10 overflow-hidden select-none">
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy via-brand-navy to-brand-blue/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[40vw] h-[40vw] rounded-full bg-brand-blue/5 blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full bg-brand-teal/5 blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '4s' }} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-black tracking-widest text-brand-teal uppercase px-3 py-1 rounded-full bg-brand-blue/10 w-fit mx-auto mb-4"
          >
            {t('contact.badge')}
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-white mb-4"
          >
            {t('contact.title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-sm md:text-base"
          >
            {t('contact.subtitle')}
          </motion.p>
        </div>

        {/* Contact panel structure columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left panel info (4 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 p-8 rounded-3xl border border-brand-blue/10 bg-[#061026]/75 backdrop-blur-md">
            <div className="space-y-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {t('contact.info.addressTitle')}
              </h3>

              <div className="space-y-5">
                {/* Physical office address */}
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

                {/* Hotlines */}
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

                {/* Email address */}
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

            {/* Saudi Licensing Badge */}
            <div className="p-4 rounded-2xl border border-brand-gold/20 bg-brand-gold/5 space-y-2">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-brand-gold shrink-0" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {t('contact.info.crTitle')}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {t('contact.info.crText')} — Under Saudi Ministry of Commerce regulatory standards.
              </p>
            </div>
            
          </div>

          {/* Right panel interactive form (7 Cols) */}
          <div className="lg:col-span-7 p-8 rounded-3xl border border-brand-blue/15 bg-brand-navy/60 backdrop-blur-md relative overflow-hidden">
            <h3 className="text-xl font-bold text-white mb-6">
              {t('contact.formHeading')}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10 transition-all">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Input Name */}
                <div className="space-y-1.5ClassName">
                  <label htmlFor="input-name" className="text-xs text-gray-400 font-semibold block uppercase">
                    {t('contact.fields.name')} <span className="text-brand-blue">*</span>
                  </label>
                  <input
                    id="input-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Eng. Ahmed Al-Otaibi"
                    className="w-full p-3.5 bg-brand-navy/80 border border-brand-blue/15 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all font-semibold"
                  />
                </div>

                {/* Input Email */}
                <div className="space-y-1.5ClassName">
                  <label htmlFor="input-email" className="text-xs text-gray-400 font-semibold block uppercase">
                    {t('contact.fields.email')} <span className="text-brand-blue">*</span>
                  </label>
                  <input
                    id="input-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ahmed@company.sa"
                    className="w-full p-3.5 bg-brand-navy/80 border border-brand-blue/15 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all font-semibold"
                  />
                </div>

                {/* Input Phone */}
                <div className="space-y-1.5ClassName">
                  <label htmlFor="input-phone" className="text-xs text-gray-400 font-semibold block uppercase">
                    {t('contact.fields.phone')}
                  </label>
                  <input
                    id="input-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0531534385"
                    className="w-full p-3.5 bg-brand-navy/80 border border-brand-blue/15 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all font-mono"
                  />
                </div>

                {/* Input Service type selection */}
                <div className="space-y-1.5ClassName">
                  <label htmlFor="select-service" className="text-xs text-gray-400 font-semibold block uppercase">
                    {t('contact.fields.service')} <span className="text-brand-blue">*</span>
                  </label>
                  <select
                    id="select-service"
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
                <label htmlFor="select-budget" className="text-xs text-gray-400 font-semibold block uppercase">
                  {t('contact.fields.budget')}
                </label>
                <select
                  id="select-budget"
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
                <label htmlFor="input-message" className="text-xs text-gray-400 font-semibold block uppercase">
                  {t('contact.fields.message')} <span className="text-brand-blue">*</span>
                </label>
                <textarea
                  id="input-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your project specifications, timeframe, and goals..."
                  className="w-full p-3.5 bg-brand-navy/80 border border-brand-blue/15 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all font-semibold resize-none"
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
                id="btn-submit-lead"
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

      </div>
    </section>
  );
}
