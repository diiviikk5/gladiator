// Question generation system for infinite replayability
export const questionTemplates = [
  // CATEGORY 1: TIME COMPLEXITY
  {
    id: "tc_search_sorted",
    category: "time_complexity",
    scenario: "Search for user #{id} in {size} {state} user database",
    variables: {
      id: () => Math.floor(Math.random() * 1000000),
      size: ["1K", "100K", "1M", "10M"],
      state: ["sorted", "unsorted"]
    },
    algorithms: [
      { name: "Linear Search", complexity: "O(n)", icon: "🔍" },
      { name: "Binary Search", complexity: "O(log n)", icon: "⚡" },
      { name: "Hash Lookup", complexity: "O(1)", icon: "🎯" }
    ],
    getCorrect: (vars) => {
      if (vars.state === "sorted") return { algo: "Binary Search", answer: "O(log n)" };
      if (vars.state === "unsorted") return { algo: "Linear Search", answer: "O(n)" };
    },
    qteQuestion: "What's the time complexity?",
    qteOptions: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    explanation: (vars) => 
      vars.state === "sorted" 
        ? "Binary Search divides search space in half each step → O(log n)"
        : "Unsorted data requires checking each element → O(n)"
  },

  {
    id: "tc_sort_large",
    category: "time_complexity",
    scenario: "Sort {size} records for {purpose}",
    variables: {
      size: ["10K", "1M", "100M"],
      purpose: ["quarterly report", "data export", "analytics dashboard"]
    },
    algorithms: [
      { name: "Bubble Sort", complexity: "O(n²)", icon: "🐌" },
      { name: "Quick Sort", complexity: "O(n log n)", icon: "⚡" },
      { name: "Merge Sort", complexity: "O(n log n)", icon: "🔀" }
    ],
    getCorrect: (vars) => ({ algo: "Quick Sort", answer: "O(n log n)" }),
    qteQuestion: "What's the time complexity?",
    qteOptions: ["O(n)", "O(n log n)", "O(n²)", "O(2^n)"],
    explanation: "Quick Sort averages O(n log n) - optimal for comparison sorts"
  },

  // CATEGORY 2: REAL-WORLD APPLICATION
  {
    id: "app_autocomplete",
    category: "application",
    scenario: "Build autocomplete for search bar with {count} queries",
    variables: {
      count: ["10K", "1M", "10M"]
    },
    algorithms: [
      { name: "Array Scan", complexity: "O(n)", icon: "📋" },
      { name: "Trie (Prefix Tree)", complexity: "O(k)", icon: "🌳" },
      { name: "Hash Table", complexity: "O(1)", icon: "🎯" }
    ],
    getCorrect: (vars) => ({ algo: "Trie (Prefix Tree)", answer: "Prefix matching" }),
    qteQuestion: "What's the best data structure?",
    qteOptions: ["Array", "Hash Table", "Trie", "Binary Tree"],
    explanation: "Tries excel at prefix matching - perfect for autocomplete (O(k) where k=query length)"
  },

  {
    id: "app_lru_cache",
    category: "application",
    scenario: "Implement browser cache that evicts {strategy}",
    variables: {
      strategy: ["least recently used items", "oldest items", "random items"]
    },
    algorithms: [
      { name: "Array + Sort", complexity: "O(n log n)", icon: "📋" },
      { name: "LRU Cache", complexity: "O(1)", icon: "🔄" },
      { name: "Stack", complexity: "O(1)", icon: "📚" }
    ],
    getCorrect: (vars) => 
      vars.strategy === "least recently used items"
        ? { algo: "LRU Cache", answer: "Hash Map + Doubly Linked List" }
        : { algo: "Stack", answer: "LIFO structure" },
    qteQuestion: "What data structure combination?",
    qteOptions: ["Array", "Hash + Linked List", "Binary Tree", "Queue"],
    explanation: "LRU Cache uses Hash Map (O(1) lookup) + Doubly Linked List (O(1) eviction)"
  },

  // CATEGORY 3: EDGE CASES
  {
    id: "edge_duplicates",
    category: "edge_case",
    scenario: "Search array with {percent}% duplicate values",
    variables: {
      percent: ["10", "50", "90"]
    },
    algorithms: [
      { name: "Binary Search", complexity: "O(log n)", icon: "⚡" },
      { name: "Modified Binary", complexity: "O(n)", icon: "🔧" },
      { name: "Hash Set", complexity: "O(n)", icon: "🎯" }
    ],
    getCorrect: (vars) => ({ algo: "Modified Binary", answer: "Find boundaries" }),
    qteQuestion: "What's the challenge?",
    qteOptions: ["No challenge", "Multiple matches", "Unsorted data", "Memory limit"],
    explanation: "High duplicates mean Binary Search must scan for first/last occurrence"
  },

  {
    id: "edge_memory",
    category: "edge_case",
    scenario: "Sort {size} records but only {memory} RAM available",
    variables: {
      size: ["10GB", "100GB"],
      memory: ["1GB", "512MB"]
    },
    algorithms: [
      { name: "Quick Sort", complexity: "O(n log n)", icon: "⚡" },
      { name: "Merge Sort", complexity: "O(n log n)", icon: "🔀" },
      { name: "External Sort", complexity: "O(n log n)", icon: "💾" }
    ],
    getCorrect: (vars) => ({ algo: "External Sort", answer: "Disk-based chunks" }),
    qteQuestion: "What's the constraint?",
    qteOptions: ["Time", "Space", "Both", "Neither"],
    explanation: "External Sort splits data into chunks that fit in memory, then merges"
  },

  // CATEGORY 4: TRADEOFFS
  {
    id: "trade_space_time",
    category: "tradeoff",
    scenario: "Optimize {metric} for real-time {application}",
    variables: {
      metric: ["speed", "memory usage"],
      application: ["trading system", "mobile app", "embedded device"]
    },
    algorithms: [
      { name: "Hash Table", complexity: "O(1) time, O(n) space", icon: "🎯" },
      { name: "Binary Search", complexity: "O(log n) time, O(1) space", icon: "⚡" },
      { name: "Linear Scan", complexity: "O(n) time, O(1) space", icon: "🔍" }
    ],
    getCorrect: (vars) => 
      vars.metric === "speed" 
        ? { algo: "Hash Table", answer: "Trade space for speed" }
        : { algo: "Binary Search", answer: "Balance time/space" },
    qteQuestion: "What matters more?",
    qteOptions: ["Speed", "Memory", "Both equal", "Neither"],
    explanation: (vars) => 
      vars.metric === "speed"
        ? "Trading systems prioritize latency over memory"
        : "Mobile/embedded devices have tight memory constraints"
  }
];

