// src/data/duelProblems.js

export const typingChallenges = [
  // Already provided in previous message - 20 long paragraphs
  // Copy the 20 sets from earlier...
  {
    id: 1,
    title: "Data Structures Fundamentals",
    paragraph: "Data structures are fundamental building blocks in computer science that organize information for efficient access and modification. Arrays store contiguous elements accessed via indices, making random access O(1) but insertion and deletion O(n). Linked lists provide efficient insertion and deletion with O(1) complexity at known positions but require O(n) traversal for searching. Stacks follow the Last In First Out principle, essential for function call management and expression evaluation. Queues implement First In First Out behavior, crucial for breadth-first search and job scheduling. Trees organize hierarchical data with root and leaf nodes, binary trees restricting two children per node, and binary search trees maintaining order for efficient searching in O(log n) average case. Hash tables provide average O(1) lookup through key-value mapping and collision resolution via chaining or open addressing. Graphs model complex relationships through vertices and edges, supporting various algorithms like Dijkstra's shortest path, Kruskal's minimum spanning tree, and Floyd-Warshall for all-pairs shortest paths. Heaps maintain partial order properties for efficient priority queue operations. Tries optimize prefix-based searches for autocomplete functionality. Each structure trades memory, speed, and simplicity differently. Selection depends on problem requirements: arrays for cache-friendly sequential access, linked lists for frequent insertions, hash tables for fast lookups, trees for sorted ranges, graphs for network problems. Understanding these foundations enables writing optimal solutions for interview questions and production systems. Proper structure selection significantly impacts algorithm performance. Time complexity analysis using Big O notation helps compare structures objectively. Space complexity considerations matter in memory-constrained environments."
  },
  {
    id: 2,
    title: "Sorting and Searching Techniques",
    paragraph: "Sorting algorithms organize data into desired order, fundamental for binary search, data analysis, and database queries. Bubble sort repeatedly compares adjacent elements and swaps them, achieving O(n²) in average and worst cases but maintaining simplicity and stability. Selection sort finds minimum elements iteratively, also O(n²) but minimizing swaps. Insertion sort builds sorted arrays incrementally, efficient for small datasets or nearly sorted data with O(n) best case. Merge sort employs divide-and-conquer strategy, splitting arrays recursively and merging results, guaranteeing O(n log n) and stability but requiring O(n) extra space. Quick sort selects pivots and partitions recursively, averaging O(n log n) with O(log n) space and in-place operation but risking O(n²) worst case with poor pivot selection. Heap sort leverages heap properties for O(n log n) guaranteed performance without extra space. Counting sort and radix sort achieve linear O(n) for specialized scenarios with non-negative integers. Searching finds elements in datasets: linear search examines every element requiring O(n), binary search on sorted data divides search space achieving O(log n), while hash-based search provides O(1) average lookup. Interpolation search estimates positions improving linear search average performance. Jump search balances binary and linear searches for unsorted data. Exponential search finds ranges before binary searching. Understanding sorting and searching optimizes query performance. Cache behavior influences practical performance beyond theoretical complexity. Stable sorts preserve relative order of equal elements, important for maintaining data integrity during multi-key sorting operations. Adaptive algorithms exploit existing order achieving better performance on partially sorted data."
  },
  {
    id: 3,
    title: "Graph Algorithms and Traversals",
    paragraph: "Graphs model real-world problems through vertices and edges representing entities and relationships. Adjacency matrices use O(V²) space but provide O(1) edge lookup. Adjacency lists use O(V+E) space with O(degree) edge access. Directed graphs maintain source-destination relationships while undirected graphs represent mutual connections. Weighted graphs assign costs to edges for shortest path and minimum spanning tree problems. Depth-first search explores branches deeply before backtracking, useful for topological sorting, cycle detection, and connectivity analysis. Breadth-first search explores level-by-level, finding shortest paths in unweighted graphs and useful for bipartite checking. Topological sorting orders vertices respecting edge directions, essential for task scheduling and dependency resolution. Dijkstra's algorithm finds shortest paths from source to all vertices using priority queues and greedy selection, achieving O((V+E)log V) with binary heaps. Bellman-Ford handles negative weights, detecting negative cycles while maintaining O(VE) complexity. Floyd-Warshall computes all-pairs shortest paths in O(V³), more practical than running Dijkstra V times. Kruskal's algorithm builds minimum spanning trees by sorting edges and using union-find for cycle prevention, achieving O(E log E). Prim's algorithm grows spanning trees from vertices using priority queues, also O((V+E)log V). Strongly connected components identify cycles using Kosaraju or Tarjan's algorithms. Bridge and articulation point detection analyzes graph structure vulnerability. Bipartite checking determines two-colorability for matching problems. Maximum flow algorithms like Ford-Fulkerson and Dinic solve network flow optimization. Graph problems often reduce to fundamental traversals or shortest path variants."
  },
  {
    id: 4,
    title: "Tree Structures and Balancing",
    paragraph: "Trees organize hierarchical data with parent-child relationships, supporting efficient searching and insertion through ordered structures. Binary trees restrict each node to two children, unordered or following search tree properties. Binary search trees maintain left-child less than parent less than right-child invariant, enabling O(log n) search in balanced cases but degrading to O(n) with skewed structure. AVL trees self-balance using rotation operations whenever height difference exceeds one, guaranteeing O(log n) for all operations. Red-black trees maintain color properties and structural constraints less strictly than AVL but still ensuring O(log n) operations with fewer rotations. Splay trees rotate accessed elements toward root, exhibiting amortized O(log n) behavior through adaptive compression. B-trees maintain wide branching factors minimizing disk I/O for database indexing, balancing more subtly than binary variants. Segment trees handle range queries and point updates in O(log n), storing aggregate information in hierarchical structure. Fenwick trees or binary indexed trees provide space-efficient range query support. Suffix trees enable linear-time pattern matching and data compression algorithms. Trie trees optimize prefix-based searches for autocomplete and dictionary implementations. Expression trees represent formulas evaluating through post-order traversal. Huffman coding builds optimal prefix-free trees minimizing average code length. Tree traversals include inorder producing sorted output in binary search trees, preorder useful for tree copying and expression parsing, postorder necessary for tree deletion and expression evaluation. Level-order traversal uses queues for breadth-first exploration. Lowest common ancestor finding supports range minimum query structures. Tree height and balance considerations affect practical performance. Choosing tree structures depends on access patterns, insert frequency, and query requirements."
  },
  {
    id: 5,
    title: "Hash Tables and Collision Resolution",
    paragraph: "Hash tables provide average O(1) lookup through key transformation to array indices via hash functions. Ideal hash functions distribute keys uniformly minimizing collisions while computing quickly. Modulo operation directly maps keys to table size determining distribution properties. Multiplicative hash and universal hashing provide theoretical guarantees against adversarial input. Separate chaining resolves collisions by maintaining linked lists at each table position, allowing arbitrary load factors above one. Open addressing resolves collisions by probing alternative positions through linear probing, quadratic probing, or double hashing. Linear probing examines consecutive positions creating clustering that degrades performance. Quadratic probing using offset squares reduces clustering but complicates deletion. Double hashing uses secondary hash function for probe sequence distribution avoiding systematic patterns. Load factor ratio of filled entries to table size affects performance, with rehashing triggered at thresholds. Rehashing doubles table size maintaining O(1) average through amortized analysis despite one-time O(n) cost. Robin Hood hashing reduces variance in insertion costs through strategic entry displacement. Cuckoo hashing guarantees O(1) worst-case lookup and deletion through multiple hash functions. Bloom filters provide space-efficient probabilistic membership testing accepting false positives. Applications include symbol table implementations, caching, password verification, and deduplication. Cryptographic hashing requires different properties including avalanche effects and collision resistance. Non-cryptographic hashing prioritizes speed for data structures. Hash table design involves balancing space, speed, and collision likelihood. Hash table implementation significantly impacts language performance from JavaScript objects to Java HashMaps. Understanding hash functions helps debug performance issues and choose appropriate load factors."
  },
  {
    id: 6,
    title: "Dynamic Programming Solutions",
    paragraph: "Dynamic programming solves complex problems by decomposing into overlapping subproblems storing intermediate results avoiding recomputation. Memoization records subproblem solutions in tables enabling top-down recursive approaches with lookup before recursive calls. Tabulation builds solution tables bottom-up through iterative computation avoiding recursion overhead and stack depth concerns. Fibonacci sequence exemplifies DP where naive recursion repeats calculations exponentially while DP achieves linear time. Longest common subsequence finds longest matching subsequence in two strings through O(mn) DP table. Edit distance computes minimum operations transforming one string to another. Knapsack problem maximizes value selecting items respecting weight constraints, solvable through pseudo-polynomial DP. Coin change determines minimum coins summing to target value. Longest increasing subsequence finds longest growing sequence within array. Matrix chain multiplication minimizes scalar multiplications through parenthesization ordering. Travelling salesman problem finds shortest tour visiting all cities, intractable for large instances despite DP improvements. Partition problem determines if set divides into equal-sum subsets. Word break checks if string decomposes into dictionary words. Painting fence problems optimize decorating with minimum cost considering overlaps. Digit DP handles digit-by-digit constraints in number problems. DP transitions define state relationships determining correct update ordering. Multiple DP representations trade space for time optimization. Bitmask DP uses binary representations encoding state subsets. State compression reduces space through observation that only previous layer matters. DP identifies through optimal substructure and overlapping subproblems recognition. Interview questions frequently test DP understanding through novel problem variants."
  },
  {
    id: 7,
    title: "Greedy Algorithms and Optimization",
    paragraph: "Greedy algorithms build solutions incrementally by selecting locally optimal choices at each step hoping global optimality results. Activity selection schedules maximum non-overlapping intervals through earliest finish-time sorting. Huffman coding builds optimal prefix-free binary trees for data compression through repeated minimum combination. Fractional knapsack achieves global optimum selecting items by value-to-weight ratio despite integer knapsack intractability. Coin change with specific denominations sometimes admits greedy solutions but generally requires dynamic programming. Job sequencing maximizes profit selecting compatible deadline-respecting tasks. Prim's algorithm grows minimum spanning trees greedily from vertices. Kruskal's algorithm builds minimum spanning trees greedily selecting minimum edges. Dijkstra's algorithm finds shortest paths greedily selecting nearest unvisited vertices. Huffman decoding leverages greedily constructed trees. Greedy proof techniques establish when local optimality implies global optimality through exchange arguments and structural analysis. Counterexamples demonstrate greedy failures for problems requiring global consideration. Greedy algorithms often provide approximation algorithms with performance guarantees for NP-hard problems. Greedy coloring provides valid but potentially suboptimal graph coloring. Greedy scheduling approximates makespan minimization. Understanding greedy applicability prevents incorrect solution attempts. Greedy serves as starting point for optimization before dynamic programming or other approaches. Many interview problems test greedy recognition and proof construction. Practical applications value greedy for efficiency when global optimality proves unnecessary."
  },
  {
    id: 8,
    title: "Backtracking and Problem Solving",
    paragraph: "Backtracking systematically explores solution spaces pruning branches impossible to yield solutions. N-queens places N non-attacking queens on chessboard through row-by-row placement with conflict checking. Sudoku fills nine-by-nine grids with digit constraints and backtracking on conflicts. Permutation generation constructs all element orderings through recursive swapping. Combination generation selects subsets of specified size. Maze solving finds paths exploring available directions backtracking dead ends. Subset problems find special subsets like palindromic decomposition or target sum achievement. Word search locates paths in letter grids following adjacency constraints. Tiling problems cover boards with specific pieces through placement and backtracking. Graph coloring assigns colors to vertices respecting adjacency constraints. Knight tour finds paths visiting all squares once through knight moves. Hamiltonian path finding requires visiting all vertices exactly once. Traveling salesman backtracking explores permutations pruning exceeding current best. Backtracking complexity often exhibits exponential worst-case but reasonable average performance through pruning. Branch-and-bound combines backtracking with optimization tracking best solutions. Bitmask enumeration generates all subsets efficiently for small sets. Backtracking recognizes through requirement to explore multiple possibilities with constraint satisfaction. Implementation uses recursive functions with return-on-failure triggering alternative exploration. Pruning effectiveness determines practical performance through early elimination of invalid branches. Backtracking provides general framework solving diverse problems despite computational expense. Interview questions test backtracking recognition and implementation efficiency."
  },
  {
    id: 9,
    title: "Bit Manipulation Techniques",
    paragraph: "Bit manipulation solves problems directly manipulating binary representations through logical operations. Bitwise AND operation outputs one only when both inputs equal one, useful for bit masking. Bitwise OR operation outputs one when either input equals one, combining bit patterns. Bitwise XOR operation outputs one when inputs differ, enabling toggle and parity checking. Bitwise NOT inverts all bits though implementation varies by representation size. Left shift multiplies by powers of two shifting bits leftward padding zeros. Right shift divides by powers of two removing rightmost bits. Arithmetic shift preserves sign bits in signed representations. Bit masking selects or modifies specific bit ranges through AND operations. Setting bit forces one at position through OR with shifted one. Clearing bit forces zero through AND with shifted inverted one. Toggling bit flips state through XOR with shifted one. Checking bit examines specific position through AND comparison. Bit counting determines set bit quantity through various algorithms. Brian Kernighan algorithm efficiently counts set bits. Power of two identification uses n and n-minus-one AND property. Subset enumeration generates all subsets through incrementing through two to n. Gray code generates binary sequences differing by single bit. Hamming distance measures bit differences between numbers. Parity checking detects single-bit errors. Integer representation exploits sign bit, magnitude, and two's complement conventions. Bit reversal reverses bit order useful for FFT algorithms. Endianness affects multi-byte integer representation. Bitwise operations provide hardware-efficient implementations. Interview problems test bit manipulation recognition and implementation."
  },
  {
    id: 10,
    title: "String Processing Algorithms",
    paragraph: "String processing handles text efficiently through specialized algorithms and data structures. Naive string matching compares pattern at every position achieving O((n-m+1)m) worst-case. Knuth-Morris-Pratt constructs failure function eliminating redundant comparisons achieving O(n+m) time. Boyer-Moore uses rightmost character information skipping characters improving average performance. Rabin-Karp employs rolling hash comparing hashes before full comparison achieving O(n+m) average. Aho-Corasick matches multiple patterns simultaneously through automaton construction. Regular expressions match complex patterns through finite automata compilation. Wildcard matching handles asterisk and question mark patterns through dynamic programming. Longest common subsequence finds longest matching subsequence in two strings through O(mn) DP. Longest increasing subsequence specializes to sorted LCS variant. Palindrome checking verifies symmetric properties potentially expanding around centers. Palindromic decomposition partitions strings into palindromes. Anagram detection identifies character-rearranged equivalences. Trie structures optimize prefix-based searches for dictionaries and autocomplete. Suffix arrays and suffix trees enable linear-time pattern matching and compression. Z-algorithm computes pattern occurrence positions efficiently. Manacher's algorithm finds longest palindromes in linear time. String hashing enables quick equality checking. Tokenization and parsing prepare input for semantic processing. Regular expression engines balance expressiveness and performance. String compression reduces storage through pattern recognition. Run-length encoding handles repetitive sequences. Huffman coding optimizes prefix-free representations."
  },
  {
    id: 11,
    title: "Advanced Algorithm Design",
    paragraph: "Advanced algorithm design combines fundamental techniques addressing complex problems requiring innovation. Divide-and-conquer splits problems recursively combining solutions achieving O(n log n) for many algorithms. Master theorem analyzes divide-and-conquer complexity through recurrence relation solving. Merge sort applies divide-and-conquer maintaining stability and O(n log n) guarantee. Quick sort applies divide-and-conquer with O(n²) worst-case despite average O(n log n). Strassen's algorithm multiplies matrices in O(n^2.807) faster than standard O(n³). Fast Fourier Transform applies divide-and-conquer to polynomial multiplication. Binary search applies divide-and-conquer to searching sorted data. Closest pair problem applies divide-and-conquer to geometric algorithms. Network flow algorithms solve maximum flow problems through augmenting path methods. Linear programming finds optimal solutions respecting linear constraints. Approximation algorithms provide provably near-optimal solutions for NP-hard problems within constant factors. Randomized algorithms employ randomness improving average-case or worst-case complexity. Polynomial-time reduction establishes NP-hardness through SAT and other completeness proofs. Parameterized algorithms solve NP-hard problems efficiently for small parameter values. Online algorithms process input sequentially without lookahead achieving competitive ratios. Streaming algorithms process massive data in single passes. Parallel algorithms exploit multiple processors for speedup. Distributed algorithms coordinate multiple machines handling failures. Quantum algorithms potentially achieve exponential speedup for specific problems. Algorithm selection depends on problem characteristics, constraints, and practical requirements. Theoretical understanding combined with practical implementation experience enables optimal solutions."
  },
  {
    id: 12,
    title: "Priority Queues and Heaps",
    paragraph: "Priority queues maintain elements ordered by priority enabling efficient maximum or minimum extraction. Heaps implement priority queues through complete binary trees maintaining heap properties. Max heaps maintain parent greater than children supporting maximum extraction. Min heaps maintain parent less than children supporting minimum extraction. Heap insertion adds elements at leaf maintaining heap property through upward percolation. Heap extraction removes root replacing with last element then downward percolation. Heapify transforms arbitrary arrays into heaps through bottom-up percolation achieving O(n) time. Heap sort converts arrays to heaps extracting elements maintaining sorted output. Heap operations achieve O(log n) insertion and extraction enabling O(n log n) sorting. Heaps support Dijkstra's shortest path algorithm efficiently. Heaps enable Prim's minimum spanning tree algorithm. Priority queues handle scheduling problems maintaining task priorities. Huffman coding constructs optimal trees through repeated minimum extraction. Merge k sorted lists efficiently uses heaps. Median finding dynamically maintains heaps tracking running medians. K-way merge uses heaps organizing multiple sorted sequences. Tournament selection finds k smallest elements efficiently. Dijkstra's algorithm optimization uses priority queues achieving O((V+E)log V). Fibonacci heaps provide amortized O(1) insertion and decrease-key operations. Binomial heaps support efficient merge operations. Pairing heaps offer practical efficiency despite complex analysis. Binary indexed trees provide alternative range aggregate structures. Segment trees complement heaps for range query problems. Heap implementation efficiency significantly impacts algorithm performance."
  },
  {
    id: 13,
    title: "Network Flow and Matching",
    paragraph: "Network flow models problems through directed graphs with capacity constraints and flow conservation. Ford-Fulkerson method finds maximum flow through augmenting paths achieving flow value equal minimum cut. Residual graphs represent remaining capacity after partial flow. Augmenting paths connect source to sink through available capacity. Edmonds-Karp applies breadth-first search to augmenting path finding. Dinic's algorithm uses level graphs improving Ford-Fulkerson complexity. Push-relabel algorithms maintain preflows pushing excess toward sink. Maximum bipartite matching models through network flow with capacity one edges. Hungarian algorithm finds maximum weight matching through reduction to min-cost flow. Minimum cost flow extends maximum flow adding per-unit costs. Circulation problems enforce flow conservation at all nodes beyond source and sink. Flow decomposition represents flows as path combinations. Min-cut max-flow theorem establishes equality between maximum flow and minimum cut. Network connectivity uses flow algorithms for robustness analysis. Demand fulfillment models use flow networks. Project selection converts to min-cut problems. Baseball elimination uses flow algorithms determining mathematical feasibility. Image segmentation applies min-cut algorithms. Airline scheduling uses flow networks. Telephone routing uses flow algorithms. Practical networks employ efficient algorithms understanding scaling and approximation."
  },
  {
    id: 14,
    title: "Computational Geometry",
    paragraph: "Computational geometry solves spatial problems through point, line, and polygon algorithms. Distance calculations use Euclidean metrics measuring separation between points. Closest pair algorithms find minimum-distance pairs through divide-and-conquer in O(n log n). Convex hull identifies smallest convex polygon containing all points. Graham scan constructs convex hulls through polar sorting and stack-based construction. Quick hull recursively finds hulls through pivot point division. Jarvis march incrementally builds convex hulls. Point in polygon testing determines containment through ray casting. Intersection detection identifies overlapping geometric objects. Line segment intersection finds crossing points. Polygon area calculation uses shoelace formula. Triangle area determines through cross product. Collinear checking detects point alignment. Orientation determines point left or right of line. Sweepline algorithms handle event-based geometric processing. Voronoi diagrams partition space into nearest-point regions. Delaunay triangulations maximize minimum angles. KD-trees organize spatial data enabling range queries. Range trees support multidimensional range search. Visible point determination solves line-of-sight problems. Nearest neighbor search localizes closest points efficiently. Geometric transforms including rotation, translation, and scaling. Perspective projection converts 3D to 2D. Mesh generation creates triangulations for simulation. Collision detection prevents physical intersection in games and simulation."
  },
  {
    id: 15,
    title: "Number Theory and Cryptography",
    paragraph: "Number theory studies integer properties enabling cryptographic algorithms and modular arithmetic. Prime number testing determines primality through deterministic and probabilistic methods. Sieve of Eratosthenes efficiently generates primes up to limit through iterative elimination. Miller-Rabin primality test provides probabilistic verification with adjustable confidence. Greatest common divisor computation uses Euclidean algorithm through iterative remainder reduction. Least common multiple derives from GCD relationship. Extended Euclidean algorithm finds integer solutions to Bezout identity. Modular arithmetic performs operations modulo prime handling wraparound behavior. Fermat's Little Theorem enables efficient modular exponentiation. Euler's theorem generalizes Fermat to composite moduli. Chinese Remainder Theorem reconstructs numbers from modular residues. RSA encryption uses large semiprime factorization difficulty. Public key enables private communication through mathematical asymmetry. Discrete logarithm problem enables Diffie-Hellman key exchange. Elliptic curve cryptography provides efficiency advantages over RSA. Digital signatures verify authenticity through one-way functions. Hash functions provide collision-resistant summarization. Message authentication codes detect tampering. Symmetric encryption masks plaintext through keys. Block cipher modes including CBC and CTR. Stream ciphers encrypt continuous data. Key derivation functions strengthen passwords. Cryptographic randomness requires high entropy sources. Side-channel attacks exploit implementation details. Quantum computing threatens current cryptographic security."
  },
  {
    id: 16,
    title: "Cache and Memory Optimization",
    paragraph: "Cache hierarchies including L1, L2, and L3 caches store frequently accessed data near processors. Memory access patterns significantly affect practical algorithm performance beyond theoretical complexity. Spatial locality suggests accessing nearby memory addresses through prefetching. Temporal locality suggests reusing recently accessed data through caching. Cache line sizes typically 64 bytes group data for efficient retrieval. Cache associativity determines memory locations mapping to cache positions. Set-associative caches balance full and direct mapping. Cache replacement policies including LRU and random determine eviction on misses. Cache coherence maintains consistency across multiple processors. NUMA systems exhibit non-uniform access latency requiring awareness. Memory bandwidth limits throughput despite processor speed. False sharing causes unnecessary cache invalidation through shared line modification. Data alignment improves access efficiency through word boundary alignment. Prefetching hints processors to load anticipated data. Memory pools reduce fragmentation through allocation patterns. Virtual memory provides abstraction enabling larger address spaces. Page faults trigger expensive disk access warranting minimization. Paging and segmentation enable memory management. Swap analysis determines thrashing likelihood. Pointer arithmetic enables efficient traversal. Structure of array versus array of structures affects cache behavior. Computation layout restructures for cache locality. Algorithm choice considers practical machine characteristics. Performance profiling identifies bottlenecks. Optimization focuses on dominant costs."
  },
  {
    id: 17,
    title: "Parallel and Distributed Computing",
    paragraph: "Parallel computing exploits multiple processors for simultaneous computation reducing execution time. Shared memory multiprocessing enables direct memory access among threads. Message passing multiprocessing enables communication-based thread coordination. Thread synchronization prevents race conditions through locks, semaphores, and monitors. Mutual exclusion ensures critical section exclusive access. Deadlock prevention avoids circular wait through ordered lock acquisition. Lock-free algorithms eliminate explicit synchronization through atomic operations. Compare-and-swap enables atomic comparisons and updates. Memory barriers enforce ordering in relaxed memory models. Producer-consumer patterns coordinate data flow through queues. Map-reduce frameworks distribute computation across clusters. Distributed consensus determines shared decision through Byzantine-resistant voting. Paxos algorithm tolerates minority failure. Raft algorithm provides practical consensus. Chord distributed hash tables enable peer-to-peer systems. Consistent hashing minimizes redistribution during scaling. Replication maintains data across failures. Two-phase commit ensures atomic transactions. Eventually consistent systems prioritize availability. CAP theorem proves impossibility of simultaneous consistency, availability, and partition tolerance. Quorum systems balance consistency and availability. Vector clocks establish causality in distributed systems. Lamport clocks provide total ordering. Chandy-Lamport algorithm captures consistent snapshots. Distributed mutual exclusion prevents simultaneous critical section access. Load balancing distributes work across processors. Task scheduling optimizes processor utilization. Work stealing balances loads through idle processor assistance. Parallel algorithm speedup indicates efficiency gains. Amdahl's law limits achievable parallelism through sequential portions."
  },
  {
    id: 18,
    title: "Machine Learning Fundamentals",
    paragraph: "Machine learning enables systems learning patterns from data without explicit programming. Supervised learning learns from labeled examples predicting outcomes. Classification assigns categorical labels. Regression predicts continuous values. Decision trees split features recursively building human-interpretable models. Random forests combine multiple trees reducing overfitting. Support vector machines find maximum-margin separating hyperplanes. Neural networks approximate arbitrary functions through layered computations. Gradient descent optimizes parameters minimizing loss through iterative steps. Backpropagation computes gradients efficiently through reverse differentiation. Convolutional neural networks process spatial data through sliding filters. Recurrent neural networks process sequences through temporal connections. Attention mechanisms enable selective focus on relevant information. Transformer architectures revolutionized language understanding through parallel attention computation. Unsupervised learning discovers patterns without labels. Clustering groups similar items through distance metrics. K-means partitions data minimizing within-cluster variance. Hierarchical clustering builds trees through agglomeration. Principal component analysis reduces dimensionality through variance maximization. Reinforcement learning learns through environment interaction and rewards. Q-learning estimates action values through temporal difference learning. Policy gradient methods directly optimize policies. Deep Q-networks combine neural networks and Q-learning. Markov decision processes formalize sequential decisions. Bellman equations relate values recursively. Exploration-exploitation tradeoffs balance learning and performance. Generalization performance on unseen data indicates model quality. Cross-validation estimates generalization through train-test splitting. Regularization prevents overfitting through parameter constraints. Hyperparameter tuning optimizes model architectures. Transfer learning applies knowledge across tasks."
  },
  {
    id: 19,
    title: "Game Theory and Algorithms",
    paragraph: "Game theory analyzes strategic interactions through payoff matrices and Nash equilibria. Zero-sum games pit opponents with opposing interests. Non-zero-sum games enable mutual benefit or loss. Pure strategies employ single actions deterministically. Mixed strategies randomize across actions probabilistically. Nash equilibrium establishes strategies where no unilateral deviation improves outcome. Dominant strategies beat all opponent responses. Cooperative games enable binding agreements. Coalition formation determines group participation benefits. Prisoner's dilemma demonstrates cooperation difficulty through rational self-interest. Chicken game analyzes collision avoidance incentives. Matching pennies exemplifies simultaneous move asymmetry. Auction theory determines efficient goods allocation. Bidding strategies depend on valuation information. Second-price auctions align bidder incentives with valuation. Mechanism design creates games achieving desired outcomes. Arrow's impossibility theorem limits voting aggregation. Approval voting enables multiple candidate support. Minimax strategies optimize worst-case outcomes. Alpha-beta pruning eliminates unexamined game tree branches. Transposition tables cache previously evaluated positions. Quiescence search extends horizon beyond tactical instability. Iterative deepening balances time and accuracy. Monte Carlo tree search samples games finding promising moves. Upper confidence tree balancing explores promising lines. Nim game analysis through Grundy numbers determines winner. Sprague-Grundy theorem enables game decomposition. Combinatorial game theory classifies winning positions. Retrograde analysis works backwards from known endings. Endgame tables store optimal endgame strategies. Opening books record strong early moves. Playing strength evaluation through Elo and Glicko ratings."
  },
  {
    id: 20,
    title: "Advanced Data Structures",
    paragraph: "Advanced data structures combine fundamentals enabling efficient specialized operations. Suffix arrays enable linear-time pattern matching through sorted suffixes. Suffix trees provide faster pattern matching through explicit tree structure. Persistent data structures maintain version histories enabling efficient historical queries. Rope data structures optimize string manipulation through balanced trees. B-plus trees improve range query performance through leaf chaining. R-trees index spatial data enabling bounding box queries. Quadtrees recursively partition 2D space. Octrees extend quadtrees to 3D. KD-trees organize multidimensional data through recursive splitting. Van Emde Boas trees achieve O(log log n) operations on integers. Fibonacci heaps provide O(1) amortized insertion and decrease-key. Binomial heaps support efficient merging. Skew heaps simplify implementation through amortized O(log n). Leftist heaps merge in O(log n) time. Treap structures randomize binary search tree insertion determining heights. Splay trees adaptively reorganize through accessed element rotation. Skip lists randomize linked list layering enabling O(log n) search. Bloom filters provide space-efficient probabilistic membership. Cuckoo hashing guarantees O(1) worst-case lookup. Hopscotch hashing combines advantages of various techniques. B-skip heaps combine B-trees and skip lists. Segment trees support range queries and point updates. Fenwick trees provide space-efficient range query alternatives. Disjoint set union efficiently manages connectivity. Link-cut trees dynamically maintain forest structures. Centroid decomposition solves tree problems recursively. Heavy-light decomposition decomposes trees into chain and binary tree structures. Metric trees index metric spaces. Fractional cascading enables efficient range searching. Interpolation search trees improve average search performance."
  }
];

