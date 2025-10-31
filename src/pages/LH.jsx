import { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Zap, Trophy, Home, RotateCcw, Flame, X } from 'lucide-react';
import { getRandomQuestion } from '../data/fallingFrenzyQuestions';
import { leaderboardService } from '../services/leaderboardService';

const POWER_UPS = [
  { id: 'shield', name: 'SHIELD', icon: '🛡️', desc: '+1 Life', color: '#10b981', duration: 0 },
  { id: 'speedboost', name: 'ROCKET', icon: '🚀', desc: 'Speed +100%', color: '#f59e0b', duration: 10000 },
  { id: 'slowmo', name: 'SLOW MO', icon: '🐢', desc: 'Speed -70%', color: '#3b82f6', duration: 12000 },
  { id: 'pointsx5', name: '5x POINTS', icon: '💎', desc: '5x Score', color: '#ff1744', duration: 20000 },
  { id: 'accuracy', name: 'ACCURACY', icon: '🎯', desc: 'Show Answer', color: '#a855f7', duration: 0 },
  { id: 'freeze', name: 'PAUSE', icon: '⏸️', desc: 'Freeze 5s', color: '#06b6d4', duration: 5000 },
  { id: 'remove_answers', name: 'CHAOS', icon: '🌪️', desc: 'Remove Wrong', color: '#ff5722', duration: 0 },
];

const getMutation = (combo) => {
  if (combo >= 25) return { name: '⚡ EXTREME', speed: 2.5, shuffle: 0.8, blur: true };
  if (combo >= 20) return { name: '🔴 CHAOS', speed: 2, shuffle: 0.6, blur: true };
  if (combo >= 15) return { name: '🌀 TURBULENT', speed: 1.6, shuffle: 0.5, blur: false };
  if (combo >= 10) return { name: '👻 BLUR', speed: 1.35, shuffle: 0.3, blur: true };
  if (combo >= 5) return { name: '🎲 SHUFFLE', speed: 1.15, shuffle: 0.2, blur: false };
  return { name: '⚙️ NORMAL', speed: 1, shuffle: 0, blur: false };
};

