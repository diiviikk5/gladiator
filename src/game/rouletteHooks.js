import { useState, useCallback, useEffect } from 'react';
import { generateChamber, generateItems, calculateAIMove, applyItemEffect } from './rouletteLogic';
import { AI_LEVELS } from './rouletteData';

export const useRouletteGame = () => {
  // Core game state
  const [gamePhase, setGamePhase] = useState('menu');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [round, setRound] = useState(1);
  const [chamber, setChamber] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playerHP, setPlayerHP] = useState(4);
  const [aiHP, setAIHP] = useState(4);
  const [playerItems, setPlayerItems] = useState([]);
  const [aiItems, setAIItems] = useState([]);
  const [turn, setTurn] = useState('player');
  const [knownInfo, setKnownInfo] = useState([]);
  const [revealedNext, setRevealedNext] = useState(false);
  const [gameLog, setGameLog] = useState([]);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  
  // Animation states
  const [shootingAnimation, setShootingAnimation] = useState(false);
  const [targetSelf, setTargetSelf] = useState(false);
  const [damageFlash, setDamageFlash] = useState(null);
  const [itemAnimation, setItemAnimation] = useState(null);

  // Add log message
  const addLog = useCallback((message) => {
    setGameLog(prev => [...prev.slice(-4), message]);
  }, []);

  // Start new round
  const startRound = useCallback(() => {
    const newChamber = generateChamber(difficulty);
    setChamber(newChamber);
    setCurrentIndex(0);
    setPlayerItems(generateItems(round, difficulty));
    setAIItems(generateItems(round, difficulty));
    setKnownInfo([]);
    setRevealedNext(false);
    setGameLog([`Round ${round} - Chamber loaded with ${newChamber.length} test cases`]);
    setGamePhase('roundStart');
    
    setTimeout(() => setGamePhase('playing'), 2000);
  }, [difficulty, round]);

  // Start game
  const startGame = useCallback((selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setRound(1);
    setPlayerHP(4);
    setAIHP(AI_LEVELS[selectedDifficulty].hp);
    setWins(0);
    setLosses(0);
    startRound();
  }, [startRound]);

  // Use item
  const useItem = useCallback((item) => {
    if (gamePhase !== 'playing' || turn !== 'player') return;
    
    setItemAnimation(item);
    setGamePhase('itemUse');
    
    setTimeout(() => {
      const { newState, message } = applyItemEffect(item, {
        chamber,
        currentIndex,
        playerHP,
        knownInfo,
        revealedNext
      });
      
      setChamber(newState.chamber || chamber);
      setKnownInfo(newState.knownInfo || knownInfo);
      setRevealedNext(newState.revealedNext || revealedNext);
      setPlayerHP(newState.playerHP || playerHP);
      addLog(message);
      
      setPlayerItems(prev => prev.filter(i => i.id !== item.id));
      setItemAnimation(null);
      setGamePhase('playing');
    }, 800);
    
  }, [gamePhase, turn, chamber, currentIndex, playerHP, knownInfo, revealedNext, addLog]);

  // Shoot action
  const shoot = useCallback((target) => {
    if (gamePhase !== 'playing' || turn !== 'player') return;
    
    setShootingAnimation(true);
    setTargetSelf(target === 'self');
    setGamePhase('shooting');
    
    setTimeout(() => {
      const currentRound = chamber[currentIndex];
      const isBlank = currentRound.id === 'blank';
      const damage = currentRound.damage;
      
      if (target === 'self') {
        if (isBlank) {
          addLog(`✓ Test PASSED - You get another turn`);
          setCurrentIndex(prev => prev + 1);
          setRevealedNext(false);
        } else {
          setPlayerHP(prev => Math.max(0, prev - damage));
          setDamageFlash('player');
          addLog(`✗ Test FAILED - You take ${damage} damage`);
          setCurrentIndex(prev => prev + 1);
          setTurn('ai');
          setRevealedNext(false);
          setTimeout(() => setDamageFlash(null), 500);
        }
      } else {
        if (!isBlank) {
          setAIHP(prev => Math.max(0, prev - damage));
          setDamageFlash('ai');
          addLog(`✗ AI takes ${damage} damage`);
          setTimeout(() => setDamageFlash(null), 500);
        } else {
          addLog(`✓ Test PASSED - No damage dealt`);
        }
        setCurrentIndex(prev => prev + 1);
        setTurn('ai');
        setRevealedNext(false);
      }
      
      setShootingAnimation(false);
      setTimeout(() => setGamePhase('playing'), 1000);
      
    }, 1500);
    
  }, [gamePhase, turn, chamber, currentIndex, addLog]);

  // AI Turn
  useEffect(() => {
    if (gamePhase !== 'playing' || turn !== 'ai' || currentIndex >= chamber.length) return;
    
    const aiLevel = AI_LEVELS[difficulty];
    
    setTimeout(() => {
      const decision = calculateAIMove({
        chamber,
        currentIndex,
        playerHP,
        aiHP,
        knownInfo,
        aiItems
      }, aiLevel);
      
      if (decision.action === 'useItem') {
        addLog(`🤖 AI uses ${decision.item.name}`);
        setAIItems(prev => prev.filter(i => i.id !== decision.item.id));
        setTimeout(() => executeAIShoot(), 1000);
      } else {
        executeAIShoot();
      }
    }, 1500);
    
  }, [gamePhase, turn, currentIndex, chamber.length]);

  const executeAIShoot = useCallback(() => {
    const currentRound = chamber[currentIndex];
    const isBlank = currentRound.id === 'blank';
    const damage = currentRound.damage;
    
    const shouldShootSelf = Math.random() > 0.5 && isBlank;
    
    setShootingAnimation(true);
    setTargetSelf(shouldShootSelf);
    
    setTimeout(() => {
      if (shouldShootSelf) {
        if (isBlank) {
          addLog(`🤖 AI shoots self - Test PASSED - AI continues`);
          setCurrentIndex(prev => prev + 1);
        } else {
          setAIHP(prev => Math.max(0, prev - damage));
          setDamageFlash('ai');
          addLog(`🤖 AI shoots self - Test FAILED - ${damage} damage`);
          setCurrentIndex(prev => prev + 1);
          setTurn('player');
          setTimeout(() => setDamageFlash(null), 500);
        }
      } else {
        if (!isBlank) {
          setPlayerHP(prev => Math.max(0, prev - damage));
          setDamageFlash('player');
          addLog(`🤖 AI shoots you - Test FAILED - You take ${damage} damage`);
          setTimeout(() => setDamageFlash(null), 500);
        } else {
          addLog(`🤖 AI shoots you - Test PASSED - No damage`);
        }
        setCurrentIndex(prev => prev + 1);
        setTurn('player');
      }
      
      setShootingAnimation(false);
    }, 1500);
    
  }, [chamber, currentIndex, addLog]);

  // Check round/game end
  useEffect(() => {
    if (currentIndex >= chamber.length && chamber.length > 0 && gamePhase === 'playing') {
      setTimeout(() => {
        if (playerHP > 0 && aiHP > 0) {
          setRound(prev => prev + 1);
          startRound();
        }
      }, 2000);
    }
    
    if (playerHP <= 0 && gamePhase === 'playing') {
      setLosses(prev => prev + 1);
      setGamePhase('gameOver');
      addLog(`💀 GAME OVER - AI WINS`);
    } else if (aiHP <= 0 && gamePhase === 'playing') {
      setWins(prev => prev + 1);
      setGamePhase('gameOver');
      addLog(`🏆 VICTORY - YOU WIN`);
    }
  }, [currentIndex, chamber.length, playerHP, aiHP, gamePhase, startRound, addLog]);

  return {
    // State
    gamePhase,
    difficulty,
    round,
    chamber,
    currentIndex,
    playerHP,
    aiHP,
    playerItems,
    aiItems,
    turn,
    knownInfo,
    revealedNext,
    gameLog,
    wins,
    losses,
    shootingAnimation,
    targetSelf,
    damageFlash,
    itemAnimation,
    
    // Actions
    startGame,
    shoot,
    useItem,
    setGamePhase,
    setRound
  };
};
