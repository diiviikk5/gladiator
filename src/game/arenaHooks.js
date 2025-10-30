import { useState, useEffect, useCallback, useRef } from 'react';
import { ALGORITHM_MOVES, DEFENSIVE_MOVES, AI_OPPONENTS } from './arenaData';
import {
  calculateDamage,
  selectAIMove,
  simulateAITiming,
  canUseMove,
  regenerateEnergy,
  consumeEnergy,
  isOnCooldown,
  tickCooldowns,
  setCooldown,
  isBattleOver,
  calculateBattleResult,
  calculateComboMultiplier,
  shouldResetCombo
} from './arenaLogic';

export const useArenaBattle = () => {
  // ==================== STATE ====================
  const [gamePhase, setGamePhase] = useState('menu');
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [playerHP, setPlayerHP] = useState(100);
  const [playerMaxHP] = useState(100);
  const [playerEnergy, setPlayerEnergy] = useState(100);
  const [playerMaxEnergy] = useState(100);
  const [playerMoves] = useState(['binarySearch', 'quickSort', 'hashTable', 'stackBlock']);
  const [playerCooldowns, setPlayerCooldowns] = useState({});
  const [aiHP, setAiHP] = useState(100);
  const [aiMaxHP, setAiMaxHP] = useState(100);
  const [aiEnergy, setAiEnergy] = useState(100);
  const [aiMaxEnergy, setAiMaxEnergy] = useState(100);
  const [aiCooldowns, setAiCooldowns] = useState({});
  const [turn, setTurn] = useState('player');
  const [selectedMove, setSelectedMove] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [comboCount, setComboCount] = useState(0);
  const [perfectHits, setPerfectHits] = useState(0);
  const [battleStartTime, setBattleStartTime] = useState(null);
  const [qteActive, setQteActive] = useState(false);
  const [qtePosition, setQtePosition] = useState(0);
  const [qteDirection, setQteDirection] = useState(1);
  const [qteStage, setQteStage] = useState(0);
  const [qteResults, setQteResults] = useState([]);
  const [showTimingFeedback, setShowTimingFeedback] = useState(null);
  const [damageAnimation, setDamageAnimation] = useState(null);
  const [hitEffect, setHitEffect] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const qteIntervalRef = useRef(null);

  // ==================== HELPER FUNCTIONS (DEFINE FIRST) ====================
  
  const addLog = (message) => {
    setBattleLog(prev => [...prev.slice(-4), message]);
  };

  const calculateTimingResult = (position, zones) => {
    const { perfect, great, good } = zones;
    if (position >= perfect[0] && position <= perfect[1]) return 'PERFECT';
    if (position >= great[0] && position <= great[1]) return 'GREAT';
    if (position >= good[0] && position <= good[1]) return 'GOOD';
    return 'MISS';
  };

  const calculateMultiStageResult = (results) => {
    if (results.every(r => r === 'PERFECT')) return 'PERFECT';
    if (results.every(r => r === 'PERFECT' || r === 'GREAT')) return 'GREAT';
    if (results.some(r => r === 'MISS')) return 'MISS';
    return 'GOOD';
  };

  // ==================== BATTLE MANAGEMENT ====================
  
  const startBattle = useCallback((opponentId) => {
    const opponent = AI_OPPONENTS[opponentId];
    if (!opponent) return;
    
    setSelectedOpponent(opponent);
    setPlayerHP(playerMaxHP);
    setPlayerEnergy(playerMaxEnergy);
    setAiHP(opponent.maxHP);
    setAiMaxHP(opponent.maxHP);
    setAiEnergy(opponent.maxEnergy);
    setAiMaxEnergy(opponent.maxEnergy);
    setPlayerCooldowns({});
    setAiCooldowns({});
    setTurn('player');
    setBattleLog([`Battle started against ${opponent.name}!`]);
    setComboCount(0);
    setPerfectHits(0);
    setBattleStartTime(Date.now());
    setGamePhase('battle');
  }, [playerMaxHP, playerMaxEnergy]);

  const endBattle = useCallback(() => {
    if (!selectedOpponent || !battleStartTime) return;
    
    const totalTime = Date.now() - battleStartTime;
    const result = calculateBattleResult(playerHP, aiHP, selectedOpponent, totalTime, perfectHits);
    
    setGamePhase(result.victory ? 'victory' : 'defeat');
    
    addLog(result.victory ? 
      `🏆 VICTORY! +${result.xpGained} XP` :
      `💀 DEFEAT. +${result.xpGained} XP`
    );
  }, [playerHP, aiHP, selectedOpponent, battleStartTime, perfectHits]);

  const returnToMenu = useCallback(() => {
    setGamePhase('menu');
    setSelectedOpponent(null);
  }, []);

  // ==================== TURN MANAGEMENT ====================
  
  const endPlayerTurn = useCallback(() => {
    setPlayerEnergy(prev => regenerateEnergy(prev, playerMaxEnergy));
    setPlayerCooldowns(prev => tickCooldowns(prev));
    
    if (isBattleOver(playerHP, aiHP)) {
      endBattle();
      return;
    }
    
    setTurn('ai');
  }, [playerHP, aiHP, playerMaxEnergy, endBattle]);

  const endAITurn = useCallback(() => {
    setAiEnergy(prev => regenerateEnergy(prev, aiMaxEnergy));
    setAiCooldowns(prev => tickCooldowns(prev));
    
    if (isBattleOver(playerHP, aiHP)) {
      endBattle();
      return;
    }
    
    setTurn('player');
  }, [playerHP, aiHP, aiMaxEnergy, endBattle]);

  // ==================== MOVE EXECUTION ====================
  
  const executeMove = useCallback((move, timingResult) => {
    setIsAnimating(true);
    
    if (move.type === 'offensive') {
      const damage = calculateDamage(move, timingResult, { level: 1 }, { defense: 0 });
      const comboMult = calculateComboMultiplier(comboCount);
      const finalDamage = Math.round(damage * comboMult);
      
      setAiHP(prev => Math.max(0, prev - finalDamage));
      setDamageAnimation({ target: 'ai', damage: finalDamage, timing: timingResult });
      setHitEffect({ type: 'hit', color: move.color });
      
      addLog(`💥 ${move.name}: ${finalDamage} damage (${timingResult})`);
      
      if (timingResult === 'PERFECT') {
        setPerfectHits(prev => prev + 1);
        setComboCount(prev => prev + 1);
      } else if (shouldResetCombo(timingResult)) {
        setComboCount(0);
      }
    } else if (move.type === 'defensive') {
      addLog(`🛡️ ${move.name} ready!`);
    }
    
    setPlayerEnergy(prev => consumeEnergy(prev, move));
    setPlayerCooldowns(prev => setCooldown(move.id, move, prev));
    
    setTimeout(() => {
      setDamageAnimation(null);
      setHitEffect(null);
      setIsAnimating(false);
      setSelectedMove(null);
      endPlayerTurn();
    }, 1500);
  }, [comboCount, endPlayerTurn]);

  // ==================== QTE SYSTEM ====================
  
  const startQTE = useCallback((move) => {
    setQteActive(true);
    setQtePosition(0);
    setQteDirection(1);
    setQteStage(0);
    setQteResults([]);
    setGamePhase('qte');
    
    const speed = move.timing.difficulty === 'extreme' ? 0.8 :
                  move.timing.difficulty === 'hard' ? 1.0 :
                  move.timing.difficulty === 'medium' ? 1.2 : 1.5;
    
    qteIntervalRef.current = setInterval(() => {
      setQtePosition(prev => {
        let next = prev + (qteDirection * speed);
        if (next >= 100) {
          setQteDirection(-1);
          return 100;
        } else if (next <= 0) {
          setQteDirection(1);
          return 0;
        }
        return next;
      });
    }, 16);
  }, [qteDirection]);

  const handleQTEClick = useCallback(() => {
    if (!qteActive || !selectedMove) return;
    
    const move = selectedMove;
    
    if (move.timing.multiStage) {
      const currentStage = move.timing.stages[qteStage];
      const result = calculateTimingResult(qtePosition, currentStage.zones);
      
      setQteResults(prev => [...prev, result]);
      setShowTimingFeedback(result);
      setTimeout(() => setShowTimingFeedback(null), 500);
      
      if (qteStage < move.timing.stages.length - 1) {
        setQteStage(prev => prev + 1);
        setQtePosition(0);
        setQteDirection(1);
      } else {
        clearInterval(qteIntervalRef.current);
        const finalResult = calculateMultiStageResult([...qteResults, result]);
        setTimeout(() => {
          setQteActive(false);
          setGamePhase('battle');
          executeMove(move, finalResult);
        }, 600);
      }
    } else {
      const result = calculateTimingResult(qtePosition, move.timing.zones);
      setShowTimingFeedback(result);
      clearInterval(qteIntervalRef.current);
      setTimeout(() => {
        setShowTimingFeedback(null);
        setQteActive(false);
        setGamePhase('battle');
        executeMove(move, result);
      }, 600);
    }
  }, [qteActive, selectedMove, qtePosition, qteStage, qteResults, executeMove]);

  // ==================== PLAYER ACTIONS ====================
  
  const selectPlayerMove = useCallback((moveId) => {
    if (turn !== 'player' || isAnimating || qteActive) return;
    
    const move = ALGORITHM_MOVES[moveId] || DEFENSIVE_MOVES[moveId];
    if (!move) return;
    
    if (!canUseMove(move, playerEnergy)) {
      addLog('❌ Not enough energy!');
      return;
    }
    
    if (isOnCooldown(moveId, playerCooldowns)) {
      addLog(`❌ ${move.name} on cooldown!`);
      return;
    }
    
    setSelectedMove(move);
    
    if (move.timing.enabled) {
      startQTE(move);
    } else {
      executeMove(move, 'PERFECT');
    }
  }, [turn, isAnimating, qteActive, playerEnergy, playerCooldowns, startQTE, executeMove]);

  // ==================== AI TURN ====================
  
  useEffect(() => {
    if (turn !== 'ai' || !selectedOpponent || isAnimating || gamePhase !== 'battle') return;
    
    const timer = setTimeout(() => {
      const aiMove = selectAIMove(selectedOpponent, { playerHP, aiHP, aiEnergy, turn });
      
      if (!aiMove) {
        endAITurn();
        return;
      }
      
      setIsAnimating(true);
      addLog(`🤖 ${selectedOpponent.name} uses ${aiMove.name}!`);
      
      const timingResult = simulateAITiming(selectedOpponent, aiMove);
      
      setTimeout(() => {
        if (aiMove.type === 'offensive') {
          const damage = calculateDamage(aiMove, timingResult, { level: selectedOpponent.level }, { defense: 0 });
          setPlayerHP(prev => Math.max(0, prev - damage));
          setDamageAnimation({ target: 'player', damage, timing: timingResult });
          setHitEffect({ type: 'hit', color: aiMove.color });
          addLog(`💥 AI deals ${damage} damage (${timingResult})`);
        }
        
        setAiEnergy(prev => consumeEnergy(prev, aiMove));
        setAiCooldowns(prev => setCooldown(aiMove.id, aiMove, prev));
        
        setTimeout(() => {
          setDamageAnimation(null);
          setHitEffect(null);
          setIsAnimating(false);
          endAITurn();
        }, 1500);
      }, 1000);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [turn, selectedOpponent, isAnimating, gamePhase, playerHP, aiHP, aiEnergy, endAITurn]);

  // ==================== CLEANUP ====================
  
  useEffect(() => {
    return () => {
      if (qteIntervalRef.current) clearInterval(qteIntervalRef.current);
    };
  }, []);

  // ==================== RETURN ====================
  
  return {
    gamePhase,
    selectedOpponent,
    playerHP,
    playerMaxHP,
    playerEnergy,
    playerMaxEnergy,
    playerMoves,
    playerCooldowns,
    aiHP,
    aiMaxHP,
    aiEnergy,
    aiMaxEnergy,
    aiCooldowns,
    turn,
    selectedMove,
    battleLog,
    comboCount,
    perfectHits,
    qteActive,
    qtePosition,
    qteStage,
    qteResults,
    showTimingFeedback,
    damageAnimation,
    hitEffect,
    isAnimating,
    startBattle,
    selectPlayerMove,
    handleQTEClick,
    returnToMenu,
    availableOpponents: Object.values(AI_OPPONENTS),
    moveDatabase: { ...ALGORITHM_MOVES, ...DEFENSIVE_MOVES }
  };
};

export default useArenaBattle;
