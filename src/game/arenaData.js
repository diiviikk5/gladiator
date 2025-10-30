import { 
  Zap, Target, Shield, Brain, Shuffle, Eye, 
  Layers, Grid, Activity, Sparkles, TrendingUp, ArrowRight,
  Code, Search, Hash, GitBranch
} from 'lucide-react';

// ==================== ALGORITHM MOVES ====================

export const ALGORITHM_MOVES = {
  // TIER 1: BASIC ALGORITHMS
  binarySearch: {
    id: 'binarySearch',
    name: 'Binary Strike',
    algorithm: 'Binary Search',
    type: 'offensive',
    tier: 1,
    icon: Eye,
    color: '#3b82f6',
    complexity: 'O(log n)',
    energy: 20,
    baseDamage: 15,
    cooldown: 0,
    timing: {
      enabled: true,
      difficulty: 'easy',
      duration: 2000,
      zones: {
        perfect: [48, 52],
        great: [40, 60],
        good: [30, 70]
      },
      multipliers: {
        PERFECT: 2.5,
        GREAT: 1.8,
        GOOD: 1.3,
        MISS: 0.5
      }
    },
    description: 'Halve the search space with each strike. Perfect timing hits the exact midpoint.',
    visual: 'binarySearchQTE',
    educational: {
      concept: 'Binary Search - Divide and Conquer',
      explanation: 'Perfect timing represents finding the exact middle element, halving possibilities with O(log n) efficiency.',
      bestCase: 'O(1)',
      worstCase: 'O(log n)'
    }
  },

  bubbleSort: {
    id: 'bubbleSort',
    name: 'Bubble Barrage',
    algorithm: 'Bubble Sort',
    type: 'offensive',
    tier: 1,
    icon: Shuffle,
    color: '#8b5cf6',
    complexity: 'O(n²)',
    energy: 15,
    baseDamage: 12,
    cooldown: 0,
    timing: {
      enabled: true,
      difficulty: 'easy',
      duration: 2500,
      zones: {
        perfect: [45, 55],
        great: [35, 65],
        good: [25, 75]
      },
      multipliers: {
        PERFECT: 2.0,
        GREAT: 1.6,
        GOOD: 1.2,
        MISS: 0.5
      }
    },
    description: 'Multiple weak strikes that swap adjacent elements. Low energy but lower damage.',
    visual: 'bubbleSortQTE',
    educational: {
      concept: 'Bubble Sort - Adjacent Swapping',
      explanation: 'Each perfect hit represents an optimal swap. Multiple passes needed.',
      bestCase: 'O(n)',
      worstCase: 'O(n²)'
    }
  },

  // TIER 2: INTERMEDIATE ALGORITHMS
  quickSort: {
    id: 'quickSort',
    name: 'Partition Strike',
    algorithm: 'QuickSort',
    type: 'offensive',
    tier: 2,
    icon: Zap,
    color: '#f59e0b',
    complexity: 'O(n log n)',
    energy: 30,
    baseDamage: 25,
    cooldown: 1,
    timing: {
      enabled: true,
      difficulty: 'medium',
      duration: 1800,
      zones: {
        perfect: [47, 53],
        great: [38, 62],
        good: [28, 72]
      },
      multipliers: {
        PERFECT: 3.0,
        GREAT: 2.2,
        GOOD: 1.5,
        MISS: 0.6
      }
    },
    description: 'Choose optimal pivot to split enemy defenses. High damage with good timing.',
    visual: 'quickSortQTE',
    educational: {
      concept: 'QuickSort - Pivot Selection',
      explanation: 'Perfect timing = optimal pivot that creates balanced partitions. Worst pivot = O(n²).',
      bestCase: 'O(n log n)',
      worstCase: 'O(n²)'
    }
  },

  mergeSort: {
    id: 'mergeSort',
    name: 'Divide & Conquer',
    algorithm: 'Merge Sort',
    type: 'offensive',
    tier: 2,
    icon: TrendingUp,
    color: '#10b981',
    complexity: 'O(n log n)',
    energy: 35,
    baseDamage: 28,
    cooldown: 2,
    timing: {
      enabled: true,
      difficulty: 'medium',
      duration: 2000,
      multiStage: true,
      stages: [
        { name: 'DIVIDE', zones: { perfect: [45, 55], great: [35, 65] }, duration: 700 },
        { name: 'MERGE', zones: { perfect: [48, 52], great: [38, 62] }, duration: 700 },
        { name: 'CONQUER', zones: { perfect: [49, 51], great: [40, 60] }, duration: 600 }
      ],
      multipliers: {
        PERFECT: 3.5,
        GREAT: 2.5,
        GOOD: 1.8,
        MISS: 0.7
      }
    },
    description: 'Three-stage attack: divide, merge, conquer. All stages must succeed for full damage.',
    visual: 'mergeSortQTE',
    educational: {
      concept: 'Merge Sort - Guaranteed Performance',
      explanation: 'Always O(n log n), no worst case. Three stages represent recursive division.',
      bestCase: 'O(n log n)',
      worstCase: 'O(n log n)'
    }
  },

  hashTable: {
    id: 'hashTable',
    name: 'Hash Shield',
    algorithm: 'Hash Table',
    type: 'defensive',
    tier: 2,
    icon: Hash,
    color: '#06b6d4',
    complexity: 'O(1)',
    energy: 25,
    baseDamage: 0,
    cooldown: 1,
    timing: {
      enabled: true,
      difficulty: 'hard',
      duration: 1500,
      zones: {
        perfect: [48, 52],
        great: [40, 60],
        good: [30, 70]
      },
      multipliers: {
        PERFECT: 0.95,  // Block 95% damage
        GREAT: 0.75,
        GOOD: 0.50,
        MISS: 0.20
      }
    },
    description: 'Instant O(1) defense. Narrow timing window but maximum protection.',
    visual: 'hashTableQTE',
    educational: {
      concept: 'Hash Table - Constant Time Access',
      explanation: 'Perfect timing = no hash collisions, instant O(1) lookup and defense.',
      bestCase: 'O(1)',
      worstCase: 'O(n)'
    }
  },

  // TIER 3: ADVANCED ALGORITHMS
  dijkstra: {
    id: 'dijkstra',
    name: 'Shortest Path',
    algorithm: "Dijkstra's Algorithm",
    type: 'offensive',
    tier: 3,
    icon: Target,
    color: '#ef4444',
    complexity: 'O((V+E) log V)',
    energy: 40,
    baseDamage: 35,
    cooldown: 2,
    timing: {
      enabled: true,
      difficulty: 'hard',
      duration: 1600,
      zones: {
        perfect: [49, 51],
        great: [43, 57],
        good: [35, 65]
      },
      multipliers: {
        PERFECT: 4.0,
        GREAT: 2.8,
        GOOD: 2.0,
        MISS: 0.8
      }
    },
    description: 'Find optimal attack path through enemy defenses. High damage, narrow timing.',
    visual: 'dijkstraQTE',
    educational: {
      concept: 'Dijkstra - Shortest Path',
      explanation: 'Perfect timing = finding absolutely shortest path to target.',
      bestCase: 'O((V+E) log V)',
      worstCase: 'O((V+E) log V)'
    }
  },

  bfs: {
    id: 'bfs',
    name: 'Wave Assault',
    algorithm: 'Breadth-First Search',
    type: 'offensive',
    tier: 3,
    icon: Grid,
    color: '#3b82f6',
    complexity: 'O(V + E)',
    energy: 35,
    baseDamage: 30,
    cooldown: 2,
    timing: {
      enabled: true,
      difficulty: 'medium',
      duration: 1800,
      pattern: 'wave',  // Hit multiple zones in sequence
      zones: {
        perfect: [48, 52],
        great: [40, 60],
        good: [30, 70]
      },
      multipliers: {
        PERFECT: 3.5,
        GREAT: 2.5,
        GOOD: 1.8,
        MISS: 0.7
      }
    },
    description: 'Level-by-level attack waves. Hit all zones for maximum damage.',
    visual: 'bfsQTE',
    educational: {
      concept: 'BFS - Level Order Traversal',
      explanation: 'Attack in waves, exploring all possibilities at current depth before going deeper.',
      bestCase: 'O(V + E)',
      worstCase: 'O(V + E)'
    }
  },

  dfs: {
    id: 'dfs',
    name: 'Deep Strike',
    algorithm: 'Depth-First Search',
    type: 'offensive',
    tier: 3,
    icon: Layers,
    color: '#8b5cf6',
    complexity: 'O(V + E)',
    energy: 35,
    baseDamage: 32,
    cooldown: 2,
    timing: {
      enabled: true,
      difficulty: 'medium',
      duration: 1700,
      pattern: 'chain',  // Hit zones in deep sequence
      zones: {
        perfect: [47, 53],
        great: [38, 62],
        good: [28, 72]
      },
      multipliers: {
        PERFECT: 3.8,
        GREAT: 2.6,
        GOOD: 1.9,
        MISS: 0.7
      }
    },
    description: 'Go as deep as possible before backtracking. High single-target damage.',
    visual: 'dfsQTE',
    educational: {
      concept: 'DFS - Depth Exploration',
      explanation: 'Dive deep into one path before exploring alternatives. Chain combo damage.',
      bestCase: 'O(V + E)',
      worstCase: 'O(V + E)'
    }
  },

  // TIER 4: ULTIMATE ALGORITHMS
  dynamicProgramming: {
    id: 'dynamicProgramming',
    name: 'Memoized Fury',
    algorithm: 'Dynamic Programming',
    type: 'ultimate',
    tier: 4,
    icon: Sparkles,
    color: '#a855f7',
    complexity: 'Varies',
    energy: 60,
    baseDamage: 50,
    cooldown: 4,
    timing: {
      enabled: true,
      difficulty: 'extreme',
      duration: 2500,
      multiStage: true,
      stages: [
        { name: 'SUBPROBLEM', zones: { perfect: [48, 52] }, duration: 800 },
        { name: 'MEMOIZE', zones: { perfect: [49, 51] }, duration: 700 },
        { name: 'OPTIMIZE', zones: { perfect: [49.5, 50.5] }, duration: 600 },
        { name: 'SOLVE', zones: { perfect: [49, 51] }, duration: 400 }
      ],
      multipliers: {
        PERFECT: 5.0,
        GREAT: 3.5,
        GOOD: 2.5,
        MISS: 1.0
      }
    },
    description: 'Ultimate move: Break problem into subproblems, memoize, and solve optimally. Massive damage on perfect execution.',
    visual: 'dynamicProgrammingQTE',
    educational: {
      concept: 'Dynamic Programming - Optimal Substructure',
      explanation: 'Four stages: identify subproblems, store solutions, optimize, solve. Miss any stage = reduced efficiency.',
      bestCase: 'O(n)',
      worstCase: 'O(2^n) without memoization'
    }
  },

  heapSort: {
    id: 'heapSort',
    name: 'Heap Devastation',
    algorithm: 'Heap Sort',
    type: 'ultimate',
    tier: 4,
    icon: Activity,
    color: '#ec4899',
    complexity: 'O(n log n)',
    energy: 55,
    baseDamage: 45,
    cooldown: 3,
    timing: {
      enabled: true,
      difficulty: 'hard',
      duration: 1900,
      multiStage: true,
      stages: [
        { name: 'HEAPIFY', zones: { perfect: [47, 53] }, duration: 800 },
        { name: 'EXTRACT', zones: { perfect: [48, 52] }, duration: 700 },
        { name: 'SORT', zones: { perfect: [49, 51] }, duration: 400 }
      ],
      multipliers: {
        PERFECT: 4.5,
        GREAT: 3.2,
        GOOD: 2.3,
        MISS: 0.9
      }
    },
    description: 'Build max heap and extract repeatedly. Guaranteed O(n log n) performance.',
    visual: 'heapSortQTE',
    educational: {
      concept: 'Heap Sort - In-Place Sorting',
      explanation: 'Heapify phase is critical. Perfect execution maintains heap property.',
      bestCase: 'O(n log n)',
      worstCase: 'O(n log n)'
    }
  }
};

