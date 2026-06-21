import React, { useState } from 'react';
import { auth, db, googleProvider, isRealFirebase } from '../../firebase/config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Chrome, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface AuthViewProps {
  onBack: () => void;
  onSuccess: (user: any) => void;
  initialMode?: 'login' | 'register';
}

export default function AuthView({ onBack, onSuccess, initialMode = 'login' }: AuthViewProps) {
  const { language, t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // Feedback states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Synchronize registered/logged-in user to Firestore
  const syncUserProfile = async (user: any, nameOverride?: string) => {
    if (!isRealFirebase || !db) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      
      const emailLower = user.email?.toLowerCase() || '';
      // Determine if they are the designated admin
      const decidedRole = (emailLower === 'mohamedsamysalmony@gmail.com') ? 'admin' : 'user';
      
      if (!docSnap.exists()) {
        const profileData = {
          uid: user.uid,
          email: user.email,
          displayName: nameOverride || user.displayName || user.email?.split('@')[0] || 'Visitor',
          photoURL: user.photoURL || '',
          role: decidedRole,
          createdAt: serverTimestamp()
        };
        await setDoc(userRef, profileData);
        console.log("Profile created securely in Firestore:", profileData);
      } else {
        // If they are registering or logging in as admin but metadata was different, let's update
        if (emailLower === 'mohamedsamysalmony@gmail.com' && docSnap.data().role !== 'admin') {
          await setDoc(userRef, { role: 'admin' }, { merge: true });
        }
      }
    } catch (err) {
      console.error("Error synchronizing profile details to database:", err);
    }
  };

  // Google Login popup workflow (as per guidelines preference)
  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    
    try {
      if (!isRealFirebase) {
        // Safe interactive sandbox response
        const dummyUser = {
          uid: "goog_sim_" + Date.now(),
          email: "mohamedsamysalmony@gmail.com",
          displayName: "Mohamed Samy Salmony",
          photoURL: ""
        };
        setSuccessMsg(language === 'ar' ? 'تم تسجيل الدخول بنجاح (وضع المحاكاة)!' : 'Logged in successfully (Sim Mode)!');
        setTimeout(() => {
          onSuccess(dummyUser);
        }, 1200);
        return;
      }

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      await syncUserProfile(user);
      
      setSuccessMsg(language === 'ar' ? 'تم تسجيل الدخول بجوجل بنجاح!' : 'Logged in with Google successfully!');
      setTimeout(() => {
        onSuccess(user);
      }, 1000);
      
    } catch (err: any) {
      console.error("Google authentication failed:", err);
      setErrorMsg(err.message || "Google auth returned a mismatch. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Standard form submissions
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg(language === 'ar' ? 'يرجى إكمال جميع الحقول.' : 'Please enter all fields.');
      setLoading(false);
      return;
    }

    if (mode === 'register' && !fullName) {
      setErrorMsg(language === 'ar' ? 'يرجى إدخال اسمك الكامل لتسجيل الحساب.' : 'Name is required to write account details.');
      setLoading(false);
      return;
    }

    try {
      if (!isRealFirebase) {
        // Safe interactive simulated auth sequence
        const simulatedUser = {
          uid: "sim_usr_" + Date.now(),
          email: email,
          displayName: fullName || email.split('@')[0],
          photoURL: ""
        };
        
        // Simulating writing to localStorage
        const simUsers = JSON.parse(localStorage.getItem('aat_sim_users') || '[]');
        simUsers.push(simulatedUser);
        localStorage.setItem('aat_sim_users', JSON.stringify(simUsers));
        
        setSuccessMsg(language === 'ar' ? 'تمت العملية بنجاح (وضع الأمن المحاكي)!' : 'Operation completed (Simulated Security)!');
        setTimeout(() => {
          onSuccess(simulatedUser);
        }, 1200);
        return;
      }

      if (mode === 'register') {
        const creds = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(creds.user, { displayName: fullName });
        await syncUserProfile(creds.user, fullName);
        setSuccessMsg(language === 'ar' ? 'تم إنشاء حسابك وتقييده بـ Firebase بنجاح!' : 'Account registered and securely synchronized in Firebase!');
        setTimeout(() => {
          onSuccess(creds.user);
        }, 1200);
      } else {
        const creds = await signInWithEmailAndPassword(auth, email, password);
        await syncUserProfile(creds.user);
        setSuccessMsg(language === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Successfully signed in!');
        setTimeout(() => {
          onSuccess(creds.user);
        }, 1000);
      }
    } catch (err: any) {
      console.error("Credentials authenticator failed:", err);
      let errorText = err.message;
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorText = language === 'ar' ? 'بيانات الاعتماد غير صالحة.' : 'Incorrect email or password combination.';
      } else if (err.code === 'auth/email-already-in-use') {
        errorText = language === 'ar' ? 'هذا البريد الإلكتروني مستخدم بالفعل.' : 'Email is already registered under another account.';
      }
      setErrorMsg(errorText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 pt-24 pb-12 relative">
      {/* Decorative premium space background glows */}
      <div className="absolute top-1/4 left-1/4 w-[35vw] h-[35vw] rounded-full bg-brand-teal/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] rounded-full bg-brand-blue/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-brand-navy-light/90 border border-brand-blue/20 rounded-3xl p-8 shadow-2xl relative backdrop-blur-md"
      >
        {/* Back Link button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 text-xs text-slate-400 hover:text-brand-teal flex items-center gap-1.5 transition-colors group cursor-pointer"
        >
          {language === 'ar' ? (
            <>
              <span>العودة للموقع</span>
              <ArrowLeft className="w-4 h-4 rotate-180 transition-transform group-hover:translate-x-1" />
            </>
          ) : (
            <>
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Site</span>
            </>
          )}
        </button>

        {/* Brand Header */}
        <div className="text-center mt-6 mb-8">
          <span className="text-[10px] tracking-widest font-bold text-brand-teal bg-brand-teal/10 border border-brand-teal/20 px-3 py-1 rounded-full uppercase inline-flex items-center gap-1.5 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('aboutUs.badge')} SAFE SYSTEM</span>
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {mode === 'login' 
              ? (language === 'ar' ? 'مرحباً بعودتك إلى AAT' : 'Welcome back to AAT Portal') 
              : (language === 'ar' ? 'إنشاء حساب جديد بـ AAT' : 'Join ASMA Advanced Technology')}
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            {mode === 'login'
              ? (language === 'ar' ? 'سجل دخولك لإدارة طلباتك ومتابعة أتمتة أعمالك' : 'Sign in to manage your leads or view admin statistics')
              : (language === 'ar' ? 'سجل معنا للولوج إلى بوابتنا الرقمية الآمنة لشركائنا بجميع أنحاء المملكة' : 'Enter details to claim your sovereign technology partner client dashboard')}
          </p>
        </div>

        {/* Global Feedback states banner */}
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs flex items-start gap-2.5"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </motion.div>
        )}

        {/* Standard Email Auth credentials form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'عبدالله الغامدي' : 'e.g. Faisal Al-Shammari'}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-brand-navy border border-brand-blue/15 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder="you@company.com.sa"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-brand-navy border border-brand-blue/15 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {language === 'ar' ? 'كلمة المرور' : 'Secure Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-brand-navy border border-brand-blue/15 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-brand-teal hover:bg-brand-teal-light text-brand-navy font-bold rounded-xl shadow-lg shadow-brand-teal/15 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="w-5 h-5 rounded-full border-2 border-brand-navy border-t-transparent animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>
                  {mode === 'login'
                    ? (language === 'ar' ? 'تسجيل الدخول الآمن' : 'Sign In')
                    : (language === 'ar' ? 'إنشاء حساب جديد' : 'Register Account')}
                </span>
              </>
            )}
          </button>
        </form>

        {/* Divider text lines */}
        <div className="relative flex items-center my-6">
          <div className="grow border-t border-brand-blue/10"></div>
          <span className="shrink-0 mx-4 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            {language === 'ar' ? 'أو سجل الدخول عبر' : 'Or integrate with'}
          </span>
          <div className="grow border-t border-brand-blue/10"></div>
        </div>

        {/* Google sign in button wrapper */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={loading}
          className="w-full py-3 border border-brand-blue/20 bg-brand-navy hover:bg-brand-blue/10 text-white font-medium rounded-xl flex items-center justify-center gap-2.5 transition-all text-sm cursor-pointer disabled:opacity-50"
        >
          <Chrome className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {mode === 'login'
              ? (language === 'ar' ? 'الولوج السريع بحساب Google' : 'Google Fast Sign In')
              : (language === 'ar' ? 'تسجيل فوري بحساب Google' : 'Instant Google Linkage')}
          </span>
        </button>

        {/* Sub-toggle link and switch */}
        <div className="text-center mt-6 text-xs text-slate-400">
          {mode === 'login' ? (
            <>
              <span>{language === 'ar' ? 'ليس لديك حساب حتى الآن؟' : 'New partner client?'} </span>
              <button
                onClick={() => setMode('register')}
                className="text-brand-teal hover:underline font-bold focus:outline-none pr-1 pl-1 cursor-pointer"
              >
                {language === 'ar' ? 'إنشاء حساب الآن' : 'Create an Account'}
              </button>
            </>
          ) : (
            <>
              <span>{language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already registered?'} </span>
              <button
                onClick={() => setMode('login')}
                className="text-brand-teal hover:underline font-bold focus:outline-none pr-1 pl-1 cursor-pointer"
              >
                {language === 'ar' ? 'تسجيل الدخول' : 'Sign in to Portal'}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
