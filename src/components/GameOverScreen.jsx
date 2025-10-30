import { motion } from 'framer-motion';
import { Trophy, XCircle, RotateCcw, Home, Award } from 'lucide-react';

export default function GameOverScreen({ victory, round, onRestart, onHome }) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="text-center max-w-2xl"
      >
        {victory ? (
          <>
            {/* Victory Animation */}
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 2, ease: 'easeInOut' },
                scale: { duration: 1, repeat: Infinity }
              }}
            >
              <Trophy className="w-32 h-32 text-amber-400 mx-auto mb-6" />
            </motion.div>
            
            <motion.h1 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="text-8xl font-black mb-4 text-emerald-400" 
              style={{ 
                fontFamily: 'Orbitron, sans-serif',
                textShadow: '0 0 40px #10b98180'
              }}
            >
              VICTORY!
            </motion.h1>
            
            <p className="text-3xl mb-4 text-gray-300">
              Opponent Defeated!
            </p>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-3 mb-8"
            >
              <Award className="w-8 h-8 text-amber-400" />
              <p className="text-xl text-amber-400 font-bold">
                Completed {round} rounds
              </p>
            </motion.div>
          </>
        ) : (
          <>
            {/* Defeat Animation */}
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
              }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              <XCircle className="w-32 h-32 text-red-500 mx-auto mb-6" />
            </motion.div>
            
            <motion.h1 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="text-8xl font-black mb-4 text-red-500" 
              style={{ 
                fontFamily: 'Orbitron, sans-serif',
                textShadow: '0 0 40px #ef444480'
              }}
            >
              DEFEATED!
            </motion.h1>
            
            <p className="text-3xl mb-4 text-gray-300">
              Your algorithms weren't fast enough
            </p>
            
            <p className="text-xl text-gray-500 mb-8">
              Made it to round {round} - Try optimizing your choices!
            </p>
          </>
        )}

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRestart}
            className="px-8 py-4 bg-emerald-500 rounded-xl font-bold text-xl hover:bg-emerald-600 flex items-center gap-3 transition-colors"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            <RotateCcw className="w-6 h-6" />
            Play Again
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onHome}
            className="px-8 py-4 bg-gray-700 rounded-xl font-bold text-xl hover:bg-gray-600 flex items-center gap-3 transition-colors"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            <Home className="w-6 h-6" />
            Dashboard
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
