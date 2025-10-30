import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Shield, Zap, RotateCcw, Code, Timer } from 'lucide-react';
import { AlgorithmCard } from './AlgorithmCard';
import { Button } from './button';
import { Card } from './card';
import { Separator } from './separator';
import { cn } from "../../lib/utils"

export function BattleArena({ 
  playerActive, 
  opponentActive, 
  playerTeam,
  opponentTeam,
  battleLog,
  onAttack,
  onDefend,
  onBoost,
  onSwitch,
  turn,
  timeLeft
}) {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Background effects */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-transparent to-amber-500" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Timer Bar */}
        <motion.div 
          initial={{ scaleX: 1 }}
          animate={{ scaleX: timeLeft / 15 }}
          className="h-2 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full mb-6"
        />

        {/* Battle Arena */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          {/* Opponent Side */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-lg font-bold text-red-400">
                OPPONENT
              </h3>
              <Timer className="w-5 h-5 text-red-400" />
            </div>
            
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              key={opponentActive?.id}
            >
              <AlgorithmCard algorithm={opponentActive} />
            </motion.div>

            {/* Team preview */}
            <div className="flex gap-2">
              {opponentTeam?.filter(a => a.id !== opponentActive?.id).map(algo => (
                <TeamPreviewCard key={algo.id} algorithm={algo} />
              ))}
            </div>
          </div>

          {/* Player Side */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-lg font-bold text-emerald-400">
                YOU
              </h3>
              <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-sm text-gray-400">
                Turn {turn}
              </div>
            </div>
            
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              key={playerActive?.id}
            >
              <AlgorithmCard algorithm={playerActive} />
            </motion.div>

            {/* Team preview */}
            <div className="flex gap-2">
              {playerTeam?.filter(a => a.id !== playerActive?.id).map(algo => (
                <TeamPreviewCard key={algo.id} algorithm={algo} onClick={() => onSwitch(algo)} />
              ))}
            </div>
          </div>
        </div>

        {/* Battle Log */}
        <Card className="p-4 mb-6 bg-black/40 backdrop-blur-sm border-emerald-500/20">
          <div className="space-y-2">
            {battleLog?.slice(-5).map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-gray-300 flex items-center gap-2"
              >
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                {log}
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-4">
          <ActionButton
            icon={<Sword className="w-6 h-6" />}
            label="ATTACK"
            description="Code Challenge"
            onClick={onAttack}
            variant="destructive"
          />
          <ActionButton
            icon={<Shield className="w-6 h-6" />}
            label="DEFEND"
            description="Reduce damage 50%"
            onClick={onDefend}
            variant="secondary"
          />
          <ActionButton
            icon={<Zap className="w-6 h-6" />}
            label="BOOST"
            description="+1 ATK/DEF/SPD"
            onClick={onBoost}
            variant="default"
          />
          <ActionButton
            icon={<RotateCcw className="w-6 h-6" />}
            label="SWITCH"
            description="Change algorithm"
            onClick={() => {}}
            variant="outline"
          />
        </div>
      </div>
    </div>
  );
}

function TeamPreviewCard({ algorithm, onClick }) {
  const hpPercent = (algorithm.currentHp / algorithm.maxHp) * 100;
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex-1 p-3 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-emerald-500/50 transition-all"
    >
      <div className="text-2xl mb-1">{algorithm.icon}</div>
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className={cn(
            'h-full transition-all',
            hpPercent > 50 ? 'bg-emerald-500' : hpPercent > 25 ? 'bg-yellow-500' : 'bg-red-500'
          )}
          style={{ width: `${hpPercent}%` }}
        />
      </div>
    </motion.button>
  );
}

function ActionButton({ icon, label, description, onClick, variant }) {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      className="h-auto flex-col gap-2 p-6 group"
    >
      <div className="group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="font-bold text-base">
        {label}
      </div>
      <div className="text-xs opacity-70">
        {description}
      </div>
    </Button>
  );
}
