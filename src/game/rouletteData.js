import { 
  Target, Zap, Brain, Search, Shuffle, Eye, Heart, 
  Shield, AlertTriangle, CheckCircle, Skull, Sparkles
} from 'lucide-react';

// ==================== ROUND TYPES ====================
export const ROUND_TYPES = {
  BLANK: { 
    id: 'blank', 
    name: 'Pass', 
    icon: CheckCircle, 
    color: '#10b981', 
    damage: 0,
    description: 'Test case passed - algorithm executed correctly'
  },
  LIVE: { 
    id: 'live', 
    name: 'Fail', 
    icon: AlertTriangle, 
    color: '#ef4444', 
    damage: 1,
    description: 'Test case failed - algorithm error detected'
  },
  CRITICAL: { 
    id: 'critical', 
    name: 'Critical', 
    icon: Skull, 
    color: '#dc2626', 
    damage: 2,
    description: 'Edge case failure - catastrophic algorithm flaw'
  }
};

// ==================== ITEMS WITH EDUCATIONAL CONTEXT ====================
export const ITEMS = {
  // TIER 1 - Basic Operations
  magnifyingGlass: {
    id: 'magnifyingGlass',
    name: 'Direct Access',
    icon: Eye,
    tier: 1,
    color: '#3b82f6',
    description: 'Peek at next test case',
    uses: 1,
    educational: {
      concept: 'Array Indexing',
      complexity: 'O(1)',
      explanation: 'Direct memory access - instant lookup like array[i]'
    }
  },
  healthKit: {
    id: 'healthKit',
    name: 'Error Handler',
    icon: Heart,
    tier: 1,
    color: '#ec4899',
    description: 'Restore 1 HP (max 4)',
    uses: 1,
    educational: {
      concept: 'Exception Handling',
      complexity: 'O(1)',
      explanation: 'Try-catch blocks - recover from runtime errors'
    }
  },
  
  // TIER 2 - Search & Sort
  binarySearch: {
    id: 'binarySearch',
    name: 'Binary Search',
    icon: Search,
    tier: 2,
    color: '#10b981',
    description: 'Check which half contains more FAIL cases',
    uses: 1,
    educational: {
      concept: 'Binary Search Algorithm',
      complexity: 'O(log n)',
      explanation: 'Divide chamber in half - eliminate half of possibilities instantly. Works because chamber is "sorted" by our knowledge.'
    }
  },
  bubbleSort: {
    id: 'bubbleSort',
    name: 'Bubble Sort',
    icon: Shuffle,
    tier: 2,
    color: '#8b5cf6',
    description: 'Swap next two adjacent test cases',
    uses: 1,
    educational: {
      concept: 'Bubble Sort - Adjacent Swapping',
      complexity: 'O(1) for single swap',
      explanation: 'Like bubble sort, swap adjacent elements. Use when you know next two cases and want to reorder.'
    }
  },
  
  // TIER 3 - Advanced Algorithms
  quickSort: {
    id: 'quickSort',
    name: 'QuickSort Partition',
    icon: Zap,
    tier: 3,
    color: '#f59e0b',
    description: 'Partition chamber - move all PASS to front',
    uses: 1,
    educational: {
      concept: 'QuickSort Partitioning',
      complexity: 'O(n)',
      explanation: 'Choose PASS as pivot - partition remaining tests around it. Classic QuickSort strategy.'
    }
  },
  hashTable: {
    id: 'hashTable',
    name: 'Hash Table',
    icon: Brain,
    tier: 3,
    color: '#06b6d4',
    description: 'Instantly reveal ALL remaining test cases',
    uses: 1,
    educational: {
      concept: 'Hash Table - Perfect Information',
      complexity: 'O(1) lookups',
      explanation: 'Hash table stores every test case with O(1) access. Perfect memory of all states.'
    }
  },
  
  // TIER 4 - Meta Operations
  quantumState: {
    id: 'quantumState',
    name: 'State Mutation',
    icon: Sparkles,
    tier: 4,
    color: '#a855f7',
    description: 'Force next test case to PASS',
    uses: 1,
    educational: {
      concept: 'State Manipulation',
      complexity: 'O(1)',
      explanation: 'Direct memory write - mutate internal state. Like changing a variable mid-execution.'
    }
  },
  skipTurn: {
    id: 'skipTurn',
    name: 'Control Flow',
    icon: Target,
    tier: 4,
    color: '#ef4444',
    description: 'Force opponent to shoot themselves',
    uses: 1,
    educational: {
      concept: 'Control Flow Hijacking',
      complexity: 'O(1)',
      explanation: 'Manipulate program execution flow - like forcing a specific code path.'
    }
  }
};

// ==================== AI DIFFICULTY LEVELS ====================
export const AI_LEVELS = {
  EASY: {
    name: 'Junior Dev',
    description: 'Learning the ropes. Makes obvious mistakes.',
    itemUseChance: 0.3,
    deductionAccuracy: 0.5,
    aggressiveness: 0.4,
    hp: 3,
    color: '#10b981'
  },
  MEDIUM: {
    name: 'Senior Dev',
    description: 'Experienced. Uses items strategically.',
    itemUseChance: 0.6,
    deductionAccuracy: 0.75,
    aggressiveness: 0.6,
    hp: 4,
    color: '#f59e0b'
  },
  HARD: {
    name: 'Principal Engineer',
    description: 'Expert-level decision making. Rarely wrong.',
    itemUseChance: 0.85,
    deductionAccuracy: 0.95,
    aggressiveness: 0.8,
    hp: 4,
    color: '#ef4444'
  },
  INSANE: {
    name: 'The Algorithm',
    description: 'Perfect play. Knows all patterns.',
    itemUseChance: 1.0,
    deductionAccuracy: 1.0,
    aggressiveness: 1.0,
    hp: 5,
    color: '#dc2626'
  }
};

// ==================== CHAMBER CONFIGURATIONS ====================
export const CHAMBER_CONFIGS = {
  EASY: { total: 6, fail: 2, critical: 0 },
  MEDIUM: { total: 8, fail: 3, critical: 1 },
  HARD: { total: 8, fail: 4, critical: 2 },
  INSANE: { total: 10, fail: 5, critical: 2 }
};

// ==================== EDUCATIONAL TOOLTIPS ====================
export const TOOLTIPS = {
  chamber: 'Each slot represents a test case. PASS (green) = algorithm succeeds, FAIL (red) = algorithm error, CRITICAL (dark red) = catastrophic failure.',
  shooting: 'Shoot yourself on PASS to get extra turn. Shoot opponent to deal damage. Use probability and items to deduce chamber contents.',
  items: 'Items represent algorithm concepts. Use them to gather information or manipulate the chamber state.',
  hp: 'Each FAIL deals 1 damage, CRITICAL deals 2. Reach 0 HP and you lose.',
  aiDecisions: 'AI uses probability theory and algorithm knowledge to make optimal decisions.'
};
