import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Book, Users, Zap, Brain, Database, Cpu, Clock, Target, 
  AlertTriangle, CheckCircle, Plus, Home, ChevronRight, Play, Award, 
  Sparkles, Box, Server, Monitor, Layers, Network, Code, TreePine, 
  Mountain, Factory, Shield, Heart, Coffee, TrendingUp, Archive,
  DollarSign, Briefcase, Package, Settings, Save
} from 'lucide-react';

// ==================== GAME CONFIGURATION ====================
const GAME_CONFIG = {
  mapWidth: 20,
  mapHeight: 14,
  startResources: { data: 100, cpu: 60, memory: 40 },
  tickInterval: 3000, // 3 seconds per game tick
  dayLength: 10, // 10 ticks per day
  victoryConditions: { algorithms: 5, buildings: 10, colonists: 5 }
};

// ==================== DATA STRUCTURES ====================

const TILE_TYPES = {
  GRASS: { id: 'grass', bg: '#166534', passable: true, moveCost: 1 },
  DIRT: { id: 'dirt', bg: '#92400e', passable: true, moveCost: 1 },
  STONE: { id: 'stone', bg: '#64748b', icon: Mountain, passable: false },
  FOREST: { id: 'forest', bg: '#15803d', icon: TreePine, passable: true, moveCost: 2, resource: 'wood' },
  WATER: { id: 'water', bg: '#0369a1', passable: false },
  RUIN: { id: 'ruin', bg: '#78716c', icon: Factory, passable: true, loot: true }
};

const ALGORITHMS = [
  { id: 'linear', name: 'Linear Search', icon: Code, tier: 1, color: '#3b82f6', complexity: 'O(n)', unlocks: ['workstation'] },
  { id: 'binary', name: 'Binary Search', icon: Target, tier: 2, color: '#10b981', complexity: 'O(log n)', unlocks: ['database'] },
  { id: 'bubble', name: 'Bubble Sort', icon: Layers, tier: 1, color: '#6366f1', complexity: 'O(n²)', unlocks: ['warehouse'] },
  { id: 'quick', name: 'QuickSort', icon: Zap, tier: 3, color: '#8b5cf6', complexity: 'O(n log n)', unlocks: ['server'] },
  { id: 'dijkstra', name: "Dijkstra's", icon: Network, tier: 4, color: '#f59e0b', complexity: 'O(E log V)', unlocks: ['ai-lab'] },
  { id: 'astar', name: 'A*', icon: Target, tier: 5, color: '#ef4444', complexity: 'O(b^d)', unlocks: ['quantum-core'] }
];

const BUILDINGS = [
  { id: 'workstation', name: 'Workstation', icon: Monitor, requires: 'linear', cost: { data: 40, cpu: 20 }, produces: { data: 2 }, color: '#3b82f6' },
  { id: 'database', name: 'Database', icon: Database, requires: 'binary', cost: { data: 80, cpu: 40 }, produces: { data: 5, cpu: 2 }, color: '#10b981' },
  { id: 'warehouse', name: 'Warehouse', icon: Package, requires: 'bubble', cost: { data: 60, cpu: 30 }, produces: { memory: 10 }, color: '#6366f1' },
  { id: 'server', name: 'Server', icon: Server, requires: 'quick', cost: { data: 120, cpu: 60 }, produces: { cpu: 8 }, color: '#8b5cf6' },
  { id: 'ai-lab', name: 'AI Lab', icon: Brain, requires: 'dijkstra', cost: { data: 200, cpu: 100 }, produces: { data: 10, cpu: 10 }, color: '#f59e0b' },
  { id: 'quantum-core', name: 'Quantum Core', icon: Sparkles, requires: 'astar', cost: { data: 500, cpu: 300 }, produces: { data: 50, cpu: 50 }, color: '#ef4444' }
];

const RANDOM_EVENTS = [
  {
    id: 'bug-swarm',
    title: 'Bug Swarm Attack!',
    description: 'Sort 10,000 bugs by severity to defend colony',
    requires: 'quick',
    icon: AlertTriangle,
    color: '#ef4444',
    rewards: { data: 100, cpu: 50 },
    penalties: { data: -50 }
  },
  {
    id: 'trader',
    title: 'Algorithm Trader',
    description: 'A mysterious trader offers to sell rare algorithms',
    icon: Briefcase,
    color: '#f59e0b',
    action: 'trade'
  },
  {
    id: 'memory-leak',
    title: 'Memory Leak Crisis',
    description: 'System RAM usage critical - optimize data structures',
    requires: 'binary',
    icon: AlertTriangle,
    color: '#ef4444',
    rewards: { memory: 100 },
    penalties: { cpu: -30 }
  }
];

