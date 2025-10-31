// ==================== BLOCK TYPES ====================
export const BLOCK_TYPES = {
  compare: {
    id: 'compare',
    name: 'Compare',
    icon: '⚖️',
    color: '#3b82f6',
    description: 'Compare two values',
    executionTime: 100,
    required: ['sorting', 'searching'],
    complexity: 'O(1)',
    teaches: 'Conditional Logic'
  },
  swap: {
    id: 'swap',
    name: 'Swap',
    icon: '🔄',
    color: '#10b981',
    description: 'Swap two elements',
    executionTime: 150,
    required: ['sorting'],
    complexity: 'O(1)',
    teaches: 'Data Manipulation'
  },
  loop: {
    id: 'loop',
    name: 'Loop',
    icon: '🔁',
    color: '#8b5cf6',
    description: 'Repeat actions',
    executionTime: 50,
    required: ['sorting', 'searching'],
    complexity: 'O(n)',
    teaches: 'Iteration'
  },
  condition: {
    id: 'condition',
    name: 'If/Else',
    icon: '🔀',
    color: '#f59e0b',
    description: 'Branch logic',
    executionTime: 80,
    required: ['searching', 'sorting'],
    complexity: 'O(1)',
    teaches: 'Conditional Branching'
  },
  partition: {
    id: 'partition',
    name: 'Partition',
    icon: '✂️',
    color: '#ef4444',
    description: 'Divide array (QuickSort)',
    executionTime: 200,
    required: ['sorting'],
    complexity: 'O(n)',
    teaches: 'Divide & Conquer'
  },
  binarySearch: {
    id: 'binarySearch',
    name: 'Binary Search',
    icon: '🔍',
    color: '#06b6d4',
    description: 'Halve search space',
    executionTime: 120,
    required: ['searching'],
    complexity: 'O(log n)',
    teaches: 'Logarithmic Search'
  },
  merge: {
    id: 'merge',
    name: 'Merge',
    icon: '🔗',
    color: '#14b8a6',
    description: 'Combine sorted arrays',
    executionTime: 180,
    required: ['sorting'],
    complexity: 'O(n)',
    teaches: 'Merge Strategy'
  },
  heap: {
    id: 'heap',
    name: 'Heap Operation',
    icon: '🏔️',
    color: '#a855f7',
    description: 'Heap data structure',
    executionTime: 160,
    required: ['sorting'],
    complexity: 'O(log n)',
    teaches: 'Heap Operations'
  }
};

// ==================== CHALLENGES (50+ SCENARIOS) ====================
const EASY_CHALLENGES = [
  {
    id: 'sort_tiny_1',
    title: 'Tiny Array Sort',
    description: 'Sort 3 numbers: [3, 1, 2]',
    data: [3, 1, 2],
    type: 'sorting',
    difficulty: 'easy',
    requiredBlocks: ['compare', 'swap', 'loop'],
    optimalBlocks: ['compare', 'swap', 'loop'],
    hint: 'Use Compare + Swap + Loop for basic sorting',
    rankedPoints: 50,
    estimatedTime: 800
  },
  {
    id: 'sort_tiny_2',
    title: 'Simple Order',
    description: 'Sort 4 numbers: [4, 2, 3, 1]',
    data: [4, 2, 3, 1],
    type: 'sorting',
    difficulty: 'easy',
    requiredBlocks: ['compare', 'swap', 'loop'],
    optimalBlocks: ['compare', 'swap', 'loop'],
    hint: 'Bubble Sort works here',
    rankedPoints: 60,
    estimatedTime: 900
  },
  {
    id: 'sort_small_1',
    title: 'Sort Small Array',
    description: 'Sort these 5 numbers',
    data: [5, 2, 8, 1, 9],
    type: 'sorting',
    difficulty: 'easy',
    requiredBlocks: ['compare', 'swap', 'loop'],
    optimalBlocks: ['compare', 'swap', 'loop'],
    hint: 'You need: Compare + Swap + Loop',
    rankedPoints: 70,
    estimatedTime: 1000
  },
  {
    id: 'sort_small_2',
    title: 'Quick Sort Easy',
    description: 'Sort: [7, 3, 6, 2, 4]',
    data: [7, 3, 6, 2, 4],
    type: 'sorting',
    difficulty: 'easy',
    requiredBlocks: ['compare', 'swap', 'loop'],
    optimalBlocks: ['compare', 'swap', 'loop'],
    hint: 'Partition helps here',
    rankedPoints: 75,
    estimatedTime: 950
  },
  {
    id: 'sort_duplicates_1',
    title: 'Sort with Duplicates',
    description: 'Sort: [3, 1, 3, 2, 1]',
    data: [3, 1, 3, 2, 1],
    type: 'sorting',
    difficulty: 'easy',
    requiredBlocks: ['compare', 'swap', 'loop'],
    optimalBlocks: ['compare', 'swap', 'loop', 'condition'],
    hint: 'Handle duplicates carefully',
    rankedPoints: 80,
    estimatedTime: 1100
  }
];

