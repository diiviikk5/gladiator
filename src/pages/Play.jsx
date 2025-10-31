import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play as PlayIcon, Zap, Trophy, TrendingUp, Clock, BarChart3 } from 'lucide-react';
import { 
  BLOCK_TYPES, 
  CHALLENGES, 
  AlgorithmExecutor, 
  AIOpponent,
  getRandomChallenge,
  getRankFromPoints,
  calculateRankedPoints,
  RANKED_CONFIG
} from '../data/algoBlocks';
import DraggableBlock from '../components/DraggableBlock';
import AlgorithmBuilder from '../components/AlgorithmBuilder';
import ExecutionAnimation from '../components/ExecutionAnimation';
import HPBar from '../components/HPBar';
import ChallengeCard from '../components/ChallengeCard';
import GameOverScreen from '../components/GameOverScreen';
// Load Orbitron font
const loadOrbitronFont = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
};

export default function Play() {
  loadOrbitronFont();
  const navigate = useNavigate();

  // ==================== GAME PHASES ====================
  const [gamePhase, setGamePhase] = useState('menu'); // menu, ranked-select, build, execute, result, matchend, gameover
  const [bestOf, setBestOf] = useState(3);
  const [roundsWon, setRoundsWon] = useState({ player: 0, opponent: 0 });
  
  // ==================== ROUND STATE ====================
  const [round, setRound] = useState(1);
  const [playerHP, setPlayerHP] = useState(100);
  const [opponentHP, setOpponentHP] = useState(100);
  const [currentChallenge, setCurrentChallenge] = useState(CHALLENGES[0]);
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [executionData, setExecutionData] = useState(null);
  
  // ==================== RANKED MODE ====================
  const [rankedMode, setRankedMode] = useState('casual'); // casual, ranked
  const [difficulty, setDifficulty] = useState('medium');
  const [playerRankedPoints, setPlayerRankedPoints] = useState(0);
  const [playerRank, setPlayerRank] = useState(getRankFromPoints(0));
  
  // ==================== AI SETTINGS ====================
  const [aiDifficulty, setAiDifficulty] = useState('medium');
  const [aiName, setAiName] = useState('Bot.Alpha');
  
  // ==================== STATISTICS ====================
  const [stats, setStats] = useState({
    totalGames: 0,
    totalWins: 0,
    totalLosses: 0,
    streak: 0,
    maxStreak: 0,
    avgExecutionTime: 0,
    avgEfficiency: 0,
    blocksUsed: {},
    algorithmsIdentified: {}
  });
  
  const [roundStats, setRoundStats] = useState({
    playerTime: 0,
    opponentTime: 0,
    playerEfficiency: 0,
    opponentEfficiency: 0,
    playerAlgorithm: '',
    opponentAlgorithm: '',
    playerComparisons: 0,
    playerSwaps: 0,
    opponentComparisons: 0,
    opponentSwaps: 0
  });

  // ==================== START MENU ====================
  if (gamePhase === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-purple-900 text-white p-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1
            style={{ fontFamily: 'Orbitron, sans-serif' }}
            className="text-8xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400"
          >
            ⚔️ BLITZ MODE
          </h1>
          <p className="text-2xl text-gray-300 mb-12">
            Build algorithms • Race the AI • Climb ranks
          </p>

          {/* Stats Display */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-4 gap-4 mb-12"
          >
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <p className="text-sm text-emerald-400 mb-1">RANK</p>
              <p style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-3xl font-black text-emerald-300">
                {playerRank.icon} {playerRank.name}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <p className="text-sm text-cyan-400 mb-1">POINTS</p>
              <p style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-3xl font-black text-cyan-300">
                {playerRankedPoints.toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <p className="text-sm text-yellow-400 mb-1">WIN RATE</p>
              <p style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-3xl font-black text-yellow-300">
                {stats.totalGames > 0 ? ((stats.totalWins / stats.totalGames) * 100).toFixed(0) : 0}%
              </p>
            </div>
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <p className="text-sm text-purple-400 mb-1">STREAK</p>
              <p style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-3xl font-black text-purple-300">
                🔥 {stats.streak}
              </p>
            </div>
          </motion.div>

          {/* Mode Selection */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-6 max-w-2xl mx-auto"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setRankedMode('casual');
                setGamePhase('ranked-select');
              }}
              className="p-8 rounded-2xl border-3 border-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all"
            >
              <PlayIcon className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
              <h3 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-2xl font-black text-emerald-300 mb-2">
                CASUAL
              </h3>
              <p className="text-sm text-emerald-200">No ranking • Just fun</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setRankedMode('ranked');
                setGamePhase('ranked-select');
              }}
              className="p-8 rounded-2xl border-3 border-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20 transition-all"
            >
              <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-400" />
              <h3 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-2xl font-black text-yellow-300 mb-2">
                RANKED
              </h3>
              <p className="text-sm text-yellow-200">Climb the ladder</p>
            </motion.button>
          </motion.div>

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 p-6 rounded-lg bg-black/50 border border-gray-700"
          >
            <h3 className="text-lg font-bold text-gray-300 mb-4">📊 CAREER STATS</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Total Games</p>
                <p className="text-2xl font-bold text-cyan-300">{stats.totalGames}</p>
              </div>
              <div>
                <p className="text-gray-500">Wins / Losses</p>
                <p className="text-2xl font-bold text-emerald-300">{stats.totalWins} / {stats.totalLosses}</p>
              </div>
              <div>
                <p className="text-gray-500">Best Streak</p>
                <p className="text-2xl font-bold text-yellow-300">🔥 {stats.maxStreak}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ==================== DIFFICULTY SELECTION ====================
  if (gamePhase === 'ranked-select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-purple-900 text-white p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto"
        >
          <button
            onClick={() => setGamePhase('menu')}
            className="mb-8 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            ← Back
          </button>

          <h2 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-5xl font-black text-center mb-12 text-cyan-400">
            SELECT DIFFICULTY
          </h2>

          <div className="grid grid-cols-3 gap-6">
            {['easy', 'medium', 'hard'].map((diff, i) => (
              <motion.button
                key={diff}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setDifficulty(diff);
                  setAiDifficulty(diff);
                  startMatch(diff);
                }}
                className={`p-8 rounded-2xl border-3 transition-all ${
                  diff === 'easy'
                    ? 'border-green-500 bg-green-500/10 hover:bg-green-500/20'
                    : diff === 'medium'
                    ? 'border-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20'
                    : 'border-red-500 bg-red-500/10 hover:bg-red-500/20'
                }`}
              >
                <div className="text-4xl mb-3">
                  {diff === 'easy' ? '🟢' : diff === 'medium' ? '🟡' : '🔴'}
                </div>
                <h3 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-2xl font-black mb-2 capitalize">
                  {diff}
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  {diff === 'easy'
                    ? 'Beginner friendly'
                    : diff === 'medium'
                    ? 'Balanced challenge'
                    : 'Extreme difficulty'}
                </p>
                <p className="text-xs text-gray-500">
                  {rankedMode === 'ranked' && `+${RANKED_CONFIG.pointsPerRound[diff].win} pts per win`}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // ==================== START MATCH FUNCTION ====================
  const startMatch = (selectedDifficulty) => {
    setRound(1);
    setPlayerHP(100);
    setOpponentHP(100);
    setRoundsWon({ player: 0, opponent: 0 });
    setSelectedBlocks([]);
    const challenge = getRandomChallenge(selectedDifficulty);
    setCurrentChallenge(challenge);
    setGamePhase('build');
  };

  // ==================== BLOCK HANDLERS ====================
  const handleBlockDrop = (blockId) => {
    if (selectedBlocks.length >= 10) {
      alert('Maximum 10 blocks allowed!');
      return;
    }
    setSelectedBlocks([...selectedBlocks, blockId]);
  };

  const handleBlockRemove = (index) => {
    setSelectedBlocks(selectedBlocks.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setSelectedBlocks([]);
  };

  // ==================== EXECUTE HANDLER ====================
  const handleExecute = () => {
    if (selectedBlocks.length === 0) {
      alert('Add some blocks first!');
      return;
    }

    const challengeData = typeof currentChallenge.data === 'function'
      ? currentChallenge.data()
      : [...currentChallenge.data];

    // Player execution
    const playerExec = new AlgorithmExecutor(selectedBlocks, challengeData, currentChallenge.type);
    const playerResult = playerExec.execute();

    // AI execution
    const ai = new AIOpponent(aiDifficulty);
    const opponentResult = ai.execute(currentChallenge);

    // Store stats
    setRoundStats({
      playerTime: playerResult.executionTime,
      opponentTime: opponentResult.executionTime,
      playerEfficiency: playerResult.efficiency,
      opponentEfficiency: opponentResult.efficiency,
      playerAlgorithm: playerResult.algorithm,
      opponentAlgorithm: opponentResult.algorithm,
      playerComparisons: playerResult.comparisons,
      playerSwaps: playerResult.swaps,
      opponentComparisons: opponentResult.comparisons,
      opponentSwaps: opponentResult.swaps
    });

    setExecutionData({
      player: { ...playerResult, initial: challengeData },
      opponent: { ...opponentResult, initial: challengeData }
    });

    setGamePhase('execute');
  };

  // ==================== EXECUTION COMPLETE ====================
  const handleExecutionComplete = (playerWon) => {
    const damage = 25;

    if (playerWon) {
      const newHP = Math.max(0, opponentHP - damage);
      setOpponentHP(newHP);
      setRoundsWon({ ...roundsWon, player: roundsWon.player + 1 });

      if (newHP <= 0 || roundsWon.player + 1 > bestOf / 2) {
        setTimeout(() => setGamePhase('matchend'), 1500);
        return;
      }
    } else {
      const newHP = Math.max(0, playerHP - damage);
      setPlayerHP(newHP);
      setRoundsWon({ ...roundsWon, opponent: roundsWon.opponent + 1 });

      if (newHP <= 0 || roundsWon.opponent + 1 > bestOf / 2) {
        setTimeout(() => setGamePhase('matchend'), 1500);
        return;
      }
    }

    setGamePhase('result');
  };

  // ==================== NEXT ROUND ====================
  const nextRound = () => {
    setRound(round + 1);
    setPlayerHP(100);
    setOpponentHP(100);
    setSelectedBlocks([]);
    const nextChallenge = getRandomChallenge(difficulty);
    setCurrentChallenge(nextChallenge);
    setGamePhase('build');
  };

  // ==================== MATCH END ====================
  const matchEnd = () => {
    if (gamePhase === 'matchend') {
      const playerWon = roundsWon.player > roundsWon.opponent;
      const points = rankedMode === 'ranked'
        ? calculateRankedPoints(difficulty, playerWon)
        : 0;

      const newPoints = playerRankedPoints + points;
      const newRank = getRankFromPoints(newPoints);
      const newStreak = playerWon ? stats.streak + 1 : 0;

      setStats({
        ...stats,
        totalGames: stats.totalGames + 1,
        totalWins: playerWon ? stats.totalWins + 1 : stats.totalWins,
        totalLosses: playerWon ? stats.totalLosses : stats.totalLosses + 1,
        streak: newStreak,
        maxStreak: Math.max(stats.maxStreak, newStreak)
      });

      setPlayerRankedPoints(newPoints);
      setPlayerRank(newRank);

      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-8"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            className="max-w-3xl w-full text-center"
          >
            <motion.h1
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{ fontFamily: 'Orbitron, sans-serif' }}
              className={`text-8xl font-black mb-6 ${playerWon ? 'text-emerald-400' : 'text-red-400'}`}
            >
              {playerWon ? '🏆 MATCH WON!' : '💀 MATCH LOST!'}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-3 gap-4 mb-8"
            >
              <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-700">
                <p className="text-sm text-gray-400 mb-1">ROUNDS WON</p>
                <p className="text-4xl font-black text-cyan-300">{roundsWon.player}</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-700">
                <p className="text-sm text-gray-400 mb-1">ROUNDS LOST</p>
                <p className="text-4xl font-black text-red-300">{roundsWon.opponent}</p>
              </div>
              {rankedMode === 'ranked' && (
                <div className="p-4 rounded-lg bg-yellow-900/50 border border-yellow-700">
                  <p className="text-sm text-yellow-400 mb-1">POINTS EARNED</p>
                  <p className="text-4xl font-black text-yellow-300">+{points}</p>
                </div>
              )}
            </motion.div>

            {rankedMode === 'ranked' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-8 p-6 rounded-lg bg-purple-900/50 border border-purple-500"
              >
                <p className="text-sm text-purple-300 mb-2">NEW RANK</p>
                <p style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-3xl font-black text-purple-300">
                  {newRank.icon} {newRank.name} ({newPoints.toLocaleString()} pts)
                </p>
              </motion.div>
            )}

            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setGamePhase('menu');
                }}
                className="px-12 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-bold text-lg transition-colors"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                PLAY AGAIN
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="px-12 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold text-lg transition-colors"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                DASHBOARD
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      );
    }
  };

  // ==================== BUILD PHASE ====================
  if (gamePhase === 'build') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-purple-900 text-white p-6">
        
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <button
                onClick={() => setGamePhase('menu')}
                className="px-4 py-2 bg-red-500/20 border-2 border-red-500/50 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                ← QUIT
              </button>
            </div>
            <div className="text-center flex-1">
              <p className="text-xs text-gray-500 uppercase">BEST OF {bestOf}</p>
              <p style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-4xl font-black text-emerald-400">
                YOU {roundsWon.player} - {roundsWon.opponent} BOT
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">DIFFICULTY</p>
              <p style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-xl font-black text-yellow-400 capitalize">
                {difficulty}
              </p>
            </div>
          </div>
        </div>

        {/* HP Bars */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="grid grid-cols-3 gap-8 items-center">
            {/* Player HP */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-emerald-400 font-bold">YOU</span>
                <span className="text-sm text-gray-500">{playerHP}/100</span>
              </div>
              <div className="w-full h-6 bg-black/50 rounded-full overflow-hidden border-2 border-emerald-500">
                <motion.div
                  animate={{ width: `${playerHP}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-400"
                />
              </div>
            </div>

            {/* Challenge */}
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-2 uppercase">ROUND {round}</div>
              <p style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-2xl font-black text-cyan-400">
                {currentChallenge.title}
              </p>
              <p className="text-sm text-gray-400 mt-2">{currentChallenge.description}</p>
            </div>

            {/* Opponent HP */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-orange-400 font-bold">AI BOT</span>
                <span className="text-sm text-gray-500">{opponentHP}/100</span>
              </div>
              <div className="w-full h-6 bg-black/50 rounded-full overflow-hidden border-2 border-orange-500">
                <motion.div
                  animate={{ width: `${opponentHP}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 ml-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-4 gap-6">
            
            {/* Blocks Palette */}
            <div className="col-span-1 space-y-3">
              <h3 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-lg font-bold text-emerald-400">
                BLOCKS
              </h3>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {Object.values(BLOCK_TYPES).map((block) => (
                  <motion.div
                    key={block.id}
                    whileHover={{ scale: 1.05 }}
                    draggable
                    onDragEnd={() => handleBlockDrop(block.id)}
                    className="p-3 rounded-lg cursor-move transition-all"
                    style={{ backgroundColor: block.color + '30', borderLeft: `4px solid ${block.color}` }}
                  >
                    <div className="text-lg mb-1">{block.icon}</div>
                    <p className="text-xs font-bold text-white">{block.name}</p>
                    <p className="text-xs text-gray-400">{block.complexity}</p>
                  </motion.div>
                ))}
              </div>

              <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-800 text-xs text-gray-400 space-y-1">
                <p className="font-bold text-gray-300">💡 HOW:</p>
                <p>1. Drag blocks right</p>
                <p>2. Build algorithm</p>
                <p>3. Execute & race!</p>
              </div>
            </div>

            {/* Builder Area */}
            <div className="col-span-3 space-y-4">
              {/* Builder Canvas */}
              <div className="p-6 rounded-2xl border-4 border-dashed border-cyan-500 bg-black/30 min-h-64">
                <p className="text-xs text-gray-500 mb-4 uppercase">Your Algorithm</p>
                
                {selectedBlocks.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-center">
                    <div>
                      <p className="text-5xl mb-3">📦</p>
                      <p className="text-gray-500">Drag blocks here to build your algorithm</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedBlocks.map((blockId, index) => {
                      const block = Object.values(BLOCK_TYPES).find(b => b.id === blockId);
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-3 rounded-lg flex items-center justify-between"
                          style={{ backgroundColor: block.color + '30' }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{block.icon}</span>
                            <div>
                              <p className="font-bold text-white">{block.name}</p>
                              <p className="text-xs text-gray-400">{block.description}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleBlockRemove(index)}
                            className="px-3 py-1 bg-red-500/30 hover:bg-red-500/50 rounded text-sm transition-colors"
                          >
                            ✕
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Info & Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-blue-900/30 border border-blue-600">
                  <p className="text-xs text-blue-400 mb-1">BLOCKS USED</p>
                  <p style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-2xl font-black text-blue-300">
                    {selectedBlocks.length}/10
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-purple-900/30 border border-purple-600">
                  <p className="text-xs text-purple-400 mb-1">CHALLENGE</p>
                  <p className="text-sm text-purple-200 font-semibold capitalize">
                    {currentChallenge.difficulty} • {currentChallenge.type}
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClearAll}
                  disabled={selectedBlocks.length === 0}
                  className="flex-1 py-3 bg-gray-700/50 hover:bg-gray-600/50 disabled:opacity-30 rounded-lg font-bold transition-colors"
                >
                  🗑️ CLEAR
                </motion.button>
                <motion.button
                  whileHover={selectedBlocks.length > 0 ? { scale: 1.05 } : {}}
                  whileTap={selectedBlocks.length > 0 ? { scale: 0.98 } : {}}
                  onClick={handleExecute}
                  disabled={selectedBlocks.length === 0}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-lg hover:shadow-emerald-500/50 disabled:opacity-30 rounded-lg font-black text-lg transition-all flex items-center justify-center gap-2"
                  style={{ fontFamily: 'Orbitron, sans-serif' }}
                >
                  <PlayIcon className="w-5 h-5" fill="currentColor" />
                  EXECUTE
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== EXECUTION PHASE ====================
  if (gamePhase === 'execute' && executionData) {
    return (
      <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-5xl w-full"
        >
          <div className="grid grid-cols-2 gap-8">
            
            {/* Player Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 rounded-2xl border-2 border-emerald-500 bg-emerald-500/10"
            >
              <h3 className="text-xl font-bold text-emerald-400 mb-4">YOUR ALGORITHM</h3>
              <div className="space-y-3 mb-6">
                <div className="p-3 rounded bg-black/50">
                  <p className="text-xs text-gray-500">Algorithm</p>
                  <p className="font-bold text-emerald-300 capitalize">{roundStats.playerAlgorithm}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded bg-black/50">
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="font-bold text-cyan-300">{roundStats.playerTime}ms</p>
                  </div>
                  <div className="p-3 rounded bg-black/50">
                    <p className="text-xs text-gray-500">Efficiency</p>
                    <p className="font-bold text-yellow-300">{roundStats.playerEfficiency}%</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded bg-black/50">
                    <p className="text-xs text-gray-500">Comparisons</p>
                    <p className="font-bold text-blue-300">{roundStats.playerComparisons}</p>
                  </div>
                  <div className="p-3 rounded bg-black/50">
                    <p className="text-xs text-gray-500">Swaps</p>
                    <p className="font-bold text-purple-300">{roundStats.playerSwaps}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Opponent Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 rounded-2xl border-2 border-orange-500 bg-orange-500/10"
            >
              <h3 className="text-xl font-bold text-orange-400 mb-4">BOT ALGORITHM</h3>
              <div className="space-y-3 mb-6">
                <div className="p-3 rounded bg-black/50">
                  <p className="text-xs text-gray-500">Algorithm</p>
                  <p className="font-bold text-orange-300 capitalize">{roundStats.opponentAlgorithm}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded bg-black/50">
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="font-bold text-cyan-300">{roundStats.opponentTime}ms</p>
                  </div>
                  <div className="p-3 rounded bg-black/50">
                    <p className="text-xs text-gray-500">Efficiency</p>
                    <p className="font-bold text-yellow-300">{roundStats.opponentEfficiency}%</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded bg-black/50">
                    <p className="text-xs text-gray-500">Comparisons</p>
                    <p className="font-bold text-blue-300">{roundStats.opponentComparisons}</p>
                  </div>
                  <div className="p-3 rounded bg-black/50">
                    <p className="text-xs text-gray-500">Swaps</p>
                    <p className="font-bold text-purple-300">{roundStats.opponentSwaps}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Race Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-center"
          >
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const playerWon =
                  roundStats.playerTime < roundStats.opponentTime &&
                  executionData.player.isCorrect;
                handleExecutionComplete(playerWon);
              }}
              className="px-12 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-black text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              DETERMINE WINNER →
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ==================== RESULT PHASE ====================
  if (gamePhase === 'result' && executionData) {
    const playerWon =
      roundStats.playerTime < roundStats.opponentTime &&
      executionData.player.isCorrect;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-8"
      >
        <div className="text-center max-w-2xl">
          <motion.h2
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{ fontFamily: 'Orbitron, sans-serif' }}
            className={`text-8xl font-black mb-8 ${playerWon ? 'text-emerald-400' : 'text-red-400'}`}
          >
            {playerWon ? '⚡ ROUND WON!' : '💥 ROUND LOST!'}
          </motion.h2>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextRound}
            className="px-12 py-5 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-black text-2xl transition-colors"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            NEXT ROUND →
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // ==================== MATCH END ====================
  if (gamePhase === 'matchend') {
    return matchEnd();
  }

  return null;
}