// ==================== PROCEDURAL GENERATION ====================

const generateMap = (w, h, seed = Math.random()) => {
  const map = [];
  const noise = (x, y) => {
    const val = Math.sin(x * 0.1 + seed) * Math.cos(y * 0.1 + seed);
    return (val + 1) / 2;
  };

  for (let y = 0; y < h; y++) {
    const row = [];
    for (let x = 0; x < w; x++) {
      const centerDist = Math.sqrt((x - w/2)**2 + (y - h/2)**2);
      const noiseVal = noise(x, y);
      
      let tile;
      if (centerDist < 3) {
        tile = TILE_TYPES.GRASS;
      } else if (noiseVal < 0.3) {
        tile = TILE_TYPES.WATER;
      } else if (noiseVal < 0.4) {
        tile = TILE_TYPES.STONE;
      } else if (noiseVal < 0.6) {
        tile = TILE_TYPES.FOREST;
      } else if (noiseVal < 0.8) {
        tile = TILE_TYPES.DIRT;
      } else if (noiseVal < 0.95) {
        tile = TILE_TYPES.GRASS;
      } else {
        tile = TILE_TYPES.RUIN;
      }
      
      const hasBook = tile.loot && Math.random() > 0.7;
      const bookTier = Math.floor(Math.random() * 3) + 1;
      const availableBooks = ALGORITHMS.filter(a => a.tier <= bookTier);
      
      row.push({ 
        ...tile, 
        x, 
        y, 
        building: null, 
        book: hasBook ? availableBooks[Math.floor(Math.random() * availableBooks.length)] : null,
        discovered: centerDist < 5
      });
    }
    map.push(row);
  }
  return map;
};

// ==================== MAIN COMPONENT ====================