// ============ HELPER FUNCTIONS ============

/**
 * Get random typing challenge
 * @returns {Object} Random challenge object
 */
export const getRandomChallenge = () => {
  return typingChallenges[Math.floor(Math.random() * typingChallenges.length)];
};

/**
 * Get challenge by ID
 * @param {number} id - Challenge ID
 * @returns {Object} Challenge object or null
 */
export const getChallengeById = (id) => {
  return typingChallenges.find((challenge) => challenge.id === id) || null;
};

/**
 * Calculate WPM (Words Per Minute)
 * @param {number} wordsTyped - Number of words typed
 * @param {number} timeElapsed - Time elapsed in seconds
 * @returns {number} WPM rounded
 */
export const calculateWPM = (wordsTyped, timeElapsed) => {
  if (timeElapsed === 0) return 0;
  return Math.round((wordsTyped / timeElapsed) * 60);
};

/**
 * Calculate accuracy percentage
 * @param {string} typed - Typed text
 * @param {string} original - Original paragraph
 * @returns {number} Accuracy percentage
 */
export const calculateAccuracy = (typed, original) => {
  if (typed.length === 0) return 0;
  let correct = 0;
  for (let i = 0; i < typed.length && i < original.length; i++) {
    if (typed[i] === original[i]) correct++;
  }
  return Math.round((correct / typed.length) * 100);
};

