// src/data/mcqBank.js

export const globalMCQBank = [
  // Format for each MCQ:
  // {
  //   q: "Question text",
  //   options: ["Option 1", "Option 2", "Option 3", "Option 4"],
  //   answer: "Correct option text"
  // }

  // --- BINARY SEARCH & SEARCHING (50+ MCQs)
  {
    q: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(n^2)"],
    answer: "O(log n)"
  },
  {
    q: "Binary search works on which type of array?",
    options: ["Unsorted", "Sorted", "Random", "Any array"],
    answer: "Sorted"
  },
  {
    q: "Which algorithm is NOT a searching algorithm?",
    options: ["Linear search", "Interpolation search", "Exponential search", "Bubble sort"],
    answer: "Bubble sort"
  },
  {
    q: "What is the best case time complexity of linear search?",
    options: ["O(1)", "O(n)", "O(n^2)", "O(log n)"],
    answer: "O(1)"
  },
  {
    q: "Interpolation search is an improvement over binary search for?",
    options: ["Unsorted arrays", "Uniformly distributed data", "Linked lists", "Graphs"],
    answer: "Uniformly distributed data"
  },
  {
    q: "Jump search time complexity is?",
    options: ["O(n)", "O(sqrt(n))", "O(log n)", "O(n^2)"],
    answer: "O(sqrt(n))"
  },
  {
    q: "What is the auxiliary space complexity of binary search?",
    options: ["O(n)", "O(1)", "O(log n)", "O(n^2)"],
    answer: "O(1)"
  },
  {
    q: "Which search algorithm requires data to be sorted?",
    options: ["Linear search", "Hash search", "Binary search", "All of them"],
    answer: "Binary search"
  },
  {
    q: "Exponential search is used when?",
    options: ["Array is small", "Array size is unknown", "Array is sorted", "Array is unsorted"],
    answer: "Array size is unknown"
  },
  {
    q: "In binary search, what is the number of comparisons in worst case for array of size 32?",
    options: ["32", "16", "5", "6"],
    answer: "6"
  },

  // --- SORTING ALGORITHMS (50+ MCQs)
  {
    q: "What is the time complexity of merge sort in worst case?",
    options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
    answer: "O(n log n)"
  },
  {
    q: "Which sorting algorithm is stable?",
    options: ["Quick sort", "Heap sort", "Merge sort", "Selection sort"],
    answer: "Merge sort"
  },
  {
    q: "Quicksort has worst case complexity of?",
    options: ["O(n)", "O(n log n)", "O(n^2)", "O(1)"],
    answer: "O(n^2)"
  },
  {
    q: "Which sorting algorithm uses divide and conquer?",
    options: ["Bubble sort", "Insertion sort", "Merge sort", "Selection sort"],
    answer: "Merge sort"
  },
  {
    q: "Bubble sort compares adjacent elements and?",
    options: ["Adds them", "Multiplies them", "Swaps them if out of order", "Divides them"],
    answer: "Swaps them if out of order"
  },
  {
    q: "What is the space complexity of merge sort?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
    answer: "O(n)"
  },
  {
    q: "Which sorting is best for nearly sorted data?",
    options: ["Quick sort", "Insertion sort", "Heap sort", "Merge sort"],
    answer: "Insertion sort"
  },
  {
    q: "Heap sort has time complexity of?",
    options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
    answer: "O(n log n)"
  },
  {
    q: "Selection sort minimum comparisons?",
    options: ["n-1", "n(n-1)/2", "log n", "n"],
    answer: "n(n-1)/2"
  },
  {
    q: "Radix sort works on?",
    options: ["Strings only", "Floating point numbers", "Non-negative integers", "All numbers"],
    answer: "Non-negative integers"
  },

  // --- STACKS & QUEUES (50+ MCQs)
  {
    q: "What principle does a stack follow?",
    options: ["FIFO", "LIFO", "Random", "Priority"],
    answer: "LIFO"
  },
  {
    q: "Stack operation that removes top element is?",
    options: ["Push", "Pop", "Peek", "Insert"],
    answer: "Pop"
  },
  {
    q: "Queue follows which principle?",
    options: ["LIFO", "FIFO", "Random", "Circular"],
    answer: "FIFO"
  },
  {
    q: "Which operation adds element to queue?",
    options: ["Dequeue", "Enqueue", "Pop", "Peek"],
    answer: "Enqueue"
  },
  {
    q: "Stack is used for?",
    options: ["BFS", "Function calls", "Job scheduling", "Printer queue"],
    answer: "Function calls"
  },
  {
    q: "Queue is used for?",
    options: ["DFS", "Expression evaluation", "BFS", "Undo functionality"],
    answer: "BFS"
  },
  {
    q: "How many stacks are needed to implement queue?",
    options: ["1", "2", "3", "4"],
    answer: "2"
  },
  {
    q: "How many queues are needed to implement stack?",
    options: ["1", "2", "3", "4"],
    answer: "2"
  },
  {
    q: "Time complexity of stack push operation?",
    options: ["O(n)", "O(1)", "O(log n)", "O(n^2)"],
    answer: "O(1)"
  },
  {
    q: "Time complexity of queue dequeue operation?",
    options: ["O(n)", "O(1)", "O(log n)", "O(n^2)"],
    answer: "O(1)"
  },

  // --- LINKED LISTS (50+ MCQs)
  {
    q: "How is data accessed in a linked list?",
    options: ["Indexing", "Sequential traversal", "Hash lookup", "Random access"],
    answer: "Sequential traversal"
  },
  {
    q: "Which linked list allows bidirectional traversal?",
    options: ["Singly linked", "Circular linked", "Doubly linked", "XOR linked"],
    answer: "Doubly linked"
  },
  {
    q: "Time complexity of searching in singly linked list?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
    answer: "O(n)"
  },
  {
    q: "Insertion at beginning of linked list takes?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
    answer: "O(1)"
  },
  {
    q: "Deletion at end of singly linked list takes?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
    answer: "O(n)"
  },
  {
    q: "Circular linked list has?",
    options: ["NULL at end", "Last node points to first", "Two heads", "No tail"],
    answer: "Last node points to first"
  },
  {
    q: "XOR linked list uses which operation?",
    options: ["OR", "AND", "XOR", "NOT"],
    answer: "XOR"
  },
  {
    q: "Skip list improves linked list search to?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"],
    answer: "O(log n)"
  },
  {
    q: "Doubly linked list reversal is?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"],
    answer: "O(n)"
  },
  {
    q: "Merge two sorted linked lists takes?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
    answer: "O(n)"
  },

  // --- TREES (50+ MCQs)
  {
    q: "Maximum children in binary tree?",
    options: ["1", "2", "3", "Any"],
    answer: "2"
  },
  {
    q: "Inorder traversal of BST gives?",
    options: ["Unsorted", "Sorted", "Reverse sorted", "Random"],
    answer: "Sorted"
  },
  {
    q: "AVL tree rebalances when height difference exceeds?",
    options: ["1", "2", "3", "4"],
    answer: "1"
  },
  {
    q: "Red-black tree property requires?",
    options: ["Height difference 1", "Black nodes on all paths", "Red parent", "All leaves at level"],
    answer: "Black nodes on all paths"
  },
  {
    q: "Splay tree rotates accessed element to?",
    options: ["Middle", "Bottom", "Root", "Random"],
    answer: "Root"
  },
  {
    q: "B-tree order determines?",
    options: ["Height", "Children per node", "Color property", "Balance factor"],
    answer: "Children per node"
  },
  {
    q: "Preorder traversal visits node?",
    options: ["After children", "Before children", "Between children", "Last"],
    answer: "Before children"
  },
  {
    q: "Postorder traversal visits node?",
    options: ["First", "Before children", "After children", "Randomly"],
    answer: "After children"
  },
  {
    q: "Tree height of single node?",
    options: ["0", "1", "-1", "Undefined"],
    answer: "0"
  },
  {
    q: "Complete binary tree has maximum nodes at height h?",
    options: ["2h", "2^h", "2^(h+1)-1", "h^2"],
    answer: "2^(h+1)-1"
  },

  // --- GRAPHS (50+ MCQs)
  {
    q: "Which algorithm finds shortest path?",
    options: ["DFS", "Dijkstra's", "BFS", "Prim's"],
    answer: "Dijkstra's"
  },
  {
    q: "Graph traversal using stack is?",
    options: ["BFS", "DFS", "Both", "Neither"],
    answer: "DFS"
  },
  {
    q: "Graph traversal using queue is?",
    options: ["DFS", "BFS", "Both", "Neither"],
    answer: "BFS"
  },
  {
    q: "Detecting cycle in graph uses?",
    options: ["DFS", "BFS", "Prim's", "Dijkstra's"],
    answer: "DFS"
  },
  {
    q: "Topological sort is used for?",
    options: ["Finding cycles", "Shortest path", "Dependency resolution", "MST"],
    answer: "Dependency resolution"
  },
  {
    q: "Kruskal's algorithm finds?",
    options: ["Shortest path", "Longest path", "Minimum spanning tree", "Maximum flow"],
    answer: "Minimum spanning tree"
  },
  {
    q: "Prim's algorithm time complexity?",
    options: ["O(V^2)", "O(E log V)", "O(V E)", "O(log V)"],
    answer: "O(E log V)"
  },
  {
    q: "Floyd-Warshall finds?",
    options: ["Single-source shortest path", "All-pairs shortest path", "MST", "Maximum flow"],
    answer: "All-pairs shortest path"
  },
  {
    q: "Bellman-Ford handles?",
    options: ["Positive edges only", "Negative edges", "Negative cycles", "All of these"],
    answer: "Negative edges"
  },
  {
    q: "Bipartite graph can be colored with?",
    options: ["1 color", "2 colors", "3 colors", "N colors"],
    answer: "2 colors"
  },

  // --- HASHING (30+ MCQs)
  {
    q: "Hashing primary use is?",
    options: ["Sorting", "Searching", "Traversal", "Balancing"],
    answer: "Searching"
  },
  {
    q: "Hash collision resolution by chaining uses?",
    options: ["Arrays", "Linked lists", "Trees", "Heaps"],
    answer: "Linked lists"
  },
  {
    q: "Load factor in hash table is?",
    options: ["Size/Capacity", "Capacity/Size", "Collisions/Size", "Rehashes/Capacity"],
    answer: "Size/Capacity"
  },
  {
    q: "Double hashing uses how many hash functions?",
    options: ["1", "2", "3", "N"],
    answer: "2"
  },
  {
    q: "Best hash function property is?",
    options: ["Fast collision", "Uniform distribution", "Random mapping", "Ordered output"],
    answer: "Uniform distribution"
  },
  {
    q: "Linear probing causes?",
    options: ["Primary clustering", "Secondary clustering", "Rehashing", "Collision"],
    answer: "Primary clustering"
  },
  {
    q: "Open addressing requires?",
    options: ["External storage", "Array-based table", "Linked lists", "Trees"],
    answer: "Array-based table"
  },
  {
    q: "Bloom filter is used for?",
    options: ["Sorting", "Searching", "Membership testing", "Hashing"],
    answer: "Membership testing"
  },
  {
    q: "Cuckoo hashing guarantees?",
    options: ["O(n) search", "O(log n) search", "O(1) worst-case search", "O(1) average search"],
    answer: "O(1) worst-case search"
  },
  {
    q: "Robin Hood hashing reduces?",
    options: ["Collisions", "Variance in insertion time", "Space usage", "Search time"],
    answer: "Variance in insertion time"
  },

  // --- DYNAMIC PROGRAMMING (30+ MCQs)
  {
    q: "DP requires which property?",
    options: ["Greedy choice", "Optimal substructure", "Linear order", "Sorting"],
    answer: "Optimal substructure"
  },
  {
    q: "Memoization is?",
    options: ["Bottom-up DP", "Top-down DP", "Recursion", "Iteration"],
    answer: "Top-down DP"
  },
  {
    q: "Fibonacci using DP achieves?",
    options: ["O(n^2)", "O(2^n)", "O(n)", "O(log n)"],
    answer: "O(n)"
  },
  {
    q: "LCS time complexity is?",
    options: ["O(m+n)", "O(m*n)", "O(m^2)", "O(n^2)"],
    answer: "O(m*n)"
  },
  {
    q: "Knapsack problem DP time?",
    options: ["O(nW)", "O(n log n)", "O(n^2)", "O(2^n)"],
    answer: "O(nW)"
  },
  {
    q: "Tabulation DP is?",
    options: ["Top-down", "Bottom-up", "Recursive", "Iterative + recursion"],
    answer: "Bottom-up"
  },
  {
    q: "Coin change minimum coins uses?",
    options: ["Greedy", "BFS", "DP", "DFS"],
    answer: "DP"
  },
  {
    q: "Edit distance algorithm is?",
    options: ["Dijkstra's", "Floyd-Warshall", "Levenshtein", "Hamming"],
    answer: "Levenshtein"
  },
  {
    q: "Longest increasing subsequence uses?",
    options: ["DP", "Sorting", "Hashing", "Recursion"],
    answer: "DP"
  },
  {
    q: "Matrix chain multiplication finds optimal?",
    options: ["Sum", "Product", "Parenthesization", "Order"],
    answer: "Parenthesization"
  },

  // --- GREEDY ALGORITHMS (20+ MCQs)
  {
    q: "Greedy algorithms pick?",
    options: ["Global optimum", "Local optimum", "Random choice", "Worst choice"],
    answer: "Local optimum"
  },
  {
    q: "Huffman coding is?",
    options: ["DP problem", "Greedy problem", "Sorting problem", "Graph problem"],
    answer: "Greedy problem"
  },
  {
    q: "Activity selection problem is solved by?",
    options: ["DP", "Greedy", "Brute force", "Hashing"],
    answer: "Greedy"
  },
  {
    q: "Greedy fails for?",
    options: ["MST", "Activity selection", "0-1 Knapsack", "Dijkstra"],
    answer: "0-1 Knapsack"
  },
  {
    q: "Fractional knapsack is solved by?",
    options: ["DP", "Greedy", "Recursion", "BFS"],
    answer: "Greedy"
  },
  {
    q: "Job sequencing with deadlines uses?",
    options: ["DP", "Greedy", "Recursion", "Sorting"],
    answer: "Greedy"
  },
  {
    q: "Dijkstra's algorithm is?",
    options: ["DP", "Greedy", "Recursion", "Backtracking"],
    answer: "Greedy"
  },
  {
    q: "Prim's MST algorithm uses?",
    options: ["DFS", "BFS", "Greedy", "DP"],
    answer: "Greedy"
  },
  {
    q: "Kruskal's MST algorithm uses?",
    options: ["DFS", "BFS", "Greedy + Union-Find", "DP"],
    answer: "Greedy + Union-Find"
  },
  {
    q: "Greedy works for coin change with?",
    options: ["Any denominations", "Canonical coin system", "Binary coins", "Prime denominations"],
    answer: "Canonical coin system"
  },

  // --- BACKTRACKING (20+ MCQs)
  {
    q: "N-Queens problem requires?",
    options: ["DP", "Greedy", "Backtracking", "Hashing"],
    answer: "Backtracking"
  },
  {
    q: "Sudoku solving uses?",
    options: ["DFS only", "BFS only", "Backtracking", "DP"],
    answer: "Backtracking"
  },
  {
    q: "Permutation generation uses?",
    options: ["DP", "Greedy", "Backtracking", "Sorting"],
    answer: "Backtracking"
  },
  {
    q: "Combination generation uses?",
    options: ["DP", "Greedy", "Backtracking", "Hashing"],
    answer: "Backtracking"
  },
  {
    q: "Maze solving uses?",
    options: ["BFS", "DFS", "Backtracking", "All of these"],
    answer: "All of these"
  },
  {
    q: "Hamiltonian path finding uses?",
    options: ["DP", "Greedy", "Backtracking", "Hashing"],
    answer: "Backtracking"
  },
  {
    q: "Knight tour problem uses?",
    options: ["DP", "Greedy", "Backtracking", "Sorting"],
    answer: "Backtracking"
  },
  {
    q: "Backtracking worst case is?",
    options: ["O(n log n)", "O(n^2)", "O(2^n)", "O(n)"],
    answer: "O(2^n)"
  },
  {
    q: "Pruning in backtracking helps?",
    options: ["Increase time", "Reduce search space", "Add solutions", "Simplify code"],
    answer: "Reduce search space"
  },
  {
    q: "Branch and bound is?",
    options: ["Backtracking + optimization", "DP + greedy", "DFS + hashing", "BFS + sorting"],
    answer: "Backtracking + optimization"
  },

  // --- BIT MANIPULATION (20+ MCQs)
  {
    q: "XOR operation result is 1 when?",
    options: ["Both 1", "Both 0", "Bits differ", "Bits same"],
    answer: "Bits differ"
  },
  {
    q: "AND operation result is 1 when?",
    options: ["Either 1", "Bits differ", "Both 1", "At least one 0"],
    answer: "Both 1"
  },
  {
    q: "OR operation result is 0 when?",
    options: ["Both 0", "Both 1", "Bits differ", "Either 1"],
    answer: "Both 0"
  },
  {
    q: "Setting bit at position i uses?",
    options: ["n & (1 << i)", "n | (1 << i)", "n ^ (1 << i)", "n << i"],
    answer: "n | (1 << i)"
  },
  {
    q: "Clearing bit at position i uses?",
    options: ["n | (1 << i)", "n & ~(1 << i)", "n ^ (1 << i)", "n << i"],
    answer: "n & ~(1 << i)"
  },
  {
    q: "Toggling bit at position i uses?",
    options: ["n & (1 << i)", "n | (1 << i)", "n ^ (1 << i)", "n << i"],
    answer: "n ^ (1 << i)"
  },
  {
    q: "Checking if power of 2 uses?",
    options: ["n & (n-1) == 0", "n | (n-1) == 0", "n ^ (n-1) == 0", "n << 1 == 0"],
    answer: "n & (n-1) == 0"
  },
  {
    q: "Counting set bits is?",
    options: ["Brian Kernighan algorithm", "Population count", "Hamming weight", "All of these"],
    answer: "All of these"
  },
  {
    q: "Left shift by k multiplies by?",
    options: ["2", "2^k", "k", "k^2"],
    answer: "2^k"
  },
  {
    q: "Right shift by k divides by?",
    options: ["2", "2^k", "k", "k^2"],
    answer: "2^k"
  },

  // --- HEAPS & PRIORITY QUEUES (20+ MCQs)
  {
    q: "Min heap property is?",
    options: ["Parent > child", "Parent < child", "Parent = child", "No order"],
    answer: "Parent < child"
  },
  {
    q: "Heap insertion time complexity?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    answer: "O(log n)"
  },
  {
    q: "Heap extraction time complexity?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    answer: "O(log n)"
  },
  {
    q: "Heapify operation is?",
    options: ["O(n log n)", "O(n)", "O(log n)", "O(1)"],
    answer: "O(n)"
  },
  {
    q: "Heap sort time complexity?",
    options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
    answer: "O(n log n)"
  },
  {
    q: "Priority queue is implemented using?",
    options: ["Array", "Linked list", "Heap", "BST"],
    answer: "Heap"
  },
  {
    q: "Fibonacci heap decrease-key is?",
    options: ["O(log n)", "O(1)", "O(n)", "O(n log n)"],
    answer: "O(1)"
  },
  {
    q: "Binomial heap merge is?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    answer: "O(log n)"
  },
  {
    q: "Pairing heap operations are?",
    options: ["Worse than Fibonacci", "Better than Fibonacci", "Amortized O(log n)", "O(1) worst-case"],
    answer: "Amortized O(log n)"
  },
  {
    q: "Max heap used for?",
    options: ["Finding minimum", "Finding maximum", "Sorting ascending", "Searching"],
    answer: "Finding maximum"
  },

  // --- ADVANCED CONCEPTS (30+ MCQs)
  {
    q: "Time complexity Big O is?",
    options: ["Upper bound", "Lower bound", "Average case", "Exact time"],
    answer: "Upper bound"
  },
  {
    q: "Space complexity measures?",
    options: ["CPU time", "Memory used", "Code size", "Output size"],
    answer: "Memory used"
  },
  {
    q: "Amortized analysis averages over?",
    options: ["Single operation", "Sequence of operations", "Worst case", "Best case"],
    answer: "Sequence of operations"
  },
  {
    q: "Master theorem solves?",
    options: ["Sorting", "Searching", "Recurrence relations", "Graph problems"],
    answer: "Recurrence relations"
  },
  {
    q: "NP-complete problem is?",
    options: ["Solvable in polynomial time", "Verifiable in polynomial time", "Hard to solve", "No known solution"],
    answer: "Verifiable in polynomial time"
  },
  {
    q: "Union-Find finds?",
    options: ["Path", "Root", "Connectivity", "Height"],
    answer: "Connectivity"
  },
  {
    q: "Path compression in Union-Find reduces to?",
    options: ["O(n)", "O(log n)", "O(α(n))", "O(1)"],
    answer: "O(α(n))"
  },
  {
    q: "Suffix array is used for?",
    options: ["Sorting suffixes", "Pattern matching", "Compression", "All of these"],
    answer: "All of these"
  },
  {
    q: "Trie is used for?",
    options: ["Prefix search", "Exact search", "Range query", "Sorting"],
    answer: "Prefix search"
  },
  {
    q: "Segment tree supports?",
    options: ["Point update only", "Range query only", "Both point update and range query", "Deletion only"],
    answer: "Both point update and range query"
  },
  {
    q: "Fenwick tree is also called?",
    options: ["AVL tree", "Binary indexed tree", "Trie", "Suffix tree"],
    answer: "Binary indexed tree"
  },
  {
    q: "Persistent data structure maintains?",
    options: ["Single version", "Multiple versions", "No versions", "Deleted versions"],
    answer: "Multiple versions"
  },
  {
    q: "Skip list search time is?",
    options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
    answer: "O(log n)"
  },
  {
    q: "Van Emde Boas tree search is?",
    options: ["O(n)", "O(log n)", "O(log log n)", "O(1)"],
    answer: "O(log log n)"
  },
  {
    q: "Rope data structure is used for?",
    options: ["String storage", "String concatenation", "Tree traversal", "Graph representation"],
    answer: "String concatenation"
  },

  // --- GRAPH THEORY (20+ MCQs)
  {
    q: "Strongly connected component uses?",
    options: ["Kosaraju algorithm", "Tarjan algorithm", "Both", "DFS"],
    answer: "Both"
  },
  {
    q: "Bridge finding in graph uses?",
    options: ["BFS", "DFS", "Dijkstra", "Floyd-Warshall"],
    answer: "DFS"
  },
  {
    q: "Articulation point finding uses?",
    options: ["BFS", "DFS", "Dijkstra", "Bellman-Ford"],
    answer: "DFS"
  },
  {
    q: "Bipartite checking uses?",
    options: ["DFS only", "BFS only", "BFS or DFS", "Dijkstra"],
    answer: "BFS or DFS"
  },
  {
    q: "Maximum flow finds?",
    options: ["Shortest path", "Minimum path", "Maximum capacity path", "Maximum flow value"],
    answer: "Maximum flow value"
  },
  {
    q: "Ford-Fulkerson uses?",
    options: ["Augmenting paths", "Spanning trees", "Cycles", "Components"],
    answer: "Augmenting paths"
  },
  {
    q: "Minimum cost flow combines?",
    options: ["Flow + Cost", "MST + Shortest path", "All", "None"],
    answer: "Flow + Cost"
  },
  {
    q: "Graph coloring determines?",
    options: ["Chromatic number", "Vertices color", "Edges color", "Minimum colors"],
    answer: "Chromatic number"
  },
  {
    q: "Clique problem finds?",
    options: ["Connected components", "Largest complete subgraph", "Longest path", "Shortest cycle"],
    answer: "Largest complete subgraph"
  },
  {
    q: "Independent set problem finds?",
    options: ["Connected vertices", "Non-adjacent vertices", "Maximum vertices", "Minimum vertices"],
    answer: "Non-adjacent vertices"
  }
];

// USAGE EXAMPLE in Duel.jsx:
// const randomMCQ = globalMCQBank[Math.floor(Math.random() * globalMCQBank.length)];
