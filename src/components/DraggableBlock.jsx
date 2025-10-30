import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function DraggableBlock({ block, disabled = false }) {
  const [isDragging, setIsDragging] = useState(false);

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
      className={`p-3 rounded-lg border-2 flex items-center gap-2 transition-all ${
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
      <div className="text-3xl">{block.icon}</div>
      <div className="flex-1 min-w-0">
        <div 
          className="font-bold text-sm truncate" 
          style={{ color: block.color, fontFamily: 'Orbitron, sans-serif' }}
        >
          {block.name}
        </div>
        <div className="text-[10px] text-gray-500 truncate">
          {block.description}
        </div>
      </div>
      {!disabled && <Plus className="w-4 h-4 opacity-50" style={{ color: block.color }} />}
    </motion.div>
  );
}