export default function Colony() {
  const navigate = useNavigate();
  
  // Game State
  const [phase, setPhase] = useState('intro');
  const [map, setMap] = useState([]);
  const [colonists, setColonists] = useState([]);
  const [resources, setResources] = useState(GAME_CONFIG.startResources);
  const [discovered, setDiscovered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [buildMode, setBuildMode] = useState(null);
  const [logs, setLogs] = useState([]);
  const [day, setDay] = useState(1);
  const [tick, setTick] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [hoveredTile, setHoveredTile] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [gameSpeed, setGameSpeed] = useState(1);
  const [victoryProgress, setVictoryProgress] = useState({ algorithms: 0, buildings: 0, colonists: 3 });

  // Initialize
  useEffect(() => {
    const newMap = generateMap(GAME_CONFIG.mapWidth, GAME_CONFIG.mapHeight);
    setMap(newMap);
    setColonists([
      { id: 1, name: 'Alice', x: 9, y: 6, hunger: 100, energy: 100, morale: 100, skill: 'Algorithms', moving: false },
      { id: 2, name: 'Bob', x: 10, y: 7, hunger: 100, energy: 100, morale: 100, skill: 'Systems', moving: false },
      { id: 3, name: 'Carol', x: 11, y: 6, hunger: 100, energy: 100, morale: 100, skill: 'Data Structures', moving: false }
    ]);
  }, []);

  // Game Loop
  useEffect(() => {
    if (phase !== 'playing') return;
    
    const interval = setInterval(() => {
      setTick(t => {
        const newTick = t + 1;
        
        // Day cycle
        if (newTick % GAME_CONFIG.dayLength === 0) {
          setDay(d => d + 1);
          setTimeOfDay('morning');
          triggerRandomEvent();
        } else if (newTick % (GAME_CONFIG.dayLength / 4) === 0) {
          setTimeOfDay(prev => {
            if (prev === 'morning') return 'afternoon';
            if (prev === 'afternoon') return 'evening';
            if (prev === 'evening') return 'night';
            return 'morning';
          });
        }
        
        // Resource generation
        generateResources();
        
        // Colonist needs
        updateColonistNeeds();
        
        return newTick;
      });
    }, GAME_CONFIG.tickInterval / gameSpeed);
    
    return () => clearInterval(interval);
  }, [phase, gameSpeed, map]);

  // Functions
  const addLog = useCallback((msg) => {
    setLogs(prev => [...prev.slice(-5), { msg, time: Date.now() }]);
  }, []);

  const generateResources = useCallback(() => {
    const newResources = { data: 0, cpu: 0, memory: 0 };
    
    map.forEach(row => {
      row.forEach(tile => {
        if (tile.building) {
          const building = BUILDINGS.find(b => b.id === tile.building);
          if (building?.produces) {
            Object.entries(building.produces).forEach(([key, val]) => {
              newResources[key] += val;
            });
          }
        }
      });
    });
    
    setResources(prev => ({
      data: Math.min(prev.data + newResources.data, 9999),
      cpu: Math.min(prev.cpu + newResources.cpu, 9999),
      memory: Math.min(prev.memory + newResources.memory, 9999)
    }));
  }, [map]);

  const updateColonistNeeds = useCallback(() => {
    setColonists(prev => prev.map(c => ({
      ...c,
      hunger: Math.max(0, c.hunger - 2),
      energy: Math.max(0, c.energy - 1),
      morale: c.hunger < 20 || c.energy < 20 ? Math.max(0, c.morale - 5) : Math.min(100, c.morale + 1)
    })));
  }, []);

  const triggerRandomEvent = useCallback(() => {
    if (Math.random() > 0.4) {
      const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
      setCurrentEvent(event);
      addLog(`⚠️ EVENT: ${event.title}`);
    }
  }, [addLog]);

  const moveColonist = useCallback((cid, x, y) => {
    if (x < 0 || x >= GAME_CONFIG.mapWidth || y < 0 || y >= GAME_CONFIG.mapHeight) return;
    
    const tile = map[y][x];
    if (!tile.passable) {
      addLog(`❌ Cannot move to ${tile.id}`);
      return;
    }

    setColonists(prev => prev.map(c => 
      c.id === cid ? { ...c, x, y, moving: true, energy: Math.max(0, c.energy - (tile.moveCost || 1) * 5) } : c
    ));

    setTimeout(() => {
      setColonists(prev => prev.map(c => c.id === cid ? { ...c, moving: false } : c));
    }, 500);

    if (tile.book && !discovered.includes(tile.book.id)) {
      setDiscovered(prev => [...prev, tile.book.id]);
      addLog(`📚 ${tile.book.name} discovered!`);
      setVictoryProgress(prev => ({ ...prev, algorithms: prev.algorithms + 1 }));
      
      setMap(prev => prev.map(row => row.map(t => 
        t.x === x && t.y === y ? { ...t, book: null } : t
      )));
    }

    // Reveal fog of war
    setMap(prev => prev.map(row => row.map(t => {
      const dist = Math.sqrt((t.x - x)**2 + (t.y - y)**2);
      return dist < 4 ? { ...t, discovered: true } : t;
    })));
  }, [map, discovered, addLog]);

  const placeBuilding = useCallback((x, y, bid) => {
    const building = BUILDINGS.find(b => b.id === bid);
    const tile = map[y][x];
    
    if (!tile.passable || tile.building || !building) return;
    if (building.requires && !discovered.includes(building.requires)) {
      addLog(`🔒 ${building.name} requires ${building.requires}`);
      return;
    }
    if (resources.data < building.cost.data || resources.cpu < building.cost.cpu) {
      addLog('❌ Insufficient resources');
      return;
    }

    setMap(prev => prev.map(row => row.map(t => 
      t.x === x && t.y === y ? { ...t, building: bid } : t
    )));
    
    setResources(prev => ({
      data: prev.data - building.cost.data,
      cpu: prev.cpu - building.cost.cpu,
      memory: prev.memory
    }));
    
    setVictoryProgress(prev => ({ ...prev, buildings: prev.buildings + 1 }));
    addLog(`✅ ${building.name} constructed`);
    setBuildMode(null);
  }, [map, discovered, resources, addLog]);

  const handleEventResolve = useCallback((success) => {
    if (success && currentEvent.rewards) {
      setResources(prev => ({
        data: prev.data + (currentEvent.rewards.data || 0),
        cpu: prev.cpu + (currentEvent.rewards.cpu || 0),
        memory: prev.memory + (currentEvent.rewards.memory || 0)
      }));
      addLog('✅ Event resolved successfully!');
    } else if (!success && currentEvent.penalties) {
      setResources(prev => ({
        data: Math.max(0, prev.data + (currentEvent.penalties.data || 0)),
        cpu: Math.max(0, prev.cpu + (currentEvent.penalties.cpu || 0)),
        memory: Math.max(0, prev.memory + (currentEvent.penalties.memory || 0))
      }));
      addLog('❌ Event failed - penalties applied');
    }
    setCurrentEvent(null);
  }, [currentEvent, addLog]);

  // Check victory
  useEffect(() => {
    if (victoryProgress.algorithms >= GAME_CONFIG.victoryConditions.algorithms &&
        victoryProgress.buildings >= GAME_CONFIG.victoryConditions.buildings) {
      setPhase('victory');
    }
  }, [victoryProgress]);

  // ==================== RENDER PHASES ====================

  // Intro
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center overflow-hidden relative">
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, #10B981, transparent 50%)',
              'radial-gradient(circle at 80% 50%, #F59E0B, transparent 50%)',
              'radial-gradient(circle at 20% 50%, #10B981, transparent 50%)'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="relative z-10 text-center max-w-5xl px-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: 'spring' }}
            className="mb-8"
          >
            <Code className="w-32 h-32 text-emerald-400 mx-auto" strokeWidth={1.5} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-9xl font-black mb-6"
            style={{ 
              fontFamily: 'Orbitron, sans-serif',
              background: 'linear-gradient(135deg, #10B981, #F59E0B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            ALGO COLONY
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-3xl text-gray-300 mb-12"
          >
            Survive. Build. Learn Algorithms.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPhase('landing')}
            className="px-16 py-6 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl font-black text-3xl flex items-center gap-4 mx-auto shadow-2xl"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            <Play className="w-8 h-8" fill="currentColor" />
            BEGIN EXPEDITION
          </motion.button>
        </div>
      </div>
    );
  }

  // Landing Cutscene
  if (phase === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white flex items-center justify-center p-6">
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 
              className="text-7xl font-black mb-4"
              style={{ fontFamily: 'Orbitron, sans-serif', color: '#10b981' }}
            >
              MISSION BRIEFING
            </h2>
            <div className="w-48 h-2 bg-gradient-to-r from-emerald-500 via-amber-500 to-emerald-500 mx-auto" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-8 text-2xl text-gray-300 leading-relaxed mb-16"
          >
            <p className="text-center">
              <span className="text-emerald-400 font-bold">Year 2077.</span> The Algorithm Wars have ended.
            </p>
            <p className="text-center">
              <span className="text-amber-400 font-bold">Three developers</span> crash-land on an unknown planet filled with ancient algorithmic knowledge.
            </p>
            <p className="text-center text-purple-400 font-bold text-3xl">
              Build. Discover. Survive.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-3 gap-6 mb-16"
          >
            {colonists.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.2 }}
                className="p-8 rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-500/10 to-transparent backdrop-blur-sm"
              >
                <Users className="w-16 h-16 text-emerald-400 mx-auto mb-4" strokeWidth={1.5} />
                <h3 className="font-black text-2xl mb-2 text-center" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  {c.name}
                </h3>
                <p className="text-center text-gray-400 font-bold">{c.skill}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Energy</span>
                    <span className="text-emerald-400 font-bold">{c.energy}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Morale</span>
                    <span className="text-emerald-400 font-bold">{c.morale}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(16, 185, 129, 0.6)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setPhase('playing');
              addLog('🚀 Colony established on Algorithm Planet');
            }}
            className="w-full py-6 bg-gradient-to-r from-emerald-500 via-amber-500 to-emerald-500 rounded-2xl font-black text-3xl flex items-center justify-center gap-4 shadow-2xl"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            <ChevronRight className="w-8 h-8" />
            ESTABLISH COLONY
            <ChevronRight className="w-8 h-8" />
          </motion.button>
        </div>
      </div>
    );
  }

  // Victory
  if (phase === 'victory') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-4xl"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, ease: 'easeOut' }}
          >
            <Trophy className="w-40 h-40 text-amber-400 mx-auto mb-8" />
          </motion.div>

          <h1 
            className="text-9xl font-black mb-6"
            style={{ 
              fontFamily: 'Orbitron, sans-serif',
              background: 'linear-gradient(135deg, #10B981, #F59E0B, #10B981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            VICTORY!
          </h1>

          <p className="text-3xl text-gray-300 mb-12">
            Colony Thriving • Day {day} • {discovered.length} Algorithms Mastered
          </p>

          <div className="flex gap-6 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-12 py-5 bg-emerald-500 rounded-xl font-bold text-2xl hover:bg-emerald-600 flex items-center gap-3"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              <Play className="w-6 h-6" />
              New Colony
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-12 py-5 bg-gray-700 rounded-xl font-bold text-2xl hover:bg-gray-600 flex items-center gap-3"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              <Home className="w-6 h-6" />
              Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // MAIN GAME - Continue in next message due to length
  // Type "continue" for the complete gameplay UI with all systems working
  // ==================== MAIN GAMEPLAY UI ====================
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4">
      
      {/* TOP HUD - Resources & Day */}
      <div className="max-w-[1900px] mx-auto mb-4 flex items-center justify-between">
        <div className="flex gap-3">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border-2 border-blue-500/50 rounded-xl backdrop-blur-sm"
          >
            <Database className="w-5 h-5 text-blue-400" />
            <div>
              <div className="font-black text-xl" style={{ fontFamily: 'Orbitron, sans-serif' }}>{resources.data}</div>
              <div className="text-[10px] text-blue-300">Data Shards</div>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border-2 border-purple-500/50 rounded-xl backdrop-blur-sm"
          >
            <Cpu className="w-5 h-5 text-purple-400" />
            <div>
              <div className="font-black text-xl" style={{ fontFamily: 'Orbitron, sans-serif' }}>{resources.cpu}</div>
              <div className="text-[10px] text-purple-300">CPU Cycles</div>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border-2 border-emerald-500/50 rounded-xl backdrop-blur-sm"
          >
            <Brain className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="font-black text-xl" style={{ fontFamily: 'Orbitron, sans-serif' }}>{resources.memory}</div>
              <div className="text-[10px] text-emerald-300">Memory</div>
            </div>
          </motion.div>
        </div>

        {/* Day & Time with Speed Control */}
        <div className="text-center">
          <div className="text-4xl font-black mb-1" style={{ fontFamily: 'Orbitron, sans-serif', color: '#10b981' }}>
            DAY {day}
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400 capitalize">{timeOfDay}</span>
          </div>
          <div className="flex gap-1 mt-2">
            {[1, 2, 4].map(speed => (
              <button
                key={speed}
                onClick={() => setGameSpeed(speed)}
                className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                  gameSpeed === speed
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl hover:border-red-500/50 transition-all flex items-center gap-2 font-bold"
        >
          <Home className="w-5 h-5" />
          EXIT DEMO
        </button>
      </div>

      {/* MAIN OBJECTIVE TRACKER - Always Visible */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-[1900px] mx-auto mb-4 p-4 bg-gradient-to-r from-emerald-500/20 via-amber-500/20 to-purple-500/20 border-2 border-emerald-500/50 rounded-xl backdrop-blur-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-black flex items-center gap-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            <Target className="w-6 h-6 text-emerald-400" />
            COLONY OBJECTIVES
          </h3>
          <span className="text-sm text-gray-400">Complete all 3 to win</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Objective 1: Discover Algorithms */}
          <div className={`p-3 rounded-lg border-2 ${
            discovered.length >= 5 ? 'border-emerald-500 bg-emerald-500/20' : 'border-gray-700 bg-gray-800/50'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Book className={`w-5 h-5 ${discovered.length >= 5 ? 'text-emerald-400' : 'text-gray-500'}`} />
              <span className="font-bold text-sm">Discover 5 Algorithms</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-900 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500"
                  animate={{ width: `${(discovered.length / 5) * 100}%` }}
                />
              </div>
              <span className="text-xs font-bold">{discovered.length}/5</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
              {discovered.length === 0 ? '→ Explore ruins (glowing tiles)' : 
               discovered.length < 5 ? '→ Keep exploring for more books' : '✓ Complete!'}
            </p>
          </div>

          {/* Objective 2: Build Infrastructure */}
          <div className={`p-3 rounded-lg border-2 ${
            victoryProgress.buildings >= 8 ? 'border-emerald-500 bg-emerald-500/20' : 'border-gray-700 bg-gray-800/50'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Monitor className={`w-5 h-5 ${victoryProgress.buildings >= 8 ? 'text-emerald-400' : 'text-gray-500'}`} />
              <span className="font-bold text-sm">Build 8 Structures</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-900 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-amber-500"
                  animate={{ width: `${(victoryProgress.buildings / 8) * 100}%` }}
                />
              </div>
              <span className="text-xs font-bold">{victoryProgress.buildings}/8</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
              {victoryProgress.buildings === 0 ? '→ Select building, click tile to place' : 
               victoryProgress.buildings < 8 ? '→ Need more resources & algorithms' : '✓ Complete!'}
            </p>
          </div>

          {/* Objective 3: Colony Stability */}
          <div className={`p-3 rounded-lg border-2 ${
            day >= 5 && colonists.every(c => c.morale > 50) ? 'border-emerald-500 bg-emerald-500/20' : 'border-gray-700 bg-gray-800/50'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Heart className={`w-5 h-5 ${day >= 5 && colonists.every(c => c.morale > 50) ? 'text-emerald-400' : 'text-gray-500'}`} />
              <span className="font-bold text-sm">Survive 5 Days</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-900 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-purple-500"
                  animate={{ width: `${(day / 5) * 100}%` }}
                />
              </div>
              <span className="text-xs font-bold">{Math.min(day, 5)}/5</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
              {day < 5 ? `→ ${5 - day} days remaining` : '✓ Complete!'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* MAIN GRID */}
      <div className="max-w-[1900px] mx-auto grid grid-cols-6 gap-4">
        
        {/* LEFT - COLONISTS (Detailed) */}
        <div className="col-span-1 space-y-3">
          <div className="p-4 bg-gray-900/90 border-2 border-emerald-500/30 rounded-xl backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              <Users className="w-5 h-5 text-emerald-400" />
              COLONISTS
            </h3>
            {colonists.map(c => (
              <motion.div
                key={c.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelected(c.id === selected ? null : c.id)}
                className={`p-3 rounded-lg cursor-pointer mb-3 transition-all ${
                  selected === c.id
                    ? 'bg-emerald-500/30 border-2 border-emerald-500'
                    : 'bg-gray-800/50 border border-gray-700 hover:border-emerald-500/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <div className="flex-1">
                    <div className="font-bold text-sm">{c.name}</div>
                    <div className="text-[10px] text-gray-400">{c.skill}</div>
                  </div>
                </div>
                
                {/* Needs */}
                <div className="space-y-1">
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-gray-500">Energy</span>
                      <span className={c.energy < 30 ? 'text-red-400' : 'text-emerald-400'}>{c.energy}%</span>
                    </div>
                    <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${c.energy}%` }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-gray-500">Morale</span>
                      <span className={c.morale < 30 ? 'text-red-400' : 'text-blue-400'}>{c.morale}%</span>
                    </div>
                    <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${c.morale}%` }} />
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-gray-500 mt-2">
                  Position: ({c.x}, {c.y})
                </div>
              </motion.div>
            ))}

            <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-[10px] text-blue-300">
                💡 <strong>Tip:</strong> Select colonist, click tile to move. Low energy = slower movement.
              </p>
            </div>
          </div>

          {/* Discovered Algorithms */}
          <div className="p-4 bg-gray-900/90 border-2 border-amber-500/30 rounded-xl backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              <Book className="w-5 h-5 text-amber-400" />
              ALGORITHMS
            </h3>
            {discovered.length === 0 ? (
              <p className="text-xs text-gray-500 italic">
                No algorithms discovered yet.<br/>
                <span className="text-amber-400">→ Explore glowing ruins!</span>
              </p>
            ) : (
              discovered.map(algoId => {
                const algo = ALGORITHMS.find(a => a.id === algoId);
                return (
                  <motion.div
                    key={algoId}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="p-2 rounded-lg bg-gray-800/50 border border-amber-500/50 mb-2"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <algo.icon className="w-4 h-4" style={{ color: algo.color }} />
                      <span className="font-bold text-sm">{algo.name}</span>
                    </div>
                    <div className="text-[10px] text-gray-400">{algo.complexity}</div>
                    <div className="text-[10px] text-emerald-400 mt-1">
                      ✓ Unlocks: {algo.unlocks.join(', ')}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* CENTER - GAME MAP (Larger) */}
        <div className="col-span-4">
          <div className="p-4 bg-gray-900/90 border-2 border-emerald-500/30 rounded-xl backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                <MapPin className="w-6 h-6 text-emerald-400" />
                COLONY MAP
              </h3>
              <div className="flex items-center gap-3 text-sm">
                {selected && (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {colonists.find(c => c.id === selected)?.name} selected - Click tile to move
                  </span>
                )}
                {buildMode && (
                  <span className="text-purple-400 flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                    {BUILDINGS.find(b => b.id === buildMode)?.name} - Click tile to place
                  </span>
                )}
                {!selected && !buildMode && (
                  <span className="text-gray-500">Click colonist or building to start</span>
                )}
              </div>
            </div>

            {/* Map Grid */}
            <div className="grid gap-[2px] p-3 bg-black/60 rounded-xl overflow-auto max-h-[600px]">
              {map.map((row, y) => (
                <div key={y} className="flex gap-[2px]">
                  {row.map((tile, x) => {
                    const colonist = colonists.find(c => c.x === x && c.y === y);
                    const isHovered = hoveredTile?.x === x && hoveredTile?.y === y;
                    const building = tile.building ? BUILDINGS.find(b => b.id === tile.building) : null;
                    const isSelected = colonist && colonist.id === selected;
                    
                    return (
                      <motion.div
                        key={`${x}-${y}`}
                        whileHover={{ scale: tile.discovered ? 1.08 : 1, zIndex: 10 }}
                        onMouseEnter={() => setHoveredTile({ x, y, ...tile })}
                        onMouseLeave={() => setHoveredTile(null)}
                        onClick={() => {
                          if (selected) moveColonist(selected, x, y);
                          else if (buildMode) placeBuilding(x, y, buildMode);
                        }}
                        className="relative w-14 h-14 rounded-lg cursor-pointer transition-all flex items-center justify-center"
                        style={{
                          backgroundColor: tile.discovered ? tile.bg : '#0a0a0a',
                          border: isSelected ? '3px solid #10b981' : 
                                  isHovered ? '2px solid #10b981' : 
                                  '1px solid #00000060',
                          boxShadow: tile.book && tile.discovered ? '0 0 20px rgba(245, 158, 11, 0.9), 0 0 40px rgba(245, 158, 11, 0.5)' : 'none',
                          opacity: tile.discovered ? 1 : 0.3
                        }}
                      >
                        {/* Tile Icon */}
                        {tile.icon && tile.discovered && <tile.icon className="w-5 h-5 text-white/40" />}
                        
                        {/* Building */}
                        {building && tile.discovered && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring' }}
                          >
                            <building.icon className="w-7 h-7" style={{ color: building.color }} />
                          </motion.div>
                        )}

                        {/* Algorithm Book (Glowing) */}
                        {tile.book && tile.discovered && !building && (
                          <motion.div
                            animate={{ 
                              rotate: [0, 10, -10, 0],
                              scale: [1, 1.15, 1],
                              y: [0, -3, 0]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="relative"
                          >
                            <tile.book.icon className="w-8 h-8" style={{ color: tile.book.color }} />
                            <motion.div
                              className="absolute inset-0 rounded-full"
                              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              style={{ background: `radial-gradient(circle, ${tile.book.color}80, transparent)` }}
                            />
                          </motion.div>
                        )}

                        {/* Colonist */}
                        {colonist && tile.discovered && (
                          <motion.div
                            animate={colonist.moving ? { 
                              scale: [1, 0.8, 1],
                              rotate: [0, -10, 10, 0]
                            } : {}}
                            transition={{ duration: 0.5 }}
                          >
                            <Users className="w-8 h-8 text-emerald-400" strokeWidth={2.5} />
                          </motion.div>
                        )}

                        {/* Fog of War indicator */}
                        {!tile.discovered && (
                          <div className="text-xs text-gray-700">?</div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Hover Info */}
            <AnimatePresence>
              {hoveredTile && hoveredTile.discovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 p-3 bg-black/80 rounded-lg border border-emerald-500/50"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-bold capitalize">{hoveredTile.id}</span>
                    {hoveredTile.book && (
                      <span className="text-amber-400">• {hoveredTile.book.name} (Click to discover!)</span>
                    )}
                    {hoveredTile.building && (
                      <span className="text-purple-400">• {BUILDINGS.find(b => b.id === hoveredTile.building)?.name}</span>
                    )}
                    {!hoveredTile.passable && (
                      <span className="text-red-400">• Impassable</span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT - BUILD MENU & LOGS */}
        <div className="col-span-1 space-y-3">
          {/* Build Menu */}
          <div className="p-4 bg-gray-900/90 border-2 border-purple-500/30 rounded-xl backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              <Plus className="w-5 h-5 text-purple-400" />
              BUILD
            </h3>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {BUILDINGS.map(b => {
                const canBuild = !b.requires || discovered.includes(b.requires);
                const hasRes = resources.data >= b.cost.data && resources.cpu >= b.cost.cpu;
                const isActive = buildMode === b.id;
                
                return (
                  <motion.button
                    key={b.id}
                    whileHover={canBuild && hasRes ? { scale: 1.02, x: 2 } : {}}
                    onClick={() => canBuild && hasRes && setBuildMode(isActive ? null : b.id)}
                    disabled={!canBuild || !hasRes}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      isActive
                        ? 'bg-purple-500/40 border-2 border-purple-500 shadow-lg'
                        : canBuild && hasRes
                        ? 'bg-gray-800/70 border border-gray-700 hover:border-purple-500/70'
                        : 'bg-gray-800/30 border border-gray-800 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <b.icon className="w-5 h-5" style={{ color: canBuild ? b.color : '#666' }} />
                      <span className="font-bold text-sm">{b.name}</span>
                    </div>
                    
                    {b.produces && (
                      <div className="text-[10px] text-emerald-400 mb-1">
                        + {Object.entries(b.produces).map(([k, v]) => `${v} ${k}`).join(', ')}/tick
                      </div>
                    )}
                    
                    <div className="flex gap-2 text-[10px]">
                      <span className="text-blue-400">{b.cost.data} Data</span>
                      <span className="text-purple-400">{b.cost.cpu} CPU</span>
                    </div>
                    
                    {!canBuild && b.requires && (
                      <div className="text-[10px] text-red-400 mt-1">
                        🔒 Requires {ALGORITHMS.find(a => a.id === b.requires)?.name}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-3 p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <p className="text-[10px] text-purple-300">
                💡 Buildings generate resources each game tick
              </p>
            </div>
          </div>

          {/* Event Log */}
          <div className="p-4 bg-gray-900/90 border-2 border-cyan-500/30 rounded-xl backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              <Clock className="w-5 h-5 text-cyan-400" />
              ACTIVITY LOG
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-xs text-gray-500 italic">Waiting for activity...</p>
              ) : (
                logs.map((log, i) => (
                  <motion.div
                    key={log.time}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-2 bg-gray-800/60 rounded-lg text-xs text-gray-300 border-l-2 border-cyan-500"
                  >
                    {log.msg}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RANDOM EVENT POPUP */}
      <AnimatePresence>
        {currentEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50"
            onClick={() => handleEventResolve(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-3xl w-full p-8 bg-gray-900 border-4 rounded-3xl shadow-2xl"
              style={{ borderColor: currentEvent.color }}
            >
              <div className="flex items-center gap-4 mb-6">
                <currentEvent.icon className="w-16 h-16" style={{ color: currentEvent.color }} />
                <div>
                  <h2 
                    className="text-5xl font-black"
                    style={{ fontFamily: 'Orbitron, sans-serif', color: currentEvent.color }}
                  >
                    {currentEvent.title}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">Random Event</p>
                </div>
              </div>

              <p className="text-2xl text-gray-300 mb-6">
                {currentEvent.description}
              </p>

              {currentEvent.requires && (
                <div className="p-4 bg-amber-500/20 border-2 border-amber-500/50 rounded-xl mb-6">
                  <p className="text-amber-400 text-lg">
                    <Book className="inline w-6 h-6 mr-2" />
                    <strong>Required Algorithm:</strong> {ALGORITHMS.find(a => a.id === currentEvent.requires)?.name}
                  </p>
                  {discovered.includes(currentEvent.requires) ? (
                    <p className="text-emerald-400 mt-3 text-xl font-bold">✓ You have this algorithm!</p>
                  ) : (
                    <p className="text-red-400 mt-3 text-xl font-bold">✗ You haven't discovered this yet</p>
                  )}
                </div>
              )}

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEventResolve(currentEvent.requires ? discovered.includes(currentEvent.requires) : true)}
                  disabled={currentEvent.requires && !discovered.includes(currentEvent.requires)}
                  className="flex-1 py-4 bg-emerald-500 rounded-xl font-bold text-xl disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Orbitron, sans-serif' }}
                >
                  RESOLVE EVENT
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEventResolve(false)}
                  className="flex-1 py-4 bg-gray-700 rounded-xl font-bold text-xl"
                  style={{ fontFamily: 'Orbitron, sans-serif' }}
                >
                  IGNORE
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
