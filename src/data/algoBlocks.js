// ==================== BLOCK TYPES ====================
export const BLOCK_TYPES = {
  compare: {
    id: 'compare',
    name: 'Compare',
    icon: '⚖️',
    color: '#3b82f6',
    description: 'Compare two values',
    executionTime: 100,
    required: ['sorting', 'searching']
  },
  swap: {
    id: 'swap',
    name: 'Swap',
    icon: '🔄',
    color: '#10b981',
    description: 'Swap two elements',
    executionTime: 150,
    required: ['sorting']
  },
  loop: {
    id: 'loop',
    name: 'Loop',
    icon: '🔁',
    color: '#8b5cf6',
    description: 'Repeat actions',
    executionTime: 50,
    required: ['sorting', 'searching']
  },
  condition: {
    id: 'condition',
    name: 'If/Else',
    icon: '🔀',
    color: '#f59e0b',
    description: 'Branch logic',
    executionTime: 80,
    required: ['searching', 'sorting']
  },
  partition: {
    id: 'partition',
    name: 'Partition',
    icon: '✂️',
    color: '#ef4444',
    description: 'Divide array (QuickSort)',
    executionTime: 200,
    required: ['sorting']
  }
};

// ==================== CHALLENGES ====================
export const CHALLENGES = [
  {
    id: 'sort_5',
    title: 'Sort Small Array',
    description: 'Sort these 5 numbers',
    data: [5, 2, 8, 1, 9],
    type: 'sorting',
    difficulty: 'easy',
    requiredBlocks: ['compare', 'swap', 'loop'],
    optimalBlocks: ['compare', 'swap', 'loop'],
    hint: 'You need: Compare + Swap + Loop for basic sorting'
  },
  {
    id: 'sort_medium',
    title: 'Sort Medium Array',
    description: 'Sort these 8 numbers efficiently',
    data: [12, 4, 23, 7, 1, 19, 8, 15],
    type: 'sorting',
    difficulty: 'medium',
    requiredBlocks: ['compare', 'swap', 'loop'],
    optimalBlocks: ['compare', 'swap', 'loop', 'condition'],
    hint: 'Add Condition to optimize'
  },
  {
    id: 'sort_advanced',
    title: 'Sort Large Array Fast',
    description: 'Sort 10 numbers with optimal algorithm',
    data: [34, 7, 23, 32, 5, 62, 14, 18, 9, 41],
    type: 'sorting',
    difficulty: 'hard',
    requiredBlocks: ['compare', 'swap', 'loop', 'partition'],
    optimalBlocks: ['compare', 'swap', 'loop', 'partition'],
    hint: 'Use Partition for divide-and-conquer!'
  }
];

// ==================== ALGORITHM VALIDATION & EXECUTION ====================
export class AlgorithmExecutor {
  constructor(blocks, data, challengeType) {
    this.blocks = blocks;
    this.data = [...data];
    this.challengeType = challengeType;
    this.comparisons = 0;
    this.swaps = 0;
  }

  // Main execution function
  execute() {
    // Step 1: Validate the algorithm structure
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

    // Step 2: Determine algorithm type
    const algorithmType = this.identifyAlgorithm();

    // Step 3: Execute sorting (actually sort the array)
    const sorted = this.performSort(algorithmType);

    // Step 4: Verify correctness
    const targetSorted = [...this.data].sort((a, b) => a - b);
    const isCorrect = JSON.stringify(sorted) === JSON.stringify(targetSorted);

    // Step 5: Calculate execution time based on algorithm
    const executionTime = this.calculateExecutionTime(algorithmType, this.data.length);

    return {
      result: sorted,
      executionTime,
      comparisons: this.comparisons,
      swaps: this.swaps,
      algorithm: algorithmType,
      isCorrect,
      efficiency: this.getEfficiency(algorithmType),
      initial: this.data
    };
  }

