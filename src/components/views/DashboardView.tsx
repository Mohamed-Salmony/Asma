import React, { useState, useEffect } from 'react';
import { db, isRealFirebase, auth } from '../../firebase/config';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Filter, 
  Trash2, 
  Heart, 
  Briefcase, 
  ThumbsUp, 
  ThumbsDown, 
  RefreshCw, 
  ExternalLink,
  Crown,
  ChevronDown,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { Lead, ChatInteraction, UserProfile } from '../../types';

interface DashboardViewProps {
  user: any;
  onLogout: () => void;
  onBack: () => void;
}

export default function DashboardView({ user, onLogout, onBack }: DashboardViewProps) {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'leads' | 'chatbot' | 'users'>('leads');
  
  // Data states
  const [leads, setLeads] = useState<Lead[]>([]);
  const [interactions, setInteractions] = useState<ChatInteraction[]>([]);
  const [accounts, setAccounts] = useState<UserProfile[]>([]);
  
  // View states
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [leadFilter, setLeadFilter] = useState<'all' | 'new' | 'contacted' | 'in-progress' | 'closed'>('all');

  // Load actual Firebase collections or seed simulated files
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      if (isRealFirebase && db) {
        // Core Fetching sequence
        console.log("Fetching live workspace collections from Firebase Firestore...");
        
        // 1. Fetch Leads
        const leadsSnap = await getDocs(query(collection(db, 'leads'), orderBy('timestamp', 'desc')));
        const leadsData = leadsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Lead[];
        setLeads(leadsData);
        
        // 2. Fetch Interactions
        const chatSnap = await getDocs(query(collection(db, 'interactions'), orderBy('timestamp', 'desc')));
        const chatData = chatSnap.docs.map(d => ({ id: d.id, ...d.data() })) as ChatInteraction[];
        setInteractions(chatData);
        
        // 3. Fetch Registered Profiles
        const usersSnap = await getDocs(collection(db, 'users'));
        const usersData = usersSnap.docs.map(d => ({ uid: d.id, ...d.data() })) as UserProfile[];
        setAccounts(usersData);
      } else {
        // High fidelity elegant simulated database loads
        console.warn("Real Firebase inactive - seeding dashboard state logs.");
        
        // Simulate seeded leads
        const seededLeads: Lead[] = [
          {
            id: "ld_sim_1",
            name: "Eng. Faisal Al-Shammari",
            email: "faisal@riyadhlogistics.sa",
            phone: "+966 50 123 4567",
            service: "Web Development Platform",
            budget: "30,000 - 55,000 SAR (Growth)",
            message: "We need a responsive high-capacity fleet tracker linked with dynamic CRM reports to organize stock shipments in our Riyadh hub.",
            status: "in-progress",
            timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
          },
          {
            id: "ld_sim_2",
            name: "Sultan Bin Abdulaziz",
            email: "s.abdulaziz@sovereign.sa",
            phone: "+966 55 999 8888",
            service: "Mobile iOS / Android Application",
            budget: "60,000+ SAR (Enterprise)",
            message: "Looking for an encrypted investor relations application incorporating secure biometric identification and local push logs stream in Flutter.",
            status: "new",
            timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
          },
          {
            id: "ld_sim_3",
            name: "Dr. Sarah Al-Otaibi",
            email: "s.otaibi@advancedhealth.com.sa",
            phone: "",
            service: "AI Automation Pipeline",
            budget: "60,000+ SAR (Enterprise)",
            message: "We wish to deploy an automated OCR pipeline parser to categorize clinical records from scanner sheets safely according to Saudi health targets.",
            status: "contacted",
            timestamp: new Date(Date.now() - 3600000 * 48).toISOString()
          }
        ];
        
        // Localstorage fetch
        const storedLeads = JSON.parse(localStorage.getItem('aat_sim_leads') || '[]');
        setLeads([...storedLeads.map((l: any, i: number) => ({ id: "ld_stored_" + i, ...l })), ...seededLeads]);

        // Seeded chatbot logs
        setInteractions([
          {
            id: "chat_sim_1",
            question: "What is your main license registry or Commercial registry under Saudi law?",
            answer: "ASMA Advanced Technology (AAT) is a fully authorized digital enterprise operating under official Commercial Registration CR No. 7003024853.",
            rating: "like",
            language: "en",
            timestamp: new Date(Date.now() - 600000 * 2).toISOString()
          },
          {
            id: "chat_sim_2",
            question: "ما هي باقة Starter لديكم وكم تكلفتها؟",
            answer: "الباقة الأساسية (Starter Package) تتراوح بين 10,000 إلى 18,000 ريال سعودي وتشمل: بوابات إلكترونية من صفحة إلى 5 صفحات، نظام إدارة محتوى بسيط، و3 أشهر صيانة مجانية.",
            rating: "like",
            language: "ar",
            timestamp: new Date(Date.now() - 600000 * 15).toISOString()
          },
          {
            id: "chat_sim_3",
            question: "Do you offer offline stock managers for WPF desktop systems?",
            answer: "Yes! Our Sovereign Industrial ERP services are specialized in WPF and .NET Core implementations, binding stocks and barcodes synchronously.",
            rating: "dislike",
            language: "en",
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
          }
        ]);

        // Seeded registered accounts
        setAccounts([
          {
            uid: "sim_usr_1",
            email: "mohamedsamysalmony@gmail.com",
            displayName: "Mohamed Samy (Owner Admin)",
            photoURL: "",
            role: "admin",
            createdAt: new Date().toISOString()
          },
          {
            uid: "sim_usr_2",
            email: "faisal@riyadhlogistics.sa",
            displayName: "Eng. Faisal",
            photoURL: "",
            role: "user",
            createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
          }
        ]);
      }
    } catch (err) {
      console.error("Dashboard dataload error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Run initial state loading
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Update lead follow-up status (Firebase synced)
  const handleUpdateLeadStatus = async (leadId: string, newStatus: "new" | "contacted" | "in-progress" | "closed") => {
    setUpdatingId(leadId);
    try {
      if (isRealFirebase && db) {
        const leadRef = doc(db, 'leads', leadId);
        await updateDoc(leadRef, { status: newStatus });
        console.log("Lead status updated to:", newStatus);
      }
      
      // Local updates representation
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    } catch (err) {
      console.error("Failed to commit status change:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete lead or log entry
  const handleDeleteItem = async (col: 'leads' | 'interactions', id: string) => {
    if (!window.confirm(language === 'ar' ? "هل أنت متأكد من مسح هذا التقرير نهائياً؟" : "Are you sure you want to permanently delete this item?")) return;
    
    try {
      if (isRealFirebase && db) {
        await deleteDoc(doc(db, col, id));
        console.log(`Deleted document from '${col}' with ID:`, id);
      }
      
      if (col === 'leads') {
        setLeads(prev => prev.filter(l => l.id !== id));
      } else {
        setInteractions(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error("Deletion failed:", err);
    }
  };

  // Derived statistics metrics
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'new').length;
  const closedLeads = leads.filter(l => l.status === 'closed').length;
  
  const totalChatQuestions = interactions.length;
  const likeVotes = interactions.filter(i => i.rating === 'like').length;
  const totalHelpfulnessRatio = totalChatQuestions > 0 
    ? Math.round((likeVotes / interactions.filter(i => i.rating !== 'none').length || 1) * 100) 
    : 100;

  // Filtered Leads implementation
  const filteredLeads = leads.filter(l => leadFilter === 'all' ? true : l.status === leadFilter);

  return (
    <div className="min-h-screen bg-brand-navy pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Dashboard Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-blue/15 pb-6">
          <div>
            <span className="text-[10px] tracking-widest font-bold text-brand-teal bg-brand-teal/10 border border-brand-teal/20 px-3 py-1 rounded-full uppercase inline-flex items-center gap-1.5 mb-2">
              <Crown className="w-3.5 h-3.5" />
              <span>RIYADH MAIN HEADQUARTERS</span>
            </span>
            <h1 className="text-3xl font-black text-white flex items-center gap-2 tracking-tight">
              <span>{language === 'ar' ? 'لوحة تحكم المشرف' : 'AAT HQ Management Terminal'}</span>
              <span className="text-brand-teal text-xs font-bold border border-brand-teal/30 px-2.5 py-0.5 rounded-md">ADMIN</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {language === 'ar' 
                ? `مرحباً بك، ${user.displayName || user.email} • لوحة تحليلات وإدارة معاملات الموقع الإلكتروني`
                : `Active Operator: ${user.displayName || user.email} • Comprehensive portal audit & lead logging terminal`}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Quick reload action */}
            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="p-3 bg-brand-navy-light hover:bg-brand-blue/15 border border-brand-blue/15 text-slate-300 rounded-xl transition-colors cursor-pointer"
              title="Refresh database entries"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Back to Site Button */}
            <button
              onClick={onBack}
              className="px-4 py-2.5 bg-brand-navy-light hover:bg-brand-blue/20 text-xs font-bold text-white border border-brand-blue/15 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>{language === 'ar' ? 'مراجعة وجهة المستخدم' : 'View Core Website'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Logout action */}
            <button
              onClick={onLogout}
              className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/25 text-xs font-bold text-rose-300 border border-rose-500/20 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تسجيل الخروج' : 'Exit Dashboard'}</span>
            </button>
          </div>
        </div>

        {/* 1. KEY ANALYTICS METRICS BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Total Client Inquiries */}
          <motion.div
            whileHover={{ y: -3 }}
            className="p-6 rounded-2xl bg-brand-navy-light border border-brand-blue/10 flex items-center gap-5 shadow-lg relative overflow-hidden"
          >
            <div className="p-4 bg-brand-teal/10 border border-brand-teal/20 text-brand-teal rounded-2xl shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                {language === 'ar' ? 'مجموع الاستفسارات' : 'Total Client Leads'}
              </p>
              <h3 className="text-2xl font-black text-white mt-1">{totalLeads}</h3>
              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
                <span>{newLeads} {language === 'ar' ? 'جديد لم يعالج' : 'uncontacted new inquiries'}</span>
              </p>
            </div>
          </motion.div>

          {/* AI Chatbot Questions */}
          <motion.div
            whileHover={{ y: -3 }}
            className="p-6 rounded-2xl bg-brand-navy-light border border-brand-blue/10 flex items-center gap-5 shadow-lg relative overflow-hidden"
          >
            <div className="p-4 bg-brand-blue/10 border border-brand-blue/20 text-brand-blue rounded-2xl shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                {language === 'ar' ? 'استفسارات المساعد الالي' : 'Chatbot Interactions'}
              </p>
              <h3 className="text-2xl font-black text-white mt-1">{totalChatQuestions}</h3>
              <p className="text-[10px] text-slate-400 mt-1">
                {language === 'ar' ? 'تاريخ المحادثات المسجل بالكامل' : 'AI automated logs records'}
              </p>
            </div>
          </motion.div>

          {/* Chatbot Rating ratio */}
          <motion.div
            whileHover={{ y: -3 }}
            className="p-6 rounded-2xl bg-brand-navy-light border border-brand-blue/10 flex items-center gap-5 shadow-lg relative overflow-hidden"
          >
            <div className="p-4 bg-brand-gold/10 border border-brand-gold/20 text-brand-gold rounded-2xl shrink-0">
              <ThumbsUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                {language === 'ar' ? 'نسبة رضا المستخدمين' : 'Chatbot Accuracy'}
              </p>
              <h3 className="text-2xl font-black text-white mt-1">{totalHelpfulnessRatio}%</h3>
              <p className="text-[10px] text-slate-400 mt-1">
                {likeVotes} {language === 'ar' ? 'إعجابات بإجابات الـ AI' : 'positive client thumbs up'}
              </p>
            </div>
          </motion.div>

          {/* Accounts Profiles logged */}
          <motion.div
            whileHover={{ y: -3 }}
            className="p-6 rounded-2xl bg-brand-navy-light border border-brand-blue/10 flex items-center gap-5 shadow-lg relative overflow-hidden"
          >
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                {language === 'ar' ? 'المستخدمين المسجلين' : 'Registered Users'}
              </p>
              <h3 className="text-2xl font-black text-white mt-1">{accounts.length}</h3>
              <p className="text-[10px] text-slate-400 mt-1">
                {language === 'ar' ? 'بوابة العملاء والمشرفين' : 'Sovereign portal client slots'}
              </p>
            </div>
          </motion.div>
        </div>

        {/* 2. SUB-SECTION NAV TABS BAR */}
        <div className="flex border-b border-brand-blue/10 gap-6">
          <button
            onClick={() => setActiveTab('leads')}
            className={`pb-4 text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === 'leads' ? 'text-brand-teal text-base border-b-2 border-brand-teal' : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'ar' ? 'إدارة استمارات العملاء (Leads)' : 'Portal Project Inquiry Leads'}
          </button>
          <button
            onClick={() => setActiveTab('chatbot')}
            className={`pb-4 text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === 'chatbot' ? 'text-brand-teal text-base border-b-2 border-brand-teal' : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'ar' ? 'سجلات دعم الـ AI Chatbot' : 'AI chatbot transcripts'}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === 'users' ? 'text-brand-teal text-base border-b-2 border-brand-teal' : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'ar' ? 'تقارير الأعضاء والحسابات' : 'System Profiles'}
          </button>
        </div>

        {/* 3. SUB-SECTION TAB DISPATCH PANELS */}
        <AnimatePresence mode="wait">
          {activeTab === 'leads' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Filter Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-brand-navy-light/40 border border-brand-blue/10 p-4 rounded-xl">
                <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                  <Filter className="w-4 h-4 text-brand-teal" />
                  <span>{language === 'ar' ? 'فرز حالة المتابعة' : 'Inquiry Followups Filter:'}</span>
                </span>
                
                <div className="flex flex-wrap gap-2 text-xs">
                  {(['all', 'new', 'contacted', 'in-progress', 'closed'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setLeadFilter(st)}
                      className={`px-3 py-1.5 rounded-lg border font-bold uppercase transition-all cursor-pointer ${
                        leadFilter === st 
                          ? 'bg-brand-teal border-brand-teal text-brand-navy' 
                          : 'border-brand-blue/20 text-slate-400 hover:text-white hover:border-brand-blue/40'
                      }`}
                    >
                      {language === 'ar' ? (
                        st === 'all' ? 'الكل' :
                        st === 'new' ? 'جديد' :
                        st === 'contacted' ? 'تم الاتصال' :
                        st === 'in-progress' ? 'قيد التنفيذ' : 'مغلق'
                      ) : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid or Empty container */}
              {filteredLeads.length === 0 ? (
                <div className="text-center py-12 bg-brand-navy-light/20 border border-brand-blue/10 rounded-2xl">
                  <p className="text-slate-400 text-sm">
                    {language === 'ar' ? 'لا يوجد استمارات مطابقة لهذا التصفية حالياً.' : 'No customer inquiries match the selected status category.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredLeads.map((ld) => (
                    <motion.div
                      key={ld.id}
                      layout
                      className="bg-brand-navy-light border border-brand-blue/10 p-6 rounded-2xl relative shadow-md hover:shadow-brand-teal/5 hover:border-brand-blue/25 transition-all text-sm"
                    >
                      {/* Delete button (accessible strictly to Riyadh admins) */}
                      <button
                        onClick={() => handleDeleteItem('leads', ld.id!)}
                        className="absolute top-5 right-5 text-slate-500 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-rose-500/10 cursor-pointer"
                        title="Delete Lead entry"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>

                      {/* Header details */}
                      <div className="space-y-1 mb-4 pr-10">
                        <span className="text-[10px] text-slate-400 font-mono tracking-tighter">
                          ID: {ld.id} • {new Date(ld.timestamp?.seconds ? ld.timestamp.seconds * 1000 : ld.timestamp).toLocaleString()}
                        </span>
                        <h4 className="text-lg font-black text-white">{ld.name}</h4>
                        <p className="text-brand-teal font-medium text-xs flex items-center gap-1 bg-brand-teal/5 px-2.5 py-1 rounded-md max-w-max border border-brand-teal/15 mt-1.5">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{ld.service}</span>
                        </p>
                      </div>

                      {/* Grid metrics */}
                      <div className="grid grid-cols-2 gap-4 bg-brand-navy/60 p-3.5 rounded-xl text-xs mb-4">
                        <div>
                          <span className="text-slate-500 block mb-0.5">{language === 'ar' ? 'البريد الإلكتروني' : 'Email:'}</span>
                          <span className="text-slate-200 font-bold block overflow-x-auto select-all">{ld.email}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block mb-0.5">{language === 'ar' ? 'الهاتف' : 'Phone:'}</span>
                          <span className="text-slate-200 font-bold block select-all">{ld.phone || "—"}</span>
                        </div>
                        <div className="col-span-2 border-t border-brand-blue/10 pt-2">
                          <span className="text-slate-500 block mb-0.5">{language === 'ar' ? 'الميزانية المتوقعة' : 'SAR Budget Option:'}</span>
                          <span className="text-amber-400 font-bold block">{ld.budget || "Not Specified"}</span>
                        </div>
                      </div>

                      {/* Client message brief */}
                      <div className="bg-brand-navy/20 border border-brand-blue/5 p-4 rounded-xl text-slate-300 text-xs leading-relaxed max-h-36 overflow-y-auto mb-5">
                        <span className="text-slate-500 block font-bold text-[10px] uppercase mb-1">{language === 'ar' ? 'تفاصيل الطلب' : 'Inquiry Text:'}</span>
                        {ld.message}
                      </div>

                      {/* Follow-up state controllers */}
                      <div className="flex flex-wrap items-center justify-between border-t border-brand-blue/10 pt-4 gap-3 text-xs">
                        <div className="flex items-center gap-1 text-slate-400 font-bold uppercase tracking-wider">
                          <Clock className="w-4 h-4 text-brand-gold animate-pulse" />
                          <span>{language === 'ar' ? 'حالة المعاملة:' : 'Inquiry Status:'}</span>
                        </div>

                        <div className="flex gap-1.5 relative">
                          {(['new', 'contacted', 'in-progress', 'closed'] as const).map((statusValue) => (
                            <button
                              key={statusValue}
                              disabled={updatingId === ld.id}
                              onClick={() => handleUpdateLeadStatus(ld.id!, statusValue)}
                              className={`px-2.5 py-1.5 rounded-lg border font-bold text-[10px] uppercase transition-all cursor-pointer ${
                                ld.status === statusValue
                                  ? (statusValue === 'new' ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' :
                                     statusValue === 'contacted' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' :
                                     statusValue === 'in-progress' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' :
                                     'bg-emerald-500/10 border-emerald-500/30 text-emerald-300')
                                  : 'border-brand-blue/5 bg-brand-navy hover:border-brand-blue/15 text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              {language === 'ar' ? (
                                statusValue === 'new' ? 'جديد' :
                                statusValue === 'contacted' ? 'تم الاتصال' :
                                statusValue === 'in-progress' ? 'بالعمل' : 'مكتمل'
                              ) : statusValue}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'chatbot' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {interactions.length === 0 ? (
                <div className="text-center py-12 bg-brand-navy-light/20 border border-brand-blue/10 rounded-2xl">
                  <p className="text-slate-400 text-sm">
                    {language === 'ar' ? 'لا يوجد تقارير محادثات بعد.' : 'No AI chatbot logs logged currently in the database.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
                  {interactions.map((chat) => (
                    <motion.div
                      key={chat.id}
                      className="bg-brand-navy-light border border-brand-blue/10 p-5 rounded-2xl relative shadow-sm text-xs flex flex-col md:flex-row md:items-start justify-between gap-6"
                    >
                      {/* Delete button (accessible strictly to Riyadh admins) */}
                      <button
                        onClick={() => handleDeleteItem('interactions', chat.id!)}
                        className="absolute top-5 right-5 text-slate-500 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-rose-500/10 cursor-pointer"
                        title="Delete interaction log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Text transcript section */}
                      <div className="space-y-3 max-w-4xl grow">
                        <div className="space-y-0.5 text-[10px] text-slate-500 font-mono">
                          <span>ID: {chat.id} • {new Date(chat.timestamp?.seconds ? chat.timestamp.seconds * 1000 : chat.timestamp).toLocaleString()}</span>
                          {chat.userEmail && <span className="block text-indigo-400">Authenticated user: {chat.userEmail}</span>}
                        </div>

                        {/* Question Dialog and Prompt */}
                        <div>
                          <span className="text-[10px] text-brand-gold uppercase tracking-wider font-bold block mb-1">{language === 'ar' ? 'استفسار المستخدم:' : 'User Query:'}</span>
                          <p className="text-slate-100 font-bold bg-brand-navy-light/90 p-3 rounded-lg border border-brand-blue/5 leading-relaxed">
                            {chat.question}
                          </p>
                        </div>

                        {/* Bot crafted answer */}
                        <div>
                          <span className="text-[10px] text-brand-teal uppercase tracking-wider font-bold block mb-1">{language === 'ar' ? 'إجابة آية الرمزية (AI Assistant):' : 'AAT AI Response:'}</span>
                          <p className="text-slate-300 bg-brand-navy/40 p-3 rounded-lg border border-brand-blue/5 leading-relaxed">
                            {chat.answer}
                          </p>
                        </div>
                      </div>

                      {/* Vote Feedback rating banner */}
                      <div className="shrink-0 flex md:flex-col items-center justify-end gap-2 text-right mt-2 md:mt-0 min-w-32 border-t md:border-t-0 border-brand-blue/10 pt-3 md:pt-0">
                        <span className="text-[10px] uppercase font-bold text-slate-500">{language === 'ar' ? 'تقييم العميل:' : 'User Feedback:'}</span>
                        {chat.rating === 'like' ? (
                          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full inline-flex items-center gap-1.5 text-[10px] font-bold">
                            <ThumbsUp className="w-3 h-3" />
                            <span>HELPFUL</span>
                          </span>
                        ) : chat.rating === 'dislike' ? (
                          <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full inline-flex items-center gap-1.5 text-[10px] font-bold">
                            <ThumbsDown className="w-3 h-3" />
                            <span>UNHELPFUL</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-slate-500/10 border border-slate-500/20 text-slate-400 rounded-full inline-flex items-center gap-1.5 text-[10px] font-bold">
                            <span>NO RATING</span>
                          </span>
                        )}

                        <span className="text-[10px] font-bold text-slate-600 block mt-1">
                          Lang: {chat.language?.toUpperCase() || "EN"}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Account List details */}
              <div className="bg-brand-navy-light border border-brand-blue/10 rounded-2xl overflow-hidden shadow-md">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-brand-navy text-xs uppercase tracking-wider text-slate-400 border-b border-brand-blue/10">
                    <tr>
                      <th className="px-6 py-4">{language === 'ar' ? 'العضو' : 'User Representative'}</th>
                      <th className="px-6 py-4">{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</th>
                      <th className="px-6 py-4">{language === 'ar' ? 'مستوى الصلاحية' : 'Sovereign Clearence'}</th>
                      <th className="px-6 py-4">{language === 'ar' ? 'تاريخ التسجيل' : 'Registered Date'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-blue/5 text-slate-300">
                    {accounts.map((acc) => (
                      <tr key={acc.uid} className="hover:bg-brand-navy/20 transition-colors">
                        <td className="px-6 py-4 font-bold flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal flex items-center justify-center font-bold">
                            {acc.displayName?.charAt(0).toUpperCase() || acc.email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <span>{acc.displayName || "Non-Specified Name"}</span>
                        </td>
                        <td className="px-6 py-4 font-mono select-all text-xs">{acc.email}</td>
                        <td className="px-6 py-4">
                          {acc.role === 'admin' ? (
                            <span className="px-2.5 py-1 bg-brand-gold/10 border border-brand-gold/20 text-brand-gold rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1">
                              <Crown className="w-3 h-3 animate-bounce" />
                              <span>ADMINISTRATOR</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>PARTNER USER</span>
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400">
                          {acc.createdAt ? new Date(acc.createdAt?.seconds ? acc.createdAt.seconds * 1000 : acc.createdAt).toLocaleDateString() : "simulation"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