const MEDIUM_CHALLENGES = [
  {
    id: 'sort_medium_1',
    title: 'Sort Medium Array',
    description: 'Sort these 8 numbers efficiently',
    data: [12, 4, 23, 7, 1, 19, 8, 15],
    type: 'sorting',
    difficulty: 'medium',
    requiredBlocks: ['compare', 'swap', 'loop'],
    optimalBlocks: ['compare', 'swap', 'loop', 'condition'],
    hint: 'Add Condition to optimize',
    rankedPoints: 100,
    estimatedTime: 1200
  },
  {
    id: 'sort_medium_2',
    title: 'Reverse Sorted Array',
    description: 'Sort worst-case: [9,8,7,6,5,4,3,2,1]',
    data: [9, 8, 7, 6, 5, 4, 3, 2, 1],
    type: 'sorting',
    difficulty: 'medium',
    requiredBlocks: ['compare', 'swap', 'loop'],
    optimalBlocks: ['compare', 'swap', 'loop', 'condition'],
    hint: 'Optimize with early exit condition',
    rankedPoints: 110,
    estimatedTime: 1400
  },
  {
    id: 'sort_medium_3',
    title: 'Nearly Sorted',
    description: 'Sort nearly sorted: [1,2,3,5,4,6,7,8]',
    data: [1, 2, 3, 5, 4, 6, 7, 8],
    type: 'sorting',
    difficulty: 'medium',
    requiredBlocks: ['compare', 'swap', 'loop', 'condition'],
    optimalBlocks: ['compare', 'swap', 'loop', 'condition'],
    hint: 'Optimized bubble sort shines here',
    rankedPoints: 95,
    estimatedTime: 900
  },
  {
    id: 'sort_medium_4',
    title: 'Random Medium',
    description: 'Sort: [45, 23, 67, 12, 89, 34, 56, 78]',
    data: [45, 23, 67, 12, 89, 34, 56, 78],
    type: 'sorting',
    difficulty: 'medium',
    requiredBlocks: ['compare', 'swap', 'loop'],
    optimalBlocks: ['compare', 'swap', 'loop', 'partition'],
    hint: 'Partition strategy improves performance',
    rankedPoints: 105,
    estimatedTime: 1300
  },
  {
    id: 'sort_medium_5',
    title: 'Mostly Sorted',
    description: 'Sort: [1,2,3,4,5,9,6,7,8]',
    data: [1, 2, 3, 4, 5, 9, 6, 7, 8],
    type: 'sorting',
    difficulty: 'medium',
    requiredBlocks: ['compare', 'swap', 'loop', 'condition'],
    optimalBlocks: ['compare', 'swap', 'loop', 'condition'],
    hint: 'Optimized algorithms detect this',
    rankedPoints: 90,
    estimatedTime: 850
  },
  {
    id: 'sort_medium_6',
    title: 'Same Numbers',
    description: 'Sort: [5, 5, 5, 5, 5, 5, 5, 5]',
    data: [5, 5, 5, 5, 5, 5, 5, 5],
    type: 'sorting',
    difficulty: 'medium',
    requiredBlocks: ['compare', 'swap', 'loop'],
    optimalBlocks: ['compare', 'swap', 'loop', 'condition'],
    hint: 'Condition check prevents useless swaps',
    rankedPoints: 85,
    estimatedTime: 700
  },
  {
    id: 'sort_medium_7',
    title: 'Two Clusters',
    description: 'Sort: [1,3,2,7,5,6,4,8]',
    data: [1, 3, 2, 7, 5, 6, 4, 8],
    type: 'sorting',
    difficulty: 'medium',
    requiredBlocks: ['compare', 'swap', 'loop'],
    optimalBlocks: ['compare', 'swap', 'loop', 'partition'],
    hint: 'Partition excels at splitting clusters',
    rankedPoints: 100,
    estimatedTime: 1150
  }
];

