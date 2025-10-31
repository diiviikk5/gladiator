import { motion } from 'framer-motion';

export default function HPBar({ current, max, label, color, side = 'left', status = 'active', challenge = null }) {
  const percentage = (current / max) * 100;
  
  const getStatusColor = () => {
    if (percentage <= 20) return '#ef4444';
    if (percentage <= 50) return '#f59e0b';
    return color;
  };

  const getStatusText = () => {
    if (percentage <= 20) return '🔴 CRITICAL';
    if (percentage <= 50) return '🟡 WARNING';
    return '🟢 HEALTHY';
  };

  return (
    <div>
      {/* Header */}
      <div className={`flex justify-between mb-3 text-sm ${side === 'right' ? 'flex-row-reverse' : ''}`}>
        <div>
          <span 
            className="font-bold" 
            style={{ color, fontFamily: 'Orbitron, sans-serif' }}
          >
            {label}
          </span>
          {challenge && (
            <p className="text-xs text-gray-500 mt-1">
              Round {challenge.round} • {challenge.difficulty}
            </p>
          )}
        </div>
        <div className="text-right">
          <span 
            className="font-black tabular-nums text-lg" 
            style={{ color }}
          >
            {current}
          </span>
          <p className="text-xs" style={{ color: getStatusColor() }}>
            {getStatusText()}
          </p>
        </div>
      </div>

      {/* HP Bar */}
      <div 
        className="h-8 bg-gray-800 rounded-full overflow-hidden border-2 relative shadow-lg"
        style={{ borderColor: `${getStatusColor()}80` }}
      >
        <motion.div
          className="h-full relative overflow-hidden"
          style={{ 
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${getStatusColor()}, ${getStatusColor()}dd)`
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
          className="absolute inset-0 flex items-center justify-center font-black text-white"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)', fontFamily: 'Orbitron, sans-serif' }}
        >
          {percentage.toFixed(0)}%
        </div>
      </div>

      {/* Below Bar Info */}
      <div className="mt-2 flex justify-between text-xs text-gray-600">
        <span>{current}/{max} HP</span>
        <span>{percentage >= 75 ? '✅ Stable' : percentage >= 50 ? '⚠️ Caution' : '🔴 Danger'}</span>
      </div>
    </div>
  );
}
