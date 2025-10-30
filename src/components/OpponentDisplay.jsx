import { motion } from 'framer-motion';
import { Zap, Target, Crown } from 'lucide-react';

export default function OpponentDisplay({ opponentName, stats }) {
  const getSpeedColor = (wpm) => {
    if (wpm > 100) return 'from-yellow-500 to-yellow-400';
    if (wpm > 80) return 'from-cyan-500 to-cyan-400';
    if (wpm > 60) return 'from-green-500 to-green-400';
    return 'from-gray-500 to-gray-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-purple-300 flex items-center gap-2">
          <Crown size={20} />
          {opponentName}
        </h3>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-50"
        />
      </div>

      {/* WPM */}
      <motion.div
        whileHover={{ scale: 1.05, x: 10 }}
        className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-l-4 border-purple-500 p-4 rounded-lg backdrop-blur"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-400 text-sm uppercase tracking-wider">WPM</p>
            <motion.p
              key={stats.wpm}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="text-3xl font-black text-purple-300 mt-1"
            >
              {stats.wpm}
            </motion.p>
          </div>
          <Zap className="text-purple-400" size={32} />
        </div>
      </motion.div>

      {/* ACCURACY */}
      <motion.div
        whileHover={{ scale: 1.05, x: 10 }}
        className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-l-4 border-green-500 p-4 rounded-lg backdrop-blur"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-400 text-sm uppercase tracking-wider">Accuracy</p>
            <motion.p
              key={stats.accuracy}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="text-3xl font-black text-green-300 mt-1"
            >
              {stats.accuracy}%
            </motion.p>
          </div>
          <Target className="text-green-400" size={32} />
        </div>
      </motion.div>

      {/* MCQ SCORE */}
      <motion.div
        whileHover={{ scale: 1.05, x: 10 }}
        className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border-l-4 border-yellow-500 p-4 rounded-lg backdrop-blur"
      >
        <p className="text-yellow-400 text-sm uppercase tracking-wider">MCQs Correct</p>
        <motion.p
          key={stats.correctMCQs}
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="text-3xl font-black text-yellow-300 mt-1"
        >
          {stats.correctMCQs}/{stats.totalMCQs}
        </motion.p>
      </motion.div>

      {/* FINAL SCORE */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-gradient-to-r from-pink-600 to-purple-600 p-4 rounded-lg backdrop-blur border-2 border-pink-400"
      >
        <p className="text-pink-200 text-sm uppercase tracking-wider font-semibold">Final Score</p>
        <motion.p
          key={stats.finalScore}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl font-black text-white mt-2"
        >
          {stats.finalScore}
        </motion.p>
      </motion.div>

      {/* PROGRESS BAR */}
      <div className="space-y-2">
        <p className="text-gray-400 text-xs uppercase">Overall Progress</p>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            animate={{ width: `${Math.min(100, stats.finalScore / 10)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
