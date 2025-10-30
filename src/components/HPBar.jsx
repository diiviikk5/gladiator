import { motion } from 'framer-motion';

export default function HPBar({ current, max, label, color, side = 'left' }) {
  const percentage = (current / max) * 100;
  
  return (
    <div>
      <div className={`flex justify-between mb-2 text-sm ${side === 'right' ? 'flex-row-reverse' : ''}`}>
        <span 
          className="font-bold" 
          style={{ color, fontFamily: 'Orbitron, sans-serif' }}
        >
          {label}
        </span>
        <span 
          className="font-bold tabular-nums" 
          style={{ color }}
        >
          {current}
        </span>
      </div>
      <div 
        className="h-7 bg-gray-800 rounded-full overflow-hidden border-2 relative"
        style={{ borderColor: `${color}80` }}
      >
        <motion.div
          className="h-full relative overflow-hidden"
          style={{ 
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${color}, ${color}dd)`
          }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
            }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
        
        {/* Percentage text overlay */}
        <div 
          className="absolute inset-0 flex items-center justify-center text-xs font-black text-white"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
        >
          {percentage.toFixed(0)}%
        </div>
      </div>
    </div>
  );
}
