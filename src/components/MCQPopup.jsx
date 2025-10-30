import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Zap } from 'lucide-react';

export default function MCQPopup({
  isOpen,
  currentMCQ,
  selectedAnswer,
  onAnswerSelect,
}) {
  if (!isOpen || !currentMCQ) return null;

  const isAnswered = selectedAnswer !== null;
  const isCorrect = isAnswered && selectedAnswer === currentMCQ.answer;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl mx-4"
          >
            {/* ANIMATED BORDER */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-60 animate-pulse"></div>

            {/* CONTENT */}
            <motion.div className="relative bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-cyan-500/50 rounded-2xl p-8 shadow-2xl">
              {/* HEADER */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-6"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                />
                <h2 className="text-xl font-bold text-cyan-300 uppercase tracking-wider">Quick Question!</h2>
              </motion.div>

              {/* QUESTION */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <p className="text-2xl font-bold text-white leading-relaxed">
                  {currentMCQ.q}
                </p>
              </motion.div>

              {/* OPTIONS */}
              <div className="space-y-3 mb-8">
                {currentMCQ.options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                    onClick={() => !isAnswered && onAnswerSelect(option)}
                    disabled={isAnswered}
                    whileHover={!isAnswered ? { scale: 1.05, x: 10 } : {}}
                    whileTap={!isAnswered ? { scale: 0.95 } : {}}
                    className={`w-full p-4 rounded-lg font-semibold text-lg transition-all text-left flex items-center gap-4 border-2 ${
                      selectedAnswer === option
                        ? isCorrect
                          ? 'bg-green-600/30 border-green-500 text-green-300 shadow-lg shadow-green-500/50'
                          : 'bg-red-600/30 border-red-500 text-red-300 shadow-lg shadow-red-500/50'
                        : isAnswered
                        ? 'bg-gray-800/50 border-gray-700 text-gray-500'
                        : 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700/50 hover:border-cyan-500 cursor-pointer'
                    }`}
                  >
                    <motion.span
                      initial={{ rotate: 0 }}
                      animate={selectedAnswer === option ? { rotate: 360 } : { rotate: 0 }}
                      className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center flex-shrink-0"
                    >
                      {String.fromCharCode(65 + idx)}
                    </motion.span>
                    <span className="flex-1">{option}</span>
                    {selectedAnswer === option && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        {isCorrect ? (
                          <CheckCircle size={24} className="text-green-400" />
                        ) : (
                          <XCircle size={24} className="text-red-400" />
                        )}
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* FEEDBACK */}
              <AnimatePresence>
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`p-4 rounded-lg text-center font-bold text-lg flex items-center justify-center gap-2 ${
                      isCorrect
                        ? 'bg-green-900/40 border-2 border-green-500 text-green-300'
                        : 'bg-red-900/40 border-2 border-red-500 text-red-300'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <Zap size={20} />
                        Correct! Great Job! +10 Points
                      </>
                    ) : (
                      <>
                        <XCircle size={20} />
                        Wrong! Correct answer: <span className="font-black">{currentMCQ.answer}</span>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
