import { motion, AnimatePresence } from 'framer-motion';

export default function DuelGameScreen({
  timeLeft,
  playerStats,
  opponentStats,
  opponentName,
  currentParagraph,
  typedText,
  onTyping,
  typingInputRef,
  showMCQPopup,
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* HEADER - Timer and Scores */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8 bg-gray-800/50 p-6 rounded-lg backdrop-blur"
      >
        {/* Player Stats */}
        <div className="text-center flex-1">
          <p className="text-gray-400 text-sm">You</p>
          <p className="text-cyan-400 text-2xl font-bold">{playerStats.wpm} WPM</p>
          <p className="text-green-400 text-sm">{playerStats.accuracy}% Acc</p>
          <p className="text-yellow-400 text-sm mt-1">
            MCQ: {playerStats.correctMCQs}/{playerStats.totalMCQs}
          </p>
        </div>

        {/* Timer */}
        <div className="text-center">
          <motion.div
            animate={{
              scale: timeLeft <= 10 ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className={`text-5xl font-bold ${
              timeLeft <= 10 ? 'text-red-500' : 'text-cyan-400'
            }`}
          >
            {timeLeft}s
          </motion.div>
        </div>

        {/* Opponent Stats */}
        <div className="text-center flex-1">
          <p className="text-gray-400 text-sm">{opponentName}</p>
          <p className="text-purple-400 text-2xl font-bold">{opponentStats.wpm} WPM</p>
          <p className="text-green-400 text-sm">{opponentStats.accuracy}% Acc</p>
          <p className="text-yellow-400 text-sm mt-1">
            MCQ: {opponentStats.correctMCQs}/{opponentStats.totalMCQs}
          </p>
        </div>
      </motion.div>

      {/* PARAGRAPH - Typing Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800/50 p-8 rounded-lg mb-6 backdrop-blur"
      >
        {/* Paragraph Display with Character Highlighting */}
        <div className="text-gray-300 text-lg leading-relaxed mb-6 select-none font-mono">
          {currentParagraph.split('').map((char, idx) => {
            let charClass = 'text-gray-400';
            if (idx < typedText.length) {
              charClass =
                typedText[idx] === char
                  ? 'text-green-400 font-semibold'
                  : 'text-red-500 font-semibold bg-red-900/30';
            }
            return (
              <span key={idx} className={charClass}>
                {char === ' ' ? '·' : char}
              </span>
            );
          })}
        </div>

        {/* Typing Input */}
        <input
          ref={typingInputRef}
          type="text"
          value={typedText}
          onChange={onTyping}
          placeholder="Start typing here..."
          disabled={showMCQPopup}
          className="w-full bg-gray-700/50 text-white px-4 py-3 rounded border-2 border-cyan-500/30 focus:border-cyan-500 outline-none text-lg font-mono"
          autoFocus
        />

        {/* Stats Footer */}
        <div className="mt-4 grid grid-cols-4 gap-4 text-sm text-gray-400">
          <div>
            <span className="text-gray-500">Typed: </span>
            <span className="text-cyan-400">{typedText.length}</span>
            <span className="text-gray-500">/{currentParagraph.length}</span>
          </div>
          <div>
            <span className="text-gray-500">Correct: </span>
            <span className="text-green-400">{playerStats.correctChars}</span>
          </div>
          <div>
            <span className="text-gray-500">Progress: </span>
            <span className="text-blue-400">
              {Math.round((typedText.length / currentParagraph.length) * 100)}%
            </span>
          </div>
          <div>
            <span className="text-gray-500">Score: </span>
            <span className="text-yellow-400">{playerStats.finalScore}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