/**
 * Calculate final score
 * @param {number} wpm - Words per minute
 * @param {number} accuracy - Accuracy percentage
 * @param {number} correctMCQs - Number of correct MCQs
 * @returns {number} Final score
 */
export const calculateFinalScore = (wpm, accuracy, correctMCQs) => {
  const wpmScore = wpm * 1;
  const accuracyScore = accuracy * 0.5;
  const mcqScore = correctMCQs * 10;
  return Math.max(0, Math.round(wpmScore + accuracyScore + mcqScore));
};

/**
 * Count words in text
 * @param {string} text - Text to count
 * @returns {number} Word count
 */
export const countWords = (text) => {
  return text.trim().split(/\s+/).filter((word) => word.length > 0).length;
};

/**
 * Compare two player stats and determine winner
 * @param {Object} player1 - Player 1 stats
 * @param {Object} player2 - Player 2 stats
 * @returns {string} 'player1' | 'player2' | 'tie'
 */
export const determineWinner = (player1, player2) => {
  if (player1.finalScore > player2.finalScore) return 'player1';
  if (player2.finalScore > player1.finalScore) return 'player2';
  return 'tie';
};

/**
 * Get character-level error positions
 * @param {string} typed - Typed text
 * @param {string} original - Original text
 * @returns {Array} Array of error positions
 */
export const getErrorPositions = (typed, original) => {
  const errors = [];
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] !== original[i]) {
      errors.push(i);
    }
  }
  return errors;
};

/**
 * Format time in MM:SS format
 * @param {number} seconds - Seconds
 * @returns {string} Formatted time
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

/**
 * Generate performance rating based on metrics
 * @param {number} wpm - Words per minute
 * @param {number} accuracy - Accuracy percentage
 * @returns {string} Rating description
 */
export const getPerformanceRating = (wpm, accuracy) => {
  if (wpm > 100 && accuracy > 95) return 'Legendary';
  if (wpm > 80 && accuracy > 90) return 'Master';
  if (wpm > 60 && accuracy > 85) return 'Expert';
  if (wpm > 40 && accuracy > 80) return 'Intermediate';
  if (wpm > 20 && accuracy > 70) return 'Beginner';
  return 'Novice';
};

export default {
  typingChallenges,
  getRandomChallenge,
  getChallengeById,
  calculateWPM,
  calculateAccuracy,
  calculateFinalScore,
  countWords,
  determineWinner,
  getErrorPositions,
  formatTime,
  getPerformanceRating,
};