const HARD_CHALLENGES = [
  {
    id: 'sort_hard_1',
    title: 'Sort Large Array Fast',
    description: 'Sort 10 numbers with optimal algorithm',
    data: [34, 7, 23, 32, 5, 62, 14, 18, 9, 41],
    type: 'sorting',
    difficulty: 'hard',
    requiredBlocks: ['compare', 'swap', 'loop', 'partition'],
    optimalBlocks: ['compare', 'swap', 'loop', 'partition'],
    hint: 'Use Partition for divide-and-conquer!',
    rankedPoints: 150,
    estimatedTime: 1500
  },
  {
    id: 'sort_hard_2',
    title: 'Large Random Array',
    description: 'Sort: [89,12,45,67,23,78,34,56,90,11,99,44]',
    data: [89, 12, 45, 67, 23, 78, 34, 56, 90, 11, 99, 44],
    type: 'sorting',
    difficulty: 'hard',
    requiredBlocks: ['compare', 'swap', 'loop', 'partition'],
    optimalBlocks: ['compare', 'swap', 'loop', 'partition', 'condition'],
    hint: 'QuickSort dominates here',
    rankedPoints: 160,
    estimatedTime: 1800
  },
  {
    id: 'sort_hard_3',
    title: 'Reverse Large Array',
    description: 'Sort reversed 10 elements',
    data: [100, 90, 80, 70, 60, 50, 40, 30, 20, 10],
    type: 'sorting',
    difficulty: 'hard',
    requiredBlocks: ['compare', 'swap', 'loop', 'partition'],
    optimalBlocks: ['compare', 'swap', 'loop', 'partition'],
    hint: 'Partition avoids worst-case',
    rankedPoints: 170,
    estimatedTime: 2000
  },
  {
    id: 'sort_hard_4',
    title: 'Mixed Sorted Regions',
    description: 'Sort: [1,2,3,9,8,7,4,5,6]',
    data: [1, 2, 3, 9, 8, 7, 4, 5, 6],
    type: 'sorting',
    difficulty: 'hard',
    requiredBlocks: ['compare', 'swap', 'loop', 'partition'],
    optimalBlocks: ['compare', 'swap', 'loop', 'partition', 'merge'],
    hint: 'Merge Sort handles this efficiently',
    rankedPoints: 155,
    estimatedTime: 1600
  },
  {
    id: 'sort_hard_5',
    title: 'Two Sorted Arrays',
    description: 'Sort: [1,3,5,7,2,4,6,8]',
    data: [1, 3, 5, 7, 2, 4, 6, 8],
    type: 'sorting',
    difficulty: 'hard',
    requiredBlocks: ['compare', 'swap', 'loop', 'merge'],
    optimalBlocks: ['compare', 'swap', 'loop', 'merge'],
    hint: 'Two sorted arrays? Use Merge!',
    rankedPoints: 165,
    estimatedTime: 1400
  },
  {
    id: 'sort_hard_6',
    title: 'Large with Duplicates',
    description: 'Sort: [5,2,5,1,5,3,5,4,5,2,5]',
    data: [5, 2, 5, 1, 5, 3, 5, 4, 5, 2, 5],
    type: 'sorting',
    difficulty: 'hard',
    requiredBlocks: ['compare', 'swap', 'loop', 'partition'],
    optimalBlocks: ['compare', 'swap', 'loop', 'partition', 'condition'],
    hint: 'Handle duplicates with partition',
    rankedPoints: 140,
    estimatedTime: 1700
  },
  {
    id: 'sort_hard_7',
    title: 'All Negative',
    description: 'Sort: [-5,-2,-8,-1,-9,-3]',
    data: [-5, -2, -8, -1, -9, -3],
    type: 'sorting',
    difficulty: 'hard',
    requiredBlocks: ['compare', 'swap', 'loop', 'partition'],
    optimalBlocks: ['compare', 'swap', 'loop', 'partition'],
    hint: 'Negative numbers sort same way',
    rankedPoints: 130,
    estimatedTime: 1300
  },
  {
    id: 'sort_hard_8',
    title: 'Mixed Positive/Negative',
    description: 'Sort: [-3, 5, -1, 9, -7, 2]',
    data: [-3, 5, -1, 9, -7, 2],
    type: 'sorting',
    difficulty: 'hard',
    requiredBlocks: ['compare', 'swap', 'loop', 'partition'],
    optimalBlocks: ['compare', 'swap', 'loop', 'partition'],
    hint: 'Comparison works across sign',
    rankedPoints: 125,
    estimatedTime: 1250
  }
];

