import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Zap, AlertCircle } from 'lucide-react';

export default function ExecutionAnimation({ playerData, opponentData, onComplete }) {
  const [playerProgress, setPlayerProgress] = useState(0);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [winner, setWinner] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

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
        const playerWon = playerData.executionTime < opponentData.executionTime && playerData.isCorrect;
        setWinner(playerWon ? 'player' : 'opponent');
        setShowDetails(true);
        setTimeout(() => {
          onComplete(playerWon);
        }, 2500);
      } else {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 90) return '#10b981';
    if (efficiency >= 70) return '#3b82f6';
    if (efficiency >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        
        {/* Title */}
        <motion.h2 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-6xl font-black text-center mb-12 text-emerald-400"
          style={{ 
            fontFamily: 'Orbitron, sans-serif',
            textShadow: '0 0 30px #10b98160'
          }}
        >
          <Zap className="inline w-12 h-12 mb-2 mr-3" />
          EXECUTING ALGORITHMS
        </motion.h2>

        <div className="grid grid-cols-2 gap-8">
          
          {/* PLAYER SIDE */}
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
                YOU
              </h3>
              
              {/* Algorithm Badge */}
              <div className="mb-3">
                <span 
                  className="px-4 py-2 rounded-full text-xs font-bold uppercase inline-block"
                  style={{ 
                    backgroundColor: `${getEfficiencyColor(playerData.efficiency)}20`,
                    color: getEfficiencyColor(playerData.efficiency),
                    border: `2px solid ${getEfficiencyColor(playerData.efficiency)}60`
                  }}
                >
                  {playerData.algorithm.replace('_', ' ')}
                </span>
              </div>

              {/* Stats */}
              <div className="flex justify-center gap-6 text-sm text-gray-400 mb-4">
                <div>
                  <div className="text-xs text-gray-600">Comparisons</div>
                  <div className="text-lg font-bold text-emerald-400">{playerData.comparisons}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Swaps</div>
                  <div className="text-lg font-bold text-emerald-400">{playerData.swaps}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Efficiency</div>
                  <div className="text-lg font-bold text-emerald-400">{playerData.efficiency}%</div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-900/80 rounded-xl p-6 border-2 border-emerald-500/30">
              <div className="mb-3 flex justify-between items-center">
                <span className="text-xs text-gray-500 font-mono">Execution Progress</span>
                <span className="text-xs font-bold text-emerald-400">{playerProgress.toFixed(0)}%</span>
              </div>
              
              <div className="h-6 bg-gray-800 rounded-full overflow-hidden border border-emerald-500/50 relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 flex items-center justify-end pr-2"
                  style={{ width: `${playerProgress}%` }}
                  transition={{ duration: 0.1 }}
                >
                  {playerProgress >= 100 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </motion.div>
                
                {/* Pulse effect */}
                {playerProgress < 100 && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-300/30 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                )}
              </div>
            </div>
            
            {/* Time Display */}
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">Execution Time</div>
              <div 
                className="text-3xl font-black text-emerald-400" 
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
                className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-2"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-red-400">{playerData.error}</div>
              </motion.div>
            )}
          </motion.div>

          {/* OPPONENT SIDE */}
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
                OPPONENT
              </h3>
              
              {/* Algorithm Badge */}
              <div className="mb-3">
                <span 
                  className="px-4 py-2 rounded-full text-xs font-bold uppercase inline-block"
                  style={{ 
                    backgroundColor: `${getEfficiencyColor(opponentData.efficiency)}20`,
                    color: getEfficiencyColor(opponentData.efficiency),
                    border: `2px solid ${getEfficiencyColor(opponentData.efficiency)}60`
                  }}
                >
                  {opponentData.algorithm.replace('_', ' ')}
                </span>
              </div>

              {/* Stats */}
              <div className="flex justify-center gap-6 text-sm text-gray-400 mb-4">
                <div>
                  <div className="text-xs text-gray-600">Comparisons</div>
                  <div className="text-lg font-bold text-amber-400">{opponentData.comparisons}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Swaps</div>
                  <div className="text-lg font-bold text-amber-400">{opponentData.swaps}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Efficiency</div>
                  <div className="text-lg font-bold text-amber-400">{opponentData.efficiency}%</div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-900/80 rounded-xl p-6 border-2 border-amber-500/30">
              <div className="mb-3 flex justify-between items-center">
                <span className="text-xs text-gray-500 font-mono">Execution Progress</span>
                <span className="text-xs font-bold text-amber-400">{opponentProgress.toFixed(0)}%</span>
              </div>
              
              <div className="h-6 bg-gray-800 rounded-full overflow-hidden border border-amber-500/50 relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 flex items-center justify-end pr-2"
                  style={{ width: `${opponentProgress}%` }}
                  transition={{ duration: 0.1 }}
                >
                  {opponentProgress >= 100 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </motion.div>
                
                {/* Pulse effect */}
                {opponentProgress < 100 && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/30 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                )}
              </div>
            </div>
            
            {/* Time Display */}
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">Execution Time</div>
              <div 
                className="text-3xl font-black text-amber-400" 
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                {(opponentData.executionTime / 1000).toFixed(3)}s
              </div>
            </div>
          </motion.div>
        </div>

        {/* Winner Announcement */}
        {winner && showDetails && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="text-center mt-12"
          >
            {winner === 'player' ? (
              <>
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 0.6, repeat: 2 }}
                >
                  <CheckCircle className="w-24 h-24 text-emerald-400 mx-auto mb-4" />
                </motion.div>
                <h3 
                  className="text-7xl font-black text-emerald-400 mb-4"
                  style={{ 
                    fontFamily: 'Orbitron, sans-serif',
                    textShadow: '0 0 40px #10b98180'
                  }}
                >
                  YOU WIN!
                </h3>
                <p className="text-2xl text-gray-400">
                  ⚡ {((opponentData.executionTime - playerData.executionTime) / 1000).toFixed(3)}s faster
                </p>
              </>
            ) : (
              <>
                <XCircle className="w-24 h-24 text-red-500 mx-auto mb-4" />
                <h3 
                  className="text-7xl font-black text-red-500 mb-4"
                  style={{ 
                    fontFamily: 'Orbitron, sans-serif',
                    textShadow: '0 0 40px #ef444480'
                  }}
                >
                  YOU LOSE!
                </h3>
                <p className="text-2xl text-gray-400">
                  {!playerData.isCorrect 
                    ? '❌ Algorithm failed to sort correctly' 
                    : `⏱️ ${((playerData.executionTime - opponentData.executionTime) / 1000).toFixed(3)}s slower`
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
