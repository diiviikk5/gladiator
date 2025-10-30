import { motion } from 'framer-motion';

export default function TypingDisplay({
  paragraph,
  typedText,
  currentWord,
  wpm,
  accuracy,
}) {
  const getCharClass = (char, idx) => {
    if (idx < typedText.length) {
      return typedText[idx] === char
        ? 'text-green-400 bg-green-900/20 font-bold'
        : 'text-red-500 bg-red-900/30 font-bold underline';
    }
    return idx === typedText.length
      ? 'text-cyan-300 bg-cyan-900/20 animate-pulse'
      : 'text-gray-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* LIVE STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-2 border-cyan-500/50 p-4 rounded-lg backdrop-blur"
        >
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">WPM</p>
          <motion.p
            key={wpm}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-black text-cyan-300 mt-2"
          >
            {wpm}
          </motion.p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-2 border-green-500/50 p-4 rounded-lg backdrop-blur"
        >
          <p className="text-green-400 text-sm font-semibold uppercase tracking-wider">Accuracy</p>
          <motion.p
            key={accuracy}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-black text-green-300 mt-2"
          >
            {accuracy}%
          </motion.p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-2 border-purple-500/50 p-4 rounded-lg backdrop-blur"
        >
          <p className="text-purple-400 text-sm font-semibold uppercase tracking-wider">Chars</p>
          <motion.p
            key={typedText.length}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-black text-purple-300 mt-2"
          >
            {typedText.length}
          </motion.p>
        </motion.div>
      </div>

      {/* TYPING AREA */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition"></div>
        <div className="relative bg-gray-900/90 border-2 border-cyan-500/30 rounded-xl p-8 backdrop-blur-xl min-h-48 overflow-auto scroll-smooth">
          <div className="text-2xl leading-relaxed font-mono tracking-wider">
            {paragraph.split('').map((char, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.001 }}
                className={`${getCharClass(
                  char,
                  idx
                )} transition-all duration-75 inline-block px-0.5`}
              >
                {char === ' ' ? '·' : char}
              </motion.span>
            ))}
          </div>

          {/* CURSOR */}
          {typedText.length < paragraph.length && (
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="absolute w-1 h-8 bg-cyan-400 rounded-full"
              style={{ left: `${(typedText.length % 50) * 1.5}%`, top: '2rem' }}
            />
          )}

          {/* PROGRESS BAR */}
          <motion.div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-b-xl"
            initial={{ width: 0 }}
            animate={{ width: `${(typedText.length / paragraph.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* STATS FOOTER */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-gray-800/50 border border-gray-700 p-3 rounded-lg">
          <p className="text-gray-400 text-xs">Typed</p>
          <p className="text-cyan-400 font-bold text-lg">{typedText.length}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 p-3 rounded-lg">
          <p className="text-gray-400 text-xs">Progress</p>
          <p className="text-blue-400 font-bold text-lg">
            {Math.round((typedText.length / paragraph.length) * 100)}%
          </p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 p-3 rounded-lg">
          <p className="text-gray-400 text-xs">Errors</p>
          <p className="text-red-400 font-bold text-lg">
            {typedText.split('').filter((c, i) => c !== paragraph[i] && i < paragraph.length).length}
          </p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 p-3 rounded-lg">
          <p className="text-gray-400 text-xs">Remaining</p>
          <p className="text-yellow-400 font-bold text-lg">
            {Math.max(0, paragraph.length - typedText.length)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