export const CHALLENGES = [
  ...EASY_CHALLENGES,
  ...MEDIUM_CHALLENGES,
  ...HARD_CHALLENGES
];

// ==================== RANKED MODE CONFIG ====================
export const RANKED_CONFIG = {
  maxBestOf: 3,
  pointsPerRound: {
    easy: { win: 50, loss: 10 },
    medium: { win: 100, loss: 25 },
    hard: { win: 200, loss: 50 }
  },
  ranks: [
    { name: 'Bronze', minPoints: 0, maxPoints: 500, icon: '🥉' },
    { name: 'Silver', minPoints: 501, maxPoints: 1000, icon: '🥈' },
    { name: 'Gold', minPoints: 1001, maxPoints: 2000, icon: '🥇' },
    { name: 'Platinum', minPoints: 2001, maxPoints: 5000, icon: '💎' },
    { name: 'Diamond', minPoints: 5001, maxPoints: 10000, icon: '💠' },
    { name: 'Challenger', minPoints: 10001, maxPoints: Infinity, icon: '👑' }
  ]
};

// ==================== ALGORITHM VALIDATION & EXECUTION ====================
export class AlgorithmExecutor {
  constructor(blocks, data, challengeType) {
    this.blocks = blocks;
    this.data = [...data];
    this.challengeType = challengeType;
    this.comparisons = 0;
    this.swaps = 0;
    this.iterations = 0;
  }

  execute() {
    const validation = this.validateAlgorithm();
    
    if (!validation.isValid) {
      return {
        result: [...this.data],
        executionTime: 9999,
        comparisons: 0,
        swaps: 0,
        algorithm: 'invalid',
        isCorrect: false,
        efficiency: 0,
        error: validation.error
      };
    }

    const algorithmType = this.identifyAlgorithm();
    const sorted = this.performSort(algorithmType);
    const targetSorted = [...this.data].sort((a, b) => a - b);
    const isCorrect = JSON.stringify(sorted) === JSON.stringify(targetSorted);
    const executionTime = this.calculateExecutionTime(algorithmType, this.data.length);

    return {
      result: sorted,
      executionTime,
      comparisons: this.comparisons,
      swaps: this.swaps,
      iterations: this.iterations,
      algorithm: algorithmType,
      isCorrect,
      efficiency: this.getEfficiency(algorithmType),
      initial: this.data
    };
  }

  validateAlgorithm() {
    if (this.blocks.length === 0) {
      return { isValid: false, error: 'No blocks selected!' };
    }

    if (this.challengeType === 'sorting') {
      const hasCompare = this.blocks.includes('compare');
      const hasSwap = this.blocks.includes('swap');
      const hasLoop = this.blocks.includes('loop');

      if (!hasCompare) return { isValid: false, error: 'Missing Compare block!' };
      if (!hasSwap) return { isValid: false, error: 'Missing Swap block!' };
      if (!hasLoop) return { isValid: false, error: 'Missing Loop block!' };
    }

    return { isValid: true };
  }

  identifyAlgorithm() {
    const has = (id) => this.blocks.includes(id);

    if (has('partition') && has('compare') && has('swap') && has('loop')) return 'quicksort';
    if (has('merge') && has('compare') && has('loop')) return 'mergesort';
    if (has('heap') && has('compare') && has('loop')) return 'heapsort';
    if (has('compare') && has('swap') && has('loop') && has('condition')) return 'bubble_optimized';
    if (has('compare') && has('swap') && has('loop')) return 'bubble';
    
    return 'incomplete';
  }

  performSort(algorithmType) {
    let arr = [...this.data];

    switch (algorithmType) {
      case 'quicksort':
        arr = this.quickSort(arr);
        break;
      case 'mergesort':
        arr = this.mergeSort(arr);
        break;
      case 'heapsort':
        arr = this.heapSort(arr);
        break;
      case 'bubble_optimized':
        arr = this.bubbleSortOptimized(arr);
        break;
      case 'bubble':
        arr = this.bubbleSort(arr);
        break;
      default:
        arr = this.singlePass(arr);
    }

    return arr;
  }