  // Validate that algorithm has required blocks
  validateAlgorithm() {
    if (this.blocks.length === 0) {
      return { isValid: false, error: 'No blocks selected!' };
    }

    // Check if sorting algorithm has required blocks
    if (this.challengeType === 'sorting') {
      const hasCompare = this.blocks.includes('compare');
      const hasSwap = this.blocks.includes('swap');
      const hasLoop = this.blocks.includes('loop');

      if (!hasCompare) {
        return { isValid: false, error: 'Missing Compare block!' };
      }
      if (!hasSwap) {
        return { isValid: false, error: 'Missing Swap block!' };
      }
      if (!hasLoop) {
        return { isValid: false, error: 'Missing Loop block!' };
      }
    }

    return { isValid: true };
  }

  // Identify what algorithm the user built
  identifyAlgorithm() {
    const hasCompare = this.blocks.includes('compare');
    const hasSwap = this.blocks.includes('swap');
    const hasLoop = this.blocks.includes('loop');
    const hasCondition = this.blocks.includes('condition');
    const hasPartition = this.blocks.includes('partition');

    // QuickSort: partition + compare + swap + loop
    if (hasPartition && hasCompare && hasSwap && hasLoop) {
      return 'quicksort';
    }

    // Optimized Bubble Sort: compare + swap + loop + condition
    if (hasCompare && hasSwap && hasLoop && hasCondition) {
      return 'bubble_optimized';
    }

    // Basic Bubble Sort: compare + swap + loop
    if (hasCompare && hasSwap && hasLoop) {
      return 'bubble';
    }

    // Incomplete
    return 'incomplete';
  }

  // Actually perform the sort
  performSort(algorithmType) {
    let arr = [...this.data];

    switch (algorithmType) {
      case 'quicksort':
        arr = this.quickSort(arr);
        break;
      
      case 'bubble_optimized':
        arr = this.bubbleSortOptimized(arr);
        break;
      
      case 'bubble':
        arr = this.bubbleSort(arr);
        break;
      
      default:
        // Incomplete algorithm - do one pass
        arr = this.singlePass(arr);
        break;
    }

    return arr;
  }

  // Quick Sort implementation
  quickSort(arr) {
    if (arr.length <= 1) return arr;

    const pivot = arr[Math.floor(arr.length / 2)];
    const left = [];
    const right = [];

    for (let i = 0; i < arr.length; i++) {
      if (i === Math.floor(arr.length / 2)) continue;
      
      this.comparisons++;
      if (arr[i] < pivot) {
        left.push(arr[i]);
      } else {
        right.push(arr[i]);
      }
    }

    this.swaps += arr.length / 2;

    return [...this.quickSort(left), pivot, ...this.quickSort(right)];
  }

  // Bubble Sort Optimized (with early exit)
  bubbleSortOptimized(arr) {
    let n = arr.length;
    let swapped;

    for (let i = 0; i < n - 1; i++) {
      swapped = false;
      
      for (let j = 0; j < n - i - 1; j++) {
        this.comparisons++;
        
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          this.swaps++;
          swapped = true;
        }
      }

      if (!swapped) break; // Early exit optimization
    }

    return arr;
  }

  // Basic Bubble Sort
  bubbleSort(arr) {
    let n = arr.length;

    for (let i = 0; i < n - 1; i++) {
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

  // Single pass (incomplete algorithm)
  singlePass(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
      this.comparisons++;
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        this.swaps++;
      }
    }
    return arr;
  }

  // Calculate execution time based on algorithm and data size
  calculateExecutionTime(algorithm, n) {
    const baseTime = {
      'quicksort': n * Math.log2(n) * 40,      // O(n log n)
      'bubble_optimized': (n * n) / 2 * 25,    // O(n²) / 2
      'bubble': n * n * 30,                     // O(n²)
      'incomplete': n * 200,                    // Linear but very slow
      'invalid': 9999
    };

    const time = baseTime[algorithm] || 9999;
    
    // Add 10-20% randomness
    const variance = 0.9 + Math.random() * 0.2;
    return Math.ceil(time * variance);
  }

  // Get efficiency rating
  getEfficiency(algorithm) {
    const ratings = {
      'quicksort': 95,
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

    // AI variance based on difficulty
    const multipliers = { easy: 1.2, medium: 1.0, hard: 0.9 };
    result.executionTime = Math.ceil(result.executionTime * multipliers[this.difficulty]);

    return result;
  }
}
