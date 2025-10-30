import { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Play, ChevronDown, Users, Trophy, Flame,
  Target, Brain, Download, Zap, MapPin,
  Twitter, MessageSquare, Github, Sparkles, Code, Box, LogIn, X, Mail, Lock, User
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const loadOrbitronFont = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
};

const HeroBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.7) contrast(1.1) saturate(1.2)' }}
      >
        <source src="/teaser.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
    </div>
  );
};

const HeroParticles = ({ count = 20 }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: i % 2 === 0 ? '#10B981' : '#F59E0B',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

const RevealOnScroll = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  
  return (
    <div ref={ref}>
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
        transition={{ duration: 0.6, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 150);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
    >
      <video
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      >
        <source src="/teaser.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/70" />
      
      <div className="relative z-10 text-center">
        <motion.div
          className="w-24 h-24 mx-auto mb-6 relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-full h-full rounded-full border-4 border-emerald-500/50 border-t-emerald-500 absolute" />
          <Code className="w-12 h-12 text-white absolute inset-0 m-auto" />
        </motion.div>
        
        <h2 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-2xl font-bold mb-4 text-emerald-400">
          LOADING GAME
        </h2>
        
        <div className="w-80 h-2 bg-gray-900 rounded-full mx-auto overflow-hidden border border-emerald-500/30">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        
        <p style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-emerald-400 mt-3 text-lg font-bold">
          {Math.floor(progress)}%
        </p>
      </div>
    </motion.div>
  );
};

// LOGIN FORM COMPONENT
// LOGIN FORM COMPONENT WITH GOOGLE AUTH
const LoginForm = ({ onClose }) => {
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        result = await register(formData.email, formData.password, formData.username);
      }

      if (result.success) {
        onClose();
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred');
    }
    
    setLoading(false);
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
      const { doc, setDoc, getDoc } = await import('firebase/firestore');
      const { auth, db } = await import('../config/firebase');

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          username: user.displayName || user.email.split('@')[0],
          photoURL: user.photoURL || '',
          stats: {
            wins: 0,
            losses: 0,
            totalMatches: 0,
            winStreak: 0,
            maxWinStreak: 0,
            totalPoints: 0,
            coins: 100,
            elo: 1200,
            algorithmsLearned: 0,
            playtime: 0
          },
          achievements: {
            firstWin: false,
            tenWins: false,
            fiftyWins: false,
            winStreak5: false,
            perfectGame: false,
            speedRunner: false
          },
          createdAt: new Date(),
          lastLogin: new Date(),
          authProvider: 'google'
        });
      }

      onClose();
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError(error.message || 'Google sign-in failed');
    }

    setGoogleLoading(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-gray-900 border-2 border-cyan-500/30 rounded-2xl p-8 space-y-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-3xl font-black text-cyan-400">
          {isLogin ? 'LOGIN' : 'SIGN UP'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      {/* Tab Switch */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setIsLogin(true);
            setError('');
          }}
          className={`flex-1 py-2 rounded-lg font-bold transition-all ${
            isLogin 
              ? 'bg-cyan-500 text-white' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          LOGIN
        </button>
        <button
          type="button"
          onClick={() => {
            setIsLogin(false);
            setError('');
          }}
          className={`flex-1 py-2 rounded-lg font-bold transition-all ${
            !isLogin 
              ? 'bg-cyan-500 text-white' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          SIGN UP
        </button>
      </div>

      {/* Username (Register Only) */}
      {!isLogin && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="relative"
        >
          <User className="absolute left-3 top-3.5 w-5 h-5 text-cyan-400" />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required={!isLogin}
            className="w-full pl-10 pr-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
          />
        </motion.div>
      )}

      {/* Email */}
      <div className="relative">
        <Mail className="absolute left-3 top-3.5 w-5 h-5 text-cyan-400" />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full pl-10 pr-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
        />
      </div>

      {/* Password */}
      <div className="relative">
        <Lock className="absolute left-3 top-3.5 w-5 h-5 text-cyan-400" />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full pl-10 pr-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
        />
      </div>

      {/* Confirm Password (Register Only) */}
      {!isLogin && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="relative"
        >
          <Lock className="absolute left-3 top-3.5 w-5 h-5 text-cyan-400" />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required={!isLogin}
            className="w-full pl-10 pr-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
          />
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-lg bg-red-500/20 border border-red-500 text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-bold text-lg disabled:opacity-50"
        style={{ fontFamily: 'Orbitron, sans-serif' }}
      >
        {loading ? 'Loading...' : isLogin ? 'LOGIN' : 'SIGN UP'}
      </motion.button>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-700" />
        <span className="text-gray-500 text-sm">OR</span>
        <div className="flex-1 h-px bg-gray-700" />
      </div>

      {/* Google Sign-In Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="w-full py-3 bg-white text-black rounded-lg font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 hover:bg-gray-100 transition-all"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {googleLoading ? 'Connecting...' : 'Continue with Google'}
      </motion.button>
    </motion.form>
  );
};


function Landing() {
  loadOrbitronFont();
  
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [glitchText, setGlitchText] = useState('Algo Gladiator');
  const titleRef = useRef(null);
  const heroRef = useRef(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const original = 'ALGO Gladiator';
    const glitchChars = ['A', 'L', 'G', 'O', ' ', 'C', 'O', 'L', 'O', 'N', 'Y', '█', '▓', '░'];
    
    const interval = setInterval(() => {
      if (Math.random() > 0.96) {
        const glitched = original.split('').map(char => 
          Math.random() > 0.8 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char
        ).join('');
        setGlitchText(glitched);
        setTimeout(() => setGlitchText(original), 80);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    if (!isLoading) {
      gsap.from(titleRef.current, {
        duration: 1.2,
        scale: 0.8,
        opacity: 0,
        ease: 'back.out(1.4)',
        delay: 0.2
      });

      gsap.to(heroRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        opacity: 0,
        scale: 0.95,
      });

      gsap.utils.toArray('.feature-card').forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top bottom-=100',
          },
          y: 80,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.15,
        });
      });

      gsap.utils.toArray('.benefit-card').forEach((card) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top bottom-=50',
          },
          y: 60,
          opacity: 0,
          duration: 0.8,
        });
      });
    }
  }, [isLoading]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* HERO SECTION */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <HeroBackground />
        <HeroParticles />
        
        <div className="relative z-20">
          <div ref={titleRef} className="mb-6">
            <h1 
              style={{ 
                fontFamily: 'Orbitron, sans-serif',
                background: 'linear-gradient(135deg, #10B981, #F59E0B, #34D399)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 40px rgba(16, 185, 129, 0.3)',
                animation: 'gradient 4s ease infinite'
              }}
              className="text-6xl md:text-8xl font-black tracking-wide mb-3"
            >
              {glitchText}
            </h1>
            
            <motion.div 
              className="h-1 w-80 mx-auto rounded-full bg-gradient-to-r from-emerald-500 to-amber-500" 
              style={{ boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)' }}
              animate={{ boxShadow: ['0 0 20px rgba(16, 185, 129, 0.5)', '0 0 30px rgba(245, 158, 11, 0.6)', '0 0 20px rgba(16, 185, 129, 0.5)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: 'Orbitron, sans-serif' }}
            className="text-3xl md:text-4xl font-bold mb-4 text-emerald-400"
          >
            LEARN ALGORITHMS THROUGH GAMEPLAY
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Two unique game modes. One mission: Master algorithms by actually using them.
            <br/>Fast-paced battles or deep colony management - you choose.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              onClick={() => setShowLoginModal(true)}
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(16, 185, 129, 0.6)' }}
              whileTap={{ scale: 0.95 }}
              style={{ fontFamily: 'Orbitron, sans-serif' }}
              className="px-10 py-4 text-lg font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30 flex items-center gap-3 mx-auto sm:mx-0 hover:from-emerald-600 hover:to-emerald-700 transition-all"
            >
              <Play className="w-5 h-5" fill="currentColor" />
              PLAY NOW
            </motion.button>

            <motion.button
              onClick={() => setShowLoginModal(true)}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              style={{ fontFamily: 'Orbitron, sans-serif' }}
              className="px-10 py-4 text-lg font-bold rounded-xl bg-transparent border-2 border-cyan-500 text-cyan-400 shadow-lg shadow-cyan-500/20 flex items-center gap-3 mx-auto sm:mx-0 hover:bg-cyan-500/10 transition-all"
            >
              <LogIn className="w-5 h-5" />
              LOGIN
            </motion.button>
          </motion.div>

          {/* LOGIN MODAL */}
          <AnimatePresence>
            {showLoginModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                onClick={() => setShowLoginModal(false)}
              >
                <div onClick={(e) => e.stopPropagation()}>
                  <LoginForm onClose={() => setShowLoginModal(false)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-emerald-400"
          >
            <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-xs mb-2">SCROLL</span>
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </section>

      {/* REST OF PAGE */}
      <div className="relative bg-black">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(16, 185, 129, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(245, 158, 11, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />

        {/* GAME MODES */}
        <section className="relative py-32 px-6 z-10">
          <div className="max-w-7xl mx-auto">
            <RevealOnScroll>
              <div className="text-center mb-20">
                <motion.div
                  className="inline-block px-6 py-2 mb-6 rounded-full border border-emerald-500/30"
                  style={{ background: 'rgba(16, 185, 129, 0.05)' }}
                >
                  <span style={{ 
                    fontFamily: 'Orbitron, sans-serif',
                    background: 'linear-gradient(135deg, #10B981, #F59E0B)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }} className="text-sm font-bold tracking-widest">
                    // TWO_GAME_MODES
                  </span>
                </motion.div>
                
                <h2 style={{ 
                  fontFamily: 'Orbitron, sans-serif',
                  background: 'linear-gradient(135deg, #10B981, #F59E0B)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }} className="text-5xl md:text-6xl font-black mb-6">
                  CHOOSE YOUR PATH
                </h2>
                
                <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                  Competitive algorithm races or strategic colony survival.
                  Both teach the same concepts - just different playstyles.
                </p>
              </div>
            </RevealOnScroll>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: Zap,
                  title: 'BLITZ MODE',
                  subtitle: 'Fast-Paced Algorithm Battles',
                  description: 'Build sorting algorithms by dragging blocks. Race against AI. Fastest correct algorithm wins. Learn QuickSort, MergeSort, and more through competitive gameplay.',
                  points: ['Drag-and-drop algorithm builder', 'Real-time execution visualization', 'HP-based battle system', 'Progressive difficulty AI']
                },
                {
                  icon: MapPin,
                  title: 'COLONY MODE',
                  subtitle: 'RimWorld-Style Strategy',
                  description: 'Manage a colony on Algorithm Planet. Explore procedurally generated worlds. Discover algorithm books in ancient ruins. Build structures that require algorithmic knowledge.',
                  points: ['Procedural world generation', 'Discovery-based learning', 'Colonist management & needs', 'Dynamic random events']
                }
              ].map((mode, i) => (
                <RevealOnScroll key={i} delay={i * 0.15}>
                  <motion.div
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="feature-card relative p-8 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-transparent to-amber-500/5 overflow-hidden group"
                  >
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(245, 158, 11, 0.1))',
                        boxShadow: 'inset 0 0 60px rgba(16, 185, 129, 0.1)'
                      }}
                    />

                    <div className="relative z-10">
                      <motion.div 
                        className="w-16 h-16 rounded-xl border border-emerald-500/30 flex items-center justify-center mb-6"
                        style={{ background: 'rgba(16, 185, 129, 0.1)' }}
                        whileHover={{ 
                          boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)',
                          scale: 1.1 
                        }}
                      >
                        <mode.icon className="w-8 h-8 text-emerald-400" />
                      </motion.div>

                      <h3 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-2xl font-black text-white mb-2">
                        {mode.title}
                      </h3>
                      
                      <p style={{ 
                        fontFamily: 'Orbitron, sans-serif',
                        background: 'linear-gradient(135deg, #10B981, #F59E0B)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }} className="text-sm mb-4 font-bold">
                        {mode.subtitle}
                      </p>
                      
                      <p className="text-gray-300 leading-relaxed mb-6">
                        {mode.description}
                      </p>

                      <div className="space-y-2">
                        {mode.points.map((point, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-amber-400" />
                            <span className="text-gray-400">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* WHY PLAY */}
        <section className="relative py-32 px-6 z-10 border-t border-emerald-500/10">
          <div className="max-w-7xl mx-auto">
            <RevealOnScroll>
              <div className="text-center mb-20">
                <h2 style={{ 
                  fontFamily: 'Orbitron, sans-serif',
                  background: 'linear-gradient(135deg, #10B981, #F59E0B)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }} className="text-5xl md:text-6xl font-black mb-6">
                  WHY ALGO DUEL?
                </h2>
                <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                  Stop grinding LeetCode in isolation. Start learning algorithms through gameplay.
                </p>
              </div>
            </RevealOnScroll>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Brain, title: 'Active Learning', description: 'Use algorithms in context. Build, discover, apply - not just memorize syntax.' },
                { icon: Target, title: 'Clear Objectives', description: 'Complete missions. Survive events. Build structures. Always know what to do next.' },
                { icon: Sparkles, title: 'Instant Feedback', description: 'See your algorithm execute in real-time. Understand complexity through gameplay.' },
                { icon: Trophy, title: 'Actually Fun', description: 'Engaging gameplay that happens to teach CS fundamentals. No boring lectures.' }
              ].map((benefit, i) => (
                <RevealOnScroll key={i} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ x: 10, boxShadow: '0 10px 40px rgba(16, 185, 129, 0.15)' }}
                    className="benefit-card flex gap-6 p-6 rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-transparent"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-lg border border-emerald-500/30 flex items-center justify-center"
                        style={{ background: 'rgba(16, 185, 129, 0.1)' }}
                      >
                        <benefit.icon className="w-7 h-7 text-emerald-400" />
                      </div>
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-xl font-bold text-white mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="relative py-20 px-6 z-10 border-t border-emerald-500/10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: '3+', label: 'Game Modes', icon: Box },
                { value: '500+', label: 'DSA Questions', icon: Code },
                { value: 'LIVE', label: 'Multiplayer', icon: Flame },
                { value: '100%', label: 'Educational', icon: Brain },
              ].map((stat, i) => (
                <RevealOnScroll key={i} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -5, boxShadow: '0 10px 40px rgba(16, 185, 129, 0.2)' }}
                    className="text-center p-6 rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-amber-500/5"
                  >
                    <stat.icon className="w-10 h-10 mx-auto mb-3 text-emerald-400" />
                    <div style={{ 
                      fontFamily: 'Orbitron, sans-serif',
                      background: 'linear-gradient(135deg, #10B981, #F59E0B)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }} className="text-3xl font-black mb-1">
                      {stat.value}
                    </div>
                    <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-sm text-gray-400">
                      {stat.label}
                    </div>
                  </motion.div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-32 px-6 z-10 border-t border-emerald-500/10">
          <div className="max-w-4xl mx-auto text-center">
            <RevealOnScroll>
              <h2 style={{ 
                fontFamily: 'Orbitron, sans-serif',
                background: 'linear-gradient(135deg, #10B981, #F59E0B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }} className="text-5xl md:text-6xl font-black mb-6">
                READY TO START?
              </h2>
              <p className="text-gray-400 text-lg mb-10">
                Join thousands learning DSA through competitive gameplay.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={() => setShowLoginModal(true)}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(16, 185, 129, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{ fontFamily: 'Orbitron, sans-serif' }}
                  className="px-14 py-5 text-xl font-black rounded-xl bg-gradient-to-r from-emerald-500 to-amber-500 shadow-xl hover:from-emerald-600 hover:to-amber-600 transition-all"
                >
                  PLAY NOW
                </motion.button>

                <motion.button
                  onClick={() => setShowLoginModal(true)}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(6, 182, 212, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{ fontFamily: 'Orbitron, sans-serif' }}
                  className="px-14 py-5 text-xl font-black rounded-xl bg-transparent border-2 border-cyan-500 text-cyan-400 shadow-xl hover:bg-cyan-500/10 transition-all"
                >
                  SIGN UP
                </motion.button>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="relative py-12 px-6 z-10 border-t border-emerald-500/10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 style={{ 
                  fontFamily: 'Orbitron, sans-serif',
                  background: 'linear-gradient(135deg, #10B981, #F59E0B)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }} className="text-2xl font-black mb-2">
                  ALGO DUEL
                </h3>
                <p className="text-sm text-gray-400">Learn algorithms through competitive gameplay</p>
              </div>
              
              <div className="flex gap-4">
                {[Twitter, MessageSquare, Github].map((Icon, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="p-3 border border-emerald-500/20 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-colors"
                  >
                    <Icon className="w-5 h-5 text-emerald-400" />
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-emerald-500/10 text-center text-xs text-gray-500" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              © 2025 ALGO DUEL - Learn. Compete. Master.
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

export default Landing;
