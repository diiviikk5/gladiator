import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Info } from 'lucide-react';

export default function DraggableBlock({ block, disabled = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleDragStart = (e) => {
    if (disabled) return;
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', block.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <motion.div
      draggable={!disabled}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileHover={!disabled ? { scale: 1.03, x: 3 } : {}}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className={`p-3 rounded-lg border-2 flex items-center gap-2 transition-all relative group ${
        disabled 
          ? 'opacity-30 cursor-not-allowed' 
          : isDragging 
            ? 'opacity-50 scale-95 cursor-grabbing' 
            : 'cursor-grab hover:shadow-lg'
      }`}
      style={{ 
        borderColor: block.color,
        backgroundColor: `${block.color}15`,
        boxShadow: !disabled && !isDragging ? `0 0 10px ${block.color}20` : 'none'
      }}
    >
      {/* Tooltip */}
      {showTooltip && !disabled && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full left-0 mb-2 w-48 z-50 p-2 rounded-lg bg-gray-900 border border-gray-700 text-xs space-y-1"
        >
          <p className="font-bold text-cyan-300">{block.name}</p>
          <p className="text-gray-400">{block.description}</p>
          <p className="text-purple-300">Complexity: {block.complexity}</p>
          <p className="text-yellow-300">Teaches: {block.teaches}</p>
          <p className="text-emerald-300">Time Cost: {block.executionTime}ms</p>
        </motion.div>
      )}

      <div className="text-3xl">{block.icon}</div>
      <div className="flex-1 min-w-0">
        <div 
          className="font-bold text-sm truncate" 
          style={{ color: block.color, fontFamily: 'Orbitron, sans-serif' }}
        >
          {block.name}
        </div>
        <div className="text-[10px] text-gray-500 truncate">
          {block.complexity} • {block.teaches}
        </div>
      </div>
      {!disabled && <Plus className="w-4 h-4 opacity-50" style={{ color: block.color }} />}
    </motion.div>
  );
}
