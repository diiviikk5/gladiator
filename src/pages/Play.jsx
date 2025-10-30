import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play as PlayIcon, Zap } from 'lucide-react';

import { BLOCK_TYPES, CHALLENGES, AlgorithmExecutor, AIOpponent } from '../data/algoBlocks';
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

  // Game state
  const [phase, setPhase] = useState('build'); // build, execute, result, gameover
  const [round, setRound] = useState(1);
  const [playerHP, setPlayerHP] = useState(100);
  const [opponentHP, setOpponentHP] = useState(100);
  const [currentChallenge, setCurrentChallenge] = useState(CHALLENGES[0]);
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [executionData, setExecutionData] = useState(null);
  const [aiDifficulty] = useState('medium');

  // Handlers
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

  const handleExecute = () => {
    if (selectedBlocks.length === 0) {
      alert('Add some blocks first!');
      return;
    }

    const challengeData = typeof currentChallenge.data === 'function' 
      ? currentChallenge.data() 
      : [...currentChallenge.data];

    // Player execution
    const playerExec = new AlgorithmExecutor(
      selectedBlocks, 
      challengeData,
      currentChallenge.type
    );
    const playerResult = playerExec.execute();

    // AI execution
    const ai = new AIOpponent(aiDifficulty);
    const opponentResult = ai.execute(currentChallenge);

    setExecutionData({
      player: { ...playerResult, initial: challengeData },
      opponent: { ...opponentResult, initial: challengeData }
    });

    setPhase('execute');
  };

  const handleExecutionComplete = (playerWon) => {
    const damage = 25;
    
    if (playerWon) {
      const newHP = Math.max(0, opponentHP - damage);
      setOpponentHP(newHP);
      
      if (newHP <= 0) {
        setTimeout(() => setPhase('gameover'), 1000);
        return;
      }
    } else {
      const newHP = Math.max(0, playerHP - damage);
      setPlayerHP(newHP);
      
      if (newHP <= 0) {
        setTimeout(() => setPhase('gameover'), 1000);
        return;
      }
    }

    setPhase('result');
  };

  const nextRound = () => {
    setRound(round + 1);
    setSelectedBlocks([]);
    
    // Randomize next challenge
    const nextChallenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
    setCurrentChallenge(nextChallenge);
    
    setPhase('build');
  };

  const restart = () => {
    setRound(1);
    setPlayerHP(100);
    setOpponentHP(100);
    setSelectedBlocks([]);
    setCurrentChallenge(CHALLENGES[0]);
    setPhase('build');
  };

  // GAME OVER
  if (phase === 'gameover') {
    return (
      <GameOverScreen
        victory={playerHP > 0}
        round={round}
        onRestart={restart}
        onHome={() => navigate('/dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      
      {/* HP Bars */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="grid grid-cols-3 gap-8 items-center">
          <HPBar 
            current={playerHP} 
            max={100} 
            label="YOU" 
            color="#10b981"
            side="left"
          />

          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">ROUND</div>
            <div 
              className="text-5xl font-black text-amber-400" 
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              {round}
            </div>
          </div>

          <HPBar 
            current={opponentHP} 
            max={100} 
            label="OPPONENT" 
            color="#f59e0b"
            side="right"
          />
        </div>
      </div>

      {/* Challenge */}
      <div className="max-w-4xl mx-auto mb-6">
        <ChallengeCard challenge={currentChallenge} />
      </div>

      {/* Building Phase */}
      {phase === 'build' && (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-4 gap-6">
            
            {/* Blocks Palette */}
            <div className="col-span-1 space-y-2">
              <h3 
                className="text-lg font-bold text-emerald-400 mb-3" 
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                ALGORITHM BLOCKS
              </h3>
              {Object.values(BLOCK_TYPES).map((block) => (
                <DraggableBlock key={block.id} block={block} />
              ))}

              {/* Info */}
              <div className="mt-6 p-3 bg-gray-900/50 rounded-lg border border-gray-800 text-xs text-gray-500">
                <p className="mb-2 font-bold text-gray-400">HOW TO PLAY:</p>
                <p className="mb-1">1. Drag blocks to builder</p>
                <p className="mb-1">2. Build sorting algorithm</p>
                <p>3. Execute and race!</p>
              </div>
            </div>

            {/* Algorithm Builder */}
            <div className="col-span-3">
              <AlgorithmBuilder
                blocks={selectedBlocks}
                onDrop={handleBlockDrop}
                onRemove={handleBlockRemove}
                onClear={handleClearAll}
              />

              {/* Execute Button */}
              <motion.button
                whileHover={selectedBlocks.length > 0 ? { scale: 1.02 } : {}}
                whileTap={selectedBlocks.length > 0 ? { scale: 0.98 } : {}}
                onClick={handleExecute}
                disabled={selectedBlocks.length === 0}
                className="w-full mt-5 py-6 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl font-bold text-2xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all hover:shadow-lg hover:shadow-emerald-500/50"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                <PlayIcon className="w-7 h-7" fill="currentColor" />
                EXECUTE ALGORITHM
                <Zap className="w-7 h-7" />
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Execution Phase */}
      <AnimatePresence>
        {phase === 'execute' && executionData && (
          <ExecutionAnimation
            playerData={executionData.player}
            opponentData={executionData.opponent}
            onComplete={handleExecutionComplete}
          />
        )}
      </AnimatePresence>

      {/* Result Phase */}
      {phase === 'result' && executionData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-8"
        >
          <div className="text-center max-w-3xl">
            <motion.h2 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-7xl font-black mb-8"
              style={{ 
                fontFamily: 'Orbitron, sans-serif',
                color: executionData.player.executionTime < executionData.opponent.executionTime && executionData.player.isCorrect ? '#10b981' : '#ef4444'
              }}
            >
              {executionData.player.executionTime < executionData.opponent.executionTime && executionData.player.isCorrect 
                ? 'ROUND WON!' 
                : 'ROUND LOST!'
              }
            </motion.h2>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextRound}
              className="px-12 py-5 bg-emerald-500 rounded-xl font-bold text-2xl hover:bg-emerald-600"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              Next Round →
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