// TYPE "continue" FOR AI OPPONENTS, REWARDS, AND DEFENSIVE MOVES
// ==================== DEFENSIVE MOVES ====================

export const DEFENSIVE_MOVES = {
  stackBlock: {
    id: 'stackBlock',
    name: 'Stack Defense',
    algorithm: 'Stack (LIFO)',
    type: 'defensive',
    icon: Shield,
    color: '#10b981',
    complexity: 'O(1)',
    energy: 20,
    cooldown: 0,
    timing: {
      enabled: true,
      difficulty: 'medium',
      duration: 1500,
      concept: 'LIFO',
      zones: {
        perfect: [47, 53],
        great: [38, 62],
        good: [28, 72]
      },
      multipliers: {
        PERFECT: 0.90,  // Block 90%
        GREAT: 0.70,
        GOOD: 0.50,
        MISS: 0.20
      }
    },
    description: 'Pop shields from stack in LIFO order. Last added shield blocks first.',
    visual: 'stackBlockQTE',
    educational: {
      concept: 'Stack - Last In First Out',
      explanation: 'Click shields in reverse order they were added. Perfect = proper LIFO execution.',
      operation: 'O(1) push/pop'
    }
  },

  queueParry: {
    id: 'queueParry',
    name: 'Queue Counter',
    algorithm: 'Queue (FIFO)',
    type: 'counter',
    icon: ArrowRight,
    color: '#3b82f6',
    complexity: 'O(1)',
    energy: 25,
    cooldown: 1,
    timing: {
      enabled: true,
      difficulty: 'easy',
      duration: 1800,
      concept: 'FIFO',
      zones: {
        perfect: [48, 52],
        great: [40, 60],
        good: [30, 70]
      },
      multipliers: {
        PERFECT: 1.5,  // Return 150% damage
        GREAT: 1.2,
        GOOD: 0.8,
        MISS: 0.3
      }
    },
    description: 'Queue counter-attacks in FIFO order. First queued attack executes first.',
    visual: 'queueParryQTE',
    educational: {
      concept: 'Queue - First In First Out',
      explanation: 'Process attacks in order received. Perfect = proper FIFO execution with damage bonus.',
      operation: 'O(1) enqueue/dequeue'
    }
  },

  linkedListDodge: {
    id: 'linkedListDodge',
    name: 'Linked Evasion',
    algorithm: 'Linked List',
    type: 'defensive',
    icon: GitBranch,
    color: '#8b5cf6',
    complexity: 'O(n)',
    energy: 15,
    cooldown: 0,
    timing: {
      enabled: true,
      difficulty: 'hard',
      duration: 1200,
      pattern: 'traverse',
      zones: {
        perfect: [49, 51],
        great: [42, 58],
        good: [32, 68]
      },
      multipliers: {
        PERFECT: 1.0,  // Full dodge
        GREAT: 0.85,
        GOOD: 0.70,
        MISS: 0.40
      }
    },
    description: 'Traverse linked nodes to dodge. Follow pointers perfectly to evade all damage.',
    visual: 'linkedListDodgeQTE',
    educational: {
      concept: 'Linked List - Pointer Traversal',
      explanation: 'Click nodes in linked order. Perfect = following all pointers correctly.',
      operation: 'O(n) traversal'
    }
  }
};