  quickSort(arr) {
    if (arr.length <= 1) return arr;

    const pivot = arr[Math.floor(arr.length / 2)];
    const left = [], right = [];

    for (let i = 0; i < arr.length; i++) {
      if (i === Math.floor(arr.length / 2)) continue;
      
      this.comparisons++;
      this.iterations++;
      if (arr[i] < pivot) left.push(arr[i]);
      else right.push(arr[i]);
    }

    this.swaps += arr.length / 2;
    return [...this.quickSort(left), pivot, ...this.quickSort(right)];
  }

  mergeSort(arr) {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = this.mergeSort(arr.slice(0, mid));
    const right = this.mergeSort(arr.slice(mid));

    return this.merge(left, right);
  }

  merge(left, right) {
    const result = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
      this.comparisons++;
      this.iterations++;
      
      if (left[i] < right[j]) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
        this.swaps++;
      }
    }

    return [...result, ...left.slice(i), ...right.slice(j)];
  }

  heapSort(arr) {
    const n = arr.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      this.heapify(arr, n, i);
    }

    for (let i = n - 1; i > 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      this.swaps++;
      this.heapify(arr, i, 0);
    }

    return arr;
  }

  heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
      this.comparisons++;
      largest = left;
    }

    if (right < n && arr[right] > arr[largest]) {
      this.comparisons++;
      largest = right;
    }

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      this.swaps++;
      this.iterations++;
      this.heapify(arr, n, largest);
    }
  }

  bubbleSortOptimized(arr) {
    let n = arr.length;
    let swapped;

    for (let i = 0; i < n - 1; i++) {
      swapped = false;
      this.iterations++;

      for (let j = 0; j < n - i - 1; j++) {
        this.comparisons++;
        
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          this.swaps++;
          swapped = true;
        }
      }

      if (!swapped) break;
    }

    return arr;
  }

  bubbleSort(arr) {
    let n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      this.iterations++;
      for (let j = 0; j < n - i - 1; j++) {
        this.comparisons++;
        
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          this.swaps++;
        }
      }
    }

    return arr;
  }

  singlePass(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
      this.comparisons++;
      this.iterations++;
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        this.swaps++;
      }
    }
    return arr;
  }

  calculateExecutionTime(algorithm, n) {
    const baseTime = {
      'quicksort': n * Math.log2(n) * 40,
      'mergesort': n * Math.log2(n) * 45,
      'heapsort': n * Math.log2(n) * 50,
      'bubble_optimized': (n * n) / 2 * 25,
      'bubble': n * n * 30,
      'incomplete': n * 200,
      'invalid': 9999
    };

    const time = baseTime[algorithm] || 9999;
    const variance = 0.9 + Math.random() * 0.2;
    return Math.ceil(time * variance);
  }

  getEfficiency(algorithm) {
    const ratings = {
      'quicksort': 95,
      'mergesort': 90,
      'heapsort': 85,
      'bubble_optimized': 65,
      'bubble': 40,
      'incomplete': 10,
      'invalid': 0
    };
    return ratings[algorithm] || 0;
  }
}

// ==================== AI OPPONENT ====================
export class AIOpponent {
  constructor(difficulty = 'medium') {
    this.difficulty = difficulty;
  }

  selectBlocks(challenge) {
    const maps = {
      'easy': ['compare', 'swap', 'loop'],
      'medium': ['compare', 'swap', 'loop', 'condition'],
      'hard': ['compare', 'swap', 'loop', 'partition']
    };
    return maps[this.difficulty] || maps['medium'];
  }

  execute(challenge) {
    const blocks = this.selectBlocks(challenge);
    const data = typeof challenge.data === 'function' ? challenge.data() : challenge.data;
    
    const executor = new AlgorithmExecutor(blocks, data, challenge.type);
    const result = executor.execute();

    const multipliers = { easy: 1.2, medium: 1.0, hard: 0.9 };
    result.executionTime = Math.ceil(result.executionTime * multipliers[this.difficulty]);

    return result;
  }
}

// ==================== UTILITY FUNCTIONS ====================
export const getRandomChallenge = (difficulty = 'medium') => {
  const filtered = CHALLENGES.filter(c => c.difficulty === difficulty);
  return filtered[Math.floor(Math.random() * filtered.length)];
};

export const getRankFromPoints = (points) => {
  return RANKED_CONFIG.ranks.find(r => points >= r.minPoints && points <= r.maxPoints);
};

export const calculateRankedPoints = (difficulty, won) => {
  return RANKED_CONFIG.pointsPerRound[difficulty][won ? 'win' : 'loss'];
};
