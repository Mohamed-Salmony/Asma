import React, { useState, useEffect, useRef } from 'react';
import { db, isRealFirebase, auth } from '../../firebase/config';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown, 
  HelpCircle, 
  ChevronDown,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface ChatMsg {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  rating?: 'like' | 'dislike' | 'none';
  docId?: string; // Firebase doc ID to update votes
}

export default function AIChatbotWidget() {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize welcome greetings
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome_1',
          sender: 'bot',
          text: language === 'ar' 
            ? 'مرحباً بك في آت (AAT)! أنا آية، مساعدتك الذكية لشركة أسماء للتكنولوجيا المتقدمة بالرياض. يمكنني إجابتك عن خدماتنا الرقمية، باقاتنا الاستثمارية، وتفاصيل الترخيص والتواصل. كيف يمكنني مساعدتك اليوم؟'
            : 'Welcome to AAT! I am Aya, your dedicated AI Assistant for ASMA Advanced Technology in Riyadh. I can guide you through our digital engineering services, pricing packages, corporate credentials, or Vision 2030 integrations. How can I help you today?',
          rating: 'none'
        }
      ]);
    }
  }, [language]);

  // Handle messages scroll triggers
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Handle query submissions
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputVal;
    if (!textToSend.trim() || loading) return;

    if (!customText) setInputVal('');

    // 1. Add User Message
    const userMsgId = 'usr_' + Date.now();
    const newUserMsg: ChatMsg = {
      id: userMsgId,
      sender: 'user',
      text: textToSend
    };
    setMessages(prev => [...prev, newUserMsg]);
    setLoading(true);

    try {
      // 2. Fetch from our full-stack endpoint
      const response = await fetch('/api/chatbot/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, language })
      });

      if (!response.ok) {
        throw new Error('Endpoint connection failure');
      }

      const data = await response.json();
      const botAnswer = data.answer || "I’m sorry, I was unable to compile an answer. Please reload or get in touch with our Riyadh team via WhatsApp.";

      // 3. Document in Firestore (Interactions collection)
      let customDocId: string | undefined;
      if (isRealFirebase && db) {
        try {
          const pathForWrite = 'interactions';
          customDocId = "chat_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
          
          await setDoc(doc(db, pathForWrite, customDocId), {
            question: textToSend,
            answer: botAnswer,
            rating: "none",
            language,
            timestamp: serverTimestamp(),
            userEmail: auth?.currentUser?.email || "anonymous_web"
          });
          console.log("Logged interaction securely in Firebase Firestore:", customDocId);
        } catch (fbErr) {
          console.error("Firestore logging failed:", fbErr);
        }
      }

      // 4. Render Bot message
      setMessages(prev => [...prev, {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        text: botAnswer,
        rating: 'none',
        docId: customDocId
      }]);

    } catch (err: any) {
      console.error("Chatbot error:", err);
      setMessages(prev => [...prev, {
        id: 'err_' + Date.now(),
        sender: 'bot',
        text: language === 'ar'
          ? 'المعذرة، واجهت مشكلة في الاتصال بالملقم الرقمي. يرجى مراجعة الاتصال أو الضغط على زر الدعم عبر الواتساب.'
          : 'Apologies, I encountered a cellular or server connection issue. Please check your networks or tap WhatsApp to speak with a human agent.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Upvote/Downvote feedback ratings synced to Firebase
  const handleRateMessage = async (msgId: string, docId: string | undefined, currentVote: 'like' | 'dislike') => {
    // Optimistic UI update
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, rating: currentVote } : m));

    if (!docId || !isRealFirebase || !db) {
      console.warn("Rating ignored - simulated mode or missing document context ID.");
      return;
    }

    try {
      const chatRef = doc(db, 'interactions', docId);
      await updateDoc(chatRef, { rating: currentVote });
      console.log(`Updated interaction ${docId} rating to:`, currentVote);
    } catch (err) {
      console.error("Failed to commit chatbot rating vote:", err);
    }
  };

  // Recommended helper questions to lower client friction
  const promptSuggestions = language === 'ar' ? [
    'ما هي خدمات أسماء المتقدمة (AAT)؟',
    'ما هي باقتكم وأسعاركم؟',
    'ما هو ترخيصكم وموقع المقر بالرياض؟',
    'هل تدعمون التحول الرقمي ورؤية 2030؟'
  ] : [
    'What services do you offer?',
    'What are your pricing packages?',
    'Where is your headquarters Riyadh address?',
    'Do you support Saudi Digital Vision 2030?'
  ];

  return (
    <>
      {/* 1. FLOATING ACTION BUTTON WITH ANIMATE-GLOW */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
        
        {/* Sparkle welcoming balloon (only desktop, toggled off when open) */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="bg-brand-navy-light/95 border border-brand-teal/30 px-3.5 py-2 rounded-2xl shadow-xl text-slate-100 text-xs font-bold leading-tight select-none pointer-events-auto hidden md:flex items-center gap-2 max-w-xs cursor-pointer hover:border-brand-teal/60 transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <Sparkles className="w-4 h-4 text-brand-teal animate-pulse shrink-0" />
            <span>{language === 'ar' ? 'لديك أي سؤال؟ اسأل مساعدنا الذكي!' : 'Have questions? Ask Aya AI!'}</span>
          </motion.div>
        )}

        {/* Core Floating circle action button */}
        <motion.button
          id="btn-chatbot-float"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-brand-teal to-brand-blue hover:from-brand-teal-light hover:to-brand-blue/90 border border-brand-teal/40 text-brand-navy flex items-center justify-center shadow-lg shadow-brand-teal/20 pointer-events-auto cursor-pointer relative z-40 transition-transform focus:outline-none"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="chat-close-ic"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X className="w-6 h-6 text-brand-navy" />
              </motion.div>
            ) : (
              <motion.div
                key="chat-open-ic"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                className="relative"
              >
                {/* Red ping alert notification dot */}
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-rose-500 border border-brand-navy animate-pulse" />
                <MessageSquare className="w-6 h-6 text-brand-navy" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* 2. CHAT MESSENGER WINDOW WITH PERSISTENCE SLIDE-UP */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            className={`fixed bottom-24 right-4 md:right-6 w-[92vw] sm:w-[400px] h-[550px] bg-brand-navy-light/95 border border-brand-blue/20 rounded-3xl shadow-2xl z-40 flex flex-col overflow-hidden backdrop-blur-md`}
          >
            {/* Ambient visual glass backing decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/5 blur-[50px] pointer-events-none" />

            {/* Header segment with Online light indicator */}
            <div className="p-4 bg-[#080f24]/80 border-b border-brand-blue/15 flex items-center justify-between shrink-0 relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-brand-teal/20 to-brand-blue/20 border border-brand-teal/30 flex items-center justify-center font-black text-brand-teal relative">
                  <Sparkles className="w-5 h-5 text-brand-teal" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#080f24] animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white tracking-tight flex items-center gap-1">
                    <span>{language === 'ar' ? 'آية - مساعد الذكاء الاصطناعي' : 'Aya AI Agent'}</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono tracking-tighter flex items-center gap-1 mt-0.5">
                    <span>ASMA Advanced Tech (AAT) Support</span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Chat list viewport stream */}
            <div 
              ref={scrollRef}
              className="grow p-4 overflow-y-auto space-y-4 custom-scrollbar-premium bg-brand-navy/30 relative"
            >
              <div className="absolute inset-0 bg-[radial-gradient(#1b7fe8_1px,transparent_1px)] [background-size:20px_20px] opacity-5 pointer-events-none" />
              
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col gap-1 max-w-[85%] ${
                    m.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-brand-teal text-brand-navy font-bold rounded-tr-none shadow-md'
                        : 'bg-brand-navy-light/90 border border-brand-blue/10 text-slate-100 rounded-tl-none shadow-md'
                    }`}
                  >
                    {m.text}
                  </div>

                  {/* Underlay elements for bot responses (Thumbs-up rating & timestamp) */}
                  {m.sender === 'bot' && (m.id !== 'welcome_1') && (
                    <div className="flex items-center gap-3.5 mt-1 px-1.5 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Just now</span>
                      </span>

                      {/* Vote elements */}
                      <div className="flex items-center gap-2 border-l border-brand-blue/15 pl-2.5">
                        <button
                          onClick={() => handleRateMessage(m.id, m.docId, 'like')}
                          disabled={m.rating !== 'none'}
                          className={`hover:text-emerald-400 transition-colors p-1 rounded hover:bg-slate-500/10 cursor-pointer ${
                            m.rating === 'like' ? 'text-emerald-400 scale-110 font-bold' : ''
                          }`}
                          title="This was helpful"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleRateMessage(m.id, m.docId, 'dislike')}
                          disabled={m.rating !== 'none'}
                          className={`hover:text-rose-400 transition-colors p-1 rounded hover:bg-slate-500/10 cursor-pointer ${
                            m.rating === 'dislike' ? 'text-rose-400 scale-110 font-bold' : ''
                          }`}
                          title="This was not helpful"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Bot typing loader bubble */}
              {loading && (
                <div className="flex items-center gap-2 text-slate-400 p-3 bg-brand-navy-light border border-brand-blue/10 rounded-2xl rounded-tl-none mr-auto max-w-[60px] shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>

            {/* Dynamic suggested helper questions wrapper */}
            {messages.length < 3 && (
              <div className="px-4 py-2 bg-brand-navy-light/50 border-t border-brand-blue/10 shrink-0 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
                {promptSuggestions.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(p)}
                    className="px-3 py-1.5 bg-brand-navy hover:bg-brand-blue/25 border border-brand-blue/15 rounded-xl text-[10px] font-bold text-slate-300 hover:text-white transition-all cursor-pointer inline-flex items-center gap-1 shrink-0"
                  >
                    <span>{p}</span>
                    <ArrowRight className="w-2.5 h-2.5 shrink-0 rotate-45" />
                  </button>
                ))}
              </div>
            )}

            {/* Input footer form */}
            <div className="p-4 bg-[#080f24]/80 border-t border-brand-blue/15 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'اكتب سؤالك هنا بطلاقة...' : 'Type your supportive inquiry...'}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  disabled={loading}
                  className="grow px-4 py-3 bg-brand-navy border border-brand-blue/15 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-brand-teal transition-all focus:ring-1 focus:ring-brand-teal"
                  required
                />
                
                <button
                  type="submit"
                  disabled={loading || !inputVal.trim()}
                  className="p-3 bg-brand-teal hover:bg-brand-teal-light disabled:opacity-30 text-brand-navy rounded-xl shadow-md transition-colors cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4 text-brand-navy" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
