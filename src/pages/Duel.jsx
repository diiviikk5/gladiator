import { useState, useEffect, useRef, useContext, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, Zap, Target, TrendingUp, Crown, Swords, Trophy } from 'lucide-react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { typingChallenges } from '../data/duelProblems';
import { globalMCQBank } from '../data/mcqBank';
import useSocket from '../hooks/useSocket';
import { db } from '../config/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';


const GAME_DURATION = 60;
const WORDS_FOR_MCQ = 5;

// ==================================================================================
// UTILITY FUNCTIONS
// ==================================================================================


const countWords = (text) => {
  return text.trim().split(/\s+/).filter((word) => word.length > 0).length;
};

const getSpeedCategory = (wpm) => {
  if (wpm >= 120) return 'Legendary';
  if (wpm >= 100) return 'Master';
  if (wpm >= 80) return 'Expert';
  if (wpm >= 60) return 'Advanced';
  if (wpm >= 40) return 'Intermediate';
  if (wpm >= 20) return 'Beginner';
  return 'Novice';
};

const getPerformanceRating = (wpm, accuracy, mcqs) => {
  const score = wpm + accuracy + mcqs * 5;
  if (score >= 250) return 'S-Tier';
  if (score >= 200) return 'A-Tier';
  if (score >= 150) return 'B-Tier';
  if (score >= 100) return 'C-Tier';
  return 'D-Tier';
};

const getRatingColor = (rating) => {
  switch (rating) {
    case 'S-Tier':
      return 'text-yellow-400';
    case 'A-Tier':
      return 'text-cyan-400';
    case 'B-Tier':
      return 'text-green-400';
    case 'C-Tier':
      return 'text-purple-400';
    default:
      return 'text-gray-400';
  }
};

const getTierEmoji = (tier) => {
  switch (tier) {
    case 'S-Tier':
      return '👑';
    case 'A-Tier':
      return '🌟';
    case 'B-Tier':
      return '⭐';
    case 'C-Tier':
      return '💫';
    default:
      return '✨';
  }
};

const sanitizeStats = (stats) => {
  return {
    wpm: Math.max(0, Math.floor(stats?.wpm || 0)),
    accuracy: Math.min(100, Math.max(0, Math.floor(stats?.accuracy || 0))),
    wordsTyped: Math.max(0, Math.floor(stats?.wordsTyped || 0)),
    correctChars: Math.max(0, Math.floor(stats?.correctChars || 0)),
    totalChars: Math.max(0, Math.floor(stats?.totalChars || 0)),
    correctMCQs: Math.max(0, Math.floor(stats?.correctMCQs || 0)),
    totalMCQs: Math.max(0, Math.floor(stats?.totalMCQs || 0)),
    finalScore: Math.max(0, Math.floor(stats?.finalScore || 0)),
  };
};

// ==================================================================================
// MAIN DUEL COMPONENT
// ==================================================================================