export default function LH() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('lhHighScore')) || 0);
  const [lives, setLives] = useState(6);
  const [speed, setSpeed] = useState(3);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [pointsMultiplier, setPointsMultiplier] = useState(1);

  const [currentQ, setCurrentQ] = useState(null);
  const [questionY, setQuestionY] = useState(-100);
  const [selectedAns, setSelectedAns] = useState(null);
  const [showFeedback, setShowFeedback] = useState(null);
  const [shuffledIndices, setShuffledIndices] = useState([0, 1, 2, 3]);
  const [revealAnswer, setRevealAnswer] = useState(null);
  const [answersRemoved, setAnswersRemoved] = useState([]);

  const [powerUpOnScreen, setPowerUpOnScreen] = useState(null);
  const [activePowerUps, setActivePowerUps] = useState([]);
  const [isFrozen, setIsFrozen] = useState(false);

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);

  const [particles, setParticles] = useState([]);
  const [screenShake, setScreenShake] = useState(false);
  const [notif, setNotif] = useState(null);
  const animationFrame = useRef(null);
  const lastTime = useRef(Date.now());
  const shuffleTimer = useRef(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await leaderboardService.getGlobalLeaderboard();
      setLeaderboardData(data);
      if (user?.uid) {
        const rank = data.findIndex(entry => entry.userId === user.uid);
        setUserRank(rank >= 0 ? rank + 1 : null);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(6);
    setSpeed(3);
    setCombo(0);
    setMaxCombo(0);
    setQuestionsAnswered(0);
    setPointsMultiplier(1);
    setActivePowerUps([]);
    setIsFrozen(false);
    setQuestionY(-100);
    lastTime.current = Date.now();
    spawnQuestion();
  };

  const spawnQuestion = () => {
    const randomQ = getRandomQuestion();
    setCurrentQ(randomQ);
    setQuestionY(-150);
    setSelectedAns(null);
    setShowFeedback(null);
    setShuffledIndices([0, 1, 2, 3]);
    setRevealAnswer(null);
    setAnswersRemoved([]);

    if (Math.random() < 0.4) {
      const powerUp = POWER_UPS[Math.floor(Math.random() * POWER_UPS.length)];
      setPowerUpOnScreen({
        ...powerUp,
        id: `${powerUp.id}-${Date.now()}`,
        y: -150,
        x: Math.random() * (window.innerWidth - 100) + 50
      });
    }
  };

  useEffect(() => {
    if (gameState !== 'playing' || isFrozen) return;

    const gameLoop = () => {
      const now = Date.now();
      const delta = (now - lastTime.current) / 16.67;
      lastTime.current = now;

      const mutation = getMutation(combo);

      setQuestionY(prev => {
        const newY = prev + (speed * mutation.speed) * delta;
        if (newY > window.innerHeight + 100) {
          handleMiss();
          return -150;
        }
        return newY;
      });

      setPowerUpOnScreen(prev => {
        if (!prev) return prev;
        const newY = prev.y + (speed * mutation.speed) * delta;
        if (newY > window.innerHeight) return null;
        return { ...prev, y: newY };
      });

      animationFrame.current = requestAnimationFrame(gameLoop);
    };

    animationFrame.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [gameState, speed, combo, isFrozen]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const mutation = getMutation(combo);
    if (mutation.shuffle === 0) return;

    if (shuffleTimer.current) clearInterval(shuffleTimer.current);

    shuffleTimer.current = setInterval(() => {
      if (Math.random() < mutation.shuffle) {
        setShuffledIndices(prev => {
          const indices = [0, 1, 2, 3];
          for (let i = 3; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
          }
          return indices;
        });
      }
    }, 400);

    return () => {
      if (shuffleTimer.current) clearInterval(shuffleTimer.current);
    };
  }, [gameState, combo]);

  const handleAnswer = (ansIndex) => {
    if (selectedAns !== null || showFeedback || isFrozen || !currentQ) return;

    const mutation = getMutation(combo);
    const actualIndex = mutation.shuffle > 0 ? shuffledIndices.indexOf(ansIndex) : ansIndex;

    setSelectedAns(ansIndex);

    if (actualIndex === currentQ.correct) {
      setShowFeedback('correct');
      const basePoints = (100 + combo * 75) * pointsMultiplier;
      setScore(prev => prev + basePoints);
      setCombo(prev => {
        const newCombo = prev + 1;
        setMaxCombo(max => Math.max(max, newCombo));
        return newCombo;
      });
      setQuestionsAnswered(prev => prev + 1);
      setSpeed(prev => Math.min(prev + 0.15, 12));
      createParticles(window.innerWidth / 2, questionY, '#10b981');
      showNotification(`+${Math.floor(basePoints)} 💰`, '#10b981');

      setTimeout(() => spawnQuestion(), 400);
    } else {
      setShowFeedback('wrong');
      setCombo(0);
      setPointsMultiplier(1);
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) setTimeout(() => endGame(), 1000);
        else setTimeout(() => spawnQuestion(), 800);
        return newLives;
      });
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 300);
      createParticles(window.innerWidth / 2, questionY, '#ef4444');
      showNotification('❌ Wrong!', '#ef4444');
    }
  };

  const handlePowerUpCollect = (powerUp) => {
    createParticles(powerUp.x, powerUp.y, powerUp.color);

    if (powerUp.id === 'shield') {
      setLives(prev => Math.min(prev + 1, 9));
      showNotification('🛡️ +1 Life!', powerUp.color);
    } 
    else if (powerUp.id === 'speedboost') {
      setSpeed(prev => prev * 2);
      setActivePowerUps(prev => [...prev, { id: 'speedboost', duration: powerUp.duration }]);
      setTimeout(() => {
        setSpeed(prev => prev / 2);
        setActivePowerUps(prev => prev.filter(p => p.id !== 'speedboost'));
      }, powerUp.duration);
      showNotification('🚀 Speed +100%!', powerUp.color);
    }
    else if (powerUp.id === 'slowmo') {
      setSpeed(prev => prev * 0.3);
      setActivePowerUps(prev => [...prev, { id: 'slowmo', duration: powerUp.duration }]);
      setTimeout(() => {
        setSpeed(prev => prev / 0.3);
        setActivePowerUps(prev => prev.filter(p => p.id !== 'slowmo'));
      }, powerUp.duration);
      showNotification('🐢 Speed -70%!', powerUp.color);
    }
    else if (powerUp.id === 'pointsx5') {
      setPointsMultiplier(5);
      setActivePowerUps(prev => [...prev, { id: 'pointsx5', duration: powerUp.duration }]);
      setTimeout(() => {
        setPointsMultiplier(1);
        setActivePowerUps(prev => prev.filter(p => p.id !== 'pointsx5'));
      }, powerUp.duration);
      showNotification('💎 5x Points!', powerUp.color);
    }
    else if (powerUp.id === 'accuracy') {
      setRevealAnswer(currentQ.correct);
      setTimeout(() => setRevealAnswer(null), 3000);
      showNotification('🎯 Answer Shown!', powerUp.color);
    }
    else if (powerUp.id === 'freeze') {
      setIsFrozen(true);
      setActivePowerUps(prev => [...prev, { id: 'freeze', duration: powerUp.duration }]);
      setTimeout(() => {
        setIsFrozen(false);
        setActivePowerUps(prev => prev.filter(p => p.id !== 'freeze'));
      }, powerUp.duration);
      showNotification('⏸️ Time Frozen!', powerUp.color);
    }
    else if (powerUp.id === 'remove_answers') {
      const wrongAnswers = [0, 1, 2, 3].filter(i => i !== currentQ.correct);
      if (wrongAnswers.length > 0) {
        const toRemove = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
        setAnswersRemoved([toRemove]);
        showNotification('🌪️ Wrong Removed!', powerUp.color);
      }
    }

    setPowerUpOnScreen(null);
  };

  const handleMiss = () => {
    setCombo(0);
    setPointsMultiplier(1);
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) endGame();
      else spawnQuestion();
      return newLives;
    });
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 300);
    showNotification('⏰ Passed!', '#f59e0b');
  };

  const endGame = async () => {
    setGameState('gameover');
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('lhHighScore', score);
    }

    if (user?.uid) {
      try {
        const mutation = getMutation(combo);
        await leaderboardService.saveScore(
          user.uid,
          user.username || 'Anonymous',
          score,
          maxCombo,
          questionsAnswered,
          mutation.name
        );
      } catch (error) {
        console.error('Error saving score:', error);
      }
    }
  };

  const createParticles = (x, y, color) => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: Date.now() + i,
      x, y,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.5) * 14,
      color
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id))), 1000);
  };

  const showNotification = (text, color) => {
    setNotif({ text, color, id: Date.now() });
    setTimeout(() => setNotif(null), 1500);
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyPress = (e) => {
      if (e.key >= '1' && e.key <= '4') {
        handleAnswer(parseInt(e.key) - 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, currentQ, selectedAns, showFeedback, isFrozen]);

  // ==================== MENU ====================
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-cyan-900 text-white flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full"
              initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
              animate={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
              transition={{ duration: 10 + Math.random() * 15, repeat: Infinity }}
            />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="text-center z-10 max-w-2xl"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], y: [0, -20, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <Zap className="w-40 h-40 mx-auto mb-8 text-cyan-400" />
          </motion.div>

          <h1 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-8xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
            THE FALLING FRENZY
          </h1>
          <p className="text-2xl text-gray-300 mb-12">⚡ 200+ Questions • 7 Power-Ups • Dynamic Mutations</p>

          <div className="space-y-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="px-20 py-6 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl font-black text-3xl shadow-2xl shadow-cyan-500/50 w-full"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              ▶ PLAY NOW
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setGameState('leaderboard');
                loadLeaderboard();
              }}
              className="px-20 py-4 bg-yellow-600/50 border-2 border-yellow-500 rounded-2xl font-black text-xl w-full"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              🏆 LEADERBOARD
            </motion.button>
          </div>

          <div className="mt-12 p-8 rounded-2xl bg-black/60 border-2 border-cyan-500/40 space-y-4">
            <p className="text-cyan-300 font-bold mb-4">✨ 7 POWER-UPS:</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <p className="text-gray-300">🛡️ Shield: +1 Life</p>
              <p className="text-gray-300">🚀 Rocket: Speed ×2</p>
              <p className="text-gray-300">🐢 Slow Mo: Speed ÷3</p>
              <p className="text-gray-300">💎 5x Points: ×5</p>
              <p className="text-gray-300">🎯 Accuracy: Show</p>
              <p className="text-gray-300">⏸️ Pause: Freeze</p>
              <p className="text-gray-300">🌪️ Chaos: Remove</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">HIGH SCORE</p>
            <p style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-6xl font-black text-yellow-400">
              {highScore.toLocaleString()}
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // ==================== LEADERBOARD ====================
  if (gameState === 'leaderboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-purple-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setGameState('menu')}
            className="mb-8 px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold text-lg"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            ← BACK
          </motion.button>

          <h1 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-6xl font-black mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
            🏆 GLOBAL LEADERBOARD
          </h1>

          {userRank && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 rounded-2xl bg-purple-900/50 border-2 border-purple-500"
            >
              <p className="text-purple-300 font-bold mb-2">YOUR RANK</p>
              <p style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-5xl font-black text-purple-300">
                #{userRank}
              </p>
            </motion.div>
          )}

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {leaderboardData.slice(0, 50).map((entry, idx) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={`p-4 rounded-xl border-2 flex justify-between items-center ${
                  entry.userId === user?.uid
                    ? 'bg-cyan-900/50 border-cyan-500'
                    : 'bg-black/50 border-gray-700'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-2xl font-black text-yellow-400 min-w-16">
                    #{idx + 1}
                  </span>
                  <div>
                    <p className="font-bold">{entry.username}</p>
                    <p className="text-xs text-gray-400">{entry.highestMutation}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-3xl font-black text-cyan-300">
                    {entry.score.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">{entry.maxCombo}× • {entry.questionsAnswered}Q</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==================== GAME OVER ====================
  if (gameState === 'gameover') {
    const mutation = getMutation(combo);
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-purple-900 text-white flex items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-2xl"
        >
          <h1 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-8xl font-black mb-8 text-red-400">
            GAME OVER
          </h1>

          <div className="grid grid-cols-2 gap-6 mb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-8 rounded-2xl bg-black/60 border-2 border-yellow-500">
              <p className="text-sm text-gray-400 mb-3">FINAL SCORE</p>
              <p style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-6xl font-black text-yellow-400">
                {score.toLocaleString()}
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 rounded-2xl bg-black/60 border-2 border-purple-500">
              <p className="text-sm text-gray-400 mb-3">MAX COMBO</p>
              <p style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-6xl font-black text-purple-400">
                {maxCombo}×
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-12">
            <div className="p-4 rounded-xl bg-cyan-900/30 border border-cyan-500">
              <p className="text-xs text-cyan-400">Questions</p>
              <p className="text-2xl font-black text-cyan-300">{questionsAnswered}</p>
            </div>
            <div className="p-4 rounded-xl bg-pink-900/30 border border-pink-500">
              <p className="text-xs text-pink-400">Peak Mutation</p>
              <p style={{ fontFamily: 'Orbitron, sans-serif' }} className="font-black text-pink-300">{mutation.name}</p>
            </div>
          </div>

          {score > highScore && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-12 p-6 rounded-2xl bg-yellow-500/20 border-2 border-yellow-500">
              <p className="text-3xl font-black text-yellow-400">🎉 NEW HIGH SCORE! 🎉</p>
            </motion.div>
          )}

          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={startGame}
              className="px-12 py-4 bg-cyan-500 hover:bg-cyan-600 rounded-xl font-bold text-xl"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              RETRY
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setGameState('menu')}
              className="px-12 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold text-xl"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              MENU
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ==================== PLAYING ====================
  const mutation = getMutation(combo);

  return (
    <div
      className={`min-h-screen text-white relative overflow-hidden transition-all ${screenShake ? 'animate-shake' : ''}`}
      style={{
        background: combo >= 20
          ? 'linear-gradient(135deg, rgba(255,0,128,0.25) 0%, rgba(0,0,0,0.9) 50%, rgba(255,0,128,0.25) 100%)'
          : combo >= 10
          ? 'linear-gradient(135deg, rgba(139,0,139,0.2) 0%, rgba(0,0,0,0.95) 50%, rgba(139,0,139,0.2) 100%)'
          : 'linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(0,0,0,0.95) 50%, rgba(30,58,138,0.2) 100%)'
      }}
    >
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            animation: 'slide 20s linear infinite'
          }}
        />
      </div>

      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute w-4 h-4 rounded-full"
          style={{ backgroundColor: particle.color, left: particle.x, top: particle.y, boxShadow: `0 0 10px ${particle.color}` }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 0, x: particle.vx * 60, y: particle.vy * 60 }}
          transition={{ duration: 1 }}
        />
      ))}

      <div className="absolute top-0 left-0 right-0 p-8 z-10">
        <div className="flex justify-between items-start max-w-7xl mx-auto w-full">
          <div>
            <p className="text-xs text-gray-500 uppercase">Score</p>
            <p style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-5xl font-black text-cyan-400">
              {score.toLocaleString()}
            </p>
            {combo > 1 && (
              <motion.div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-500 flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-500" />
                <p style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-2xl font-black text-orange-400">
                  {combo}×
                </p>
                {pointsMultiplier > 1 && <span className="text-yellow-300 font-black">×{pointsMultiplier}!</span>}
              </motion.div>
            )}
          </div>

          <div className="text-center">
            <motion.div
              key={mutation.name}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="p-4 rounded-2xl bg-black/80 border-2 border-purple-500 backdrop-blur-sm mb-2"
            >
              <p className="text-sm text-gray-400">MODE</p>
              <p style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-xl font-black text-purple-300">
                {mutation.name}
              </p>
            </motion.div>
            {isFrozen && <p className="text-3xl animate-pulse">⏸️ FROZEN</p>}
            {activePowerUps.length > 0 && (
              <div className="flex gap-2 justify-center mt-2 flex-wrap">
                {activePowerUps.map((p, idx) => (
                  <span key={idx} className="text-2xl">
                    {p.id === 'speedboost' ? '🚀' : p.id === 'slowmo' ? '🐢' : p.id === 'pointsx5' ? '💎' : '⏸️'}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase">Lives</p>
            <div className="flex gap-2 justify-end mt-1">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: i < lives ? 1 : 0.5, opacity: i < lives ? 1 : 0.3 }}
                  className={`w-8 h-8 rounded-full border-2 ${
                    i < lives ? 'bg-red-500 border-red-400' : 'bg-gray-700 border-gray-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 uppercase mt-3">Speed</p>
            <p style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-2xl font-black text-cyan-300">
              {speed.toFixed(1)}×
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {powerUpOnScreen && (
          <motion.div
            style={{ position: 'absolute', top: powerUpOnScreen.y, left: powerUpOnScreen.x, zIndex: 15 }}
            onClick={() => handlePowerUpCollect(powerUpOnScreen)}
            whileHover={{ scale: 1.2 }}
            className="cursor-pointer"
          >
            <motion.div
              animate={{ rotate: 360, y: [0, -15, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-20 h-20 rounded-full flex flex-col items-center justify-center text-4xl border-3 shadow-2xl bg-black/50"
              style={{ borderColor: powerUpOnScreen.color, boxShadow: `0 0 40px ${powerUpOnScreen.color}` }}
            >
              <span>{powerUpOnScreen.icon}</span>
              <span style={{ fontSize: '10px', color: powerUpOnScreen.color }} className="font-bold">
                {powerUpOnScreen.name}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {currentQ && (
          <motion.div
            style={{ position: 'absolute', top: questionY, left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}
            className="w-full max-w-3xl px-4"
          >
            <motion.div
              className={`p-8 rounded-3xl backdrop-blur-xl border-4 shadow-2xl ${
                showFeedback === 'correct'
                  ? 'bg-emerald-500/40 border-emerald-500'
                  : showFeedback === 'wrong'
                  ? 'bg-red-500/40 border-red-500'
                  : mutation.blur
                  ? 'bg-purple-900/50 border-purple-500'
                  : 'bg-slate-900/60 border-cyan-500'
              }`}
              animate={{ rotate: showFeedback ? [0, 8, -8, 0] : 0, scale: showFeedback ? [1, 1.08, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <p style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-3xl font-black text-center mb-6 text-white">
                {currentQ.q}
              </p>

              <div className="grid grid-cols-2 gap-4">
                {currentQ.opts.map((opt, idx) => {
                  const displayIdx = mutation.shuffle > 0 ? shuffledIndices.indexOf(idx) : idx;
                  const displayOpt = mutation.shuffle > 0 ? currentQ.opts[shuffledIndices[displayIdx]] : opt;
                  const isRemoved = answersRemoved.includes(idx);

                  return (
                    <motion.button
                      key={displayIdx}
                      whileHover={{ scale: selectedAns === null && !isFrozen && !isRemoved ? 1.08 : 1 }}
                      whileTap={{ scale: selectedAns === null && !isFrozen && !isRemoved ? 0.95 : 1 }}
                      onClick={() => !isRemoved && handleAnswer(displayIdx)}
                      disabled={selectedAns !== null || isFrozen || isRemoved}
                      className={`p-5 rounded-2xl font-bold text-lg transition-all border-2 ${
                        isRemoved
                          ? 'bg-gray-900/50 border-gray-600 opacity-30 cursor-not-allowed'
                          : selectedAns === displayIdx && showFeedback === 'correct'
                          ? 'bg-emerald-500 border-emerald-400 text-white'
                          : selectedAns === displayIdx && showFeedback === 'wrong'
                          ? 'bg-red-500 border-red-400 text-white'
                          : revealAnswer === idx
                          ? 'bg-yellow-500/60 border-yellow-400 text-white ring-2 ring-yellow-300'
                          : mutation.blur && selectedAns === null
                          ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50'
                          : 'bg-gray-900/80 border-gray-700 hover:bg-gray-800/80'
                      }`}
                      style={{ filter: mutation.blur && selectedAns === null ? 'blur(0.8px)' : 'none' }}
                    >
                      {!isRemoved && <span className="text-cyan-300 mr-3 font-black">{displayIdx + 1}.</span>}
                      {isRemoved ? '❌ REMOVED' : displayOpt}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notif && (
          <motion.div
            initial={{ scale: 0, y: -50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -50 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-8 py-4 rounded-2xl font-bold text-xl"
            style={{
              backgroundColor: `${notif.color}33`,
              border: `2px solid ${notif.color}`,
              color: notif.color,
              boxShadow: `0 0 20px ${notif.color}`,
              fontFamily: 'Orbitron, sans-serif'
            }}
          >
            {notif.text}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-12px); }
          75% { transform: translateX(12px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        @keyframes slide {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </div>
  );
}
