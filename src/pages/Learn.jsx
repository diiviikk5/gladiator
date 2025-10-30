import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  GraduationCap, Code, Brain, Zap, TrendingUp, BookOpen,
  Search, Filter, CheckCircle, Clock, Award, ChevronRight,
  Eye, Shuffle, Target, Sparkles, Info, PlayCircle, X,
  ArrowRight, AlertCircle, Activity, Grid, Layers
} from 'lucide-react';

const loadOrbitronFont = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
};

// Premium Card Component
const PremiumCard = ({ children, className = "", variant = "default" }) => {
  const variants = {
    default: "bg-black/50 border-white/10",
    glow: "bg-black/50 border-emerald-400/30 shadow-[0_0_40px_rgba(16,185,129,0.15)]",
    premium: "bg-gradient-to-br from-emerald-900/20 via-black/50 to-purple-900/20 border-purple-400/30 shadow-[0_0_40px_rgba(168,85,247,0.15)]"
  };

  return (
    <motion.div
      className={`relative backdrop-blur-2xl border rounded-2xl p-6 ${variants[variant]} ${className}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {children}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-emerald-400/40 rounded-tl-2xl" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-purple-400/40 rounded-br-2xl" />
    </motion.div>
  );
};

const RevealOnScroll = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  
  return (
    <div ref={ref}>
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : { y: 60, opacity: 0 }}
        transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// ALGORITHM DATA with real concepts
const ALGORITHMS = {
  binarySearch: {
    id: 'binarySearch',
    icon: Eye,
    name: 'Binary Search',
    complexity: 'O(log n)',
    category: 'Searching',
    categoryId: 'searching',
    difficulty: 'Easy',
    color: '#3b82f6',
    description: 'Efficiently search sorted arrays by repeatedly dividing the search interval in half. Eliminate half of possibilities with each comparison.',
    realWorld: ['Database indexing', 'Dictionary lookups', 'Version control systems'],
    visualization: 'binarySearch'
  },
  quickSort: {
    id: 'quickSort',
    icon: Zap,
    name: 'QuickSort',
    complexity: 'O(n log n)',
    category: 'Sorting',
    categoryId: 'sorting',
    difficulty: 'Medium',
    color: '#f59e0b',
    description: 'Partition-based sorting using a pivot element. One of the fastest sorting algorithms in practice with average O(n log n) performance.',
    realWorld: ['Operating system file sorting', 'Data processing pipelines', 'Standard library implementations'],
    visualization: 'quickSort'
  },
  bubbleSort: {
    id: 'bubbleSort',
    icon: Shuffle,
    name: 'Bubble Sort',
    complexity: 'O(n²)',
    category: 'Sorting',
    categoryId: 'sorting',
    difficulty: 'Easy',
    color: '#8b5cf6',
    description: 'Simple sorting algorithm that repeatedly swaps adjacent elements if they are in wrong order. Great for learning fundamentals.',
    realWorld: ['Educational purposes', 'Small dataset sorting', 'Nearly sorted data'],
    visualization: 'bubbleSort'
  },
  mergeSort: {
    id: 'mergeSort',
    icon: TrendingUp,
    name: 'Merge Sort',
    complexity: 'O(n log n)',
    category: 'Sorting',
    categoryId: 'sorting',
    difficulty: 'Medium',
    color: '#10b981',
    description: 'Stable divide-and-conquer sorting. Always guarantees O(n log n) performance with predictable behavior.',
    realWorld: ['External sorting', 'Linked list sorting', 'Parallel processing'],
    visualization: 'mergeSort'
  },
  dijkstra: {
    id: 'dijkstra',
    icon: Target,
    name: "Dijkstra's Algorithm",
    complexity: 'O((V + E) log V)',
    category: 'Graphs',
    categoryId: 'graphs',
    difficulty: 'Hard',
    color: '#ef4444',
    description: 'Find shortest paths in weighted graphs. Essential for pathfinding and navigation systems.',
    realWorld: ['GPS navigation', 'Network routing', 'Game AI pathfinding'],
    visualization: 'dijkstra'
  },
  bfs: {
    id: 'bfs',
    icon: Grid,
    name: 'Breadth-First Search',
    complexity: 'O(V + E)',
    category: 'Graphs',
    categoryId: 'graphs',
    difficulty: 'Medium',
    color: '#06b6d4',
    description: 'Explore graph level by level. Find shortest path in unweighted graphs.',
    realWorld: ['Social network friends', 'Web crawlers', 'Shortest path in maze'],
    visualization: 'bfs'
  },
  dfs: {
    id: 'dfs',
    icon: Layers,
    name: 'Depth-First Search',
    complexity: 'O(V + E)',
    category: 'Graphs',
    categoryId: 'graphs',
    difficulty: 'Medium',
    color: '#8b5cf6',
    description: 'Explore graph by going as deep as possible before backtracking.',
    realWorld: ['Topological sorting', 'Cycle detection', 'Maze generation'],
    visualization: 'dfs'
  },
  hashTable: {
    id: 'hashTable',
    icon: Brain,
    name: 'Hash Table',
    complexity: 'O(1)',
    category: 'Data Structures',
    categoryId: 'advanced',
    difficulty: 'Medium',
    color: '#f59e0b',
    description: 'Lightning-fast lookups using key-value pairs. Perfect memory with constant time access.',
    realWorld: ['Database indexing', 'Caching systems', 'Symbol tables'],
    visualization: 'hashTable'
  },
  dynamicProgramming: {
    id: 'dynamicProgramming',
    icon: Sparkles,
    name: 'Dynamic Programming',
    complexity: 'Varies',
    category: 'Advanced',
    categoryId: 'advanced',
    difficulty: 'Hard',
    color: '#a855f7',
    description: 'Solve complex problems by breaking them into overlapping subproblems. Master optimization.',
    realWorld: ['Resource allocation', 'Sequence alignment', 'Shortest path variations'],
    visualization: 'dynamicProgramming'
  },
  heapSort: {
    id: 'heapSort',
    icon: TrendingUp,
    name: 'Heap Sort',
    complexity: 'O(n log n)',
    category: 'Sorting',
    categoryId: 'sorting',
    difficulty: 'Medium',
    color: '#ec4899',
    description: 'Comparison-based sorting using binary heap data structure. In-place with guaranteed performance.',
    realWorld: ['Priority queues', 'Job scheduling', 'Operating systems'],
    visualization: 'heapSort'
  },
  linkedList: {
    id: 'linkedList',
    icon: ArrowRight,
    name: 'Linked List',
    complexity: 'O(n)',
    category: 'Data Structures',
    categoryId: 'advanced',
    difficulty: 'Easy',
    color: '#06b6d4',
    description: 'Linear data structure where elements point to next element. Dynamic size with O(1) insertion.',
    realWorld: ['Undo functionality', 'Music playlists', 'Browser history'],
    visualization: 'linkedList'
  },
  binaryTree: {
    id: 'binaryTree',
    icon: Activity,
    name: 'Binary Tree',
    complexity: 'O(log n)',
    category: 'Data Structures',
    categoryId: 'advanced',
    difficulty: 'Medium',
    color: '#10b981',
    description: 'Hierarchical structure where each node has at most two children. Foundation for many algorithms.',
    realWorld: ['File systems', 'Expression parsing', 'Decision trees'],
    visualization: 'binaryTree'
  },
};

// Algorithm Card Component
const AlgorithmCard = ({ algo, onClick }) => {
  const Icon = algo.icon;
  const isHard = algo.difficulty === 'Hard';

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      onClick={() => onClick(algo)}
      className={`relative p-6 rounded-xl border-2 cursor-pointer group transition-all ${
        isHard
          ? 'bg-gradient-to-br from-red-900/30 to-purple-900/30 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
          : 'bg-gradient-to-br from-white/5 to-black/50 border-white/20 hover:border-white/50'
      }`}
      style={{ borderColor: algo.color }}
    >
      {/* Icon & Badge */}
      <div className="flex items-center justify-between mb-4">
        <motion.div
          className="p-3 rounded-xl border-2"
          style={{ 
            borderColor: algo.color,
            backgroundColor: `${algo.color}20`
          }}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="w-8 h-8" style={{ color: algo.color }} />
        </motion.div>
        
        <div 
          className="px-3 py-1 rounded-full text-xs font-bold border-2"
          style={{ 
            borderColor: algo.color, 
            backgroundColor: `${algo.color}30`,
            color: algo.color
          }}
        >
          {algo.difficulty.toUpperCase()}
        </div>
      </div>

      {/* Name */}
      <h3 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-xl font-black text-white mb-2">
        {algo.name}
      </h3>
      
      {/* Description */}
      <p className="text-sm text-gray-400 mb-4 min-h-[60px]">
        {algo.description}
      </p>

      {/* Stats */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Complexity:</span>
          <span className="font-bold text-amber-400">{algo.complexity}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Category:</span>
          <span className="font-bold text-emerald-400">{algo.category}</span>
        </div>
      </div>

      {/* View Details */}
      <div 
        className="flex items-center justify-center gap-2 py-3 rounded-lg border transition-all"
        style={{ 
          backgroundColor: `${algo.color}10`,
          borderColor: `${algo.color}40`
        }}
      >
        <PlayCircle className="w-5 h-5" style={{ color: algo.color }} />
        <span className="text-sm font-bold" style={{ color: algo.color }}>
          VISUALIZE
        </span>
        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: algo.color }} />
      </div>

      {/* Glow Effect */}
      {isHard && (
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ boxShadow: '0 0 40px rgba(239, 68, 68, 0.4)' }}
        />
      )}
    </motion.div>
  );
};

// TYPE "continue" FOR VISUALIZATION MODALS + REST OF COMPONENT
// VISUALIZATION COMPONENTS

// ==================== COMPLETE ALGORITHM VISUALIZATIONS ====================

// 1. BINARY SEARCH - PROPER IMPLEMENTATION
const BinarySearchViz = () => {
  const [array] = useState([1, 5, 12, 18, 23, 29, 34, 41, 47, 55, 62, 71]);
  const [target] = useState(29);
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(11);
  const [mid, setMid] = useState(5);
  const [found, setFound] = useState(false);
  const [step, setStep] = useState(0);
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    if (found || left > right) return;
    
    const timer = setTimeout(() => {
      const currentMid = Math.floor((left + right) / 2);
      setMid(currentMid);
      setComparing(true);
      
      setTimeout(() => {
        if (array[currentMid] === target) {
          setFound(true);
        } else if (array[currentMid] < target) {
          setLeft(currentMid + 1);
          setStep(prev => prev + 1);
        } else {
          setRight(currentMid - 1);
          setStep(prev => prev + 1);
        }
        setComparing(false);
      }, 1000);
    }, 1500);

    return () => clearTimeout(timer);
  }, [left, right, found, array, target]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-gray-400">Target: </span>
          <span className="text-emerald-400 font-bold text-2xl">{target}</span>
        </div>
        <div>
          <span className="text-gray-400">Step: </span>
          <span className="text-amber-400 font-bold text-xl">{step}</span>
        </div>
        <div>
          <span className="text-gray-400">Range: </span>
          <span className="text-blue-400 font-bold">[{left}, {right}]</span>
        </div>
      </div>
      
      <div className="flex gap-2 mb-6 justify-center">
        {array.map((num, idx) => (
          <motion.div
            key={idx}
            animate={{
              scale: idx === mid && comparing ? 1.3 : idx === mid ? 1.2 : 1,
              y: idx === mid && comparing ? -10 : 0,
              backgroundColor: 
                found && idx === mid ? '#10b981' :
                idx === mid ? '#f59e0b' :
                idx >= left && idx <= right ? '#3b82f640' :
                '#1f293720',
              borderColor:
                found && idx === mid ? '#10b981' :
                idx === mid ? '#f59e0b' :
                idx >= left && idx <= right ? '#3b82f6' :
                '#374151'
            }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-16 h-16 rounded-lg border-2 flex items-center justify-center font-bold text-lg"
          >
            <span className={`${
              found && idx === mid ? 'text-white' :
              idx === mid ? 'text-white' :
              idx >= left && idx <= right ? 'text-white' :
              'text-gray-600'
            }`}>
              {num}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Arrows showing left, mid, right */}
      <div className="flex justify-center gap-8 mb-4">
        <div className="text-center">
          <div className="text-blue-400 font-bold mb-1">LEFT</div>
          <div className="text-2xl text-blue-400">↑</div>
          <div className="text-gray-500 text-sm">Index: {left}</div>
        </div>
        <div className="text-center">
          <div className="text-amber-400 font-bold mb-1">MID</div>
          <div className="text-2xl text-amber-400">↑</div>
          <div className="text-gray-500 text-sm">Index: {mid}</div>
        </div>
        <div className="text-center">
          <div className="text-blue-400 font-bold mb-1">RIGHT</div>
          <div className="text-2xl text-blue-400">↑</div>
          <div className="text-gray-500 text-sm">Index: {right}</div>
        </div>
      </div>

      {found && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-4 rounded-xl bg-emerald-500/20 border-2 border-emerald-500"
        >
          <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <div className="text-emerald-400 font-bold text-xl">
            ✓ Found {target} at index {mid} in {step} steps!
          </div>
        </motion.div>
      )}

      {left > right && !found && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-4 rounded-xl bg-red-500/20 border-2 border-red-500"
        >
          <div className="text-red-400 font-bold text-xl">
            ✗ Element not found
          </div>
        </motion.div>
      )}
    </div>
  );
};

// 2. BUBBLE SORT - PROPER SORTING ALGORITHM
const BubbleSortViz = () => {
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90, 88]);
  const [comparing, setComparing] = useState([-1, -1]);
  const [sorted, setSorted] = useState([]);
  const [swapping, setSwapping] = useState(false);
  const [pass, setPass] = useState(0);

  useEffect(() => {
    const arr = [...array];
    let i = 0;
    let j = 0;
    let swapped = false;
    
    const timer = setInterval(() => {
      if (i < arr.length - 1) {
        if (j < arr.length - i - 1) {
          setComparing([j, j + 1]);
          
          if (arr[j] > arr[j + 1]) {
            setSwapping(true);
            setTimeout(() => {
              [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
              setArray([...arr]);
              setSwapping(false);
              swapped = true;
            }, 300);
          }
          j++;
        } else {
          setSorted(prev => [...prev, arr.length - i - 1]);
          setPass(prev => prev + 1);
          j = 0;
          i++;
          if (!swapped) {
            setSorted(Array.from({ length: arr.length }, (_, idx) => idx));
            clearInterval(timer);
          }
          swapped = false;
        }
      } else {
        setSorted(Array.from({ length: arr.length }, (_, idx) => idx));
        clearInterval(timer);
      }
    }, 600);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-8">
      <div className="text-center mb-6">
        <div className="text-gray-400 mb-2">Pass: <span className="text-purple-400 font-bold">{pass}</span></div>
      </div>
      
      <div className="flex gap-3 items-end justify-center h-80 mb-6">
        {array.map((num, idx) => (
          <motion.div
            key={idx}
            animate={{
              height: `${(num / 100) * 260}px`,
              backgroundColor: 
                sorted.includes(idx) ? '#10b981' :
                comparing.includes(idx) && swapping ? '#ef4444' :
                comparing.includes(idx) ? '#f59e0b' :
                '#3b82f6',
              scale: comparing.includes(idx) ? 1.1 : 1
            }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-14 rounded-t-xl flex flex-col items-center justify-between pb-2 border-2 border-white/20"
            style={{ minHeight: '60px' }}
          >
            <div className="text-xs font-bold text-white mt-2">{num}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/50">
          <div className="text-blue-400 font-bold mb-1">Unsorted</div>
          <div className="w-6 h-6 rounded bg-blue-500" />
        </div>
        <div className="p-3 rounded-lg bg-amber-500/20 border border-amber-500/50">
          <div className="text-amber-400 font-bold mb-1">Comparing</div>
          <div className="w-6 h-6 rounded bg-amber-500" />
        </div>
        <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/50">
          <div className="text-emerald-400 font-bold mb-1">Sorted</div>
          <div className="w-6 h-6 rounded bg-emerald-500" />
        </div>
      </div>
    </div>
  );
};

// 3. QUICKSORT - PROPER PARTITION VISUALIZATION
const QuickSortViz = () => {
  const [array, setArray] = useState([38, 27, 43, 3, 9, 82, 10]);
  const [pivot, setPivot] = useState(6);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const pivotValue = array[pivot];
      const leftPart = array.filter(num => num < pivotValue);
      const rightPart = array.filter(num => num > pivotValue);
      
      setLeft(leftPart);
      setRight(rightPart);
      setStep(prev => prev + 1);
      
      if (step > 0) {
        const newArray = [...leftPart, pivotValue, ...rightPart];
        setArray(newArray);
        setPivot(leftPart.length);
      }
    }, 2500);

    return () => clearInterval(timer);
  }, [step]);

  return (
    <div className="p-8">
      <div className="text-center mb-6">
        <div className="text-gray-400 mb-2">
          Pivot Value: <span className="text-amber-400 font-bold text-2xl">{array[pivot]}</span>
        </div>
        <div className="text-gray-500 text-sm">Step: {step}</div>
      </div>

      {/* Original Array */}
      <div className="mb-8">
        <div className="text-gray-400 text-sm mb-2 text-center">Current Array:</div>
        <div className="flex gap-2 justify-center">
          {array.map((num, idx) => (
            <motion.div
              key={`${num}-${idx}`}
              animate={{
                scale: idx === pivot ? 1.3 : 1,
                backgroundColor: idx === pivot ? '#f59e0b' : '#3b82f6',
                y: idx === pivot ? -10 : 0
              }}
              transition={{ type: 'spring' }}
              className="w-16 h-16 rounded-xl border-2 border-white/30 flex items-center justify-center font-bold text-white text-lg"
            >
              {num}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Partition Result */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-blue-500/20 border-2 border-blue-500">
          <div className="text-blue-400 font-bold mb-3 text-center">Less than {array[pivot]}</div>
          <div className="flex flex-wrap gap-2 justify-center min-h-[60px]">
            {left.map((num, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-white"
              >
                {num}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-500/20 border-2 border-amber-500">
          <div className="text-amber-400 font-bold mb-3 text-center">Pivot</div>
          <div className="flex justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-12 h-12 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-white"
            >
              {array[pivot]}
            </motion.div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-500/20 border-2 border-emerald-500">
          <div className="text-emerald-400 font-bold mb-3 text-center">Greater than {array[pivot]}</div>
          <div className="flex flex-wrap gap-2 justify-center min-h-[60px]">
            {right.map((num, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-12 h-12 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-white"
              >
                {num}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// TYPE "continue" FOR REMAINING 9 VISUALIZATIONS (Merge Sort, Dijkstra, BFS, DFS, Hash Table, Dynamic Programming, Heap Sort, Linked List, Binary Tree)
// 4. MERGE SORT - PROPER DIVIDE AND CONQUER
const MergeSortViz = () => {
  const [array, setArray] = useState([38, 27, 43, 3, 9, 82, 10]);
  const [phase, setPhase] = useState('divide'); // divide, merge, complete
  const [divided, setDivided] = useState([]);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (phase === 'divide') {
        if (step === 0) setDivided([[38, 27, 43, 3], [9, 82, 10]]);
        else if (step === 1) setDivided([[38, 27], [43, 3], [9, 82], [10]]);
        else if (step === 2) {
          setDivided([[38], [27], [43], [3], [9], [82], [10]]);
          setTimeout(() => setPhase('merge'), 1000);
        }
        setStep(prev => prev + 1);
      } else if (phase === 'merge') {
        if (step === 3) setDivided([[27, 38], [3, 43], [9, 82], [10]]);
        else if (step === 4) setDivided([[3, 27, 38, 43], [9, 10, 82]]);
        else if (step === 5) {
          setDivided([[3, 9, 10, 27, 38, 43, 82]]);
          setPhase('complete');
        }
        setStep(prev => prev + 1);
      }
    }, 1800);

    return () => clearInterval(timer);
  }, [step, phase]);

  return (
    <div className="p-8">
      <div className="text-center mb-6">
        <div className="text-xl font-bold mb-2">
          <span className="text-gray-400">Phase: </span>
          <span className={phase === 'divide' ? 'text-amber-400' : phase === 'merge' ? 'text-emerald-400' : 'text-purple-400'}>
            {phase.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {divided.map((subArray, idx) => (
          <motion.div
            key={idx}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex gap-2 justify-center"
          >
            {subArray.map((num, numIdx) => (
              <motion.div
                key={numIdx}
                animate={{
                  backgroundColor: phase === 'complete' ? '#10b981' : phase === 'merge' ? '#3b82f6' : '#f59e0b'
                }}
                className="w-16 h-16 rounded-xl border-2 border-white/30 flex items-center justify-center font-bold text-white text-lg"
              >
                {num}
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>

      {phase === 'complete' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-xl bg-emerald-500/20 border-2 border-emerald-500 text-center"
        >
          <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <div className="text-emerald-400 font-bold text-xl">
            ✓ Merge Sort Complete! Array is sorted.
          </div>
        </motion.div>
      )}
    </div>
  );
};

// 5. DIJKSTRA'S ALGORITHM - SHORTEST PATH
const DijkstraViz = () => {
  const [visited, setVisited] = useState([0]);
  const [distances, setDistances] = useState({ 0: 0, 1: Infinity, 2: Infinity, 3: Infinity, 4: Infinity });
  const [current, setCurrent] = useState(0);
  const [complete, setComplete] = useState(false);

  const nodes = [
    { id: 0, x: 150, y: 50, label: 'A' },
    { id: 1, x: 50, y: 150, label: 'B' },
    { id: 2, x: 250, y: 150, label: 'C' },
    { id: 3, x: 50, y: 250, label: 'D' },
    { id: 4, x: 250, y: 250, label: 'E' },
  ];

  const edges = [
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 2, weight: 2 },
    { from: 1, to: 3, weight: 5 },
    { from: 2, to: 4, weight: 3 },
    { from: 3, to: 4, weight: 1 },
  ];

  useEffect(() => {
    const sequence = [
      { node: 0, dists: { 0: 0, 1: 4, 2: 2, 3: Infinity, 4: Infinity } },
      { node: 2, dists: { 0: 0, 1: 4, 2: 2, 3: Infinity, 4: 5 } },
      { node: 1, dists: { 0: 0, 1: 4, 2: 2, 3: 9, 4: 5 } },
      { node: 4, dists: { 0: 0, 1: 4, 2: 2, 3: 6, 4: 5 } },
      { node: 3, dists: { 0: 0, 1: 4, 2: 2, 3: 6, 4: 5 } },
    ];

    let idx = 0;
    const timer = setInterval(() => {
      if (idx < sequence.length) {
        setCurrent(sequence[idx].node);
        setDistances(sequence[idx].dists);
        setVisited(prev => [...new Set([...prev, sequence[idx].node])]);
        idx++;
      } else {
        setComplete(true);
        clearInterval(timer);
      }
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-8 h-96 relative">
      <svg className="absolute inset-0 w-full h-full">
        {edges.map((edge, idx) => {
          const from = nodes.find(n => n.id === edge.from);
          const to = nodes.find(n => n.id === edge.to);
          return (
            <g key={idx}>
              <line 
                x1={from.x} y1={from.y} 
                x2={to.x} y2={to.y} 
                stroke={visited.includes(edge.from) && visited.includes(edge.to) ? '#10b981' : '#374151'} 
                strokeWidth="3" 
              />
              <text 
                x={(from.x + to.x) / 2} 
                y={(from.y + to.y) / 2} 
                fill="#f59e0b" 
                className="text-sm font-bold"
              >
                {edge.weight}
              </text>
            </g>
          );
        })}
      </svg>

      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute rounded-full border-4 flex flex-col items-center justify-center font-bold"
          style={{
            left: node.x - 35,
            top: node.y - 35,
            width: '70px',
            height: '70px'
          }}
          animate={{
            backgroundColor: node.id === current ? '#f59e0b' : visited.includes(node.id) ? '#10b981' : '#1f2937',
            borderColor: node.id === current ? '#f59e0b' : visited.includes(node.id) ? '#10b981' : '#374151',
            scale: node.id === current ? 1.2 : 1
          }}
        >
          <span className="text-white text-xl">{node.label}</span>
          <span className="text-xs text-gray-300">
            {distances[node.id] === Infinity ? '∞' : distances[node.id]}
          </span>
        </motion.div>
      ))}

      {complete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-4 rounded-xl bg-emerald-500/20 border-2 border-emerald-500"
        >
          <div className="text-emerald-400 font-bold text-center">
            ✓ Shortest paths from A found!
          </div>
        </motion.div>
      )}
    </div>
  );
};

// 6. BFS - BREADTH FIRST SEARCH
const BFSViz = () => {
  const [visited, setVisited] = useState([0]);
  const [queue, setQueue] = useState([0]);
  const [current, setCurrent] = useState(0);
  const [complete, setComplete] = useState(false);

  const nodes = [
    { id: 0, x: 150, y: 50 },
    { id: 1, x: 50, y: 150 },
    { id: 2, x: 250, y: 150 },
    { id: 3, x: 50, y: 250 },
    { id: 4, x: 250, y: 250 },
  ];

  useEffect(() => {
    const order = [0, 1, 2, 3, 4];
    let idx = 0;
    
    const timer = setInterval(() => {
      if (idx < order.length) {
        setCurrent(order[idx]);
        setVisited(prev => [...prev, order[idx]]);
        setQueue(prev => [...prev.slice(1), ...(idx + 1 < order.length ? [order[idx + 1]] : [])]);
        idx++;
      } else {
        setComplete(true);
        clearInterval(timer);
      }
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-8">
      <div className="mb-6 p-4 rounded-xl bg-blue-500/20 border border-blue-500">
        <div className="text-blue-400 font-bold mb-2">Queue (FIFO):</div>
        <div className="flex gap-2">
          {queue.map((nodeId, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-white"
            >
              {nodeId}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="h-80 relative">
        <svg className="absolute inset-0 w-full h-full">
          <line x1="150" y1="50" x2="50" y2="150" stroke="#374151" strokeWidth="2" />
          <line x1="150" y1="50" x2="250" y2="150" stroke="#374151" strokeWidth="2" />
          <line x1="50" y1="150" x2="50" y2="250" stroke="#374151" strokeWidth="2" />
          <line x1="250" y1="150" x2="250" y2="250" stroke="#374151" strokeWidth="2" />
        </svg>

        {nodes.map((node) => (
          <motion.div
            key={node.id}
            className="absolute w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-xl"
            style={{
              left: node.x - 32,
              top: node.y - 32
            }}
            animate={{
              backgroundColor: node.id === current ? '#3b82f6' : visited.includes(node.id) ? '#10b981' : '#1f2937',
              borderColor: node.id === current ? '#3b82f6' : visited.includes(node.id) ? '#10b981' : '#374151',
              scale: node.id === current ? 1.3 : 1
            }}
          >
            <span className="text-white">{node.id}</span>
          </motion.div>
        ))}
      </div>

      {complete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-xl bg-emerald-500/20 border-2 border-emerald-500 text-center"
        >
          <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <div className="text-emerald-400 font-bold">
            ✓ BFS Complete! Visited order: 0 → 1 → 2 → 3 → 4
          </div>
        </motion.div>
      )}
    </div>
  );
};

// 7. DFS - DEPTH FIRST SEARCH
const DFSViz = () => {
  const [visited, setVisited] = useState([0]);
  const [stack, setStack] = useState([0]);
  const [current, setCurrent] = useState(0);
  const [complete, setComplete] = useState(false);

  const nodes = [
    { id: 0, x: 150, y: 50 },
    { id: 1, x: 50, y: 150 },
    { id: 2, x: 250, y: 150 },
    { id: 3, x: 50, y: 250 },
    { id: 4, x: 250, y: 250 },
  ];

  useEffect(() => {
    const order = [0, 1, 3, 2, 4]; // DFS order (go deep first)
    let idx = 0;
    
    const timer = setInterval(() => {
      if (idx < order.length) {
        setCurrent(order[idx]);
        setVisited(prev => [...prev, order[idx]]);
        setStack(prev => [...prev, order[idx]]);
        idx++;
      } else {
        setComplete(true);
        clearInterval(timer);
      }
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-8">
      <div className="mb-6 p-4 rounded-xl bg-purple-500/20 border border-purple-500">
        <div className="text-purple-400 font-bold mb-2">Stack (LIFO):</div>
        <div className="flex gap-2">
          {stack.map((nodeId, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center font-bold text-white"
            >
              {nodeId}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="h-80 relative">
        <svg className="absolute inset-0 w-full h-full">
          <line x1="150" y1="50" x2="50" y2="150" stroke="#374151" strokeWidth="2" />
          <line x1="150" y1="50" x2="250" y2="150" stroke="#374151" strokeWidth="2" />
          <line x1="50" y1="150" x2="50" y2="250" stroke="#374151" strokeWidth="2" />
          <line x1="250" y1="150" x2="250" y2="250" stroke="#374151" strokeWidth="2" />
        </svg>

        {nodes.map((node) => (
          <motion.div
            key={node.id}
            className="absolute w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-xl"
            style={{
              left: node.x - 32,
              top: node.y - 32
            }}
            animate={{
              backgroundColor: node.id === current ? '#8b5cf6' : visited.includes(node.id) ? '#10b981' : '#1f2937',
              borderColor: node.id === current ? '#8b5cf6' : visited.includes(node.id) ? '#10b981' : '#374151',
              scale: node.id === current ? 1.3 : 1
            }}
          >
            <span className="text-white">{node.id}</span>
          </motion.div>
        ))}
      </div>

      {complete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-xl bg-emerald-500/20 border-2 border-emerald-500 text-center"
        >
          <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <div className="text-emerald-400 font-bold">
            ✓ DFS Complete! Visited order: 0 → 1 → 3 → 2 → 4
          </div>
        </motion.div>
      )}
    </div>
  );
};

// TYPE "continue" FOR LAST 5 (Hash Table, Dynamic Programming, Heap Sort, Linked List, Binary Tree)
// 8. HASH TABLE - KEY-VALUE MAPPING
const HashTableViz = () => {
  const [items, setItems] = useState([]);
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const data = [
    { key: 'apple', value: '🍎', hash: 2 },
    { key: 'banana', value: '🍌', hash: 5 },
    { key: 'cherry', value: '🍒', hash: 1 },
    { key: 'date', value: '🌴', hash: 7 },
  ];

  useEffect(() => {
    if (step < data.length) {
      const timer = setTimeout(() => {
        setItems(prev => [...prev, data[step]]);
        setStep(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else if (step === data.length) {
      setComplete(true);
    }
  }, [step]);

  return (
    <div className="p-8">
      <div className="text-center mb-6">
        <div className="text-gray-400 text-sm mb-2">Hash Function: hash(key) = key.length % 8</div>
      </div>

      {/* Hash Table Slots */}
      <div className="grid grid-cols-8 gap-2 mb-8">
        {Array.from({ length: 8 }).map((_, idx) => {
          const item = items.find(i => i.hash === idx);
          return (
            <motion.div
              key={idx}
              className="h-24 rounded-lg border-2 border-gray-700 flex flex-col items-center justify-center"
              animate={{
                backgroundColor: item ? '#10b98120' : '#1f293710',
                borderColor: item ? '#10b981' : '#374151'
              }}
            >
              <div className="text-xs text-gray-500 mb-1">[{idx}]</div>
              {item && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-2xl"
                >
                  {item.value}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Insertion Steps */}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: idx * 0.3 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <div className="w-24 p-3 rounded-lg bg-blue-500/20 border border-blue-500 text-blue-400 font-bold text-center">
              {item.key}
            </div>
            <ArrowRight className="w-6 h-6 text-amber-400" />
            <div className="text-gray-400 font-mono text-sm">hash("{item.key}")</div>
            <ArrowRight className="w-6 h-6 text-amber-400" />
            <div className="w-16 h-16 rounded-lg bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 font-black text-2xl">
              {item.hash}
            </div>
            <div className="text-2xl">{item.value}</div>
          </motion.div>
        ))}
      </div>

      {complete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-xl bg-emerald-500/20 border-2 border-emerald-500 text-center"
        >
          <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <div className="text-emerald-400 font-bold">
            ✓ Hash Table Complete! O(1) average lookup time achieved.
          </div>
        </motion.div>
      )}
    </div>
  );
};

// 9. DYNAMIC PROGRAMMING - FIBONACCI EXAMPLE
const DynamicProgrammingViz = () => {
  const [memo, setMemo] = useState({ 0: 0, 1: 1 });
  const [calculating, setCalculating] = useState(2);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (calculating <= 8) {
      const timer = setTimeout(() => {
        const prev1 = memo[calculating - 1] || 0;
        const prev2 = memo[calculating - 2] || 0;
        setMemo(prev => ({ ...prev, [calculating]: prev1 + prev2 }));
        setCalculating(prev => prev + 1);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      setComplete(true);
    }
  }, [calculating, memo]);

  return (
    <div className="p-8">
      <div className="text-center mb-6">
        <div className="text-2xl font-bold text-purple-400 mb-2">
          Fibonacci with Memoization
        </div>
        <div className="text-gray-400 text-sm">Store results to avoid recalculation</div>
      </div>

      {/* Memoization Table */}
      <div className="grid grid-cols-9 gap-3 mb-8">
        {Array.from({ length: 9 }).map((_, idx) => (
          <motion.div
            key={idx}
            animate={{
              scale: calculating === idx ? 1.2 : 1,
              backgroundColor: memo[idx] !== undefined ? '#a855f720' : '#1f293710',
              borderColor: calculating === idx ? '#a855f7' : memo[idx] !== undefined ? '#a855f7' : '#374151'
            }}
            className="p-4 rounded-xl border-2 text-center"
          >
            <div className="text-xs text-gray-500 mb-2">F({idx})</div>
            <div className="text-2xl font-bold text-white">
              {memo[idx] !== undefined ? memo[idx] : '?'}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Calculation Formula */}
      {calculating <= 8 && (
        <motion.div
          key={calculating}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-purple-500/20 border-2 border-purple-500 text-center"
        >
          <div className="text-xl text-white font-bold mb-2">
            F({calculating}) = F({calculating - 1}) + F({calculating - 2})
          </div>
          <div className="text-lg text-purple-400">
            = {memo[calculating - 1]} + {memo[calculating - 2]} = {memo[calculating - 1] + memo[calculating - 2]}
          </div>
        </motion.div>
      )}

      {complete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-xl bg-emerald-500/20 border-2 border-emerald-500 text-center"
        >
          <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <div className="text-emerald-400 font-bold text-xl">
            ✓ DP Complete! Reduced O(2ⁿ) to O(n) using memoization!
          </div>
        </motion.div>
      )}
    </div>
  );
};

// 10. HEAP SORT - BINARY HEAP VISUALIZATION
const HeapSortViz = () => {
  const [array, setArray] = useState([12, 11, 13, 5, 6, 7]);
  const [heapifying, setHeapifying] = useState(false);
  const [sorted, setSorted] = useState([]);
  const [phase, setPhase] = useState('build'); // build, sort, complete

  useEffect(() => {
    const timer = setTimeout(() => {
      if (phase === 'build') {
        setHeapifying(true);
        setTimeout(() => {
          setArray([13, 12, 11, 5, 6, 7]); // max heap
          setPhase('sort');
          setHeapifying(false);
        }, 1500);
      } else if (phase === 'sort' && sorted.length < 6) {
        const newArray = [...array];
        const max = newArray.shift();
        setSorted(prev => [max, ...prev]);
        setArray(newArray);
        if (sorted.length === 5) setPhase('complete');
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [phase, sorted, array]);

  return (
    <div className="p-8">
      <div className="text-center mb-6">
        <div className="text-xl font-bold mb-2">
          <span className="text-gray-400">Phase: </span>
          <span className={
            phase === 'build' ? 'text-amber-400' : 
            phase === 'sort' ? 'text-blue-400' : 
            'text-emerald-400'
          }>
            {phase === 'build' ? 'BUILD MAX HEAP' : phase === 'sort' ? 'EXTRACTING MAX' : 'COMPLETE'}
          </span>
        </div>
      </div>

      {/* Heap Visualization */}
      <div className="mb-8">
        <div className="text-gray-400 text-sm mb-4 text-center">Current Heap:</div>
        <div className="flex gap-2 justify-center">
          {array.map((num, idx) => (
            <motion.div
              key={idx}
              animate={{
                scale: idx === 0 ? 1.3 : 1,
                backgroundColor: heapifying ? '#f59e0b' : idx === 0 ? '#3b82f6' : '#374151',
                y: idx === 0 ? -10 : 0
              }}
              className="w-16 h-16 rounded-xl border-2 border-white/30 flex items-center justify-center font-bold text-white text-lg"
            >
              {num}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sorted Array */}
      {sorted.length > 0 && (
        <div>
          <div className="text-gray-400 text-sm mb-4 text-center">Sorted (Descending):</div>
          <div className="flex gap-2 justify-center">
            {sorted.map((num, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0, y: -50 }}
                animate={{ scale: 1, y: 0 }}
                className="w-16 h-16 rounded-xl border-2 border-emerald-500 bg-emerald-500/20 flex items-center justify-center font-bold text-white text-lg"
              >
                {num}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {phase === 'complete' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-xl bg-emerald-500/20 border-2 border-emerald-500 text-center"
        >
          <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <div className="text-emerald-400 font-bold text-xl">
            ✓ Heap Sort Complete! O(n log n) guaranteed.
          </div>
        </motion.div>
      )}
    </div>
  );
};

// 11. LINKED LIST - NODE TRAVERSAL
const LinkedListViz = () => {
  const [nodes] = useState([
    { value: 10, next: 1 },
    { value: 20, next: 2 },
    { value: 30, next: 3 },
    { value: 40, next: null }
  ]);
  const [current, setCurrent] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (current !== null && current < nodes.length) {
      const timer = setTimeout(() => {
        const nextNode = nodes[current].next;
        setCurrent(nextNode);
        if (nextNode === null) setComplete(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [current, nodes]);

  return (
    <div className="p-8">
      <div className="text-center mb-6">
        <div className="text-gray-400 text-sm">Traversing Linked List...</div>
      </div>

      <div className="flex items-center justify-center gap-4">
        {nodes.map((node, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <motion.div
              animate={{
                scale: current === idx ? 1.2 : 1,
                backgroundColor: current === idx ? '#3b82f6' : current > idx ? '#10b981' : '#374151',
                borderColor: current === idx ? '#3b82f6' : current > idx ? '#10b981' : '#6b7280'
              }}
              className="relative p-6 rounded-xl border-4"
            >
              <div className="text-2xl font-bold text-white mb-2">{node.value}</div>
              <div className="text-xs text-gray-400">Node {idx}</div>
              {current === idx && (
                <motion.div
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-blue-400 font-bold"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  Current
                </motion.div>
              )}
            </motion.div>
            {node.next !== null && (
              <ArrowRight className={`w-8 h-8 ${current > idx ? 'text-emerald-400' : 'text-gray-600'}`} />
            )}
          </div>
        ))}
        <div className="w-16 h-16 rounded-xl border-4 border-dashed border-gray-600 flex items-center justify-center text-gray-600">
          NULL
        </div>
      </div>

      {complete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 rounded-xl bg-emerald-500/20 border-2 border-emerald-500 text-center"
        >
          <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <div className="text-emerald-400 font-bold text-xl">
            ✓ Traversal Complete! O(n) time complexity.
          </div>
        </motion.div>
      )}
    </div>
  );
};

// 12. BINARY TREE - TREE STRUCTURE
const BinaryTreeViz = () => {
  const [visited, setVisited] = useState([]);
  const [complete, setComplete] = useState(false);

  const tree = [
    { id: 0, value: 50, x: 200, y: 50 },
    { id: 1, value: 30, x: 100, y: 150 },
    { id: 2, value: 70, x: 300, y: 150 },
    { id: 3, value: 20, x: 50, y: 250 },
    { id: 4, value: 40, x: 150, y: 250 },
    { id: 5, value: 60, x: 250, y: 250 },
    { id: 6, value: 80, x: 350, y: 250 },
  ];

  useEffect(() => {
    const order = [0, 1, 3, 4, 2, 5, 6]; // In-order traversal
    let idx = 0;
    
    const timer = setInterval(() => {
      if (idx < order.length) {
        setVisited(prev => [...prev, order[idx]]);
        idx++;
      } else {
        setComplete(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-8 h-96 relative">
      <svg className="absolute inset-0 w-full h-full">
        {/* Edges */}
        <line x1="200" y1="50" x2="100" y2="150" stroke="#374151" strokeWidth="3" />
        <line x1="200" y1="50" x2="300" y2="150" stroke="#374151" strokeWidth="3" />
        <line x1="100" y1="150" x2="50" y2="250" stroke="#374151" strokeWidth="3" />
        <line x1="100" y1="150" x2="150" y2="250" stroke="#374151" strokeWidth="3" />
        <line x1="300" y1="150" x2="250" y2="250" stroke="#374151" strokeWidth="3" />
        <line x1="300" y1="150" x2="350" y2="250" stroke="#374151" strokeWidth="3" />
      </svg>

      {tree.map((node) => (
        <motion.div
          key={node.id}
          className="absolute w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-xl"
          style={{
            left: node.x - 32,
            top: node.y - 32
          }}
          animate={{
            backgroundColor: visited.includes(node.id) ? '#10b981' : '#1f2937',
            borderColor: visited.includes(node.id) ? '#10b981' : '#374151',
            scale: visited.includes(node.id) ? 1.2 : 1
          }}
        >
          <span className="text-white">{node.value}</span>
        </motion.div>
      ))}

      {complete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-4 rounded-xl bg-emerald-500/20 border-2 border-emerald-500"
        >
          <div className="text-emerald-400 font-bold text-center">
            ✓ In-Order Traversal Complete!
          </div>
        </motion.div>
      )}
    </div>
  );
};


// Main Modal Component
const AlgorithmModal = ({ algo, onClose }) => {
  if (!algo) return null;

  const Icon = algo.icon;

  const getVisualization = () => {
  switch (algo.visualization) {
    case 'binarySearch': return <BinarySearchViz />;
    case 'bubbleSort': return <BubbleSortViz />;
    case 'quickSort': return <QuickSortViz />;
    case 'mergeSort': return <MergeSortViz />;
    case 'dijkstra': return <DijkstraViz />;
    case 'bfs': return <BFSViz />;
    case 'dfs': return <DFSViz />;
    case 'hashTable': return <HashTableViz />;
    case 'dynamicProgramming': return <DynamicProgrammingViz />;
    case 'heapSort': return <HeapSortViz />;
    case 'linkedList': return <LinkedListViz />;
    case 'binaryTree': return <BinaryTreeViz />;
    default: return (
      <div className="p-12 text-center text-gray-400">
        <Code className="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <p>Visualization coming soon!</p>
      </div>
    );
  }
};


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative max-w-4xl w-full bg-gradient-to-br from-black via-gray-900 to-black border-2 rounded-2xl overflow-hidden"
        style={{ borderColor: algo.color, boxShadow: `0 0 50px ${algo.color}40` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-red-500/20 border-2 border-red-500 text-red-400 hover:bg-red-500/30 transition-colors flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-8 border-b border-white/10">
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              className="p-4 rounded-2xl border-3"
              style={{ 
                borderColor: algo.color,
                backgroundColor: `${algo.color}30`
              }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Icon className="w-12 h-12" style={{ color: algo.color }} />
            </motion.div>
            <div className="flex-1">
              <h2 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-4xl font-black text-white mb-2">
                {algo.name}
              </h2>
              <div className="flex items-center gap-3">
                <div 
                  className="inline-block px-3 py-1 rounded-full text-sm font-bold"
                  style={{ 
                    backgroundColor: `${algo.color}30`,
                    color: algo.color
                  }}
                >
                  {algo.difficulty}
                </div>
                <div className="text-amber-400 font-bold">⚡ {algo.complexity}</div>
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-lg">{algo.description}</p>
        </div>

        {/* Visualization */}
        <div className="bg-black/50">
          <div className="p-6 border-b border-white/10">
            <h3 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-400" />
              Live Visualization
            </h3>
          </div>
          {getVisualization()}
        </div>

        {/* Real World Applications */}
        <div className="p-8 border-t border-white/10">
          <h3 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Real-World Applications
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {algo.realWorld.map((app, i) => (
              <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10">
                <CheckCircle className="w-4 h-4 text-emerald-400 mb-2" />
                <div className="text-sm text-gray-300">{app}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
// MAIN LEARN COMPONENT
export default function Learn() {
  loadOrbitronFont();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedAlgo, setSelectedAlgo] = useState(null);

  const categories = [
    { id: 'all', label: 'All Topics', icon: BookOpen, color: '#10b981' },
    { id: 'sorting', label: 'Sorting', icon: Shuffle, color: '#8b5cf6' },
    { id: 'searching', label: 'Searching', icon: Eye, color: '#3b82f6' },
    { id: 'graphs', label: 'Graphs', icon: Target, color: '#f59e0b' },
    { id: 'advanced', label: 'Advanced', icon: Sparkles, color: '#ef4444' },
  ];

  const algorithmArray = Object.values(ALGORITHMS);

  const filteredAlgorithms = algorithmArray.filter(algo => {
    const matchesCategory = activeCategory === 'all' || algo.categoryId === activeCategory;
    const matchesSearch = algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         algo.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const stats = [
    { icon: BookOpen, label: 'Total Algorithms', value: algorithmArray.length, color: '#10b981' },
    { icon: CheckCircle, label: 'Mastered', value: '5', color: '#3b82f6' },
    { icon: Clock, label: 'Study Time', value: '12h', color: '#f59e0b' },
    { icon: Award, label: 'Progress', value: '42%', color: '#a855f7' },
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-emerald-900/20 -z-10" />
      <div 
        className="fixed inset-0 opacity-[0.02] -z-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, #10b98122 0 2px, transparent 2px 40px), repeating-linear-gradient(0deg, #8b5cf622 0 2px, transparent 2px 40px)',
        }}
      />

      {/* Floating Particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="fixed w-1 h-1 rounded-full -z-10"
          style={{ 
            left: `${Math.random() * 100}%`, 
            top: `${Math.random() * 100}%`,
            background: ['#10b981', '#8b5cf6', '#3b82f6'][Math.floor(Math.random() * 3)]
          }}
          animate={{ y: [0, -120, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 5 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 5 }}
        />
      ))}

      <div className="relative z-10 p-8 max-w-[1800px] mx-auto">
        
        {/* Hero */}
        <RevealOnScroll>
          <div className="text-center mb-16 pt-12">
            <motion.div
              className="inline-block mb-6"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1] 
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                scale: { duration: 3, repeat: Infinity }
              }}
            >
              <div className="w-24 h-24 rounded-full border-4 border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 to-transparent flex items-center justify-center">
                <GraduationCap className="w-12 h-12 text-emerald-400" style={{ filter: 'drop-shadow(0 0 20px #10b981)' }} />
              </div>
            </motion.div>
            
            <h1 
              style={{ fontFamily: 'Orbitron, sans-serif' }}
              className="text-6xl md:text-8xl font-black mb-6"
            >
              <span style={{
                background: 'linear-gradient(90deg, #10b981, #8b5cf6, #10b981)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                LEARN ALGORITHMS
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Master computer science through interactive visualizations. Watch algorithms come to life.
            </p>
          </div>
        </RevealOnScroll>

        {/* Stats */}
        <RevealOnScroll delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <PremiumCard>
                  <stat.icon className="w-8 h-8 mb-3" style={{ color: stat.color }} />
                  <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-4xl font-black text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </PremiumCard>
              </motion.div>
            ))}
          </div>
        </RevealOnScroll>

        {/* Learning Tips */}
        <RevealOnScroll delay={0.3}>
          <PremiumCard variant="glow" className="mb-8">
            <h2 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <AlertCircle className="w-7 h-7 text-emerald-400" />
              How to Learn Effectively
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {[
                {
                  icon: PlayCircle,
                  title: 'Watch Visualizations',
                  description: 'See how algorithms work step-by-step in real-time',
                  color: '#3b82f6'
                },
                {
                  icon: Code,
                  title: 'Understand Complexity',
                  description: 'Learn Big O notation and performance characteristics',
                  color: '#f59e0b'
                },
                {
                  icon: Target,
                  title: 'Apply in Games',
                  description: 'Use your knowledge in Algorithm Roulette to win',
                  color: '#10b981'
                }
              ].map((tip, i) => {
                const TipIcon = tip.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 transition-colors"
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                      style={{ backgroundColor: `${tip.color}20`, border: `2px solid ${tip.color}` }}
                    >
                      <TipIcon className="w-6 h-6" style={{ color: tip.color }} />
                    </div>
                    <h3 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-lg font-bold text-white mb-2">
                      {tip.title}
                    </h3>
                    <p className="text-sm text-gray-400">{tip.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </PremiumCard>
        </RevealOnScroll>

        {/* Search & Filter */}
        <RevealOnScroll delay={0.4}>
          <PremiumCard className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search algorithms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ fontFamily: 'Orbitron, sans-serif' }}
                  className="w-full pl-12 pr-4 py-4 bg-black/50 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500/50 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </PremiumCard>
        </RevealOnScroll>

        {/* Category Pills */}
        <RevealOnScroll delay={0.5}>
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all border-2 ${
                  activeCategory === cat.id
                    ? 'text-white'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
                style={activeCategory === cat.id ? {
                  background: `linear-gradient(135deg, ${cat.color}40, ${cat.color}10)`,
                  borderColor: cat.color,
                  boxShadow: `0 0 20px ${cat.color}40`
                } : {}}
              >
                <cat.icon className="w-5 h-5" />
                <span style={{ fontFamily: 'Orbitron, sans-serif' }}>{cat.label}</span>
                {activeCategory === cat.id && (
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-black">
                    {filteredAlgorithms.length}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </RevealOnScroll>

        {/* Algorithm Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAlgorithms.map((algo, idx) => (
            <RevealOnScroll key={algo.id} delay={0.05 * idx}>
              <AlgorithmCard algo={algo} onClick={setSelectedAlgo} />
            </RevealOnScroll>
          ))}
        </div>

        {filteredAlgorithms.length === 0 && (
          <RevealOnScroll>
            <PremiumCard className="text-center py-12">
              <Info className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-xl text-gray-400">No algorithms found matching your search</p>
            </PremiumCard>
          </RevealOnScroll>
        )}

        {/* Call to Action */}
        <RevealOnScroll delay={0.6}>
          <PremiumCard variant="premium" className="mt-12">
            <div className="text-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="inline-block mb-4"
              >
                <Target className="w-16 h-16 text-emerald-400" />
              </motion.div>
              <h3 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-3xl font-black text-white mb-3">
                Ready to Test Your Knowledge?
              </h3>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Master these algorithms and use them strategically in Algorithm Roulette. Every concept you learn here gives you an edge in the game!
              </p>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/roulette'}
                className="px-12 py-5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 font-bold text-white text-xl flex items-center gap-3 mx-auto"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                <PlayCircle className="w-6 h-6" />
                Play Algorithm Roulette
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>
          </PremiumCard>
        </RevealOnScroll>
      </div>

      {/* Algorithm Modal */}
      <AnimatePresence>
        {selectedAlgo && (
          <AlgorithmModal algo={selectedAlgo} onClose={() => setSelectedAlgo(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}