// ==================== AI OPPONENTS ====================

export const AI_OPPONENTS = {
  JUNIOR_DEV: {
    id: 'JUNIOR_DEV',
    name: 'Junior Developer',
    title: 'The Intern',
    avatar: '👨‍💻',
    level: 1,
    hp: 100,
    maxHP: 100,
    energy: 100,
    maxEnergy: 100,
    difficulty: 'easy',
    color: '#10b981',
    
    // AI Behavior
    strategy: 'basic',
    moveSelection: {
      offensive: 0.7,
      defensive: 0.2,
      ultimate: 0.05,
      random: 0.05
    },
    timingAccuracy: 0.3,  // 30% chance to hit perfect timing
    
    // Loadout
    moves: ['binarySearch', 'bubbleSort', 'stackBlock'],
    
    // Personality
    taunts: {
      start: "Let me show you what I learned in bootcamp!",
      hit: "Did I... did I do that right?",
      ultimate: "Time for my final project!",
      victory: "I actually won? MOM, I WON!",
      defeat: "Back to LeetCode easy problems..."
    },
    
    description: 'Fresh out of bootcamp. Knows basic algorithms but struggles with optimization.',
    
    rewards: {
      xp: 50,
      coins: 25,
      unlocks: []
    }
  },

  MID_DEVELOPER: {
    id: 'MID_DEVELOPER',
    name: 'Mid-Level Developer',
    title: 'The Coder',
    avatar: '👩‍💻',
    level: 2,
    hp: 150,
    maxHP: 150,
    energy: 120,
    maxEnergy: 120,
    difficulty: 'medium',
    color: '#3b82f6',
    
    strategy: 'balanced',
    moveSelection: {
      offensive: 0.6,
      defensive: 0.25,
      ultimate: 0.1,
      combo: 0.05
    },
    timingAccuracy: 0.55,
    
    moves: ['binarySearch', 'quickSort', 'hashTable', 'stackBlock', 'queueParry'],
    
    taunts: {
      start: "I've been coding for 3 years. This should be easy.",
      hit: "Classic O(n log n) efficiency!",
      ultimate: "Time to refactor your HP to zero!",
      victory: "Another bug squashed.",
      defeat: "Guess I need to study more algorithms..."
    },
    
    description: 'Experienced developer who understands complexity theory and can chain combos.',
    
    rewards: {
      xp: 100,
      coins: 60,
      unlocks: ['mergeSort']
    }
  },

  SENIOR_ENGINEER: {
    id: 'SENIOR_ENGINEER',
    name: 'Senior Engineer',
    title: 'The Architect',
    avatar: '🧑‍💼',
    level: 3,
    hp: 200,
    maxHP: 200,
    energy: 150,
    maxEnergy: 150,
    difficulty: 'hard',
    color: '#f59e0b',
    
    strategy: 'tactical',
    moveSelection: {
      offensive: 0.5,
      defensive: 0.3,
      ultimate: 0.15,
      counter: 0.05
    },
    timingAccuracy: 0.75,
    
    moves: ['quickSort', 'mergeSort', 'dijkstra', 'hashTable', 'bfs', 'queueParry', 'linkedListDodge'],
    
    taunts: {
      start: "Let me show you system design at scale.",
      hit: "Optimized for maximum throughput.",
      ultimate: "Deploying production-grade damage!",
      victory: "Shipped to production. No rollbacks needed.",
      defeat: "Interesting edge case. I'll document this bug."
    },
    
    description: 'Veterans who optimize every move and rarely miss timing windows. Masters graph algorithms.',
    
    rewards: {
      xp: 200,
      coins: 120,
      unlocks: ['dfs', 'heapSort']
    }
  },

  THE_ALGORITHM: {
    id: 'THE_ALGORITHM',
    name: 'THE ALGORITHM',
    title: 'The Final Boss',
    avatar: '🤖',
    level: 4,
    hp: 300,
    maxHP: 300,
    energy: 200,
    maxEnergy: 200,
    difficulty: 'insane',
    color: '#ef4444',
    
    strategy: 'perfect',
    moveSelection: {
      offensive: 0.5,
      defensive: 0.2,
      ultimate: 0.25,
      optimal: 0.05  // Always picks best move
    },
    timingAccuracy: 0.95,  // Near-perfect timing
    
    moves: Object.keys(ALGORITHM_MOVES),  // Has ALL moves
    
    taunts: {
      start: "I AM OPTIMAL. I AM INEVITABLE.",
      hit: "O(1) PRECISION. ZERO MERCY.",
      ultimate: "EXECUTING MAXIMUM COMPLEXITY.",
      victory: "COMPUTATIONAL SUPREMACY ACHIEVED.",
      defeat: "IMPOSSIBLE. RECALCULATING..."
    },
    
    description: 'Pure algorithmic perfection. Near-perfect timing, optimal move selection, maximum efficiency.',
    
    rewards: {
      xp: 500,
      coins: 300,
      unlocks: ['dynamicProgramming'],
      achievement: 'ALGORITHM_SLAYER'
    }
  }
};

