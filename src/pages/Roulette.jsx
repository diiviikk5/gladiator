import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Target, Home, Activity, Info, Sparkles, 
  TrendingUp, Clock, Shield, Brain, Zap
} from 'lucide-react';
import { useRouletteGame } from '../game/rouletteHooks';
import { ROUND_TYPES, ITEMS, AI_LEVELS, TOOLTIPS } from '../game/rouletteData';

// Load Orbitron font
const loadOrbitronFont = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
};

export default function Roulette() {
  loadOrbitronFont();
  const navigate = useNavigate();
  
  const {
    gamePhase,
    difficulty,
    round,
    chamber,
    currentIndex,
    playerHP,
    aiHP,
    playerItems,
    aiItems,
    turn,
    knownInfo,
    revealedNext,
    gameLog,
    wins,
    losses,
    shootingAnimation,
    targetSelf,
    damageFlash,
    itemAnimation,
    startGame,
    shoot,
    useItem,
    setGamePhase,
    setRound
  } = useRouletteGame();

  // ==================== MENU SCREEN ====================
  if (gamePhase === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900/20 text-white flex items-center justify-center overflow-hidden relative">
        
        {/* Cinematic Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.15)_0%,transparent_70%)]" />
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-px rounded-full bg-red-500"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -200, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-6xl px-6">
          {/* Animated Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, type: 'spring', bounce: 0.5 }}
            className="mb-12"
          >
            <motion.div
              animate={{ 
                rotate: 360,
                boxShadow: [
                  '0 0 20px rgba(239, 68, 68, 0.3)',
                  '0 0 60px rgba(239, 68, 68, 0.6)',
                  '0 0 20px rgba(239, 68, 68, 0.3)'
                ]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                boxShadow: { duration: 2, repeat: Infinity }
              }}
              className="w-48 h-48 rounded-full border-4 border-red-500/30 bg-gradient-to-br from-red-500/20 to-transparent mx-auto flex items-center justify-center backdrop-blur-sm"
            >
              <Target className="w-24 h-24 text-red-400" strokeWidth={1.5} />
            </motion.div>
          </motion.div>

          {/* Title with Glitch Effect */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h1
              style={{ 
                fontFamily: 'Orbitron, sans-serif',
                background: 'linear-gradient(135deg, #ef4444, #dc2626, #ef4444)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 80px rgba(239, 68, 68, 0.5)'
              }}
              className="text-9xl font-black mb-4 tracking-tight"
            >
              ALGORITHM
            </h1>
            <h2
              style={{ 
                fontFamily: 'Orbitron, sans-serif',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
              className="text-7xl font-black mb-8"
            >
              ROULETTE
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed"
          >
            One chamber. Eight test cases. Infinite tension.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-lg text-gray-500 mb-16 italic"
          >
            Use algorithm knowledge to survive. Every choice matters.
          </motion.p>

          {/* Difficulty Selection */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="space-y-6 mb-8"
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-red-500/50" />
              <h3 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-2xl text-red-400 font-bold tracking-wider">
                CHOOSE YOUR FATE
              </h3>
              <div className="h-px w-24 bg-gradient-to-l from-transparent to-red-500/50" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {Object.entries(AI_LEVELS).map(([key, level], i) => (
                <motion.button
                  key={key}
                  initial={{ x: i % 2 === 0 ? -100 : 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.7 + i * 0.15, type: 'spring' }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startGame(key)}
                  className="relative p-8 rounded-2xl border-2 transition-all group overflow-hidden"
                  style={{ 
                    borderColor: `${level.color}40`,
                    background: `linear-gradient(135deg, ${level.color}10, transparent)`
                  }}
                >
                  {/* Animated background on hover */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: `radial-gradient(circle at center, ${level.color}20, transparent)`
                    }}
                  />
                  
                  <div className="relative z-10">
                    {/* Difficulty Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span 
                        style={{ fontFamily: 'Orbitron, sans-serif', color: level.color }}
                        className="text-3xl font-black"
                      >
                        {level.name}
                      </span>
                      <div 
                        className="px-3 py-1 rounded-full border text-xs font-bold"
                        style={{ 
                          borderColor: level.color,
                          color: level.color,
                          background: `${level.color}20`
                        }}
                      >
                        {key}
                      </div>
                    </div>

                    <p className="text-gray-400 text-left mb-4 text-sm">
                      {level.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="p-2 rounded bg-black/30">
                        <div className="text-gray-500 mb-1">HP</div>
                        <div className="font-bold" style={{ color: level.color }}>{level.hp}</div>
                      </div>
                      <div className="p-2 rounded bg-black/30">
                        <div className="text-gray-500 mb-1">IQ</div>
                        <div className="font-bold" style={{ color: level.color }}>
                          {Math.floor(level.deductionAccuracy * 100)}%
                        </div>
                      </div>
                      <div className="p-2 rounded bg-black/30">
                        <div className="text-gray-500 mb-1">Aggro</div>
                        <div className="font-bold" style={{ color: level.color }}>
                          {Math.floor(level.aggressiveness * 100)}%
                        </div>
                      </div>
                    </div>

                    {/* Hover Arrow */}
                    <motion.div
                      className="mt-4 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: level.color }}
                    >
                      <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-sm font-bold">
                        ENTER
                      </span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        →
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Educational Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="mt-12 p-6 rounded-xl border border-blue-500/20 bg-blue-500/5 max-w-3xl mx-auto"
          >
            <div className="flex items-start gap-4">
              <Info className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div className="text-left">
                <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-blue-400 font-bold mb-2">
                  How Algorithm Roulette Teaches CS
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Each item represents a real algorithm concept. <span className="text-emerald-400">Binary Search</span> divides possibilities, 
                  <span className="text-purple-400"> QuickSort</span> partitions data, <span className="text-cyan-400">Hash Tables</span> provide instant lookup. 
                  You'll learn complexity theory, probability, and deduction through gameplay.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="mt-8 px-8 py-4 border-2 border-gray-700 rounded-xl hover:border-red-500/50 transition-all flex items-center gap-3 mx-auto backdrop-blur-sm"
          >
            <Home className="w-5 h-5" />
            <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="font-bold">
              Back to Dashboard
            </span>
          </motion.button>
        </div>
      </div>
    );
  }

  // ==================== CONTINUE IN NEXT MESSAGE ====================
  // ==================== ROUND START SCREEN ====================
  if (gamePhase === 'roundStart') {
    const blanks = chamber.filter(r => r.id === 'blank').length;
    const lives = chamber.filter(r => r.id === 'live').length;
    const criticals = chamber.filter(r => r.id === 'critical').length;

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
        {/* Dramatic Background */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 30% 50%, rgba(239, 68, 68, 0.3), transparent 50%)',
              'radial-gradient(circle at 70% 50%, rgba(239, 68, 68, 0.3), transparent 50%)',
              'radial-gradient(circle at 30% 50%, rgba(239, 68, 68, 0.3), transparent 50%)'
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="relative z-10 text-center"
        >
          {/* Round Number */}
          <motion.div
            animate={{ 
              textShadow: [
                '0 0 20px rgba(239, 68, 68, 0.5)',
                '0 0 80px rgba(239, 68, 68, 0.8)',
                '0 0 20px rgba(239, 68, 68, 0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <h1
              style={{ 
                fontFamily: 'Orbitron, sans-serif',
                background: 'linear-gradient(135deg, #ef4444, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
              className="text-[12rem] font-black mb-8 leading-none"
            >
              R{round}
            </h1>
          </motion.div>

          {/* Chamber Composition */}
          <div className="space-y-6 text-3xl">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
                {ROUND_TYPES.BLANK.icon && <ROUND_TYPES.BLANK.icon className="w-8 h-8 text-emerald-400" />}
              </div>
              <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="font-bold text-emerald-400">
                {blanks} PASS
              </span>
            </motion.div>

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-6"
            >
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center">
                {ROUND_TYPES.LIVE.icon && <ROUND_TYPES.LIVE.icon className="w-8 h-8 text-amber-400" />}
              </div>
              <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="font-bold text-amber-400">
                {lives} FAIL
              </span>
            </motion.div>

            {criticals > 0 && (
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-center justify-center gap-6"
              >
                <div className="w-16 h-16 rounded-full bg-red-600/20 border-2 border-red-600 flex items-center justify-center">
                  {ROUND_TYPES.CRITICAL.icon && <ROUND_TYPES.CRITICAL.icon className="w-8 h-8 text-red-500" />}
                </div>
                <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="font-bold text-red-500">
                  {criticals} CRITICAL
                </span>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{ fontFamily: 'Orbitron, sans-serif' }}
            className="mt-12 text-xl text-gray-400"
          >
            Loading chamber...
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ==================== GAME OVER SCREEN ====================
  if (gamePhase === 'gameOver') {
    const won = playerHP > 0;
    const aiLevel = AI_LEVELS[difficulty];

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
        {/* Victory/Defeat Background */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: won
              ? [
                  'radial-gradient(circle at center, rgba(16, 185, 129, 0.2), transparent 70%)',
                  'radial-gradient(circle at center, rgba(16, 185, 129, 0.4), transparent 70%)',
                  'radial-gradient(circle at center, rgba(16, 185, 129, 0.2), transparent 70%)'
                ]
              : [
                  'radial-gradient(circle at center, rgba(239, 68, 68, 0.2), transparent 70%)',
                  'radial-gradient(circle at center, rgba(239, 68, 68, 0.4), transparent 70%)',
                  'radial-gradient(circle at center, rgba(239, 68, 68, 0.2), transparent 70%)'
                ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Confetti for Victory */}
        {won && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10%`,
                  background: ['#10b981', '#f59e0b', '#3b82f6'][Math.floor(Math.random() * 3)]
                }}
                animate={{
                  y: ['0vh', '110vh'],
                  x: [0, Math.random() * 100 - 50],
                  rotate: [0, 360],
                  opacity: [1, 0]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 2,
                  repeat: Infinity
                }}
              />
            ))}
          </div>
        )}

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center max-w-3xl px-6"
        >
          {/* Icon */}
          <motion.div
            animate={{ 
              rotate: won ? 0 : 360,
              scale: won ? [1, 1.2, 1] : 1
            }}
            transition={{ 
              rotate: { duration: 2, ease: 'easeOut' },
              scale: { duration: 1.5, repeat: Infinity }
            }}
            className="mb-8"
          >
            {won ? (
              <div className="w-48 h-48 mx-auto rounded-full bg-emerald-500/20 border-4 border-emerald-500 flex items-center justify-center">
                <Sparkles className="w-24 h-24 text-emerald-400" />
              </div>
            ) : (
              <div className="w-48 h-48 mx-auto rounded-full bg-red-500/20 border-4 border-red-500 flex items-center justify-center">
                <Target className="w-24 h-24 text-red-400" />
              </div>
            )}
          </motion.div>

          {/* Result Text */}
          <h1
            style={{ 
              fontFamily: 'Orbitron, sans-serif',
              background: won 
                ? 'linear-gradient(135deg, #10b981, #34d399)'
                : 'linear-gradient(135deg, #ef4444, #dc2626)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
            className="text-9xl font-black mb-6"
          >
            {won ? 'VICTORY' : 'DEFEATED'}
          </h1>

          <p className="text-2xl text-gray-400 mb-12">
            {won 
              ? `You survived ${round} rounds against ${aiLevel.name}`
              : `${aiLevel.name} proved too strong. Try again?`
            }
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10"
            >
              <TrendingUp className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-5xl font-black text-emerald-400 mb-2">
                {wins}
              </div>
              <div className="text-sm text-gray-400">Total Wins</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-6 rounded-xl border border-red-500/30 bg-red-500/10"
            >
              <Target className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-5xl font-black text-red-400 mb-2">
                {losses}
              </div>
              <div className="text-sm text-gray-400">Total Losses</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-6 rounded-xl border border-amber-500/30 bg-amber-500/10"
            >
              <Clock className="w-10 h-10 text-amber-400 mx-auto mb-3" />
              <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-5xl font-black text-amber-400 mb-2">
                {round}
              </div>
              <div className="text-sm text-gray-400">Rounds Survived</div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setGamePhase('menu');
                setRound(1);
              }}
              className="px-12 py-5 bg-emerald-500 rounded-xl font-bold text-2xl"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              PLAY AGAIN
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(107, 114, 128, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="px-12 py-5 bg-gray-700 rounded-xl font-bold text-2xl"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              EXIT
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ==================== CONTINUE TO MAIN GAMEPLAY ====================
  // ==================== MAIN GAME UI ====================
  
  const remaining = chamber.slice(currentIndex);
  const blanks = remaining.filter(r => r.id === 'blank').length;
  const lives = remaining.filter(r => r.id === 'live').length;
  const criticals = remaining.filter(r => r.id === 'critical').length;
  const aiLevel = AI_LEVELS[difficulty];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      
      {/* Atmospheric Background */}
      <div className="fixed inset-0 opacity-30">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: turn === 'player'
              ? 'radial-gradient(circle at 30% 50%, rgba(16, 185, 129, 0.15), transparent 60%)'
              : 'radial-gradient(circle at 70% 50%, rgba(239, 68, 68, 0.15), transparent 60%)'
          }}
          transition={{ duration: 1 }}
        />
      </div>

      {/* Scanlines Effect */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
        }}
      />

      {/* Top Navigation Bar */}
      <div className="relative z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="max-w-[1800px] mx-auto px-8 py-4 flex items-center justify-between">
          
          {/* Left: Exit & Round */}
          <div className="flex items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (window.confirm('Are you sure you want to exit? Progress will be lost.')) {
                  navigate('/dashboard');
                }
              }}
              className="px-5 py-2.5 border-2 border-gray-700 rounded-xl hover:border-red-500/50 transition-all flex items-center gap-2 backdrop-blur-sm"
            >
              <Home className="w-4 h-4" />
              <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-sm font-bold">Exit</span>
            </motion.button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-transparent border border-red-500/30 flex items-center justify-center">
                <Target className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-2xl font-black text-red-400">
                  Round {round}
                </div>
                <div className="text-xs text-gray-500">vs {aiLevel.name}</div>
              </div>
            </div>
          </div>

          {/* Center: Turn Indicator */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: turn === 'player'
                ? ['0 0 0 rgba(16, 185, 129, 0)', '0 0 30px rgba(16, 185, 129, 0.5)', '0 0 0 rgba(16, 185, 129, 0)']
                : ['0 0 0 rgba(239, 68, 68, 0)', '0 0 30px rgba(239, 68, 68, 0.5)', '0 0 0 rgba(239, 68, 68, 0)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`px-8 py-3 rounded-full border-2 ${
              turn === 'player' 
                ? 'border-emerald-500 bg-emerald-500/20' 
                : 'border-red-500 bg-red-500/20'
            }`}
          >
            <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-sm font-bold tracking-wider">
              {turn === 'player' ? '🎯 YOUR TURN' : '🤖 AI THINKING...'}
            </div>
          </motion.div>

          {/* Right: Win/Loss */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-emerald-400 font-bold">{wins}W</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30">
              <Target className="w-4 h-4 text-red-400" />
              <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-red-400 font-bold">{losses}L</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="relative z-10 max-w-[1800px] mx-auto px-8 py-8">
        
        {/* Player vs AI Layout */}
        <div className="grid grid-cols-[1fr_2fr_1fr] gap-8 mb-8">
          
          {/* ========== LEFT: PLAYER ZONE ========== */}
          <motion.div
            className={`relative p-8 rounded-3xl border-2 transition-all ${
              turn === 'player' && gamePhase === 'playing'
                ? 'border-emerald-500 bg-gradient-to-br from-emerald-500/20 via-emerald-500/5 to-transparent shadow-2xl shadow-emerald-500/20'
                : 'border-gray-800 bg-gray-900/50'
            }`}
            animate={damageFlash === 'player' ? {
              boxShadow: ['0 0 0 rgba(239, 68, 68, 0)', '0 0 60px rgba(239, 68, 68, 0.8)', '0 0 0 rgba(239, 68, 68, 0)']
            } : {}}
          >
            {/* Player Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
                <Shield className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-2xl font-black text-white">
                  YOU
                </div>
                <div className="text-sm text-gray-400">Player</div>
              </div>
            </div>

            {/* HP Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400 font-bold">HEALTH</span>
                <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-2xl font-black text-white">
                  {playerHP}/4
                </span>
              </div>
              <div className="h-4 bg-gray-900 rounded-full overflow-hidden border-2 border-gray-800">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                  animate={{ width: `${(playerHP / 4) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400 font-bold">ITEMS</span>
                <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-sm font-bold text-emerald-400">
                  {playerItems.length}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {playerItems.map((item, idx) => {
                  const ItemIcon = item.icon;
                  return (
                    <motion.button
                      key={`${item.id}-${idx}`}
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => useItem(item)}
                      disabled={turn !== 'player' || gamePhase !== 'playing'}
                      className={`group relative p-4 rounded-xl border-2 transition-all ${
                        turn === 'player' && gamePhase === 'playing'
                          ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-500/20 to-transparent hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/30'
                          : 'border-gray-800 bg-gray-900/50 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <ItemIcon className="w-8 h-8 mb-2" style={{ color: item.color }} />
                      <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-xs font-bold text-white mb-1">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        Tier {item.tier}
                      </div>

                      {/* Tooltip on Hover */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="absolute left-full ml-2 top-0 w-64 p-4 rounded-xl border border-gray-700 bg-black/95 backdrop-blur-xl z-50 pointer-events-none hidden group-hover:block"
                      >
                        <div style={{ fontFamily: 'Orbitron, sans-serif', color: item.color }} className="text-sm font-bold mb-2">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-400 mb-3">
                          {item.description}
                        </div>
                        <div className="pt-3 border-t border-gray-800">
                          <div className="text-[10px] text-emerald-400 font-bold mb-1">
                            📚 {item.educational.concept}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            {item.educational.explanation}
                          </div>
                          <div className="text-[10px] text-amber-400 mt-2">
                            ⚡ {item.educational.complexity}
                          </div>
                        </div>
                      </motion.div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* ========== CENTER: CHAMBER & ACTIONS ========== */}
          <div className="flex flex-col">
            
            {/* Chamber Display */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-lg font-bold text-gray-400">
                  CHAMBER STATUS
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-gray-400">{blanks} PASS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-gray-400">{lives} FAIL</span>
                  </div>
                  {criticals > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-600" />
                      <span className="text-gray-400">{criticals} CRIT</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Chamber Slots */}
              <div className="grid grid-cols-8 gap-3 mb-6">
                {chamber.map((round, idx) => {
                  const isPast = idx < currentIndex;
                  const isCurrent = idx === currentIndex;
                  const isKnown = knownInfo.some(k => k.index === idx);
                  const knownType = knownInfo.find(k => k.index === idx)?.type;
                  const RoundIcon = ROUND_TYPES[knownType]?.icon;
                  
                  return (
                    <motion.div
                      key={idx}
                      className={`aspect-square rounded-xl border-2 flex items-center justify-center transition-all ${
                        isPast ? 'border-gray-800 bg-gray-900/30 opacity-30' :
                        isCurrent ? 'border-red-500 bg-red-500/20 shadow-xl shadow-red-500/50' :
                        'border-gray-700 bg-gray-900/50'
                      }`}
                      animate={isCurrent ? {
                        scale: [1, 1.15, 1],
                        boxShadow: [
                          '0 0 0 rgba(239, 68, 68, 0)',
                          '0 0 40px rgba(239, 68, 68, 0.8)',
                          '0 0 0 rgba(239, 68, 68, 0)'
                        ]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {isPast ? (
                        <div className="text-sm text-gray-600 font-bold">✓</div>
                      ) : isKnown && RoundIcon ? (
                        <RoundIcon className="w-5 h-5" style={{ color: ROUND_TYPES[knownType].color }} />
                      ) : (
                        <div className="text-lg text-gray-600 font-bold">?</div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-500 to-amber-500"
                  animate={{ width: `${(currentIndex / chamber.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* ========== SHOOTING ANIMATION ========== */}
            <div className="flex-1 flex items-center justify-center mb-6">
              <AnimatePresence>
                {shootingAnimation && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180, opacity: 0 }}
                    className="relative"
                  >
                    <motion.div
                      animate={{
                        boxShadow: [
                          '0 0 30px rgba(239, 68, 68, 0.5)',
                          '0 0 100px rgba(239, 68, 68, 1)',
                          '0 0 30px rgba(239, 68, 68, 0.5)'
                        ],
                        rotate: 360
                      }}
                      transition={{ 
                        boxShadow: { duration: 0.5, repeat: 3 },
                        rotate: { duration: 1.5, ease: 'linear' }
                      }}
                      className="w-48 h-48 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center relative"
                    >
                      <Target className="w-24 h-24 text-white" strokeWidth={3} />
                      
                      {/* Pulse Rings */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute inset-0 rounded-full border-4 border-red-500"
                          animate={{
                            scale: [1, 2],
                            opacity: [1, 0]
                          }}
                          transition={{
                            duration: 1.5,
                            delay: i * 0.5,
                            repeat: 1
                          }}
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Item Use Animation */}
              <AnimatePresence>
                {itemAnimation && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="relative"
                  >
                    <motion.div
                      animate={{
                        boxShadow: [
                          `0 0 30px ${itemAnimation.color}80`,
                          `0 0 80px ${itemAnimation.color}`,
                          `0 0 30px ${itemAnimation.color}80`
                        ]
                      }}
                      transition={{ duration: 0.8 }}
                      className="w-32 h-32 rounded-xl flex items-center justify-center"
                      style={{ 
                        background: `linear-gradient(135deg, ${itemAnimation.color}40, ${itemAnimation.color}10)`,
                        border: `3px solid ${itemAnimation.color}`
                      }}
                    >
                      <itemAnimation.icon className="w-16 h-16" style={{ color: itemAnimation.color }} />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ========== ACTION BUTTONS ========== */}
            {!shootingAnimation && !itemAnimation && turn === 'player' && gamePhase === 'playing' && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="grid grid-cols-2 gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => shoot('self')}
                  className="relative p-6 rounded-2xl border-2 border-emerald-500 bg-gradient-to-br from-emerald-500/30 to-transparent hover:shadow-xl hover:shadow-emerald-500/30 transition-all overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%']
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="relative z-10">
                    <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-2xl font-black text-emerald-400 mb-2">
                      SHOOT SELF
                    </div>
                    <div className="text-xs text-gray-400">
                      If PASS → Extra turn
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => shoot('opponent')}
                  className="relative p-6 rounded-2xl border-2 border-red-500 bg-gradient-to-br from-red-500/30 to-transparent hover:shadow-xl hover:shadow-red-500/30 transition-all overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="relative z-10">
                    <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-2xl font-black text-red-400 mb-2">
                      SHOOT AI
                    </div>
                    <div className="text-xs text-gray-400">
                      If FAIL → Deal damage
                    </div>
                  </div>
                </motion.button>
              </motion.div>
            )}

            {turn === 'ai' && !shootingAnimation && (
              <div className="text-center py-6">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ fontFamily: 'Orbitron, sans-serif' }}
                  className="text-xl text-red-400 font-bold"
                >
                  AI IS CALCULATING...
                </motion.div>
              </div>
            )}
          </div>

          {/* ========== TYPE "continue" FOR AI ZONE + GAME LOG ========== */}
          {/* ========== RIGHT: AI ZONE ========== */}
          <motion.div
            className={`relative p-8 rounded-3xl border-2 transition-all ${
              turn === 'ai' && gamePhase === 'playing'
                ? 'border-red-500 bg-gradient-to-br from-red-500/20 via-red-500/5 to-transparent shadow-2xl shadow-red-500/20'
                : 'border-gray-800 bg-gray-900/50'
            }`}
            animate={damageFlash === 'ai' ? {
              boxShadow: ['0 0 0 rgba(239, 68, 68, 0)', '0 0 60px rgba(239, 68, 68, 0.8)', '0 0 0 rgba(239, 68, 68, 0)']
            } : {}}
          >
            {/* AI Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
                <Brain className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-2xl font-black text-white">
                  AI
                </div>
                <div className="text-sm text-gray-400">{aiLevel.name}</div>
              </div>
            </div>

            {/* HP Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400 font-bold">HEALTH</span>
                <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-2xl font-black text-white">
                  {aiHP}/{aiLevel.hp}
                </span>
              </div>
              <div className="h-4 bg-gray-900 rounded-full overflow-hidden border-2 border-gray-800">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-500 to-red-600"
                  animate={{ width: `${(aiHP / aiLevel.hp) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* AI Stats Display */}
            <div className="mb-6 p-4 rounded-xl bg-black/30 border border-red-500/20">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-gray-500 mb-1">Intelligence</div>
                  <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-red-400 font-bold">
                    {Math.floor(aiLevel.deductionAccuracy * 100)}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Aggression</div>
                  <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-red-400 font-bold">
                    {Math.floor(aiLevel.aggressiveness * 100)}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Item Use</div>
                  <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-red-400 font-bold">
                    {Math.floor(aiLevel.itemUseChance * 100)}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Status</div>
                  <motion.div 
                    animate={{ opacity: turn === 'ai' ? [0.5, 1, 0.5] : 1 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ fontFamily: 'Orbitron, sans-serif' }} 
                    className="text-red-400 font-bold"
                  >
                    {turn === 'ai' ? 'ACTIVE' : 'IDLE'}
                  </motion.div>
                </div>
              </div>
            </div>

            {/* AI Items (Hidden but show count) */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400 font-bold">AI ITEMS</span>
                <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-sm font-bold text-red-400">
                  {aiItems.length}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {aiItems.map((item, idx) => (
                  <div
                    key={`ai-${item.id}-${idx}`}
                    className="p-4 rounded-xl border-2 border-gray-800 bg-gray-900/50 relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                    />
                    <div className="relative z-10">
                      <div className="w-8 h-8 bg-gray-800 rounded mb-2" />
                      <div className="h-3 w-16 bg-gray-800 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ========== GAME LOG ========== */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-6 rounded-2xl border border-cyan-500/20 bg-black/60 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-sm font-bold text-cyan-400 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              ACTIVITY LOG
            </div>
            <div className="text-xs text-gray-500">
              Last {gameLog.length} events
            </div>
          </div>
          
          <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
            <AnimatePresence>
              {gameLog.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-gray-400 font-mono bg-gray-900/50 px-3 py-2 rounded border border-gray-800"
                >
                  <span className="text-cyan-400 mr-2">[{i + 1}]</span>
                  {log}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ========== EDUCATIONAL TOOLTIP PANEL ========== */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-6 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent backdrop-blur-xl"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/50 flex items-center justify-center flex-shrink-0">
              <Info className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-blue-400 font-bold mb-2 text-lg">
                💡 Algorithm Insight
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                {turn === 'player' 
                  ? "Use probability and algorithm items to deduce chamber contents. Binary Search eliminates half the possibilities. Hash Tables give perfect information. QuickSort partitions the remaining tests."
                  : "AI is using probability theory and deduction accuracy to make optimal decisions. Higher difficulty = better strategic thinking and item usage."
                }
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-xs font-bold text-emerald-400">
                  O(log n) - Binary Search
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/50 text-xs font-bold text-purple-400">
                  O(n) - QuickSort Partition
                </span>
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-xs font-bold text-cyan-400">
                  O(1) - Hash Table Lookup
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.5);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.8);
        }
      `}</style>
    </div>
  );
}
