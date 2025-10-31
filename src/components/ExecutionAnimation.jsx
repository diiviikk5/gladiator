import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Zap, AlertCircle, TrendingDown, Zap as ZapIcon } from 'lucide-react';

export default function ExecutionAnimation({ playerData, opponentData, onComplete }) {
  const [playerProgress, setPlayerProgress] = useState(0);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [winner, setWinner] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [raceState, setRaceState] = useState('racing'); // racing, finished, analyzing

  useEffect(() => {
    const maxDuration = Math.max(playerData.executionTime, opponentData.executionTime);
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      
      const playerPct = Math.min((elapsed / playerData.executionTime) * 100, 100);
      const opponentPct = Math.min((elapsed / opponentData.executionTime) * 100, 100);
      
      setPlayerProgress(playerPct);
      setOpponentProgress(opponentPct);

      if (elapsed >= maxDuration) {
        setRaceState('finished');
        const playerWon = 
          playerData.executionTime < opponentData.executionTime && 
          playerData.isCorrect;
        setWinner(playerWon ? 'player' : 'opponent');
        
        setTimeout(() => {
          setRaceState('analyzing');
          setShowDetails(true);
        }, 1000);
        
        setTimeout(() => {
          onComplete(playerWon);
        }, 3500);
      } else {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [playerData, opponentData, onComplete]);

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 90) return '#10b981';
    if (efficiency >= 75) return '#3b82f6';
    if (efficiency >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getAlgorithmComplexity = (algorithm) => {
    const complexities = {
      'quicksort': 'O(n log n)',
      'mergesort': 'O(n log n)',
      'heapsort': 'O(n log n)',
      'bubble_optimized': 'O(n²)',
      'bubble': 'O(n²)',
      'incomplete': 'O(n)',
      'invalid': 'N/A'
    };
    return complexities[algorithm] || 'Unknown';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        
        {/* Title */}
        <motion.h2 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-6xl font-black text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          <Zap className="inline w-12 h-12 mb-2 mr-3" />
          EXECUTING ALGORITHMS
        </motion.h2>

        <div className="grid grid-cols-2 gap-8">
          
          {/* ==================== PLAYER SIDE ==================== */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="text-center">
              <h3 
                className="text-3xl font-bold text-emerald-400 mb-3" 
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                👤 YOU
              </h3>
              
              {/* Algorithm Badge with Complexity */}
              <div className="mb-4 space-y-2">
                <span 
                  className="px-4 py-2 rounded-full text-xs font-bold uppercase inline-block"
                  style={{ 
                    backgroundColor: `${getEfficiencyColor(playerData.efficiency)}20`,
                    color: getEfficiencyColor(playerData.efficiency),
                    border: `2px solid ${getEfficiencyColor(playerData.efficiency)}60`
                  }}
                >
                  {playerData.algorithm.replace('_', ' ').toUpperCase()}
                </span>
                <p className="text-xs text-gray-500">Complexity: {getAlgorithmComplexity(playerData.algorithm)}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <div className="text-xs text-gray-600">Comparisons</div>
                  <div className="text-lg font-bold text-emerald-400">{playerData.comparisons}</div>
                </div>
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <div className="text-xs text-gray-600">Swaps</div>
                  <div className="text-lg font-bold text-emerald-400">{playerData.swaps}</div>
                </div>
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <div className="text-xs text-gray-600">Iterations</div>
                  <div className="text-lg font-bold text-emerald-400">{playerData.iterations || 0}</div>
                </div>
              </div>

              {/* Efficiency Meter */}
              <div className="mb-3">
                <div className="text-xs text-gray-500 mb-1">Efficiency</div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full"
                    style={{ backgroundColor: getEfficiencyColor(playerData.efficiency) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${playerData.efficiency}%` }}
                    transition={{ duration: 1.5 }}
                  />
                </div>
                <div className="text-xs font-bold text-emerald-400 mt-1">{playerData.efficiency}%</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-900/80 rounded-xl p-6 border-2 border-emerald-500/30">
              <div className="mb-3 flex justify-between items-center">
                <span className="text-xs text-gray-500 font-mono">⚡ Execution</span>
                <span className="text-xs font-bold text-emerald-400">{playerProgress.toFixed(0)}%</span>
              </div>
              
              <div className="h-8 bg-gray-800 rounded-full overflow-hidden border-2 border-emerald-500/50 relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 flex items-center justify-end pr-3"
                  style={{ width: `${playerProgress}%` }}
                  transition={{ duration: 0.05 }}
                >
                  {playerProgress >= 100 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex-shrink-0"
                    >
                      <CheckCircle className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                </motion.div>
                
                {/* Pulse effect during execution */}
                {playerProgress < 100 && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  />
                )}
              </div>
            </div>
            
            {/* Time Display */}
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-2">Execution Time</div>
              <div 
                className="text-4xl font-black text-emerald-400" 
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                {(playerData.executionTime / 1000).toFixed(3)}s
              </div>
            </div>

            {/* Error Display */}
            {playerData.error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border-2 border-red-500/50 rounded-lg flex items-start gap-2"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-red-400">{playerData.error}</div>
              </motion.div>
            )}

            {/* Correctness Status */}
            {!playerData.isCorrect && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-red-500/10 border-2 border-red-500/50 rounded-lg text-center"
              >
                <p className="text-sm font-bold text-red-400">❌ Algorithm Failed</p>
                <p className="text-xs text-red-300 mt-1">Result doesn't match expected output</p>
              </motion.div>
            )}
          </motion.div>

          {/* ==================== OPPONENT SIDE ==================== */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="text-center">
              <h3 
                className="text-3xl font-bold text-amber-400 mb-3" 
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                🤖 AI BOT
              </h3>
              
              {/* Algorithm Badge with Complexity */}
              <div className="mb-4 space-y-2">
                <span 
                  className="px-4 py-2 rounded-full text-xs font-bold uppercase inline-block"
                  style={{ 
                    backgroundColor: `${getEfficiencyColor(opponentData.efficiency)}20`,
                    color: getEfficiencyColor(opponentData.efficiency),
                    border: `2px solid ${getEfficiencyColor(opponentData.efficiency)}60`
                  }}
                >
                  {opponentData.algorithm.replace('_', ' ').toUpperCase()}
                </span>
                <p className="text-xs text-gray-500">Complexity: {getAlgorithmComplexity(opponentData.algorithm)}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <div className="text-xs text-gray-600">Comparisons</div>
                  <div className="text-lg font-bold text-amber-400">{opponentData.comparisons}</div>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <div className="text-xs text-gray-600">Swaps</div>
                  <div className="text-lg font-bold text-amber-400">{opponentData.swaps}</div>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <div className="text-xs text-gray-600">Iterations</div>
                  <div className="text-lg font-bold text-amber-400">{opponentData.iterations || 0}</div>
                </div>
              </div>

              {/* Efficiency Meter */}
              <div className="mb-3">
                <div className="text-xs text-gray-500 mb-1">Efficiency</div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full"
                    style={{ backgroundColor: getEfficiencyColor(opponentData.efficiency) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${opponentData.efficiency}%` }}
                    transition={{ duration: 1.5 }}
                  />
                </div>
                <div className="text-xs font-bold text-amber-400 mt-1">{opponentData.efficiency}%</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-900/80 rounded-xl p-6 border-2 border-amber-500/30">
              <div className="mb-3 flex justify-between items-center">
                <span className="text-xs text-gray-500 font-mono">⚡ Execution</span>
                <span className="text-xs font-bold text-amber-400">{opponentProgress.toFixed(0)}%</span>
              </div>
              
              <div className="h-8 bg-gray-800 rounded-full overflow-hidden border-2 border-amber-500/50 relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 flex items-center justify-end pr-3"
                  style={{ width: `${opponentProgress}%` }}
                  transition={{ duration: 0.05 }}
                >
                  {opponentProgress >= 100 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex-shrink-0"
                    >
                      <CheckCircle className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                </motion.div>
                
                {/* Pulse effect during execution */}
                {opponentProgress < 100 && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/40 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  />
                )}
              </div>
            </div>
            
            {/* Time Display */}
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-2">Execution Time</div>
              <div 
                className="text-4xl font-black text-amber-400" 
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                {(opponentData.executionTime / 1000).toFixed(3)}s
              </div>
            </div>
          </motion.div>
        </div>

        {/* ==================== WINNER ANNOUNCEMENT ==================== */}
        {winner && showDetails && (
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 150, damping: 15 }}
            className="text-center mt-12"
          >
            {winner === 'player' ? (
              <>
                <motion.div
                  animate={{ 
                    rotate: [0, 15, -15, 15, 0],
                    scale: [1, 1.15, 1]
                  }}
                  transition={{ duration: 0.8, repeat: 2 }}
                  className="mb-4"
                >
                  <CheckCircle className="w-32 h-32 text-emerald-400 mx-auto" />
                </motion.div>
                <h3 
                  className="text-7xl font-black text-emerald-400 mb-4"
                  style={{ 
                    fontFamily: 'Orbitron, sans-serif',
                    textShadow: '0 0 60px #10b98180'
                  }}
                >
                  ⚡ YOU WIN!
                </h3>
                <p className="text-2xl text-emerald-300 font-bold">
                  +{Math.round((opponentData.executionTime - playerData.executionTime) / 1000 * 100)} points bonus
                </p>
                <p className="text-lg text-gray-400 mt-2">
                  {playerData.efficiency > opponentData.efficiency 
                    ? `🎯 More efficient by ${(playerData.efficiency - opponentData.efficiency).toFixed(0)}%`
                    : `⚡ ${((opponentData.executionTime - playerData.executionTime) / 1000).toFixed(3)}s faster`
                  }
                </p>
              </>
            ) : (
              <>
                <motion.div
                  className="mb-4"
                >
                  <XCircle className="w-32 h-32 text-red-500 mx-auto" />
                </motion.div>
                <h3 
                  className="text-7xl font-black text-red-500 mb-4"
                  style={{ 
                    fontFamily: 'Orbitron, sans-serif',
                    textShadow: '0 0 60px #ef444480'
                  }}
                >
                  💀 YOU LOSE!
                </h3>
                <p className="text-2xl text-red-400 font-bold">
                  {!playerData.isCorrect 
                    ? '❌ Algorithm failed validation'
                    : `⏱️ ${((playerData.executionTime - opponentData.executionTime) / 1000).toFixed(3)}s slower`
                  }
                </p>
                <p className="text-lg text-gray-400 mt-2">
                  {!playerData.isCorrect
                    ? 'Your algorithm did not produce correct results'
                    : 'Better luck next time!'
                  }
                </p>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