export default function Duel() {
  const globalMCQPoolRef = useRef(globalMCQBank);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const typingInputRef = useRef(null);
  const mcqTriggeredRef = useRef(new Set());
  const typingContainerRef = useRef(null);

  // ============ MAIN GAME STATE ============
  const [gamePhase, setGamePhase] = useState('modeSelect'); // modeSelect | searching | waiting | ready | countdown | playing | results | tournament
  const [gameMode, setGameMode] = useState(null); // '1v1' or 'tournament'

  // ============ GAME FLOW STATE ============
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [countdownNum, setCountdownNum] = useState(3);
  const [currentParagraph, setCurrentParagraph] = useState('');
  const [typedText, setTypedText] = useState('');
  const [currentMCQ, setCurrentMCQ] = useState(null);
  const [showMCQPopup, setShowMCQPopup] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // ============ OPPONENT/MATCH STATE ============
  const [opponentName, setOpponentName] = useState('Opponent');
  const [winner, setWinner] = useState(null);

  // ============ STATS STATE ============
  const [playerStats, setPlayerStats] = useState({
    wpm: 0,
    accuracy: 0,
    wordsTyped: 0,
    correctChars: 0,
    totalChars: 0,
    correctMCQs: 0,
    totalMCQs: 0,
    finalScore: 0,
  });

  const [opponentStats, setOpponentStats] = useState({
    wpm: 0,
    accuracy: 0,
    wordsTyped: 0,
    correctChars: 0,
    totalChars: 0,
    correctMCQs: 0,
    totalMCQs: 0,
    finalScore: 0,
  });

  // ============ TOURNAMENT STATE ============
  const [tournamentData, setTournamentData] = useState(null);
  const [tournamentPlayers, setTournamentPlayers] = useState([]);
  const [currentRound, setCurrentRound] = useState(null); // 'semifinal1', 'semifinal2', 'final'
  const [semifinals, setSemifinals] = useState({ sf1: null, sf2: null });
  const [tournamentResults, setTournamentResults] = useState({
    semifinal1: { winner: null, scores: null },
    semifinal2: { winner: null, scores: null },
    final: { winner: null, scores: null },
  });
  const [showBracket, setShowBracket] = useState(false);
  const [waitingForOtherSemifinal, setWaitingForOtherSemifinal] = useState(false);

  // ============ UI STATE ============
  const [waitingCount, setWaitingCount] = useState(0);

  const socket = useSocket(user);

  // ============ CALCULATE STATS ============
  const calculateStats = useCallback(
    (typed) => {
      const words = typed.trim().split(/\s+/).filter((w) => w.length > 0).length;
      const chars = typed.length;

      let correct = 0;
      for (let i = 0; i < typed.length && i < currentParagraph.length; i++) {
        if (typed[i] === currentParagraph[i]) correct++;
      }

      const elapsedTime = GAME_DURATION - timeLeft;
      const wpm = elapsedTime > 0 ? Math.round((words / elapsedTime) * 60) : 0;
      const accuracy = chars > 0 ? Math.round((correct / chars) * 100) : 0;

      return {
        wpm: Math.max(0, wpm),
        accuracy: Math.max(0, Math.min(100, accuracy)),
        wordsTyped: words,
        correctChars: correct,
        totalChars: chars,
        correctMCQs: playerStats.correctMCQs,
        totalMCQs: playerStats.totalMCQs,
        finalScore: Math.round(wpm + accuracy + playerStats.correctMCQs * 10),
      };
    },
    [currentParagraph, timeLeft, playerStats.correctMCQs, playerStats.totalMCQs]
  );

  // ============ SOCKET LISTENERS ============
  useEffect(() => {
    if (!socket.socket) return;

    // 1v1 Matching
    socket.onEvent('matchFound', (data) => {
      console.log('🎮 Match found:', data);
      setOpponentName(data.opponent.username || 'Opponent');
      setGameMode(data.gameMode || '1v1');
      setCurrentRound(data.round || null);
      setGamePhase('ready');
    });

    socket.onEvent('waiting', (data) => {
      console.log('⏳ Waiting:', data);
      setWaitingCount(data.waitingCount || 0);
    });

    // Tournament Matching
    socket.onEvent('waitingTournament', (data) => {
      console.log('🏆 Tournament waiting:', data);
      setWaitingCount(data.currentPlayers || 0);
    });

    socket.onEvent('tournamentStarted', (data) => {
      console.log('🏆 Tournament started:', data);
      setGameMode('tournament');
      setCurrentRound(data.currentRound);
      setTournamentPlayers(data.allPlayers || []);
      setGamePhase('tournament');
      setShowBracket(true);
    });

    socket.onEvent('tournamentFinalStarting', (data) => {
      console.log('🏆 Final starting:', data);
      setCurrentRound('final');
      setTournamentData(data);
    });

    // Game Progress
    socket.onEvent('countdownUpdate', (num) => {
      setCountdownNum(num);
    });

        socket.onEvent('gameStarted', (data) => {
      console.log('▶️ Game started');
      // ✅ USE PARAGRAPH FROM SERVER (SAME FOR BOTH PLAYERS)
      setCurrentParagraph(data.paragraph || typingChallenges[0].paragraph);
      // Store MCQ pool if needed
      globalMCQPoolRef.current = data.mcqPool || globalMCQBank;

      setGamePhase('playing');
      setTypedText('');
      setTimeLeft(GAME_DURATION);
      mcqTriggeredRef.current.clear();
      setPlayerStats({
        wpm: 0,
        accuracy: 0,
        wordsTyped: 0,
        correctChars: 0,
        totalChars: 0,
        correctMCQs: 0,
        totalMCQs: 0,
        finalScore: 0,
      });
      setOpponentStats({
        wpm: 0,
        accuracy: 0,
        wordsTyped: 0,
        correctChars: 0,
        totalChars: 0,
        correctMCQs: 0,
        totalMCQs: 0,
        finalScore: 0,
      });
      setTimeout(() => typingInputRef.current?.focus(), 100);
    });

    socket.onEvent('opponentStats', (stats) => {
      console.log('📊 Opponent stats:', stats);
      setOpponentStats(sanitizeStats(stats));
    });

          socket.onEvent('gameEnded', async (data) => {
      console.log('🏁 Game ended:', data);
      setGamePhase('results');

      // ✅ USE SERVER'S STATS (THESE ARE THE SOURCE OF TRUTH)
      const finalPlayerStats = sanitizeStats(data.player1Stats);
      const finalOpponentStats = sanitizeStats(data.player2Stats);
      
      setPlayerStats(finalPlayerStats);
      setOpponentStats(finalOpponentStats);

      // Determine winner from server
      if (data.winner === 'player1') {
        setWinner('player1');
      } else if (data.winner === 'player2') {
        setWinner('player2');
      } else {
        setWinner('tie');
      }

      // ============ UPDATE FIREBASE WITH FINAL STATS ============
      if (user?.uid) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const currentData = userDoc.data();
            const currentStats = currentData.stats || {};
            const currentAchievements = currentData.achievements || {};

            if (data.winner === 'player1') {
              // ✅ PLAYER WON
              const newWins = (currentStats.wins || 0) + 1;
              const newWinStreak = (currentStats.winStreak || 0) + 1;
              const newMaxWinStreak = Math.max(currentStats.maxWinStreak || 0, newWinStreak);
              const eloChange = 20;
              const newElo = (currentStats.elo || 1200) + eloChange;

              const newAchievements = { ...currentAchievements };
              if (newWins >= 1) newAchievements.firstWin = true;
              if (newWins >= 10) newAchievements.tenWins = true;
              if (newWins >= 50) newAchievements.fiftyWins = true;
              if (finalPlayerStats.wpm >= 100) newAchievements.speedRunner = true;
              if (finalPlayerStats.accuracy === 100) newAchievements.perfectGame = true;
              if (newWinStreak >= 5) newAchievements.winStreak5 = true;

              await updateDoc(userDocRef, {
                stats: {
                  ...currentStats,
                  wins: newWins,
                  totalMatches: (currentStats.totalMatches || 0) + 1,
                  winStreak: newWinStreak,
                  maxWinStreak: newMaxWinStreak,
                  elo: newElo,
                  totalPoints: (currentStats.totalPoints || 0) + finalPlayerStats.finalScore,
                  playtime: (currentStats.playtime || 0) + GAME_DURATION,
                },
                achievements: newAchievements,
              });

              console.log('✅ Win recorded - New ELO:', newElo);
            } else if (data.winner === 'player2') {
              // ✅ PLAYER LOST
              const newElo = Math.max(1000, (currentStats.elo || 1200) - 10);

              await updateDoc(userDocRef, {
                stats: {
                  ...currentStats,
                  losses: (currentStats.losses || 0) + 1,
                  totalMatches: (currentStats.totalMatches || 0) + 1,
                  winStreak: 0,
                  elo: newElo,
                  totalPoints: (currentStats.totalPoints || 0) + finalPlayerStats.finalScore,
                  playtime: (currentStats.playtime || 0) + GAME_DURATION,
                },
              });

              console.log('❌ Loss recorded - New ELO:', newElo);
            } else {
              // ✅ TIE
              await updateDoc(userDocRef, {
                stats: {
                  ...currentStats,
                  totalMatches: (currentStats.totalMatches || 0) + 1,
                  totalPoints: (currentStats.totalPoints || 0) + finalPlayerStats.finalScore,
                  playtime: (currentStats.playtime || 0) + GAME_DURATION,
                },
              });

              console.log('🤝 Tie recorded');
            }
          }
        } catch (error) {
          console.error('❌ Error updating Firebase:', error);
        }
      }

      // Handle tournament progression
      if (data.gameMode === 'tournament' && data.round) {
        handleTournamentRoundEnd(data.round, data.winner, data.player1Stats, data.player2Stats);
      }
    });



    return () => {
      socket.offEvent('matchFound');
      socket.offEvent('waiting');
      socket.offEvent('waitingTournament');
      socket.offEvent('tournamentStarted');
      socket.offEvent('tournamentFinalStarting');
      socket.offEvent('countdownUpdate');
      socket.offEvent('gameStarted');
      socket.offEvent('opponentStats');
      socket.offEvent('gameEnded');
    };
  }, [socket, playerStats.correctMCQs, playerStats.totalMCQs, user?.uid, winner]);

  // ============ HANDLE TOURNAMENT ROUND END ============
  const handleTournamentRoundEnd = (round, winner, p1Stats, p2Stats) => {
    console.log('🏆 Tournament round end:', round, 'Winner:', winner);

    if (round === 'semifinal1') {
      setTournamentResults((prev) => ({
        ...prev,
        semifinal1: {
          winner: winner === 'player1' ? 'player1' : 'player2',
          scores: { p1: p1Stats?.finalScore || 0, p2: p2Stats?.finalScore || 0 },
        },
      }));
    } else if (round === 'semifinal2') {
      setTournamentResults((prev) => ({
        ...prev,
        semifinal2: {
          winner: winner === 'player1' ? 'player1' : 'player2',
          scores: { p1: p1Stats?.finalScore || 0, p2: p2Stats?.finalScore || 0 },
        },
      }));
      setWaitingForOtherSemifinal(true);
    } else if (round === 'final') {
      setTournamentResults((prev) => ({
        ...prev,
        final: {
          winner: winner === 'player1' ? 'player1' : 'player2',
          scores: { p1: p1Stats?.finalScore || 0, p2: p2Stats?.finalScore || 0 },
        },
      }));
    }
  };

  // ============ GAME TIMER ============
  useEffect(() => {
    if (gamePhase !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gamePhase]);

  // ============ SYNC STATS ============
  useEffect(() => {
    if (gamePhase !== 'playing' || showMCQPopup) return;

    const stats = calculateStats(typedText);
    setPlayerStats(stats);
    socket.updateStats(stats);
  }, [typedText, gamePhase, calculateStats, socket, showMCQPopup]);

  // ============ AUTO-SCROLL (FIXED) ============
  useEffect(() => {
    if (typingContainerRef.current && gamePhase === 'playing' && typedText.length > 0) {
      const lineHeight = 32;
      const charsPerLine = 80;
      const currentLine = Math.floor(typedText.length / charsPerLine);
      const scrollAmount = currentLine * lineHeight;
      typingContainerRef.current.scrollTop = scrollAmount;
    }
  }, [typedText, gamePhase]);

  // ============ HANDLE TYPING ============
  const handleTyping = (e) => {
    if (gamePhase !== 'playing') return;

    const text = e.target.value;
    if (text.length > currentParagraph.length) {
      setTypedText(currentParagraph);
      return;
    }

    setTypedText(text);

    // MCQ EVERY 5 WORDS
    const words = text.trim().split(/\s+/).filter((w) => w.length > 0).length;
    if (
      words > 0 &&
      words % WORDS_FOR_MCQ === 0 &&
      !mcqTriggeredRef.current.has(words) &&
      !showMCQPopup
    ) {
      mcqTriggeredRef.current.add(words);
      triggerMCQ();
    }
  };

  // ============ TRIGGER MCQ ============
   const triggerMCQ = () => {
    // ✅ NEW: Use server's shared MCQ pool
    const mcqPool = globalMCQPoolRef.current || globalMCQBank;
    const mcq = mcqPool[Math.floor(Math.random() * mcqPool.length)];

    setCurrentMCQ(mcq);
    setShowMCQPopup(true);
    setSelectedAnswer(null);
  };

  // ============ HANDLE MCQ ANSWER ============
  const handleMCQAnswer = (option) => {
    setSelectedAnswer(option);
    const isCorrect = option === currentMCQ.answer;

    setTimeout(() => {
      setPlayerStats((prev) => {
        const newStats = {
          ...prev,
          totalMCQs: prev.totalMCQs + 1,
          correctMCQs: isCorrect ? prev.correctMCQs + 1 : prev.correctMCQs,
          finalScore: Math.round(
            prev.wpm +
            prev.accuracy +
            (isCorrect ? prev.correctMCQs + 1 : prev.correctMCQs) * 10
          ),
        };
        socket.answerMCQ({ correct: isCorrect, newStats });
        return newStats;
      });

      setShowMCQPopup(false);
      setCurrentMCQ(null);
      setSelectedAnswer(null);
      if (typingInputRef.current) typingInputRef.current.focus();
    }, 600);
  };

  // ============ END GAME ============
   // ============ END GAME ============
  const endGame = async () => {
    const finalStats = calculateStats(typedText);
    setPlayerStats(finalStats);
    
    // Update Firebase achievements and stats
    if (user?.uid) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const currentData = userDoc.data();
          const currentStats = currentData.stats || {};
          const currentAchievements = currentData.achievements || {};
          
          // Calculate new stats
          const newWins = (currentStats.wins || 0) + (winner === 'player1' ? 1 : 0);
          const newLosses = (currentStats.losses || 0) + (winner === 'player2' ? 1 : 0);
          const newWinStreak = winner === 'player1' ? (currentStats.winStreak || 0) + 1 : 0;
          const newMaxWinStreak = Math.max(currentStats.maxWinStreak || 0, newWinStreak);
          
          // Calculate ELO change (simple system: +20 for win, -10 for loss)
          const eloChange = winner === 'player1' ? 20 : winner === 'player2' ? -10 : 0;
          const newElo = Math.max(1000, (currentStats.elo || 1200) + eloChange);
          
          // Unlock achievements
          const newAchievements = { ...currentAchievements };
          
          if (newWins >= 1) newAchievements.firstWin = true;
          if (newWins >= 10) newAchievements.tenWins = true;
          if (newWins >= 50) newAchievements.fiftyWins = true;
          if (finalStats.wpm >= 100) newAchievements.speedRunner = true;
          if (finalStats.accuracy === 100) newAchievements.perfectGame = true;
          if (newWinStreak >= 5) newAchievements.winStreak5 = true;
          
          // Update Firebase
          await updateDoc(userDocRef, {
            stats: {
              ...currentStats,
              wins: newWins,
              losses: newLosses,
              totalMatches: (currentStats.totalMatches || 0) + 1,
              winStreak: newWinStreak,
              maxWinStreak: newMaxWinStreak,
              elo: newElo,
              totalPoints: (currentStats.totalPoints || 0) + finalStats.finalScore,
              playtime: (currentStats.playtime || 0) + GAME_DURATION,
            },
            achievements: newAchievements,
            lastLogin: new Date(),
          });
          
          console.log('✅ Firebase updated successfully');
        }
      } catch (error) {
        console.error('❌ Error updating Firebase:', error);
      }
    }
    
    socket.endGame({ stats: finalStats, userId: user?.uid || 'guest' });
  };


  // ============ GET ERROR COUNT ============
  const getErrorCount = () => {
    let errors = 0;
    for (let i = 0; i < typedText.length; i++) {
      if (typedText[i] !== currentParagraph[i]) errors++;
    }
    return errors;
  };

  // ============ FIND 1V1 MATCH ============
  const handleFind1v1 = () => {
    setGameMode('1v1');
    setGamePhase('searching');
    socket.findMatch1v1({
      userId: user?.uid || 'guest',
      displayName: user?.displayName || 'Player',
      username: user?.displayName || 'Player',
    });
  };

  // ============ FIND TOURNAMENT MATCH ============
  const handleFindTournament = () => {
    setGameMode('tournament');
    setGamePhase('searching');
    socket.findMatchTournament({
      userId: user?.uid || 'guest',
      displayName: user?.displayName || 'Player',
      username: user?.displayName || 'Player',
    });
  };

  // ============ RENDER MODE SELECT (MATCHMAKING SCREEN) ============
  if (gamePhase === 'modeSelect') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-12 max-w-4xl px-4"
          >
            <div className="space-y-4">
              <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                DSA TYPING DUEL
              </h1>
              <p className="text-gray-400 text-lg">
                Choose your battle mode
              </p>
            </div>

            {/* MODE SELECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 1V1 MODE */}
                      <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={handleFind1v1}
                      className="relative group cursor-pointer"
                      >
                      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition"></div>

                      <div className="relative bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-2 border-cyan-500/50 rounded-2xl p-12 backdrop-blur-xl hover:border-cyan-400 transition-all">
                        <div className="text-6xl mb-4">⚡</div>
                        <h2 className="text-3xl font-black text-cyan-300 mb-2">1v1 DUEL</h2>
                        <p className="text-gray-400 mb-6">
                        Head-to-head battle against one opponent
                        </p>
                        <div className="space-y-2 text-sm text-gray-400">
                        <p>✓ 60 second match</p>
                        <p>✓ Real-time typing</p>
                        <p>✓ MCQ challenges</p>
                        </div>
                        <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-8 w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-8 py-3 rounded-lg font-black text-white shadow-lg shadow-cyan-500/50 transition-all"
                        >
                        FIND MATCH
                        </motion.button>
                      </div>
                      </motion.div>

                      {/* TOURNAMENT MODE */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                onClick={handleFindTournament}
                className="relative group cursor-pointer"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition"></div>

                <div className="relative bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-2 border-purple-500/50 rounded-2xl p-12 backdrop-blur-xl hover:border-purple-400 transition-all">
                  <div className="text-6xl mb-4">🏆</div>
                  <h2 className="text-3xl font-black text-purple-300 mb-2">4-PLAYER TOURNAMENT</h2>
                  <p className="text-gray-400 mb-6">
                    Epic tournament with semifinals and finals
                  </p>
                  <div className="space-y-2 text-sm text-gray-400">
                    <p>✓ 4 players needed</p>
                    <p>✓ 2 semifinals</p>
                    <p>✓ Grand finals</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-8 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-8 py-3 rounded-lg font-black text-white shadow-lg shadow-purple-500/50 transition-all"
                  >
                    JOIN TOURNAMENT
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ============ RENDER SEARCHING/WAITING ============
  if (gamePhase === 'searching') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 max-w-2xl px-4"
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-8xl inline-block"
            >
              {gameMode === 'tournament' ? '🏆' : '⚡'}
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                {gameMode === 'tournament'
                  ? 'Finding Tournament Players...'
                  : 'Finding Opponent...'}
              </h1>
              <p className="text-gray-400 text-lg">
                {gameMode === 'tournament'
                  ? `${waitingCount}/4 players ready`
                  : 'Waiting for match...'}
              </p>
            </div>

            {gameMode === 'tournament' && (
              <div className="flex justify-center gap-4">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: i < waitingCount ? 1.2 : 1,
                      opacity: i < waitingCount ? 1 : 0.3,
                    }}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl font-bold ${
                      i < waitingCount
                        ? 'border-purple-400 bg-purple-900/40'
                        : 'border-gray-600 bg-gray-800/40'
                    }`}
                  >
                    {i < waitingCount ? '✓' : i + 1}
                  </motion.div>
                ))}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGamePhase('modeSelect')}
              className="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-lg font-bold text-white transition-all"
            >
              BACK
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ============ RENDER READY ============
  if (gamePhase === 'ready') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="text-6xl inline-block"
            >
              🤝
            </motion.div>
            <div>
              <p className="text-gray-300 text-2xl font-bold mb-2">Matched with</p>
              <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                {opponentName}
              </p>
            </div>
            <p className="text-gray-500 text-lg">Get ready for battle...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  // ============ RENDER COUNTDOWN ============
  if (gamePhase === 'countdown') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 flex items-center justify-center">
        <Navbar />
        <motion.div className="text-center">
          <motion.div
            key={countdownNum}
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
          >
            {countdownNum}
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl text-gray-300 mt-4 font-semibold"
          >
            {countdownNum === 1 ? '🚀 GO!' : '⏱️ Get ready!'}
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // ============ RENDER TOURNAMENT BRACKET ============
  if (gamePhase === 'tournament' && showBracket && currentRound !== 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 py-12">
        <Navbar />

        <div className="container mx-auto px-4 max-w-6xl">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-center mb-12"
          >
            🏆 TOURNAMENT BRACKET
          </motion.h1>

          {/* BRACKET VISUALIZATION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* SEMIFINALS */}
            <div className="space-y-8">
              <h2 className="text-2xl font-black text-cyan-400 text-center">SEMIFINALS</h2>

              {/* SF1 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-2 border-cyan-500/40 rounded-xl p-6 backdrop-blur"
              >
                <p className="text-cyan-300 font-bold mb-4">Match 1</p>
                <div className="space-y-2">
                  {tournamentPlayers.slice(0, 2).map((p, i) => (
                    <div
                      key={i}
                      className="bg-gray-900/50 border border-gray-700 p-3 rounded-lg text-gray-300 font-semibold"
                    >
                      {p.username}
                    </div>
                  ))}
                </div>
                {tournamentResults.semifinal1.winner && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-4 text-center text-green-400 font-bold"
                  >
                    ✓ Match Complete
                  </motion.div>
                )}
              </motion.div>

              {/* SF2 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-2 border-purple-500/40 rounded-xl p-6 backdrop-blur"
              >
                <p className="text-purple-300 font-bold mb-4">Match 2</p>
                <div className="space-y-2">
                  {tournamentPlayers.slice(2, 4).map((p, i) => (
                    <div
                      key={i}
                      className="bg-gray-900/50 border border-gray-700 p-3 rounded-lg text-gray-300 font-semibold"
                    >
                      {p.username}
                    </div>
                  ))}
                </div>
                {tournamentResults.semifinal2.winner && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-4 text-center text-green-400 font-bold"
                  >
                    ✓ Match Complete
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* ARROW */}
            <div className="flex items-center justify-center">
              <motion.div
                animate={{ x: [0, 20, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl text-purple-400"
              >
                →
              </motion.div>
            </div>

            {/* FINALS */}
            <div>
              <h2 className="text-2xl font-black text-pink-400 text-center mb-8">FINALS</h2>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-pink-900/40 to-purple-900/40 border-2 border-pink-500/40 rounded-xl p-6 backdrop-blur"
              >
                <p className="text-pink-300 font-bold mb-4">Grand Final</p>
                <div className="space-y-2">
                  <div className="bg-gray-900/50 border border-gray-700 p-3 rounded-lg text-gray-400 font-semibold">
                    {tournamentResults.semifinal1.winner ? '✓ Winner 1' : 'TBD'}
                  </div>
                  <div className="bg-gray-900/50 border border-gray-700 p-3 rounded-lg text-gray-400 font-semibold">
                    {tournamentResults.semifinal2.winner ? '✓ Winner 2' : 'TBD'}
                  </div>
                </div>
                {tournamentResults.final.winner && (
                  <motion.div
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="mt-4 text-center"
                  >
                    <p className="text-yellow-400 font-black text-lg">👑 CHAMPION</p>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>

          {/* WAITING MESSAGE */}
          {waitingForOtherSemifinal && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-xl text-cyan-400 font-bold">
                Waiting for other semifinal to complete...
              </p>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl inline-block mt-4"
              >
                ⏳
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }
  // ============ RENDER PLAYING SCREEN ============
  if (gamePhase === 'playing') {
    const achievements = [];
    if (playerStats.wpm >= 100) achievements.push('speedrunner');
    if (playerStats.accuracy === 100) achievements.push('perfect');
    if (playerStats.correctMCQs === playerStats.totalMCQs && playerStats.totalMCQs > 0) achievements.push('mensa');

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 pb-8">
        <Navbar />

        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* HEADER WITH TIMER */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400"
              >
                {gameMode === 'tournament'
                  ? `Tournament - ${currentRound === 'semifinal1'
                      ? 'Semifinal 1'
                      : currentRound === 'semifinal2'
                      ? 'Semifinal 2'
                      : 'FINAL'}`
                  : 'DSA Typing Duel'}
              </motion.h1>

              <motion.div
                animate={{
                  color:
                    timeLeft <= 10
                      ? ['#ef4444', '#f97316', '#ef4444']
                      : '#06b6d4',
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className={`flex items-center gap-3 text-3xl font-black ${
                  timeLeft <= 10 ? 'animate-pulse' : ''
                }`}
              >
                <Clock size={40} />
                <span>{String(timeLeft).padStart(2, '0')}s</span>
              </motion.div>
            </div>

            {/* PROGRESS BAR */}
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border-2 border-purple-500/30">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
                animate={{ width: `${(timeLeft / GAME_DURATION) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>

          {/* MAIN GAME AREA - GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            {/* YOUR TYPING AREA - 3 COLS */}
            <div className="lg:col-span-3 space-y-4">
              {/* STATS ROW */}
              <div className="grid grid-cols-5 gap-3">
                {[
                  { label: 'WPM', value: playerStats.wpm, icon: '⚡', color: 'cyan' },
                  { label: 'Acc', value: `${playerStats.accuracy}%`, icon: '🎯', color: 'green' },
                  { label: 'MCQs', value: playerStats.correctMCQs, icon: '✓', color: 'yellow' },
                  { label: 'Errors', value: getErrorCount(), icon: '❌', color: 'purple' },
                  { label: 'Score', value: playerStats.finalScore, icon: '🏆', color: 'blue' },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    className={`bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-2 border-${stat.color}-500/30 p-3 rounded-lg backdrop-blur`}
                  >
                    <p className={`text-${stat.color}-400 text-xs font-bold uppercase`}>
                      {stat.label}
                    </p>
                    <motion.p
                      key={stat.value}
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      className={`text-3xl font-black text-${stat.color}-300 mt-1`}
                    >
                      {stat.icon} {stat.value}
                    </motion.p>
                  </motion.div>
                ))}
              </div>

              {/* TYPING DISPLAY - AUTO SCROLLING (FIXED) */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition"></div>

                <div
                  ref={typingContainerRef}
                  className="relative bg-gray-900/90 border-2 border-cyan-500/40 rounded-xl p-8 backdrop-blur-xl h-64 overflow-y-auto scroll-smooth"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {/* PARAGRAPH RENDERING */}
                  <div className="text-2xl leading-relaxed font-mono tracking-wider text-gray-300 whitespace-pre-wrap break-words pr-4">
                    {currentParagraph.split('').map((char, globalIdx) => {
                      if (globalIdx < typedText.length) {
                        return (
                          <motion.span
                            key={globalIdx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`${
                              typedText[globalIdx] === char
                                ? 'text-green-400 bg-green-900/30 font-bold'
                                : 'text-red-500 bg-red-900/40 font-bold underline'
                            } inline`}
                          >
                            {char === ' ' ? '·' : char}
                          </motion.span>
                        );
                      }

                      return (
                        <span
                          key={globalIdx}
                          className={`inline ${
                            globalIdx === typedText.length
                              ? 'text-cyan-400 bg-cyan-900/30 animate-pulse font-bold'
                              : 'text-gray-600'
                          }`}
                        >
                          {char === ' ' ? '·' : char}
                        </span>
                      );
                    })}
                  </div>

                  {/* PROGRESS BAR AT BOTTOM */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-b-xl"
                    animate={{ width: `${(typedText.length / currentParagraph.length) * 100}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>

              {/* TEXT INPUT */}
              <input
                ref={typingInputRef}
                type="text"
                value={typedText}
                onChange={handleTyping}
                disabled={showMCQPopup}
                placeholder="Click here and start typing..."
                className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border-2 border-cyan-500/30 focus:border-cyan-500 focus:outline-none text-sm font-mono transition-all"
                autoFocus
              />

              {/* BOTTOM STATS */}
              <div className="grid grid-cols-4 gap-3 text-sm">
                <div className="bg-gray-800/50 border border-gray-700/50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs">Characters</p>
                  <p className="text-cyan-400 font-bold">
                    {typedText.length}/{currentParagraph.length}
                  </p>
                </div>
                <div className="bg-gray-800/50 border border-gray-700/50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs">Words</p>
                  <p className="text-purple-400 font-bold">{playerStats.wordsTyped}</p>
                </div>
                <div className="bg-gray-800/50 border border-gray-700/50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs">Progress</p>
                  <p className="text-blue-400 font-bold">
                    {Math.round((typedText.length / currentParagraph.length) * 100)}%
                  </p>
                </div>
                <div className="bg-gray-800/50 border border-gray-700/50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs">Next MCQ</p>
                  <p className="text-yellow-400 font-bold">
                    {Math.max(
                      WORDS_FOR_MCQ,
                      Math.ceil((playerStats.wordsTyped + 1) / WORDS_FOR_MCQ) *
                        WORDS_FOR_MCQ
                    )}{' '}
                    words
                  </p>
                </div>
              </div>
            </div>

            {/* OPPONENT STATS - 1 COL */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* OPPONENT NAME */}
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-2 border-purple-500/50 p-4 rounded-lg backdrop-blur text-center">
                <p className="text-purple-400 text-xs font-bold uppercase flex items-center gap-2 justify-center">
                  <Crown size={16} /> Opponent
                </p>
                <p className="text-2xl font-black text-purple-300 mt-2 truncate">
                  {opponentName}
                </p>
              </div>

              {/* OPPONENT STATS */}
              {[
                { label: 'WPM', value: opponentStats.wpm || 0, icon: '⚡', color: 'cyan' },
                { label: 'Acc', value: `${opponentStats.accuracy || 0}%`, icon: '🎯', color: 'green' },
                { label: 'MCQs', value: `${opponentStats.correctMCQs || 0}/${opponentStats.totalMCQs || 0}`, icon: '✓', color: 'yellow' },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05, x: 5 }}
                  className={`bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-l-4 border-${stat.color}-500 p-4 rounded-lg backdrop-blur`}
                >
                  <p className={`text-${stat.color}-400 text-xs font-bold uppercase`}>
                    {stat.label}
                  </p>
                  <motion.p
                    key={stat.value}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className={`text-3xl font-black text-${stat.color}-300 mt-2`}
                  >
                    {stat.icon} {stat.value}
                  </motion.p>
                </motion.div>
              ))}

              {/* OPPONENT SCORE */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-pink-600 to-purple-600 border-2 border-pink-400/50 p-4 rounded-lg backdrop-blur"
              >
                <p className="text-pink-200 text-xs font-bold uppercase">Score</p>
                <motion.p
                  key={opponentStats.finalScore}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="text-4xl font-black text-white mt-2"
                >
                  🏆 {opponentStats.finalScore || 0}
                </motion.p>
              </motion.div>

              {/* SCORE DIFF */}
              <div className="bg-gray-800/50 border-2 border-gray-700 p-4 rounded-lg text-center">
                <p className="text-gray-400 text-xs font-bold uppercase">Difference</p>
                <motion.p
                  key={playerStats.finalScore - (opponentStats.finalScore || 0)}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className={`text-2xl font-black mt-2 ${
                    playerStats.finalScore > (opponentStats.finalScore || 0)
                      ? 'text-green-400'
                      : playerStats.finalScore < (opponentStats.finalScore || 0)
                      ? 'text-red-400'
                      : 'text-gray-400'
                  }`}
                >
                  {playerStats.finalScore - (opponentStats.finalScore || 0) > 0 ? '+' : ''}
                  {playerStats.finalScore - (opponentStats.finalScore || 0)}
                </motion.p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* MCQ POPUP */}
        <MCQPopupCustom
          isOpen={showMCQPopup}
          mcq={currentMCQ}
          selectedAnswer={selectedAnswer}
          onAnswer={handleMCQAnswer}
        />
      </div>
    );
  }
  // ============ RENDER RESULTS SCREEN ============
  if (gamePhase === 'results') {
    const opponentFinalScore = opponentStats?.finalScore || 0;
    const playerFinalScore = playerStats?.finalScore || 0;

    let playerWins = false;
    let isTie = false;

    if (winner === 'player1') {
      playerWins = true;
    } else if (winner === 'player2') {
      playerWins = false;
    } else if (winner === 'tie') {
      isTie = true;
    }

    const scoreDiff = Math.abs(playerFinalScore - opponentFinalScore);
    const playerRating = getPerformanceRating(
      playerStats.wpm,
      playerStats.accuracy,
      playerStats.correctMCQs
    );
    const opponentRating = getPerformanceRating(
      opponentStats.wpm || 0,
      opponentStats.accuracy || 0,
      opponentStats.correctMCQs || 0
    );

    console.log('🏁 RESULTS DEBUG:');
    console.log('  Winner:', winner);
    console.log('  Player score:', playerFinalScore);
    console.log('  Opponent score:', opponentFinalScore);
    console.log('  Player wins:', playerWins);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 py-12">
        <Navbar />

        <div className="container mx-auto px-4 max-w-6xl">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6 mb-12"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-9xl inline-block drop-shadow-2xl"
            >
              {playerWins ? '🏆' : isTie ? '🤝' : '⚔️'}
            </motion.div>

            <div>
              <h1
                className={`text-7xl font-black tracking-wider mb-4 ${
                  playerWins
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300'
                    : isTie
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300'
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400'
                }`}
              >
                {playerWins ? 'VICTORY!' : isTie ? "IT'S A TIE!" : 'DEFEAT'}
              </h1>

              <p
                className={`text-3xl font-bold mb-3 ${
                  playerWins
                    ? 'text-yellow-300'
                    : isTie
                    ? 'text-cyan-300'
                    : 'text-orange-300'
                }`}
              >
                {playerWins
                  ? `🔥 You won by ${scoreDiff} points!`
                  : isTie
                  ? `⚖️ Perfectly matched!`
                  : `😔 You lost by ${scoreDiff} points`}
              </p>

              <p className="text-xl text-gray-400">
                {gameMode === 'tournament'
                  ? `${currentRound === 'final' ? 'Grand Final' : 'Semifinal'} - ${
                      playerWins
                        ? `Advancing to ${currentRound === 'semifinal1' || currentRound === 'semifinal2' ? 'Finals' : 'Champion'}`
                        : 'Tournament ends here'
                    }`
                  : `You ${playerFinalScore} vs ${opponentName} ${opponentFinalScore}`}
              </p>
            </div>
          </motion.div>

          {/* STATS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* YOUR STATS */}
            <motion.div
              initial={{ opacity: 0, x: -50, y: 30 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`bg-gradient-to-br ${
                playerWins
                  ? 'from-cyan-950/60 via-blue-950/60 to-cyan-950/40'
                  : 'from-gray-900/60 via-gray-800/60 to-gray-900/40'
              } border-2 ${
                playerWins ? 'border-cyan-500/70' : 'border-gray-600/70'
              } rounded-2xl p-10 backdrop-blur-xl shadow-2xl`}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="text-4xl">👤</div>
                <h2 className={`text-3xl font-black ${playerWins ? 'text-cyan-400' : 'text-gray-400'}`}>
                  Your Stats
                </h2>
              </div>

              <div className="space-y-5">
                {[
                  { label: 'WPM', value: playerStats.wpm, icon: '⚡', unit: '' },
                  { label: 'Accuracy', value: playerStats.accuracy, icon: '🎯', unit: '%' },
                  { label: 'Characters Typed', value: playerStats.totalChars, icon: '📝', unit: '' },
                  {
                    label: 'Total Errors',
                    value: getErrorCount(),
                    icon: '❌',
                    unit: '',
                  },
                  {
                    label: 'MCQs Correct',
                    value: `${playerStats.correctMCQs}/${playerStats.totalMCQs}`,
                    icon: '✓',
                    unit: '',
                  },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="flex items-center justify-between bg-gray-900/70 p-5 rounded-lg border-l-4 border-cyan-500 hover:bg-gray-800/70 transition-all"
                  >
                    <span className="text-gray-300 font-semibold text-lg flex items-center gap-3">
                      <span className="text-2xl">{stat.icon}</span>
                      {stat.label}
                    </span>
                    <span className="text-4xl font-black text-cyan-400">
                      {stat.value}
                      {stat.unit}
                    </span>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.85 }}
                  className={`flex items-center justify-between bg-gradient-to-r ${
                    playerWins ? 'from-cyan-600 to-blue-600' : 'from-gray-700 to-gray-800'
                  } p-7 rounded-xl mt-8 border-2 ${
                    playerWins ? 'border-cyan-400' : 'border-gray-600'
                  } shadow-lg`}
                >
                  <span className="text-white font-bold text-xl">Final Score</span>
                  <span className="text-6xl font-black text-white">{playerStats.finalScore}</span>
                </motion.div>

                <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-lg text-center mt-4">
                  <p className="text-gray-400 text-xs font-bold uppercase">Performance</p>
                  <p className={`text-2xl font-black mt-2 ${getRatingColor(playerRating)}`}>
                    {getTierEmoji(playerRating)} {playerRating}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* OPPONENT STATS */}
            <motion.div
              initial={{ opacity: 0, x: 50, y: 30 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`bg-gradient-to-br ${
                !playerWins && !isTie
                  ? 'from-purple-950/60 via-pink-950/60 to-purple-950/40'
                  : 'from-gray-900/60 via-gray-800/60 to-gray-900/40'
              } border-2 ${
                !playerWins && !isTie ? 'border-purple-500/70' : 'border-gray-600/70'
              } rounded-2xl p-10 backdrop-blur-xl shadow-2xl`}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="text-4xl">👹</div>
                <h2
                  className={`text-3xl font-black ${
                    !playerWins && !isTie ? 'text-purple-400' : 'text-gray-400'
                  }`}
                >
                  {opponentName}
                </h2>
              </div>

              <div className="space-y-5">
                {[
                  { label: 'WPM', value: opponentStats.wpm || 0, icon: '⚡', unit: '' },
                  { label: 'Accuracy', value: opponentStats.accuracy || 0, icon: '🎯', unit: '%' },
                  { label: 'Characters Typed', value: opponentStats.totalChars || 0, icon: '📝', unit: '' },
                  {
                    label: 'Total Errors',
                    value: (opponentStats.totalChars || 0) - (opponentStats.correctChars || 0),
                    icon: '❌',
                    unit: '',
                  },
                  {
                    label: 'MCQs Correct',
                    value: `${opponentStats.correctMCQs || 0}/${opponentStats.totalMCQs || 0}`,
                    icon: '✓',
                    unit: '',
                  },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="flex items-center justify-between bg-gray-900/70 p-5 rounded-lg border-l-4 border-purple-500 hover:bg-gray-800/70 transition-all"
                  >
                    <span className="text-gray-300 font-semibold text-lg flex items-center gap-3">
                      <span className="text-2xl">{stat.icon}</span>
                      {stat.label}
                    </span>
                    <span className="text-4xl font-black text-purple-400">
                      {stat.value}
                      {stat.unit}
                    </span>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.85 }}
                  className={`flex items-center justify-between bg-gradient-to-r ${
                    !playerWins && !isTie
                      ? 'from-purple-600 to-pink-600'
                      : 'from-gray-700 to-gray-800'
                  } p-7 rounded-xl mt-8 border-2 ${
                    !playerWins && !isTie ? 'border-purple-400' : 'border-gray-600'
                  } shadow-lg`}
                >
                  <span className="text-white font-bold text-xl">Final Score</span>
                  <span className="text-6xl font-black text-white">{opponentFinalScore}</span>
                </motion.div>

                <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-lg text-center mt-4">
                  <p className="text-gray-400 text-xs font-bold uppercase">Performance</p>
                  <p className={`text-2xl font-black mt-2 ${getRatingColor(opponentRating)}`}>
                    {getTierEmoji(opponentRating)} {opponentRating}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ACTION BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex justify-center gap-6 flex-wrap"
          >
            {gameMode === 'tournament' && playerWins && currentRound !== 'final' && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  setShowBracket(true);
                  setGamePhase('tournament');
                  setWaitingForOtherSemifinal(true);
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-14 py-5 rounded-xl font-black text-white text-xl shadow-2xl shadow-purple-500/60 transition-all"
              >
                🏆 WAIT FOR FINAL
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                setGamePhase('modeSelect');
                setTypedText('');
                setShowMCQPopup(false);
                mcqTriggeredRef.current.clear();
                setOpponentStats({
                  wpm: 0,
                  accuracy: 0,
                  wordsTyped: 0,
                  correctChars: 0,
                  totalChars: 0,
                  correctMCQs: 0,
                  totalMCQs: 0,
                  finalScore: 0,
                });
                setGameMode(null);
                setTournamentData(null);
                setTournamentPlayers([]);
                setCurrentRound(null);
                setWaitingForOtherSemifinal(false);
              }}
              className="bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 hover:from-cyan-500 hover:via-purple-500 hover:to-pink-500 px-14 py-5 rounded-xl font-black text-white text-xl shadow-2xl shadow-cyan-500/60 transition-all"
            >
              🎮 PLAY AGAIN
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 px-14 py-5 rounded-xl font-black text-white text-xl shadow-lg transition-all"
            >
              🏠 HOME
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
}

// ==================================================================================
// MCQ POPUP COMPONENT (INLINE)
// ==================================================================================

function MCQPopupCustom({ isOpen, mcq, selectedAnswer, onAnswer }) {
  if (!isOpen || !mcq) return null;

  const isAnswered = selectedAnswer !== null;
  const isCorrect = isAnswered && selectedAnswer === mcq.answer;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.7, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.7, y: 50 }}
            className="relative w-full max-w-2xl"
          >
            {/* ANIMATED BORDER */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-70"></div>

            {/* CONTENT */}
            <motion.div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-cyan-500/60 rounded-2xl p-10 shadow-2xl">
              {/* HEADER */}
              <div className="flex items-center gap-3 mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center"
                >
                  <Zap size={28} className="text-white" />
                </motion.div>
                <h2 className="text-3xl font-black text-cyan-300 uppercase tracking-wider">
                  DSA Challenge
                </h2>
              </div>

              {/* QUESTION */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <p className="text-2xl font-bold text-white leading-relaxed">{mcq.q}</p>
              </motion.div>

              {/* OPTIONS */}
              <div className="space-y-4 mb-8">
                {mcq.options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + idx * 0.1 }}
                    onClick={() => !isAnswered && onAnswer(option)}
                    disabled={isAnswered}
                    whileHover={!isAnswered ? { scale: 1.08, x: 20 } : {}}
                    whileTap={!isAnswered ? { scale: 0.92 } : {}}
                    className={`w-full p-6 rounded-xl font-bold text-lg transition-all text-left flex items-center gap-4 border-2 ${
                      selectedAnswer === option
                        ? isCorrect
                          ? 'bg-green-600/60 border-green-500 text-green-200 shadow-lg shadow-green-500/60'
                          : 'bg-red-600/60 border-red-500 text-red-200 shadow-lg shadow-red-500/60'
                        : isAnswered
                        ? 'bg-gray-800/50 border-gray-700 text-gray-500'
                        : 'bg-gray-800/90 border-gray-700 text-gray-100 hover:bg-gray-700/90 hover:border-cyan-500/60 cursor-pointer'
                    }`}
                  >
                    <motion.span
                      initial={{ scale: 0.5, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center flex-shrink-0 text-base font-black bg-gray-900/60"
                    >
                      {String.fromCharCode(65 + idx)}
                    </motion.span>
                    <span className="flex-1">{option}</span>
                    {selectedAnswer === option && (
                      <motion.span
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="text-3xl"
                      >
                        {isCorrect ? '✅' : '❌'}
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* FEEDBACK */}
              <AnimatePresence>
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.8 }}
                    className={`p-7 rounded-xl text-center font-bold text-xl border-2 ${
                      isCorrect
                        ? 'bg-gradient-to-r from-green-900/60 to-emerald-900/60 border-green-500 text-green-200'
                        : 'bg-gradient-to-r from-red-900/60 to-orange-900/60 border-red-500 text-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-4">
                      <span className="text-4xl">{isCorrect ? '🎉' : '😢'}</span>
                      <div>
                        {isCorrect ? (
                          <>
                            <p>🔥 Correct! Amazing!</p>
                            <p className="text-sm">+10 Points!</p>
                          </>
                        ) : (
                          <>
                            <p>Wrong Answer</p>
                            <p className="text-sm">Correct: {mcq.answer}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
    