// ==================== BATTLE REWARDS ====================

export const REWARDS = {
  xpPerHit: 5,
  xpPerPerfectTiming: 10,
  xpPerUltimate: 25,
  
  coinMultipliers: {
    EASY: 1.0,
    MEDIUM: 1.5,
    HARD: 2.0,
    INSANE: 3.0
  },
  
  timingBonuses: {
    PERFECT: 1.5,
    GREAT: 1.2,
    GOOD: 1.0,
    MISS: 0.5
  },
  
  streakBonuses: {
    3: 1.1,
    5: 1.25,
    10: 1.5,
    15: 2.0
  }
};

// ==================== ACHIEVEMENTS ====================

export const ACHIEVEMENTS = {
  FIRST_BLOOD: {
    id: 'FIRST_BLOOD',
    name: 'First Blood',
    description: 'Win your first Arena battle',
    icon: '⚔️',
    reward: { coins: 50 }
  },
  
  PERFECT_TIMING: {
    id: 'PERFECT_TIMING',
    name: 'Perfect Execution',
    description: 'Land 5 perfect timings in one battle',
    icon: '🎯',
    reward: { coins: 100 }
  },
  
  ALGORITHM_SLAYER: {
    id: 'ALGORITHM_SLAYER',
    name: 'Algorithm Slayer',
    description: 'Defeat THE ALGORITHM',
    icon: '👑',
    reward: { coins: 500, unlocks: ['secretSkin'] }
  },
  
  SPEEDRUN: {
    id: 'SPEEDRUN',
    name: 'Speedrunner',
    description: 'Win a battle in under 60 seconds',
    icon: '⚡',
    reward: { coins: 150 }
  },
  
  NO_DAMAGE: {
    id: 'NO_DAMAGE',
    name: 'Untouchable',
    description: 'Win without taking any damage',
    icon: '🛡️',
    reward: { coins: 200 }
  }
};

// ==================== BATTLE TIPS ====================

export const BATTLE_TIPS = [
  "Perfect timing = higher damage multipliers. Practice the rhythm!",
  "Hash Table has the narrowest timing window but strongest defense.",
  "Save ultimates for critical moments - they have long cooldowns.",
  "Defensive moves can turn the tide when low on HP.",
  "Energy management is key. Don't spam high-cost moves.",
  "Study enemy patterns. Each AI has predictable behaviors.",
  "Chain offensive moves between enemy attacks for combos.",
  "Perfect timing on ultimates deals MASSIVE damage.",
  "Block with Hash Table when enemy is charging ultimate.",
  "Counter with Queue Parry to return damage and gain initiative."
];

export default {
  ALGORITHM_MOVES,
  DEFENSIVE_MOVES,
  AI_OPPONENTS,
  REWARDS,
  ACHIEVEMENTS,
  BATTLE_TIPS
};
