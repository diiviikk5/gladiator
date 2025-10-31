import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, XCircle, Trash2, AlertCircle } from 'lucide-react';
import { BLOCK_TYPES } from '../data/algoBlocks';

export default function AlgorithmBuilder({ blocks, onDrop, onRemove, onClear, challenge = null }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState('');

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
      // Max blocks validation
      if (blocks.length >= 10) {
        setValidationError('⚠️ Maximum 10 blocks allowed!');
        setTimeout(() => setValidationError(''), 3000);
        return;
      }

      // Challenge-specific validation
      if (challenge && challenge.requiredBlocks) {
        const blocksUsed = [...blocks, blockId];
        const hasAllRequired = challenge.requiredBlocks.every(req => blocksUsed.includes(req));
        
        if (blocksUsed.length > challenge.requiredBlocks.length + 2) {
          setValidationError(`💡 Tip: This challenge needs ${challenge.requiredBlocks.join(', ')}`);
          setTimeout(() => setValidationError(''), 4000);
        }
      }

      onDrop(blockId);
      setValidationError('');
    }
  };

  // Calculate algorithm efficiency
  const calculateSuggestion = () => {
    if (!challenge) return '';
    
    const hasRequired = challenge.requiredBlocks.every(b => blocks.includes(b));
    const hasOptimal = challenge.optimalBlocks.every(b => blocks.includes(b));
    
    if (!hasRequired) {
      const missing = challenge.requiredBlocks.filter(b => !blocks.includes(b));
      return `Missing: ${missing.join(', ')}`;
    }
    
    if (!hasOptimal) {
      const canAdd = challenge.optimalBlocks.filter(b => !blocks.includes(b));
      return `Optimize with: ${canAdd.join(', ')}`;
    }
    
    return `✅ Optimal algorithm!`;
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 
            className="text-xl font-bold text-emerald-400" 
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            YOUR ALGORITHM
          </h3>
          {challenge && (
            <p className="text-xs text-gray-500 mt-1">
              {challenge.type.toUpperCase()} • {challenge.difficulty.toUpperCase()}
            </p>
          )}
        </div>
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
            <p className="text-xs text-gray-600 mb-3">
              Drag algorithm blocks from left to solve this {challenge?.type || 'algorithm'} challenge
            </p>
            {challenge && (
              <p className="text-xs text-emerald-400/70 font-mono">
                Required: {challenge.requiredBlocks.join(' → ')}
              </p>
            )}
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
                    
                    {/* Block Icon & Info */}
                    <div className="flex items-center gap-2 flex-1 min-w-0 relative z-10">
                      <div className="text-2xl flex-shrink-0">{block.icon}</div>
                      <div className="min-w-0">
                        <div 
                          className="font-bold text-sm" 
                          style={{ color: block.color, fontFamily: 'Orbitron, sans-serif' }}
                        >
                          {block.name}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {block.complexity} • {block.teaches}
                        </div>
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

      {/* Validation Messages */}
      <AnimatePresence>
        {validationError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-2 rounded-lg bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 text-xs flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {validationError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Algorithm Suggestion */}
      {challenge && blocks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`p-3 rounded-lg border-2 text-xs font-mono ${
            calculateSuggestion().includes('✅')
              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
              : 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300'
          }`}
        >
          💡 {calculateSuggestion()}
        </motion.div>
      )}

      {/* Block Count & Stats */}
      {blocks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-3 gap-2 text-xs"
        >
          <div className="p-2 rounded-lg bg-blue-900/30 border border-blue-600/50 text-center">
            <p className="text-blue-300 font-bold">{blocks.length}/10</p>
            <p className="text-gray-500">Blocks</p>
          </div>
          <div className="p-2 rounded-lg bg-purple-900/30 border border-purple-600/50 text-center">
            <p className="text-purple-300 font-bold">
              {blocks.reduce((sum, bid) => sum + (BLOCK_TYPES[bid]?.executionTime || 0), 0)}ms
            </p>
            <p className="text-gray-500">Exec Time</p>
          </div>
          <div className="p-2 rounded-lg bg-cyan-900/30 border border-cyan-600/50 text-center">
            <p className="text-cyan-300 font-bold">{challenge ? calculateSuggestion().includes('✅') ? '✅' : '⚠️' : '—'}</p>
            <p className="text-gray-500">Status</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
