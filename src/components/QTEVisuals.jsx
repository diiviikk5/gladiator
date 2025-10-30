import { motion } from 'framer-motion';
import { Eye, Shuffle, Zap, TrendingUp, Hash, Target, Grid, Layers, Activity, Sparkles } from 'lucide-react';

// ==================== BINARY SEARCH QTE ====================
export const BinarySearchQTE = ({ position }) => {
  const array = [2, 5, 8, 12, 16, 23, 38, 42, 56, 70];
  const targetIndex = Math.floor(array.length / 2);
  const currentIndex = Math.floor((position / 100) * array.length);
  
  return (
    <div className="mb-8">
      <div className="text-center mb-4 text-blue-400 font-bold">
        Finding midpoint of sorted array...
      </div>
      <div className="flex gap-2 justify-center">
        {array.map((num, idx) => (
          <motion.div
            key={idx}
            animate={{
              scale: idx === currentIndex ? 1.3 : 1,
              backgroundColor: idx === targetIndex ? '#3b82f620' : '#1f293710',
              borderColor: idx === currentIndex ? '#3b82f6' : idx === targetIndex ? '#10b981' : '#374151'
            }}
            className="w-12 h-12 rounded border-2 flex items-center justify-center font-bold text-sm"
          >
            {num}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ==================== QUICKSORT QTE ====================
export const QuickSortQTE = ({ position }) => {
  const array = [38, 27, 43, 3, 9, 82, 10];
  const pivotIndex = array.length - 1;
  const pivotValue = array[pivotIndex];
  const leftPartition = array.filter((n, i) => i < pivotIndex && n < pivotValue);
  const rightPartition = array.filter((n, i) => i < pivotIndex && n > pivotValue);
  const balance = Math.abs(leftPartition.length - rightPartition.length);
  
  return (
    <div className="mb-8">
      <div className="text-center mb-4 text-amber-400 font-bold">
        Selecting optimal pivot for balanced partition...
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="p-3 rounded bg-blue-500/20 border border-blue-500">
          <div className="text-blue-400 text-sm mb-2">Left</div>
          <div className="flex flex-wrap gap-1 min-h-[40px]">
            {leftPartition.map((n, i) => (
              <div key={i} className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center text-xs">
                {n}
              </div>
            ))}
          </div>
        </div>
        <div className="p-3 rounded bg-amber-500/20 border border-amber-500">
          <div className="text-amber-400 text-sm mb-2">Pivot</div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="w-12 h-12 mx-auto rounded bg-amber-500 flex items-center justify-center font-bold"
          >
            {pivotValue}
          </motion.div>
        </div>
        <div className="p-3 rounded bg-emerald-500/20 border border-emerald-500">
          <div className="text-emerald-400 text-sm mb-2">Right</div>
          <div className="flex flex-wrap gap-1 min-h-[40px]">
            {rightPartition.map((n, i) => (
              <div key={i} className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center text-xs">
                {n}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={`text-center text-sm ${balance <= 1 ? 'text-emerald-400' : 'text-red-400'}`}>
        Balance: {balance <= 1 ? 'OPTIMAL' : 'UNBALANCED'}
      </div>
    </div>
  );
};

// ==================== MERGE SORT QTE ====================
export const MergeSortQTE = ({ stage }) => {
  const stages = [
    { name: 'DIVIDE', array: [[38, 27, 43, 3], [9, 82, 10]], color: '#3b82f6' },
    { name: 'MERGE', array: [[27, 38], [3, 43], [9, 82], [10]], color: '#10b981' },
    { name: 'CONQUER', array: [[3, 9, 10, 27, 38, 43, 82]], color: '#a855f7' }
  ];
  
  const currentStage = stages[stage] || stages[0];
  
  return (
    <div className="mb-8">
      <div className="text-center mb-4 font-bold" style={{ color: currentStage.color }}>
        {currentStage.name} Phase
      </div>
      <div className="space-y-3">
        {currentStage.array.map((subArray, idx) => (
          <motion.div
            key={idx}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex gap-2 justify-center"
          >
            {subArray.map((num, numIdx) => (
              <div
                key={numIdx}
                className="w-12 h-12 rounded border-2 flex items-center justify-center font-bold"
                style={{ borderColor: currentStage.color, backgroundColor: `${currentStage.color}20` }}
              >
                {num}
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ==================== HASH TABLE QTE ====================
export const HashTableQTE = ({ position }) => {
  const keys = ['apple', 'banana', 'cherry', 'date'];
  const currentKey = keys[Math.floor((position / 100) * keys.length)];
  const hash = currentKey.length % 8;
  
  return (
    <div className="mb-8">
      <div className="text-center mb-4 text-cyan-400 font-bold">
        Hashing key to avoid collisions...
      </div>
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="p-3 rounded bg-blue-500/20 border border-blue-500 text-blue-400 font-bold">
          {currentKey}
        </div>
        <div className="text-amber-400">→</div>
        <div className="text-gray-400 font-mono text-sm">hash("{currentKey}")</div>
        <div className="text-amber-400">→</div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="w-16 h-16 rounded-lg bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 font-black text-2xl"
        >
          {hash}
        </motion.div>
      </div>
      <div className="grid grid-cols-8 gap-2">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className={`h-16 rounded border-2 flex items-center justify-center text-xs ${
              idx === hash ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-gray-700 bg-gray-900/30 text-gray-600'
            }`}
          >
            [{idx}]
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== DIJKSTRA QTE ====================
export const DijkstraQTE = ({ position }) => {
  const progress = position / 100;
  
  return (
    <div className="mb-8">
      <div className="text-center mb-4 text-red-400 font-bold">
        Finding shortest path through graph...
      </div>
      <div className="relative w-full h-48">
        <svg className="absolute inset-0 w-full h-full">
          {/* Nodes */}
          <circle cx="50" cy="100" r="20" fill="#1f2937" stroke="#ef4444" strokeWidth="2" />
          <circle cx="150" cy="50" r="20" fill="#1f2937" stroke={progress > 0.33 ? '#10b981' : '#374151'} strokeWidth="2" />
          <circle cx="150" cy="150" r="20" fill="#1f2937" stroke={progress > 0.33 ? '#10b981' : '#374151'} strokeWidth="2" />
          <circle cx="250" cy="100" r="20" fill="#1f2937" stroke={progress > 0.66 ? '#10b981' : '#374151'} strokeWidth="2" />
          
          {/* Edges */}
          <line x1="70" y1="100" x2="130" y2="60" stroke={progress > 0.25 ? '#10b981' : '#374151'} strokeWidth="2" />
          <line x1="70" y1="100" x2="130" y2="140" stroke={progress > 0.25 ? '#10b981' : '#374151'} strokeWidth="2" />
          <line x1="170" y1="60" x2="230" y2="90" stroke={progress > 0.5 ? '#10b981' : '#374151'} strokeWidth="2" />
          <line x1="170" y1="140" x2="230" y2="110" stroke={progress > 0.5 ? '#10b981' : '#374151'} strokeWidth="2" />
        </svg>
        
        <motion.div
          className="absolute w-4 h-4 rounded-full bg-red-400"
          animate={{
            left: `${50 + (progress * 200)}px`,
            top: '100px'
          }}
        />
      </div>
    </div>
  );
};

// ==================== BFS QTE ====================
export const BFSQTE = ({ position }) => {
  const progress = Math.floor((position / 100) * 5);
  
  return (
    <div className="mb-8">
      <div className="text-center mb-4 text-blue-400 font-bold">
        Breadth-First Search - Level by level exploration
      </div>
      <div className="space-y-4">
        {/* Level 0 */}
        <div className="flex justify-center">
          <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
            progress >= 0 ? 'bg-blue-500 border-blue-500 text-white' : 'bg-gray-900 border-gray-700 text-gray-500'
          }`}>
            0
          </div>
        </div>
        {/* Level 1 */}
        <div className="flex justify-center gap-8">
          {[1, 2].map(n => (
            <div key={n} className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
              progress >= n ? 'bg-blue-500 border-blue-500 text-white' : 'bg-gray-900 border-gray-700 text-gray-500'
            }`}>
              {n}
            </div>
          ))}
        </div>
        {/* Level 2 */}
        <div className="flex justify-center gap-4">
          {[3, 4].map(n => (
            <div key={n} className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
              progress >= n ? 'bg-blue-500 border-blue-500 text-white' : 'bg-gray-900 border-gray-700 text-gray-500'
            }`}>
              {n}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==================== DFS QTE ====================
export const DFSQTE = ({ position }) => {
  const progress = Math.floor((position / 100) * 5);
  const path = [0, 1, 3, 2, 4];
  
  return (
    <div className="mb-8">
      <div className="text-center mb-4 text-purple-400 font-bold">
        Depth-First Search - Go deep first, backtrack later
      </div>
      <div className="relative w-full h-48">
        <svg className="absolute inset-0 w-full h-full">
          <line x1="150" y1="50" x2="80" y2="120" stroke={progress >= 1 ? '#8b5cf6' : '#374151'} strokeWidth="3" />
          <line x1="80" y1="120" x2="80" y2="190" stroke={progress >= 2 ? '#8b5cf6' : '#374151'} strokeWidth="3" />
          <line x1="150" y1="50" x2="220" y2="120" stroke={progress >= 3 ? '#8b5cf6' : '#374151'} strokeWidth="3" />
          <line x1="220" y1="120" x2="220" y2="190" stroke={progress >= 4 ? '#8b5cf6' : '#374151'} strokeWidth="3" />
          
          {path.map((node, idx) => {
            const positions = [
              { x: 150, y: 50 },
              { x: 80, y: 120 },
              { x: 80, y: 190 },
              { x: 220, y: 120 },
              { x: 220, y: 190 }
            ];
            return (
              <circle
                key={node}
                cx={positions[idx].x}
                cy={positions[idx].y}
                r="20"
                fill={progress >= idx ? '#8b5cf6' : '#1f2937'}
                stroke={progress >= idx ? '#8b5cf6' : '#374151'}
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

// ==================== DYNAMIC PROGRAMMING QTE ====================
export const DynamicProgrammingQTE = ({ stage }) => {
  const stages = [
    { name: 'SUBPROBLEM', desc: 'Breaking into smaller problems', color: '#a855f7' },
    { name: 'MEMOIZE', desc: 'Storing solutions', color: '#3b82f6' },
    { name: 'OPTIMIZE', desc: 'Finding optimal path', color: '#10b981' },
    { name: 'SOLVE', desc: 'Combining results', color: '#f59e0b' }
  ];
  
  const current = stages[stage] || stages[0];
  const fibSequence = [0, 1, 1, 2, 3, 5, 8, 13];
  
  return (
    <div className="mb-8">
      <div className="text-center mb-4 font-bold" style={{ color: current.color }}>
        {current.name}: {current.desc}
      </div>
      <div className="grid grid-cols-8 gap-2">
        {fibSequence.map((num, idx) => (
          <motion.div
            key={idx}
            animate={{
              scale: idx <= stage ? 1.1 : 1,
              backgroundColor: idx <= stage ? `${current.color}30` : '#1f293710'
            }}
            className="p-3 rounded border-2 text-center"
            style={{ borderColor: idx <= stage ? current.color : '#374151' }}
          >
            <div className="text-xs text-gray-500 mb-1">F({idx})</div>
            <div className="font-bold" style={{ color: idx <= stage ? current.color : '#6b7280' }}>
              {num}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ==================== HEAP SORT QTE ====================
export const HeapSortQTE = ({ stage }) => {
  const stages = [
    { name: 'HEAPIFY', array: [50, 30, 20, 15, 10, 8, 16], color: '#ec4899' },
    { name: 'EXTRACT', array: [30, 16, 20, 15, 10, 8], color: '#f59e0b' },
    { name: 'SORT', array: [8, 10, 15, 16, 20, 30, 50], color: '#10b981' }
  ];
  
  const current = stages[stage] || stages[0];
  
  return (
    <div className="mb-8">
      <div className="text-center mb-4 font-bold" style={{ color: current.color }}>
        {current.name} Phase
      </div>
      <div className="flex gap-2 justify-center items-end h-48">
        {current.array.map((num, idx) => (
          <motion.div
            key={idx}
            initial={{ height: 0 }}
            animate={{ height: `${(num / 50) * 180}px` }}
            className="w-12 rounded-t flex items-end justify-center pb-2 border-2"
            style={{ 
              backgroundColor: `${current.color}40`,
              borderColor: current.color
            }}
          >
            <span className="text-xs font-bold text-white">{num}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
