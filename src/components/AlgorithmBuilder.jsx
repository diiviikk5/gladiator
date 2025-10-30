import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, XCircle, Trash2 } from 'lucide-react';
import { BLOCK_TYPES } from '../data/algoBlocks';

export default function AlgorithmBuilder({ blocks, onDrop, onRemove, onClear }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const blockId = e.dataTransfer.getData('text/plain');
    if (blockId && onDrop) {
      onDrop(blockId);
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 
          className="text-xl font-bold text-emerald-400" 
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          YOUR ALGORITHM
        </h3>
        <button
          onClick={onClear}
          disabled={blocks.length === 0}
          className="px-3 py-1.5 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm hover:bg-red-500/30 disabled:opacity-20 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`min-h-[350px] p-4 rounded-xl border-2 transition-all duration-200 ${
          isDragOver 
            ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01] shadow-lg shadow-emerald-500/20' 
            : 'border-emerald-500/30 bg-gray-900/50'
        }`}
      >
        {blocks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full min-h-[320px] flex flex-col items-center justify-center text-gray-500 text-center"
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Target className="w-16 h-16 mb-4 opacity-40" />
            </motion.div>
            <p className="text-lg font-bold mb-1">Drop Blocks Here</p>
            <p className="text-xs text-gray-600">
              Drag algorithm blocks from the left to build your solution
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {blocks.map((blockId, index) => {
                const block = BLOCK_TYPES[blockId];
                if (!block) return null;
                
                return (
                  <motion.div
                    key={`${blockId}-${index}`}
                    initial={{ x: -30, opacity: 0, scale: 0.9 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: 30, opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="p-3 rounded-lg border-2 flex items-center gap-3 group relative overflow-hidden"
                    style={{ 
                      borderColor: block.color,
                      backgroundColor: `${block.color}25`
                    }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 opacity-20"
                      animate={{
                        background: [
                          `linear-gradient(90deg, transparent, ${block.color}40, transparent)`,
                          `linear-gradient(90deg, transparent, ${block.color}40, transparent)`
                        ],
                        x: ['-100%', '200%']
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: 'linear'
                      }}
                    />

                    {/* Step Number */}
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 relative z-10"
                      style={{ 
                        backgroundColor: block.color, 
                        color: '#000',
                        boxShadow: `0 0 10px ${block.color}40`
                      }}
                    >
                      {index + 1}
                    </div>
                    
                    {/* Block Icon */}
                    <div className="text-2xl relative z-10">{block.icon}</div>
                    
                    {/* Block Info */}
                    <div className="flex-1 min-w-0 relative z-10">
                      <div 
                        className="font-bold text-sm" 
                        style={{ color: block.color, fontFamily: 'Orbitron, sans-serif' }}
                      >
                        {block.name}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {block.description}
                      </div>
                    </div>
                    
                    {/* Remove Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onRemove(index)}
                      className="p-1.5 bg-red-500/20 rounded-lg text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 relative z-10"
                    >
                      <XCircle className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Block Count */}
      {blocks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-gray-500"
        >
          {blocks.length} block{blocks.length !== 1 ? 's' : ''} added
        </motion.div>
      )}
    </div>
  );
}
