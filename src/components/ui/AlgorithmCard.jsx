import { motion } from 'framer-motion';
import { Zap, Shield, Heart, TrendingUp, Clock } from 'lucide-react';
import { Badge } from './badge';
import { Progress } from './progress';
import { cn } from "../../lib/utils"

export function AlgorithmCard({ algorithm, variant = 'default', onClick, selected = false }) {
  const typeStyles = {
    SORTING: {
      gradient: 'from-amber-500/20 via-orange-500/20 to-yellow-500/20',
      border: 'border-amber-500/30',
      glow: 'shadow-amber-500/20',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    SEARCHING: {
      gradient: 'from-blue-500/20 via-cyan-500/20 to-sky-500/20',
      border: 'border-blue-500/30',
      glow: 'shadow-blue-500/20',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    },
    GRAPH: {
      gradient: 'from-emerald-500/20 via-green-500/20 to-teal-500/20',
      border: 'border-emerald-500/30',
      glow: 'shadow-emerald-500/20',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    }
  };

  const style = typeStyles[algorithm.type];
  const hpPercent = algorithm.currentHp ? (algorithm.currentHp / algorithm.maxHp) * 100 : 100;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'relative group cursor-pointer rounded-xl border-2 backdrop-blur-sm transition-all',
        'bg-gradient-to-br',
        style.gradient,
        style.border,
        selected && `ring-2 ring-offset-2 ring-offset-black ${style.border}`,
        variant === 'compact' ? 'p-3' : 'p-6'
      )}
    >
      {/* Glow effect on hover */}
      <div className={cn(
        'absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl',
        style.glow
      )} />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Icon with gradient background */}
            <div className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center',
              'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm'
            )}>
              <div className="text-2xl">{algorithm.icon || <Zap className="w-6 h-6" />}</div>
            </div>
            
            <div>
              <h3 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-base font-bold text-white leading-tight">
                {algorithm.name}
              </h3>
              <Badge variant="outline" className={cn('text-xs mt-1', style.badge)}>
                {algorithm.type}
              </Badge>
            </div>
          </div>

          {/* Difficulty badge */}
          {algorithm.difficulty && (
            <Badge variant="secondary" className="text-xs">
              {algorithm.difficulty}
            </Badge>
          )}
        </div>

        {variant !== 'compact' && (
          <>
            {/* HP Bar (if in battle) */}
            {algorithm.currentHp !== undefined && (
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    HP
                  </span>
                  <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-white font-bold">
                    {algorithm.currentHp}/{algorithm.maxHp}
                  </span>
                </div>
                <Progress 
                  value={hpPercent} 
                  className="h-2"
                  indicatorClassName={hpPercent > 50 ? 'bg-emerald-500' : hpPercent > 25 ? 'bg-yellow-500' : 'bg-red-500'}
                />
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <StatPill icon={<Zap className="w-3 h-3" />} label="ATK" value={algorithm.stats.attack} boost={algorithm.boosts?.attack} />
              <StatPill icon={<Shield className="w-3 h-3" />} label="DEF" value={algorithm.stats.defense} boost={algorithm.boosts?.defense} />
              <StatPill icon={<TrendingUp className="w-3 h-3" />} label="SPD" value={algorithm.stats.speed} />
              <StatPill icon={<Heart className="w-3 h-3" />} label="HP" value={algorithm.stats.hp} />
            </div>

            {/* Complexity */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{algorithm.timeComplexity}</span>
              </div>
              <div className={cn('px-2 py-1 rounded-md', style.badge)}>
                {algorithm.stable ? 'Stable' : 'Unstable'}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Selection indicator */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
}

function StatPill({ icon, label, value, boost }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/20 backdrop-blur-sm border border-white/5">
      <div className="text-gray-400">{icon}</div>
      <div className="flex-1">
        <div className="text-xs text-gray-400">{label}</div>
        <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-sm font-bold text-white flex items-center gap-1">
          {value}
          {boost > 0 && (
            <span className="text-emerald-400 text-xs">+{boost}</span>
          )}
        </div>
      </div>
    </div>
  );
}
