import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Swords, Home, Activity, Zap, Heart, Shield, 
  Target, Clock, Award, TrendingUp, X, Play,
  AlertCircle, CheckCircle, Sparkles
} from 'lucide-react';
import { useArenaBattle } from '../game/arenaHooks';
import { ALGORITHM_MOVES, DEFENSIVE_MOVES } from '../game/arenaData';
import {
  BinarySearchQTE, QuickSortQTE, MergeSortQTE, HashTableQTE,
  DijkstraQTE, BFSQTE, DFSQTE, DynamicProgrammingQTE, HeapSortQTE
} from '../components/QTEVisuals';

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

export default function Arena() {
  loadOrbitronFont();
  const navigate = useNavigate();
  
  const {
    gamePhase,
    selectedOpponent,
    playerHP,
    playerMaxHP,
    playerEnergy,
    playerMaxEnergy,
    playerMoves,
    playerCooldowns,
    aiHP,
    aiMaxHP,
    aiEnergy,
    aiMaxEnergy,
    turn,
    selectedMove,
    battleLog,
    comboCount,
    perfectHits,
    qteActive,
    qtePosition,
    qteStage,
    showTimingFeedback,
    damageAnimation,
    hitEffect,
    isAnimating,
    startBattle,
    selectPlayerMove,
    handleQTEClick,
    returnToMenu,
    availableOpponents,
    moveDatabase
  } = useArenaBattle();

  // ==================== MENU SCREEN ====================
  if (gamePhase === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900/20 text-white flex items-center justify-center overflow-hidden relative">
        
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.15)_0%,transparent_70%)]" />
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-red-500"
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
              <Swords className="w-24 h-24 text-red-400" strokeWidth={1.5} />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h1
              style={{ 
                fontFamily: 'Orbitron, sans-serif',
                background: 'linear-gradient(135deg, #ef4444, #f59e0b, #ef4444)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
              className="text-8xl font-black mb-4 tracking-tight"
            >
              THE ARENA
            </h1>
            <p className="text-2xl text-gray-300 mb-16">
              Battle AI opponents using algorithm mastery and perfect timing
            </p>
          </motion.div>

          {/* Opponent Selection */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-red-500/50" />
              <h3 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-2xl text-red-400 font-bold tracking-wider">
                SELECT OPPONENT
              </h3>
              <div className="h-px w-24 bg-gradient-to-l from-transparent to-red-500/50" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {availableOpponents.map((opponent, idx) => (
                <motion.button
                  key={opponent.id}
                  initial={{ x: idx % 2 === 0 ? -100 : 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.2 + idx * 0.15, type: 'spring' }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startBattle(opponent.id)}
                  className="relative p-8 rounded-2xl border-2 transition-all group overflow-hidden"
                  style={{ 
                    borderColor: `${opponent.color}40`,
                    background: `linear-gradient(135deg, ${opponent.color}10, transparent)`
                  }}
                >
                  {/* Hover Effect */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: `radial-gradient(circle at center, ${opponent.color}20, transparent)`
                    }}
                  />
                  
                  <div className="relative z-10">
                    {/* Avatar & Name */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-6xl">{opponent.avatar}</div>
                      <div className="text-left">
                        <div style={{ fontFamily: 'Orbitron, sans-serif', color: opponent.color }} className="text-2xl font-black">
                          {opponent.name}
                        </div>
                        <div className="text-sm text-gray-400">{opponent.title}</div>
                      </div>
                    </div>

                    <p className="text-gray-400 text-left mb-4 text-sm">
                      {opponent.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded bg-black/30">
                        <Heart className="w-4 h-4 text-red-400 mx-auto mb-1" />
                        <div className="text-gray-500 mb-1">HP</div>
                        <div className="font-bold" style={{ color: opponent.color }}>{opponent.maxHP}</div>
                      </div>
                      <div className="p-3 rounded bg-black/30">
                        <Target className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                        <div className="text-gray-500 mb-1">Accuracy</div>
                        <div className="font-bold" style={{ color: opponent.color }}>
                          {Math.floor(opponent.timingAccuracy * 100)}%
                        </div>
                      </div>
                      <div className="p-3 rounded bg-black/30">
                        <Zap className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                        <div className="text-gray-500 mb-1">Difficulty</div>
                        <div className="font-bold" style={{ color: opponent.color }}>
                          {opponent.difficulty.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Play Button */}
                    <motion.div
                      className="mt-4 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: opponent.color }}
                    >
                      <Play className="w-5 h-5" fill="currentColor" />
                      <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-sm font-bold">
                        BATTLE
                      </span>
                    </motion.div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
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
  // ==================== BATTLE SCREEN ====================
  if (gamePhase === 'battle' || gamePhase === 'qte') {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-red-900/20 -z-10" />
        
        {/* Hit Effects */}
        <AnimatePresence>
          {hitEffect && (
            <motion.div
              initial={{ opacity: 0, scale: 2 }}
              animate={{ opacity: 0.5, scale: 4 }}
              exit={{ opacity: 0, scale: 6 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at center, ${hitEffect.color}40, transparent 60%)`
              }}
            />
          )}
        </AnimatePresence>

        {/* Top Bar */}
        <div className="border-b border-white/10 bg-black/80 backdrop-blur-xl">
          <div className="max-w-[1800px] mx-auto px-8 py-4 flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (window.confirm('Forfeit battle and return to menu?')) {
                  returnToMenu();
                }
              }}
              className="px-5 py-2.5 border-2 border-gray-700 rounded-xl hover:border-red-500/50 transition-all flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-sm font-bold">Forfeit</span>
            </motion.button>

            {/* Turn Indicator */}
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
                {turn === 'player' ? '🎯 YOUR TURN' : '🤖 AI TURN'}
              </div>
            </motion.div>

            {/* Combo Counter */}
            {comboCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500/20 to-red-500/20 border-2 border-amber-500"
              >
                <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-amber-400 font-black text-xl">
                  {comboCount}x COMBO
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Main Battle Area */}
        <div className="max-w-[1800px] mx-auto px-8 py-8">
          <div className="grid grid-cols-[1fr_2fr_1fr] gap-8 mb-8">
            
            {/* ========== PLAYER ZONE ========== */}
            <motion.div
              className={`relative p-8 rounded-3xl border-2 transition-all ${
                turn === 'player'
                  ? 'border-emerald-500 bg-gradient-to-br from-emerald-500/20 via-emerald-500/5 to-transparent shadow-2xl shadow-emerald-500/20'
                  : 'border-gray-800 bg-gray-900/50'
              }`}
              animate={damageAnimation?.target === 'player' ? {
                boxShadow: ['0 0 0 rgba(239, 68, 68, 0)', '0 0 60px rgba(239, 68, 68, 0.8)', '0 0 0 rgba(239, 68, 68, 0)'],
                x: [0, -10, 10, -10, 10, 0]
              } : {}}
            >
              {/* Player Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-xl bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-4xl">
                  👤
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
                  <span className="text-sm text-gray-400 font-bold flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-400" />
                    HEALTH
                  </span>
                  <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-2xl font-black text-white">
                    {playerHP}/{playerMaxHP}
                  </span>
                </div>
                <div className="h-6 bg-gray-900 rounded-full overflow-hidden border-2 border-gray-800">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 relative overflow-hidden"
                    animate={{ width: `${(playerHP / playerMaxHP) * 100}%` }}
                    transition={{ duration: 0.5, type: 'spring' }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/30"
                      animate={{ x: ['0%', '100%'] }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Energy Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-400 font-bold flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    ENERGY
                  </span>
                  <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-xl font-bold text-amber-400">
                    {playerEnergy}/{playerMaxEnergy}
                  </span>
                </div>
                <div className="h-4 bg-gray-900 rounded-full overflow-hidden border-2 border-gray-800">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-500"
                    animate={{ width: `${(playerEnergy / playerMaxEnergy) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded bg-black/30">
                  <Target className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                  <div className="text-gray-500 mb-1">Perfect Hits</div>
                  <div className="font-bold text-purple-400">{perfectHits}</div>
                </div>
                <div className="p-3 rounded bg-black/30">
                  <TrendingUp className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                  <div className="text-gray-500 mb-1">Combo</div>
                  <div className="font-bold text-amber-400">{comboCount}x</div>
                </div>
              </div>

              {/* Damage Indicator */}
              <AnimatePresence>
                {damageAnimation?.target === 'player' && (
                  <motion.div
                    initial={{ y: 0, opacity: 1, scale: 1 }}
                    animate={{ y: -100, opacity: 0, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  >
                    <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-6xl font-black text-red-500">
                      -{damageAnimation.damage}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ========== CENTER: BATTLE AREA ========== */}
            <div className="flex flex-col">
              {/* QTE Display or Battle Animation */}
              <div className="flex-1 flex items-center justify-center mb-6 min-h-[400px]">
                {gamePhase === 'qte' && selectedMove ? (
                  <QTEDisplay 
                    move={selectedMove}
                    position={qtePosition}
                    stage={qteStage}
                    onQTEClick={handleQTEClick}
                    showTimingFeedback={showTimingFeedback}
                  />
                ) : (
                  <div className="text-center">
                    <motion.div
                      animate={{ 
                        scale: isAnimating ? [1, 1.2, 1] : 1,
                        rotate: isAnimating ? 360 : 0
                      }}
                      transition={{ duration: 0.5 }}
                      className="w-48 h-48 mx-auto rounded-full border-4 border-red-500/30 bg-gradient-to-br from-red-500/20 to-transparent flex items-center justify-center mb-6"
                    >
                      <Swords className="w-24 h-24 text-red-400" />
                    </motion.div>
                    {turn === 'ai' && (
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{ fontFamily: 'Orbitron, sans-serif' }}
                        className="text-xl text-red-400 font-bold"
                      >
                        AI IS THINKING...
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* Move Selection */}
              {turn === 'player' && !qteActive && !isAnimating && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="grid grid-cols-2 gap-4"
                >
                  {playerMoves.map((moveId, idx) => {
                    const move = moveDatabase[moveId];
                    if (!move) return null;
                    
                    const Icon = move.icon;
                    const isOnCooldown = playerCooldowns[moveId] > 0;
                    const notEnoughEnergy = playerEnergy < move.energy;
                    const disabled = isOnCooldown || notEnoughEnergy;

                    return (
                      <motion.button
                        key={moveId}
                        whileHover={!disabled ? { scale: 1.03, y: -3 } : {}}
                        whileTap={!disabled ? { scale: 0.98 } : {}}
                        onClick={() => !disabled && selectPlayerMove(moveId)}
                        disabled={disabled}
                        className={`relative p-6 rounded-xl border-2 transition-all group ${
                          disabled 
                            ? 'opacity-50 cursor-not-allowed border-gray-800 bg-gray-900/50' 
                            : 'border-emerald-500/50 bg-gradient-to-br from-emerald-500/20 to-transparent hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/30'
                        }`}
                        style={!disabled ? { borderColor: `${move.color}50` } : {}}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ background: `${move.color}30`, border: `2px solid ${move.color}` }}
                          >
                            <Icon className="w-6 h-6" style={{ color: move.color }} />
                          </div>
                          <div className="text-left">
                            <div style={{ fontFamily: 'Orbitron, sans-serif', color: move.color }} className="font-bold">
                              {move.name}
                            </div>
                            <div className="text-xs text-gray-500">{move.complexity}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-400" />
                            <span className="text-amber-400 font-bold">{move.energy}</span>
                          </div>
                          {isOnCooldown && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-purple-400" />
                              <span className="text-purple-400 font-bold">{playerCooldowns[moveId]}</span>
                            </div>
                          )}
                          {!isOnCooldown && (
                            <div className="text-gray-400">{move.type}</div>
                          )}
                        </div>

                        {notEnoughEnergy && !isOnCooldown && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl">
                            <span className="text-red-400 font-bold text-sm">NOT ENOUGH ENERGY</span>
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </div>

            {/* TYPE "continue" FOR AI ZONE */}
                     {/* ========== AI ZONE ========== */}
            <motion.div
              className={`relative p-8 rounded-3xl border-2 transition-all ${
                turn === 'ai'
                  ? 'border-red-500 bg-gradient-to-br from-red-500/20 via-red-500/5 to-transparent shadow-2xl shadow-red-500/20'
                  : 'border-gray-800 bg-gray-900/50'
              }`}
              animate={damageAnimation?.target === 'ai' ? {
                boxShadow: ['0 0 0 rgba(239, 68, 68, 0)', '0 0 60px rgba(239, 68, 68, 0.8)', '0 0 0 rgba(239, 68, 68, 0)'],
                x: [0, 10, -10, 10, -10, 0]
              } : {}}
            >
              {/* AI Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-xl bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-4xl">
                  {selectedOpponent.avatar}
                </div>
                <div>
                  <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-2xl font-black text-white">
                    {selectedOpponent.name}
                  </div>
                  <div className="text-sm text-gray-400">{selectedOpponent.title}</div>
                </div>
              </div>

              {/* AI HP Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-400 font-bold flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-400" />
                    HEALTH
                  </span>
                  <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-2xl font-black text-white">
                    {aiHP}/{aiMaxHP}
                  </span>
                </div>
                <div className="h-6 bg-gray-900 rounded-full overflow-hidden border-2 border-gray-800">
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-500 to-red-600 relative overflow-hidden"
                    animate={{ width: `${(aiHP / aiMaxHP) * 100}%` }}
                    transition={{ duration: 0.5, type: 'spring' }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/30"
                      animate={{ x: ['0%', '100%'] }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }}
                    />
                  </motion.div>
                </div>
              </div>

              {/* AI Energy Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-400 font-bold flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    ENERGY
                  </span>
                  <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-xl font-bold text-amber-400">
                    {aiEnergy}/{aiMaxEnergy}
                  </span>
                </div>
                <div className="h-4 bg-gray-900 rounded-full overflow-hidden border-2 border-gray-800">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-500"
                    animate={{ width: `${(aiEnergy / aiMaxEnergy) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* AI Stats */}
              <div className="grid grid-cols-2 gap-3 text-xs mb-6">
                <div className="p-3 rounded bg-black/30">
                  <div className="text-gray-500 mb-1">Accuracy</div>
                  <div className="font-bold text-red-400">
                    {Math.floor(selectedOpponent.timingAccuracy * 100)}%
                  </div>
                </div>
                <div className="p-3 rounded bg-black/30">
                  <div className="text-gray-500 mb-1">Strategy</div>
                  <div className="font-bold text-red-400">
                    {selectedOpponent.strategy.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* AI Status */}
              {turn === 'ai' && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-center"
                >
                  <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-red-400 font-bold">
                    🤖 CALCULATING...
                  </div>
                </motion.div>
              )}

              {/* Damage Indicator */}
              <AnimatePresence>
                {damageAnimation?.target === 'ai' && (
                  <motion.div
                    initial={{ y: 0, opacity: 1, scale: 1 }}
                    animate={{ y: -100, opacity: 0, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  >
                    <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-6xl font-black text-red-500">
                      -{damageAnimation.damage}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* ========== BATTLE LOG ========== */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-6 rounded-2xl border border-cyan-500/20 bg-black/60 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                BATTLE LOG
              </div>
            </div>
            
            <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
              <AnimatePresence>
                {battleLog.map((log, i) => (
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
        </div>

        {/* Custom Scrollbar */}
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

  // ==================== VICTORY/DEFEAT SCREENS ====================
  if (gamePhase === 'victory' || gamePhase === 'defeat') {
    const won = gamePhase === 'victory';
    
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
        {/* Background */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: won
              ? 'radial-gradient(circle at center, rgba(16, 185, 129, 0.3), transparent 70%)'
              : 'radial-gradient(circle at center, rgba(239, 68, 68, 0.3), transparent 70%)'
          }}
        />

        {/* Confetti for victory */}
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
          className="relative z-10 text-center max-w-2xl px-6"
        >
          {/* Icon */}
          <motion.div
            animate={{ scale: won ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mb-8"
          >
            <div className={`w-48 h-48 mx-auto rounded-full border-4 flex items-center justify-center ${
              won ? 'border-emerald-500 bg-emerald-500/20' : 'border-red-500 bg-red-500/20'
            }`}>
              {won ? (
                <Sparkles className="w-24 h-24 text-emerald-400" />
              ) : (
                <Swords className="w-24 h-24 text-red-400" />
              )}
            </div>
          </motion.div>

          {/* Result */}
          <h1
            style={{ 
              fontFamily: 'Orbitron, sans-serif',
              background: won 
                ? 'linear-gradient(135deg, #10b981, #34d399)'
                : 'linear-gradient(135deg, #ef4444, #dc2626)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
            className="text-8xl font-black mb-6"
          >
            {won ? 'VICTORY' : 'DEFEAT'}
          </h1>

          <p className="text-2xl text-gray-400 mb-12">
            {won 
              ? `You defeated ${selectedOpponent.name}!`
              : `${selectedOpponent.name} was too strong. Train harder!`
            }
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            <div className="p-6 rounded-xl border border-purple-500/30 bg-purple-500/10">
              <Target className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-4xl font-black text-purple-400 mb-2">
                {perfectHits}
              </div>
              <div className="text-sm text-gray-400">Perfect Hits</div>
            </div>
            <div className="p-6 rounded-xl border border-amber-500/30 bg-amber-500/10">
              <TrendingUp className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-4xl font-black text-amber-400 mb-2">
                {comboCount}x
              </div>
              <div className="text-sm text-gray-400">Max Combo</div>
            </div>
            <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
              <Award className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-4xl font-black text-emerald-400 mb-2">
                +150
              </div>
              <div className="text-sm text-gray-400">XP Gained</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={returnToMenu}
              className="px-12 py-5 bg-emerald-500 rounded-xl font-bold text-2xl"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              CONTINUE
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
}

// ==================== QTE COMPONENT ====================
const QTEDisplay = ({ move, position, stage, onQTEClick, showTimingFeedback }) => {
  const isMultiStage = move.timing.multiStage;
  const currentStage = isMultiStage ? move.timing.stages[stage] : null;
  const zones = currentStage ? currentStage.zones : move.timing.zones;
  
  // Import visual components
  const visualComponents = {
    binarySearch: <BinarySearchQTE position={position} />,
    quickSort: <QuickSortQTE position={position} />,
    mergeSort: <MergeSortQTE stage={stage} />,
    hashTable: <HashTableQTE position={position} />,
    dijkstra: <DijkstraQTE position={position} />,
    bfs: <BFSQTE position={position} />,
    dfs: <DFSQTE position={position} />,
    dynamicProgramming: <DynamicProgrammingQTE stage={stage} />,
    heapSort: <HeapSortQTE stage={stage} />
  };
  
  return (
    <div className="relative w-full max-w-3xl">
      {/* Algorithm Visual */}
      {move.visual && visualComponents[move.id]}
      
      {/* Stage Indicator for Multi-stage */}
      {isMultiStage && (
        <div className="text-center mb-8">
          <motion.div
            key={stage}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ fontFamily: 'Orbitron, sans-serif', color: move.color }}
            className="text-4xl font-black mb-4"
          >
            {currentStage.name}
          </motion.div>
          <div className="flex gap-2 justify-center">
            {move.timing.stages.map((_, idx) => (
              <div
                key={idx}
                className={`w-16 h-2 rounded-full ${
                  idx < stage ? 'bg-emerald-500' :
                  idx === stage ? 'bg-amber-500' :
                  'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* QTE Track */}
      <div className="relative h-32 mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-16 bg-gray-900 rounded-xl relative overflow-hidden border-2 border-gray-700">
            {/* Perfect Zone */}
            <div
              className="absolute h-full bg-emerald-500/30 border-x-2 border-emerald-500"
              style={{
                left: `${zones.perfect[0]}%`,
                width: `${zones.perfect[1] - zones.perfect[0]}%`
              }}
            />
            {/* Great Zone */}
            <div
              className="absolute h-full bg-blue-500/20 border-x-2 border-blue-500"
              style={{
                left: `${zones.great[0]}%`,
                width: `${zones.great[1] - zones.great[0]}%`
              }}
            />
            {/* Good Zone */}
            <div
              className="absolute h-full bg-amber-500/10 border-x-2 border-amber-500"
              style={{
                left: `${zones.good[0]}%`,
                width: `${zones.good[1] - zones.good[0]}%`
              }}
            />
            
            {/* Moving Indicator */}
            <motion.div
              className="absolute h-full w-1 bg-white"
              style={{ left: `${position}%` }}
              animate={{
                boxShadow: [
                  '0 0 10px rgba(255, 255, 255, 0.5)',
                  '0 0 30px rgba(255, 255, 255, 1)',
                  '0 0 10px rgba(255, 255, 255, 0.5)'
                ]
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </div>
        </div>
      </div>

      {/* Click Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onQTEClick}
        className="w-full py-8 rounded-2xl border-4 font-bold text-3xl transition-all"
        style={{ 
          fontFamily: 'Orbitron, sans-serif',
          borderColor: move.color,
          background: `linear-gradient(135deg, ${move.color}30, ${move.color}10)`,
          color: move.color
        }}
      >
        CLICK NOW!
      </motion.button>

      {/* Timing Feedback */}
      <AnimatePresence>
        {showTimingFeedback && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <div
              style={{ fontFamily: 'Orbitron, sans-serif' }}
              className={`text-6xl font-black ${
                showTimingFeedback === 'PERFECT' ? 'text-emerald-400' :
                showTimingFeedback === 'GREAT' ? 'text-blue-400' :
                showTimingFeedback === 'GOOD' ? 'text-amber-400' :
                'text-red-400'
              }`}
            >
              {showTimingFeedback}!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


  // TYPE "continue" FOR BATTLE SCREEN UI
