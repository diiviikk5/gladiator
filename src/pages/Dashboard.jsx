import { useState, useEffect, useRef, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Zap, MapPin, Trophy, Clock, Brain, 
  Target, Play, ChevronRight, Swords
} from 'lucide-react';
import Navbar from '../components/Navbar';


const loadOrbitronFont = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
};


export default function Dashboard() {
  loadOrbitronFont();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const videoRef = useRef(null);


  const [hoveredMode, setHoveredMode] = useState(null);


  const playerStats = {
    username: user?.username || "PLAYER",
    level: 12,
    totalWins: 47,
    winStreak: 8,
    algorithmsLearned: 23,
    playtime: "8h 32m"
  };


  // Ensure video loops continuously and plays properly
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;


    // Set up video properties for better playback
    video.muted = true;
    video.playsInline = true;


    const playVideo = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => console.log('Autoplay blocked:', err));
      }
    };


    // Try to play immediately
    playVideo();


    // Handle ended event for looping
    const handleEnded = () => {
      video.currentTime = 0;
      playVideo();
    };


    // Force play if paused
    const checkPlayback = setInterval(() => {
      if (video.paused && !video.seeking) {
        playVideo();
      }
    }, 2000);


    video.addEventListener('ended', handleEnded);
    document.addEventListener('visibilitychange', playVideo);


    return () => {
      video.removeEventListener('ended', handleEnded);
      document.removeEventListener('visibilitychange', playVideo);
      clearInterval(checkPlayback);
    };
  }, []);


  const gameModes = [
    {
      id: 'duel',
      title: 'DUEL',
      icon: Swords,
      color: 'cyan',
      borderColor: '#06b6d4',
      description: '1v1 Real-time typing battles. Ace typing speed & MCQs to win.',
      features: ['Real-time multiplayer', 'Speed typing challenges', 'DSA MCQs'],
      buttonText: 'FIND OPPONENT',
      delay: 0.6,
      isNew: true,
      path: '/duel'
    },
    {
      id: 'roulette',
      title: 'ROULETTE',
      icon: Target,
      color: 'red',
      borderColor: '#ef4444',
      description: 'Risk & deduction. Use algorithms to survive.',
      features: ['Tension-based gameplay', 'Strategic algorithm items', '4 difficulty levels'],
      buttonText: 'PLAY NOW',
      delay: 0.65,
      isNew: false,
      path: '/roulette'
    },
    {
      id: 'arena',
      title: 'ARENA',
      icon: Swords,
      color: 'purple',
      borderColor: '#a855f7',
      description: 'QTE battles. Perfect timing. Algorithm moves.',
      features: ['Real-time QTE combat', 'Algorithm-based attacks', '4 challenging AI bosses'],
      buttonText: 'BATTLE NOW',
      delay: 0.7,
      isNew: true,
      path: '/arena'
    },
    {
      id: 'blitz',
      title: 'BLITZ',
      icon: Zap,
      color: 'emerald',
      borderColor: '#10b981',
      description: 'Fast races. Build algorithms visually.',
      features: ['Drag-and-drop builder', 'Real-time racing', 'Progressive difficulty'],
      buttonText: 'START NOW',
      delay: 0.75,
      isNew: false,
      path: '/play'
    },
    {
      id: 'colony',
      title: 'COLONY',
      icon: MapPin,
      color: 'amber',
      borderColor: '#f59e0b',
      description: 'Manage. Discover. Survive.',
      features: ['Procedural generation', 'Algorithm discovery', 'Survival mechanics'],
      buttonText: 'VIEW CONCEPT',
      delay: 0.8,
      isNew: false,
      path: '/colony',
      isPreview: true
    }
  ];


  return (
    <>
      <Navbar />
      <div className="min-h-screen text-white relative overflow-hidden bg-black">
        
        {/* ==================== VIDEO BACKGROUND ==================== */}
        <div className="fixed inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              filter: 'brightness(0.65) contrast(1.3) saturate(1.0)',
            }}
          >
            <source src="/dbvid.mp4" type="video/mp4" />
          </video>


          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
          
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%)'
            }}
          />
        </div>


        {/* ==================== CONTENT ==================== */}
        <div className="relative z-10 px-6 py-12 max-w-7xl mx-auto w-full">
          
          {/* Hero Section */}
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            {/* Username Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-10 px-12 py-8 rounded-3xl bg-black/90 backdrop-blur-xl border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/20"
            >
              <div className="mb-3">
                <span 
                  className="text-xs font-bold tracking-[0.3em] text-emerald-400"
                  style={{ fontFamily: 'Orbitron, sans-serif' }}
                >
                  // WELCOME_BACK
                </span>
              </div>


              <h1 
                className="text-6xl md:text-8xl font-black mb-4"
                style={{ 
                  fontFamily: 'Orbitron, sans-serif',
                  background: 'linear-gradient(135deg, #10B981, #F59E0B, #10B981)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'gradient 4s ease infinite',
                  textShadow: '0 0 80px rgba(16, 185, 129, 0.5)'
                }}
              >
                {playerStats.username}
              </h1>


              <p className="text-lg md:text-xl text-gray-200">
                Choose your path to algorithmic mastery
              </p>
            </motion.div>


            {/* Stats Bar - Better Spacing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center gap-4 md:gap-8 text-sm flex-wrap mb-8"
            >
              {[
                { icon: Trophy, label: 'Level', value: playerStats.level, color: 'amber' },
                { icon: Target, label: 'Wins', value: playerStats.totalWins, color: 'emerald' },
                { icon: Zap, label: 'Streak', value: playerStats.winStreak, color: 'yellow' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 rounded-2xl bg-black/85 backdrop-blur-xl border-2 border-white/20 shadow-xl hover:border-white/40 transition-colors"
                >
                  <stat.icon className={`w-5 h-5 md:w-6 md:h-6 text-${stat.color}-400`} style={{ filter: 'drop-shadow(0 0 8px currentColor)' }} />
                  <div>
                    <div className="text-gray-300 text-xs font-medium">{stat.label}</div>
                    <div className="text-white font-black text-lg md:text-xl" style={{ fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>
                      {stat.value}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>


          {/* Game Modes Section */}
          <section className="mb-20">
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-3xl md:text-4xl font-black mb-16 text-center"
              style={{ 
                fontFamily: 'Orbitron, sans-serif',
                textShadow: '0 0 30px rgba(16, 185, 129, 0.6), 0 0 60px rgba(245, 158, 11, 0.4)'
              }}
            >
              <span className="bg-gradient-to-r from-emerald-400 via-amber-400 to-emerald-400 bg-clip-text text-transparent">
                SELECT GAME MODE
              </span>
            </motion.h2>


            {/* Game Mode Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 auto-rows-max">
              {gameModes.map((mode) => {
                const Icon = mode.icon;
                const isHovered = hoveredMode === mode.id;
                
                return (
                  <motion.div
                    key={mode.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: mode.delay, type: 'spring', stiffness: 300 }}
                    onMouseEnter={() => setHoveredMode(mode.id)}
                    onMouseLeave={() => setHoveredMode(null)}
                    onClick={() => navigate(mode.path)}
                    className="relative group cursor-pointer h-full"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, y: -8 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="relative p-6 md:p-8 rounded-3xl border-3 bg-black/90 backdrop-blur-xl overflow-hidden h-full flex flex-col"
                      style={{
                        borderColor: isHovered ? mode.borderColor : `${mode.borderColor}50`,
                        boxShadow: isHovered 
                          ? `0 25px 80px ${mode.borderColor}99, inset 0 0 60px ${mode.borderColor}1a` 
                          : '0 10px 40px rgba(0, 0, 0, 0.5)'
                      }}
                    >
                      {/* Animated Glow */}
                      <motion.div
                        className="absolute inset-0 rounded-3xl opacity-0"
                        animate={{
                          opacity: isHovered ? [0.3, 0.6, 0.3] : 0
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{
                          background: `radial-gradient(circle at 50% 0%, ${mode.borderColor}66, transparent 70%)`
                        }}
                      />


                      {/* Badges */}
                      {(mode.isNew || mode.isPreview) && (
                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black text-white z-20 shadow-lg"
                          style={{ 
                            background: mode.borderColor,
                            boxShadow: `0 0 20px ${mode.borderColor}`
                          }}
                        >
                          {mode.isNew ? 'NEW' : 'PREVIEW'}
                        </div>
                      )}


                      <div className="relative z-10 flex flex-col h-full">
                        {/* Icon */}
                        <motion.div
                          className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-3 flex items-center justify-center mb-4 md:mb-6 backdrop-blur-sm"
                          style={{
                            borderColor: mode.borderColor,
                            background: `${mode.borderColor}4d`,
                            boxShadow: `0 0 30px ${mode.borderColor}80`
                          }}
                          animate={isHovered ? { rotate: 360, scale: [1, 1.1, 1] } : { rotate: 0 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Icon className="w-8 h-8 md:w-10 md:h-10" style={{ color: mode.borderColor, filter: `drop-shadow(0 0 10px ${mode.borderColor})` }} />
                        </motion.div>


                        {/* Title */}
                        <h3 
                          className="text-3xl md:text-4xl font-black mb-2 md:mb-4"
                          style={{ 
                            fontFamily: 'Orbitron, sans-serif',
                            color: mode.borderColor,
                            textShadow: `0 0 20px ${mode.borderColor}99`
                          }}
                        >
                          {mode.title}
                        </h3>


                        {/* Description */}
                        <p className="text-gray-200 mb-4 md:mb-6 text-xs md:text-sm leading-relaxed font-medium flex-grow">
                          {mode.description}
                        </p>


                        {/* Features */}
                        <div className="space-y-1 md:space-y-2 mb-4 md:mb-6">
                          {mode.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-gray-300 font-medium">
                              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: mode.borderColor, boxShadow: `0 0 8px ${mode.borderColor}` }} />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>


                        {/* Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full py-3 md:py-4 rounded-xl font-bold text-sm md:text-base flex items-center justify-center gap-2 shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${mode.borderColor}, ${mode.borderColor}cc)`,
                            boxShadow: `0 10px 30px ${mode.borderColor}66`,
                            fontFamily: 'Orbitron, sans-serif'
                          }}
                        >
                          <Play className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" />
                          {mode.buttonText}
                          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </section>


          {/* Progress Stats */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
            >
              <h3 
                className="text-3xl md:text-4xl font-black mb-12 text-center"
                style={{ 
                  fontFamily: 'Orbitron, sans-serif',
                  textShadow: '0 0 30px rgba(16, 185, 129, 0.6), 0 0 60px rgba(245, 158, 11, 0.4)'
                }}
              >
                <span className="bg-gradient-to-r from-emerald-400 via-amber-400 to-emerald-400 bg-clip-text text-transparent">
                  YOUR PROGRESS
                </span>
              </h3>


              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[
                  { icon: Brain, label: 'Algorithms', value: playerStats.algorithmsLearned, color: 'emerald', glow: '#10b981' },
                  { icon: Trophy, label: 'Total Wins', value: playerStats.totalWins, color: 'amber', glow: '#f59e0b' },
                  { icon: Zap, label: 'Win Streak', value: playerStats.winStreak, color: 'yellow', glow: '#eab308' },
                  { icon: Clock, label: 'Playtime', value: playerStats.playtime, color: 'blue', glow: '#3b82f6' }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                    whileHover={{ y: -8, scale: 1.05 }}
                    className="p-4 md:p-6 rounded-2xl border-2 bg-black/90 backdrop-blur-xl text-center shadow-xl"
                    style={{ 
                      borderColor: `${stat.glow}50`,
                      boxShadow: `0 10px 40px ${stat.glow}20`
                    }}
                  >
                    <stat.icon 
                      className={`w-8 h-8 md:w-10 md:h-10 text-${stat.color}-400 mx-auto mb-3 md:mb-4`} 
                      style={{ filter: `drop-shadow(0 0 12px ${stat.glow})` }}
                    />
                    <div 
                      className="text-3xl md:text-4xl font-black text-white mb-1 md:mb-2"
                      style={{ 
                        fontFamily: 'Orbitron, sans-serif',
                        textShadow: `0 0 15px ${stat.glow}80`
                      }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-gray-300 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>
        </div>


        {/* Gradient Animation */}
        <style jsx>{`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </div>
    </>
  );
}