// Difficulty progression
export const difficultyLevels = {
  easy: {
    qteSpeed: 3, // meter moves slower
    timeWindow: 5,
    categories: ["time_complexity"]
  },
  medium: {
    qteSpeed: 5,
    timeWindow: 4,
    categories: ["time_complexity", "application"]
  },
  hard: {
    qteSpeed: 7,
    timeWindow: 3,
    categories: ["time_complexity", "application", "edge_case"]
  },
  expert: {
    qteSpeed: 10,
    timeWindow: 2,
    categories: ["time_complexity", "application", "edge_case", "tradeoff"]
  }
};

// Generate a random question
export function generateQuestion(difficulty = "medium") {
  const config = difficultyLevels[difficulty];
  const availableTemplates = questionTemplates.filter(t => 
    config.categories.includes(t.category)
  );
  
  const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
  
  // Fill in variables
  const filledVars = {};
  Object.keys(template.variables).forEach(key => {
    const options = template.variables[key];
    filledVars[key] = typeof options === 'function' 
      ? options()
      : options[Math.floor(Math.random() * options.length)];
  });
  
  // Generate scenario text
  let scenario = template.scenario;
  Object.keys(filledVars).forEach(key => {
    scenario = scenario.replace(`{${key}}`, filledVars[key]);
  });
  
  const correct = template.getCorrect(filledVars);
  
  return {
    id: `${template.id}_${Date.now()}`,
    scenario,
    algorithms: template.algorithms,
    correctAlgo: correct.algo,
    correctAnswer: correct.answer,
    qteQuestion: template.qteQuestion,
    qteOptions: template.qteOptions,
    explanation: typeof template.explanation === 'function' 
      ? template.explanation(filledVars)
      : template.explanation,
    qteSpeed: config.qteSpeed,
    timeWindow: config.timeWindow
  };
}
    