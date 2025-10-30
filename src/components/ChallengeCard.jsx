import { motion } from 'framer-motion';
import { AlertTriangle, Lightbulb } from 'lucide-react';

export default function ChallengeCard({ challenge }) {
  const challengeData = typeof challenge.data === 'function' 
    ? challenge.data() 
    : challenge.data;

  const difficultyColors = {
    easy: '#10b981',
    medium: '#f59e0b',
    hard: '#ef4444'
  };

  const difficultyColor = difficultyColors[challenge.difficulty] || '#6b7280';

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent text-center relative overflow-hidden"
    >
      {/* Background glow */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${difficultyColor}, transparent 70%)`
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Difficulty Badge */}
        <div className="flex justify-center mb-4">
          <span 
            className="px-4 py-1.5 rounded-full text-xs font-bold uppercase"
            style={{
              backgroundColor: `${difficultyColor}20`,
              color: difficultyColor,
              border: `2px solid ${difficultyColor}40`
            }}
          >
            {challenge.difficulty}
          </span>
        </div>

        {/* Alert Icon */}
        <AlertTriangle className="w-14 h-14 text-amber-400 mx-auto mb-4" />
        
        {/* Title */}
        <h2 
          className="text-4xl font-bold mb-3" 
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          {challenge.title}
        </h2>
        
        {/* Description */}
        <p className="text-xl text-gray-300 mb-6">
          {challenge.description}
        </p>
        
        {/* Data Array */}
        <div className="flex justify-center gap-2 flex-wrap mb-6">
          {challengeData.map((num, i) => (
            <motion.div 
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.05, type: 'spring' }}
              className="px-4 py-2 bg-gray-800 rounded-lg font-mono text-lg border border-gray-700 hover:border-emerald-500/50 transition-colors"
            >
              {num}
            </motion.div>
          ))}
        </div>

        {/* Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-left"
        >
          <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-amber-400 mb-1">HINT</div>
            <p className="text-sm text-gray-400">{challenge.hint}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
