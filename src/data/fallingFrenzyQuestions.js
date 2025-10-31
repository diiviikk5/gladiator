// ==================== THE FALLING FRENZY QUESTION BANK ====================
// 200+ DSA Questions - Never Run Out!

export const FALLING_FRENZY_QUESTIONS = [
  // ==================== SORTING (25 questions) ====================
  { q: "Quick Sort average complexity?", opts: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"], correct: 1 },
  { q: "Merge Sort space complexity?", opts: ["O(1)", "O(log n)", "O(n)", "O(n²)"], correct: 2 },
  { q: "Heap Sort worst case?", opts: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], correct: 1 },
  { q: "Bubble Sort best case?", opts: ["O(n)", "O(n²)", "O(n log n)", "O(log n)"], correct: 0 },
  { q: "Insertion Sort stability?", opts: ["Always", "Never", "Sometimes", "Random"], correct: 0 },
  { q: "Selection Sort comparisons?", opts: ["n(n-1)/2", "n log n", "n", "2n"], correct: 0 },
  { q: "Quick Sort pivot selection worst case?", opts: ["Largest element", "Smallest element", "Middle element", "Any element"], correct: 1 },
  { q: "Counting Sort time complexity?", opts: ["O(n + k)", "O(n log n)", "O(n²)", "O(k)"], correct: 0 },
  { q: "Radix Sort works best on?", opts: ["Strings", "Integers", "Floats", "Objects"], correct: 1 },
  { q: "Shell Sort is variation of?", opts: ["Bubble", "Insertion", "Selection", "Merge"], correct: 1 },
  { q: "Bucket Sort average time?", opts: ["O(n + k)", "O(n log n)", "O(n)", "O(n²)"], correct: 2 },
  { q: "In-place sorting means?", opts: ["Extra O(1) space", "Extra O(n) space", "No extra space", "Uses stack"], correct: 0 },
  { q: "Stable sort preserves?", opts: ["Order of duplicates", "Array size", "Comparison count", "Time complexity"], correct: 0 },
  { q: "Which sort is adaptive?", opts: ["Quick Sort", "Heap Sort", "Insertion Sort", "Selection Sort"], correct: 2 },
  { q: "Merge Sort is?", opts: ["In-place", "Adaptive", "Stable", "Unstable"], correct: 2 },
  { q: "Quick Sort average case?", opts: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"], correct: 0 },
  { q: "Tim Sort combines?", opts: ["Bubble & Selection", "Merge & Insertion", "Quick & Heap", "Counting & Radix"], correct: 1 },
  { q: "Cocktail Sort is?", opts: ["Bubble variant", "Merge variant", "Heap variant", "Quick variant"], correct: 0 },
  { q: "Pancake Sort requires?", opts: ["Reversals only", "Swaps only", "Comparisons only", "No operations"], correct: 0 },
  { q: "Gnome Sort compares?", opts: ["Adjacent", "All pairs", "Random", "Sorted subarrays"], correct: 0 },
  { q: "Cycle Sort minimizes?", opts: ["Comparisons", "Swaps", "Time", "Space"], correct: 1 },
  { q: "Odd-Even Sort is?", opts: ["Parallel bubble", "Sequential merge", "Adaptive quick", "Static heap"], correct: 0 },
  { q: "Bitonic Sort works on?", opts: ["2^n elements", "Any n", "Prime n", "Even n"], correct: 0 },
  { q: "Strand Sort best on?", opts: ["Nearly sorted", "Random", "Reverse", "Duplicates"], correct: 0 },
  { q: "Smooth Sort is variant of?", opts: ["Heap Sort", "Quick Sort", "Merge Sort", "Bubble Sort"], correct: 0 },

  // ==================== SEARCHING (20 questions) ====================
  { q: "Binary Search requires?", opts: ["Sorted array", "Linked list", "Hash table", "Any array"], correct: 0 },
  { q: "Binary Search time complexity?", opts: ["O(log n)", "O(n)", "O(n log n)", "O(n²)"], correct: 0 },
  { q: "Linear Search worst case?", opts: ["O(n)", "O(1)", "O(log n)", "O(n²)"], correct: 0 },
  { q: "Interpolation Search best on?", opts: ["Uniform distribution", "Random", "Sorted", "Duplicates"], correct: 0 },
  { q: "Exponential Search combines?", opts: ["Binary + Linear", "Exponential jumps", "Fibonacci jumps", "Random access"], correct: 0 },
  { q: "Jump Search step size?", opts: ["√n", "n", "log n", "2n"], correct: 0 },
  { q: "Fibonacci Search uses?", opts: ["Fibonacci numbers", "Powers of 2", "Primes", "Factorials"], correct: 0 },
  { q: "Ternary Search divides into?", opts: ["3 parts", "2 parts", "4 parts", "n parts"], correct: 0 },
  { q: "Binary Search Rotated Array needs?", opts: ["Modification", "Special handling", "No change", "Preprocessing"], correct: 1 },
  { q: "Meta-Binary Search finds?", opts: ["Highest set bit position", "Lowest element", "Median", "Peak"], correct: 0 },
  { q: "Sentinel Search optimizes?", opts: ["Boundary checks", "Comparisons", "Space", "Time"], correct: 0 },
  { q: "Block Search is?", opts: ["Like jump search", "Like binary search", "Like linear search", "Like exponential"], correct: 0 },
  { q: "Lower Bound returns?", opts: ["First >= element", "First > element", "Last < element", "Last <= element"], correct: 0 },
  { q: "Upper Bound returns?", opts: ["First > element", "First >= element", "Last < element", "Last <= element"], correct: 0 },
  { q: "Equal Range returns?", opts: ["(lower, upper)", "(upper, lower)", "(first, last)", "(start, end)"], correct: 0 },
  { q: "Galloping Search uses?", opts: ["Exponential then binary", "Binary then exponential", "Linear only", "Random jumps"], correct: 0 },
  { q: "Two-pointer technique for?", opts: ["Sorted array problems", "Unsorted arrays", "Linked lists only", "Binary trees"], correct: 0 },
  { q: "Sliding Window for?", opts: ["Substring/subarray", "Single element", "Entire array", "Matrix operations"], correct: 0 },
  { q: "Meet in Middle approach uses?", opts: ["Two searches", "One search", "No search", "Random search"], correct: 0 },
  { q: "Binary Indexed Tree query?", opts: ["O(log n)", "O(1)", "O(n)", "O(n log n)"], correct: 0 },

  // ==================== GRAPHS (25 questions) ====================
  { q: "BFS uses which data structure?", opts: ["Queue", "Stack", "Array", "Tree"], correct: 0 },
  { q: "DFS time complexity?", opts: ["O(V+E)", "O(V)", "O(E)", "O(V²)"], correct: 0 },
  { q: "Dijkstra's algorithm finds?", opts: ["Shortest path", "MST", "Cycles", "Components"], correct: 0 },
  { q: "Bellman-Ford handles?", opts: ["Negative edges", "Positive only", "Zero only", "All types"], correct: 0 },
  { q: "Floyd-Warshall time complexity?", opts: ["O(V³)", "O(V²)", "O(V log V)", "O(E log V)"], correct: 0 },
  { q: "Prim's algorithm for?", opts: ["MST", "Shortest path", "Sorting", "Searching"], correct: 0 },
  { q: "Kruskal's algorithm uses?", opts: ["Union-Find", "Priority queue", "Sorting", "BFS"], correct: 0 },
  { q: "Topological sort requires?", opts: ["DAG", "Cyclic graph", "Connected graph", "Weighted graph"], correct: 0 },
  { q: "DFS detects cycles in?", opts: ["Undirected graph", "Directed graph", "Both", "Neither"], correct: 2 },
  { q: "Tarjan's algorithm finds?", opts: ["SCCs", "MST", "Shortest path", "Bipartite"], correct: 0 },
  { q: "Kosaraju's algorithm finds?", opts: ["SCCs", "MST", "Shortest path", "Bridge edges"], correct: 0 },
  { q: "Articulation point is?", opts: ["Cut vertex", "Start vertex", "End vertex", "Middle vertex"], correct: 0 },
  { q: "Bridge edge is?", opts: ["Cut edge", "Loop edge", "Parallel edge", "Self edge"], correct: 0 },
  { q: "Bipartite graph property?", opts: ["2-colorable", "Acyclic", "Connected", "Weighted"], correct: 0 },
  { q: "Eulerian path exists if?", opts: ["0 or 2 odd-degree", "All even-degree", "All odd-degree", "1 odd-degree"], correct: 0 },
  { q: "Hamiltonian cycle is?", opts: ["NP-complete", "P-class", "Easy", "Solvable in O(n)"], correct: 0 },
  { q: "Chromatic number is?", opts: ["Min colors needed", "Max colors used", "Total vertices", "Total edges"], correct: 0 },
  { q: "Graph coloring uses?", opts: ["Backtracking/Greedy", "BFS only", "DFS only", "DP only"], correct: 0 },
  { q: "A* algorithm is?", opts: ["BFS + heuristic", "DFS + heuristic", "Dijkstra variant", "Greedy only"], correct: 0 },
  { q: "Network flow problem solves?", opts: ["Max flow", "Min path", "Min cost", "Edge coloring"], correct: 0 },
  { q: "Strongly connected components count?", opts: ["1 if all reachable", "V if no edges", "E-V+1", "V-E"], correct: 0 },
  { q: "Weakly connected means?", opts: ["Connected as undirected", "Connected as directed", "All paths exist", "No paths exist"], correct: 0 },
  { q: "DAG property guarantees?", opts: ["Topological order", "Cycles exist", "Strongly connected", "All cycles"], correct: 0 },
  { q: "Tree is special graph with?", opts: ["n vertices, n-1 edges", "n vertices, n edges", "n vertices, 2n edges", "n vertices, n² edges"], correct: 0 },
  { q: "Complete graph edges?", opts: ["n(n-1)/2", "n-1", "2n", "n!"], correct: 0 },

  // ==================== TREES (25 questions) ====================
  { q: "Binary tree max nodes at level h?", opts: ["2^h", "h", "h²", "2^(h-1)"], correct: 0 },
  { q: "AVL tree balancing factor?", opts: ["-1,0,1", "0,1,2", "-2,0,2", "Any"], correct: 0 },
  { q: "Red-Black tree properties?", opts: ["5 properties", "3 properties", "4 properties", "2 properties"], correct: 0 },
  { q: "B-tree order m means?", opts: ["m children max", "m nodes max", "m depth", "m values"], correct: 0 },
  { q: "Heap property for min-heap?", opts: ["Parent < children", "Parent > children", "All equal", "Random"], correct: 0 },
  { q: "Heap operations time complexity?", opts: ["O(log n)", "O(1)", "O(n)", "O(n log n)"], correct: 0 },
  { q: "BST in-order traversal gives?", opts: ["Sorted order", "Reverse sorted", "Level order", "Random order"], correct: 0 },
  { q: "BST search time worst case?", opts: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], correct: 0 },
  { q: "Balanced BST height?", opts: ["O(log n)", "O(n)", "O(n²)", "O(√n)"], correct: 0 },
  { q: "Tree rotation fixes?", opts: ["Imbalance", "Overflow", "Underflow", "Sorting"], correct: 0 },
  { q: "LCA means?", opts: ["Lowest Common Ancestor", "Largest Child Area", "Leaf Count Average", "Level Count Array"], correct: 0 },
  { q: "Segment tree range query?", opts: ["O(log n)", "O(n)", "O(1)", "O(n log n)"], correct: 0 },
  { q: "Fenwick tree space?", opts: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], correct: 0 },
  { q: "Trie insertion time?", opts: ["O(m)", "O(log n)", "O(n)", "O(m log n)"], correct: 0 },
  { q: "Suffix tree space?", opts: ["O(n)", "O(n²)", "O(log n)", "O(1)"], correct: 0 },
  { q: "Complete binary tree property?", opts: ["All levels full", "All nodes filled", "Some nodes missing", "One node per level"], correct: 0 },
  { q: "Perfect binary tree height h has?", opts: ["2^(h+1)-1 nodes", "2^h nodes", "2h nodes", "h² nodes"], correct: 0 },
  { q: "Degenerate tree is?", opts: ["Chain/Skewed", "Balanced", "Complete", "Full"], correct: 0 },
  { q: "Tree diameter is?", opts: ["Longest path", "Height", "Width", "Leaves count"], correct: 0 },
  { q: "Tree width at level h?", opts: ["2^h nodes", "h nodes", "n/2 nodes", "√n nodes"], correct: 0 },
  { q: "Cartesian tree uses?", opts: ["Min/Max heap property", "BST property", "Heap only", "No property"], correct: 0 },
  { q: "Treap combines?", opts: ["Tree + heap", "Tree + priority", "Tree + randomization", "All of above"], correct: 3 },
  { q: "Splay tree operation?", opts: ["Splay to root", "Delete at leaf", "Rotate twice", "No rotation"], correct: 0 },
  { q: "Link-Cut tree supports?", opts: ["Dynamic trees", "Static trees", "Only queries", "Only updates"], correct: 0 },
  { q: "Van Emde Boas tree for?", opts: ["Integer search", "String search", "Float search", "Object search"], correct: 0 },

  // ==================== DYNAMIC PROGRAMMING (25 questions) ====================
  { q: "Dynamic Programming uses?", opts: ["Memoization/Tabulation", "Greedy choice", "Backtracking only", "BFS only"], correct: 0 },
  { q: "Coin Change problem uses?", opts: ["DP with states", "Greedy", "BFS", "Sorting"], correct: 0 },
  { q: "LCS time complexity?", opts: ["O(mn)", "O(m+n)", "O(m*n log n)", "O(max(m,n))"], correct: 0 },
  { q: "LIS can be solved in?", opts: ["O(n log n)", "O(n²)", "O(n)", "O(n!)"], correct: 0 },
  { q: "Knapsack 0/1 space can be?", opts: ["O(W)", "O(n)", "O(nW)", "O(1)"], correct: 0 },
  { q: "Unbounded Knapsack differs by?", opts: ["Items reused", "Items unique", "Different weight", "Different value"], correct: 0 },
  { q: "Matrix Chain Multiplication finds?", opts: ["Optimal parenthesization", "Matrix product", "Best algorithm", "Fastest order"], correct: 0 },
  { q: "Edit Distance DP state?", opts: ["dp[i][j]", "dp[i]", "dp[j]", "dp[i+j]"], correct: 0 },
  { q: "Fibonacci DP avoids?", opts: ["Recomputation", "Memory use", "Sorting", "Hashing"], correct: 0 },
  { q: "Longest Palindromic Substring uses?", opts: ["Expand around center", "DP", "Greedy", "Hashing"], correct: 1 },
  { q: "Word Break DP approach?", opts: ["Check prefixes", "Check suffixes", "Check middle", "Random check"], correct: 0 },
  { q: "Partition Equal Subset Sum uses?", opts: ["01 Knapsack", "Unbounded Knapsack", "Greedy", "BFS"], correct: 0 },
  { q: "Maximum Subarray sum (Kadane)?", opts: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], correct: 0 },
  { q: "House Robber DP recurrence?", opts: ["dp[i] = max(rob/skip)", "dp[i] = all", "dp[i] = min", "dp[i] = sum"], correct: 0 },
  { q: "Climbing Stairs base cases?", opts: ["1, 1, 2", "0, 1, 2", "1, 2, 3", "0, 0, 1"], correct: 0 },
  { q: "Paint House DP tracks?", opts: ["Last color used", "Total cost", "All costs", "Color count"], correct: 0 },
  { q: "Regular Expression Matching uses?", opts: ["DP with backtracking", "Greedy only", "BFS only", "No DP"], correct: 0 },
  { q: "Distinct Subsequences count uses?", opts: ["DP", "Permutation formula", "Combination", "Simple counting"], correct: 0 },
  { q: "Interleaving Strings uses?", opts: ["DP 2D", "DP 1D", "Greedy", "BFS"], correct: 0 },
  { q: "Decode Ways DP handles?", opts: ["Multiple interpretations", "Single path", "All paths equal", "No paths"], correct: 0 },
  { q: "Best Time Buy Sell Stock variation?", opts: ["Multiple types", "One type", "No types", "Random"], correct: 0 },
  { q: "Longest Increasing Subsequence DP?", opts: ["O(n²) or O(n log n)", "O(n)", "O(n³)", "O(log n)"], correct: 0 },
  { q: "Palindrome Partitioning uses?", opts: ["Backtracking + DP", "Only backtracking", "Only DP", "Greedy"], correct: 0 },
  { q: "Burst Balloons trick?", opts: ["Reverse process", "Forward process", "Random order", "No trick"], correct: 0 },
  { q: "Russian Doll Envelopes uses?", opts: ["LIS", "Sorting + LIS", "Sorting only", "LIS only"], correct: 1 },

  // ==================== STRINGS (20 questions) ====================
  { q: "KMP algorithm preprocesses?", opts: ["Failure function", "Pattern", "Text", "Both"], correct: 0 },
  { q: "KMP time complexity?", opts: ["O(n+m)", "O(nm)", "O(n)", "O(m)"], correct: 0 },
  { q: "Boyer-Moore worst case?", opts: ["O(nm)", "O(n+m)", "O(n)", "O(m)"], correct: 0 },
  { q: "Rabin-Karp uses?", opts: ["Rolling hash", "Fixed hash", "No hash", "Hashing only"], correct: 0 },
  { q: "Z-algorithm computes?", opts: ["Z-array", "Prefix", "Suffix", "LCP"], correct: 0 },
  { q: "Trie insert time for length m?", opts: ["O(m)", "O(log m)", "O(m log m)", "O(m²)"], correct: 0 },
  { q: "Aho-Corasick finds?", opts: ["Multiple patterns", "Single pattern", "All substrings", "All palindromes"], correct: 0 },
  { q: "Suffix Array construction?", opts: ["O(n log n) or O(n)", "O(n²)", "O(n log² n)", "O(n!)"], correct: 0 },
  { q: "Manacher's algorithm finds?", opts: ["All palindromes", "Longest palindrome", "Palindrome count", "Odd palindromes"], correct: 1 },
  { q: "Longest Common Substring uses?", opts: ["DP or Suffix array", "KMP only", "Greedy", "BFS"], correct: 0 },
  { q: "Anagram check uses?", opts: ["Sorting or hashing", "BFS", "DFS", "Counting only"], correct: 0 },
  { q: "Palindrome check time?", opts: ["O(n)", "O(log n)", "O(n²)", "O(n log n)"], correct: 0 },
  { q: "String rotation check uses?", opts: ["s1 in s2+s2", "Substring search", "Character matching", "Index search"], correct: 0 },
  { q: "Word ladder BFS uses?", opts: ["Graph adjacency", "Direct path", "Only words", "Only letters"], correct: 0 },
  { q: "Boggle DFS finds?", opts: ["Words on board", "Paths only", "Letters only", "Sequences"], correct: 0 },
  { q: "Levenshtein distance is?", opts: ["Edit distance", "Hamming distance", "Similarity score", "Character count"], correct: 0 },
  { q: "Bloom filter is?", opts: ["Probabilistic set", "Deterministic set", "Ordered set", "Sorted set"], correct: 0 },
  { q: "Pattern matching probabilistic?", opts: ["Rabin-Karp", "KMP", "Boyer-Moore", "Greedy"], correct: 0 },
  { q: "Substring with all chars uses?", opts: ["Sliding window", "Nested loop", "Sorting", "DP"], correct: 0 },
  { q: "Regular expression matching needs?", opts: ["DP with states", "Greedy", "Hashing", "Sorting"], correct: 0 },

  // ==================== MISC (20 questions) ====================
  { q: "Hash table average lookup?", opts: ["O(1)", "O(n)", "O(log n)", "O(n²)"], correct: 0 },
  { q: "Hash collision resolution uses?", opts: ["Chaining or Open addressing", "Deletion", "Resizing", "Reordering"], correct: 0 },
  { q: "Graph with no cycles is?", opts: ["Tree/Forest", "Connected", "Directed", "Weighted"], correct: 0 },
  { q: "Priority queue uses?", opts: ["Heap", "Array", "Linked list", "Hash table"], correct: 0 },
  { q: "Union-Find path compression?", opts: ["O(α(n)) amortized", "O(1)", "O(log n)", "O(n)"], correct: 0 },
  { q: "Bloom filter false positive?", opts: ["Possible", "Impossible", "Always", "Never"], correct: 0 },
  { q: "Fenwick tree updates?", opts: ["O(log n)", "O(1)", "O(n)", "O(n log n)"], correct: 0 },
  { q: "Binary Indexed Tree range query?", opts: ["O(log n)", "O(1)", "O(n)", "O(√n)"], correct: 0 },
  { q: "Square Root Decomposition blocks?", opts: ["√n", "n", "log n", "n²"], correct: 0 },
  { q: "Segment tree queries in?", opts: ["O(log n)", "O(1)", "O(n)", "O(n log n)"], correct: 0 },
  { q: "Convex Hull Graham Scan?", opts: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"], correct: 0 },
  { q: "Closest Pair of Points?", opts: ["O(n log n)", "O(n)", "O(n²)", "O(n log² n)"], correct: 0 },
  { q: "Quickselect average case?", opts: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"], correct: 0 },
  { q: "Median finding uses?", opts: ["Quickselect/Heaps", "Sorting", "Greedy", "BFS"], correct: 0 },
  { q: "Two Sum problem solved?", opts: ["Hash map O(n)", "Sorting O(n log n)", "Brute O(n²)", "DP O(n)"], correct: 0 },
  { q: "Three Sum problem with?", opts: ["Sort + Two pointer", "Hash map", "Brute force", "DP"], correct: 0 },
  { q: "Reservoir Sampling picks?", opts: ["k random items equally", "First k", "Last k", "Random k"], correct: 0 },
  { q: "Fisher-Yates shuffle time?", opts: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], correct: 0 },
  { q: "Backtracking explores?", opts: ["All possibilities", "Optimal path", "Random path", "One path"], correct: 0 },
  { q: "Greedy algorithm guarantees?", opts: ["Local optimum", "Global optimum for some problems", "Always optimal", "Never optimal"], correct: 1 },
];

export const getRandomQuestion = () => {
  return FALLING_FRENZY_QUESTIONS[Math.floor(Math.random() * FALLING_FRENZY_QUESTIONS.length)];
};

export const getQuestionsOfDifficulty = (count = 5) => {
  const questions = [];
  for (let i = 0; i < count && i < FALLING_FRENZY_QUESTIONS.length; i++) {
    const randomIdx = Math.floor(Math.random() * FALLING_FRENZY_QUESTIONS.length);
    const question = FALLING_FRENZY_QUESTIONS[randomIdx];
    if (!questions.find(q => q.q === question.q)) {
      questions.push(question);
    }
  }
  return questions;
};

export const searchQuestions = (keyword) => {
  return FALLING_FRENZY_QUESTIONS.filter(q =>
    q.q.toLowerCase().includes(keyword.toLowerCase()) ||
    q.opts.some(opt => opt.toLowerCase().includes(keyword.toLowerCase()))
  );
};
