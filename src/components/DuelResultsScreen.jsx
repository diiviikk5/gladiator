import { motion } from 'framer-motion';
import { Trophy, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DuelResultsScreen({
  playerStats,
  opponentStats,
  opponentName,
  playerWins,
  onPlayAgain,
  onBackHome,
}) {
  const navigate = useNavigate();

  const getPerformanceColor = (wpm) => {
    if (wpm > 100) return 'from-yellow-500 to-yellow-400';
    if (wpm > 80) return 'from-cyan-500 to-cyan-400';
    if (wpm > 60) return 'from-green-500 to-green-400';
    return 'from-gray-500 to-gray-400';
  };

  const getPerformanceLabel = (wpm) => {
    if (wpm > 100) return 'Legendary';
    if (wpm > 80) return 'Master';
    if (wpm > 60) return 'Expert';
    return 'Intermediate';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-7xl font-bold mb-4 inline-block"
          >
            {playerWins ? '🏆' : '⚔️'}
          </motion.div>
          <h1 className={`text-5xl font-bold mb-2 ${playerWins ? 'text-yellow-400' : 'text-gray-400'}`}>
            {playerWins ? 'VICTORY!' : 'DEFEAT'}
          </h1>
          <p className="text-gray-400 text-xl">
            {playerWins
              ? `You defeated ${opponentName}!`
              : `${opponentName} defeated you!`}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Your Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`bg-gradient-to-br ${
              playerWins
                ? 'from-cyan-900/40 to-blue-900/40'
                : 'from-gray-800/40 to-gray-900/40'
            } backdrop-blur border-2 ${
              playerWins ? 'border-cyan-500' : 'border-gray-600'
            } rounded-xl p-8`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-cyan-400">Your Performance</h2>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`px-4 py-2 rounded-full bg-gradient-to-r ${getPerformanceColor(
                  playerStats.wpm
                )} text-white font-bold text-sm`}
              >
                {getPerformanceLabel(playerStats.wpm)}
              </motion.div>
            </div>

            <div className="space-y-6">
              {/* WPM */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-700/30 p-4 rounded-lg"
              >
                <p className="text-gray-400 text-sm mb-2">Words Per Minute</p>
                <div className="flex items-center justify-between">
                  <p className="text-4xl font-bold text-cyan-400">{playerStats.wpm}</p>
                  <TrendingUp className="text-cyan-400" size={28} />
                </div>
              </motion.div>

              {/* Accuracy */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-700/30 p-4 rounded-lg"
              >
                <p className="text-gray-400 text-sm mb-2">Accuracy</p>
                <p className="text-4xl font-bold text-green-400">{playerStats.accuracy}%</p>
              </motion.div>

              {/* MCQs */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-700/30 p-4 rounded-lg"
              >
                <p className="text-gray-400 text-sm mb-2">MCQs Answered Correctly</p>
                <p className="text-4xl font-bold text-yellow-400">
                  {playerStats.correctMCQs}/{playerStats.totalMCQs}
                </p>
              </motion.div>

              {/* Final Score */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 rounded-lg"
              >
                <p className="text-gray-200 text-sm mb-2">Final Score</p>
                <p className="text-5xl font-bold text-white">{playerStats.finalScore}</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Opponent Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`bg-gradient-to-br ${
              !playerWins
                ? 'from-purple-900/40 to-pink-900/40'
                : 'from-gray-800/40 to-gray-900/40'
            } backdrop-blur border-2 ${
              !playerWins ? 'border-purple-500' : 'border-gray-600'
            } rounded-xl p-8`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-purple-400">{opponentName}</h2>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`px-4 py-2 rounded-full bg-gradient-to-r ${getPerformanceColor(
                  opponentStats.wpm
                )} text-white font-bold text-sm`}
              >
                {getPerformanceLabel(opponentStats.wpm)}
              </motion.div>
            </div>

            <div className="space-y-6">
              {/* WPM */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-700/30 p-4 rounded-lg"
              >
                <p className="text-gray-400 text-sm mb-2">Words Per Minute</p>
                <div className="flex items-center justify-between">
                  <p className="text-4xl font-bold text-purple-400">{opponentStats.wpm}</p>
                  <TrendingUp className="text-purple-400" size={28} />
                </div>
              </motion.div>

              {/* Accuracy */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-700/30 p-4 rounded-lg"
              >
                <p className="text-gray-400 text-sm mb-2">Accuracy</p>
                <p className="text-4xl font-bold text-green-400">{opponentStats.accuracy}%</p>
              </motion.div>

              {/* MCQs */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-700/30 p-4 rounded-lg"
              >
                <p className="text-gray-400 text-sm mb-2">MCQs Answered Correctly</p>
                <p className="text-4xl font-bold text-yellow-400">
                  {opponentStats.correctMCQs}/{opponentStats.totalMCQs}
                </p>
              </motion.div>

              {/* Final Score */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-lg"
              >
                <p className="text-gray-200 text-sm mb-2">Final Score</p>
                <p className="text-5xl font-bold text-white">{opponentStats.finalScore}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center gap-6 flex-wrap"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPlayAgain}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-8 py-4 rounded-lg font-bold text-white text-lg transition shadow-lg"
          >
            🎮 Play Again
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackHome}
            className="bg-gray-700 hover:bg-gray-600 px-8 py-4 rounded-lg font-bold text-white text-lg transition shadow-lg"
          >
            🏠 Back to Home
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
