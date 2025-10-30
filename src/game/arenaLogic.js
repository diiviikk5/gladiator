import { ALGORITHM_MOVES, DEFENSIVE_MOVES, AI_OPPONENTS, REWARDS } from './arenaData';

// ==================== QTE VALIDATION ====================

/**
 * Calculate timing result based on position in timing window
 * @param {number} position - Current position (0-100)
 * @param {object} zones - Timing zones {perfect, great, good}
 * @returns {string} - 'PERFECT', 'GREAT', 'GOOD', or 'MISS'
 */
export const calculateTimingResult = (position, zones) => {
  const { perfect, great, good } = zones;
  
  if (position >= perfect[0] && position <= perfect[1]) {
    return 'PERFECT';
  } else if (position >= great[0] && position <= great[1]) {
    return 'GREAT';
  } else if (position >= good[0] && position <= good[1]) {
    return 'GOOD';
  }
  return 'MISS';
};

/**
 * Calculate multi-stage timing result
 * @param {array} stageResults - Array of timing results for each stage
 * @returns {string} - Overall result
 */
export const calculateMultiStageResult = (stageResults) => {
  if (stageResults.every(r => r === 'PERFECT')) return 'PERFECT';
  if (stageResults.every(r => r === 'PERFECT' || r === 'GREAT')) return 'GREAT';
  if (stageResults.some(r => r === 'MISS')) return 'MISS';
  return 'GOOD';
};

// ==================== DAMAGE CALCULATIONS ====================

/**
 * Calculate final damage with all modifiers
 * @param {object} move - The move being used
 * @param {string} timingResult - Timing result (PERFECT/GREAT/GOOD/MISS)
 * @param {object} attacker - Attacker stats
 * @param {object} defender - Defender stats
 * @returns {number} - Final damage
 */
export const calculateDamage = (move, timingResult, attacker, defender) => {
  let damage = move.baseDamage;
  
  // Apply timing multiplier
  const timingMultiplier = move.timing.multipliers[timingResult] || 1.0;
  damage *= timingMultiplier;
  
  // Random variance (±10%)
  const variance = 0.9 + Math.random() * 0.2;
  damage *= variance;
  
  // Level scaling
  const levelBonus = 1 + (attacker.level * 0.05);
  damage *= levelBonus;
  
  // Defense reduction
  const defenseReduction = Math.max(0, 1 - (defender.defense || 0));
  damage *= defenseReduction;
  
  return Math.round(damage);
};

/**
 * Calculate defensive block amount
 * @param {object} move - Defensive move
 * @param {string} timingResult - Timing result
 * @param {number} incomingDamage - Damage to block
 * @returns {number} - Damage blocked
 */
export const calculateBlock = (move, timingResult, incomingDamage) => {
  const blockMultiplier = move.timing.multipliers[timingResult] || 0.2;
  const blockedAmount = Math.round(incomingDamage * blockMultiplier);
  return Math.min(blockedAmount, incomingDamage);
};

/**
 * Calculate counter damage
 * @param {object} move - Counter move
 * @param {string} timingResult - Timing result
 * @param {number} incomingDamage - Original attack damage
 * @returns {number} - Counter damage
 */
export const calculateCounter = (move, timingResult, incomingDamage) => {
  const counterMultiplier = move.timing.multipliers[timingResult] || 0.3;
  return Math.round(incomingDamage * counterMultiplier);
};

// ==================== AI DECISION MAKING ====================

/**
 * AI selects best move based on strategy and game state
 * @param {object} aiOpponent - AI opponent data
 * @param {object} gameState - Current game state
 * @returns {object} - Selected move
 */
export const selectAIMove = (aiOpponent, gameState) => {
  const { playerHP, aiHP, aiEnergy, turn } = gameState;
  const availableMoves = aiOpponent.moves
    .map(moveId => ALGORITHM_MOVES[moveId] || DEFENSIVE_MOVES[moveId])
    .filter(move => move && aiEnergy >= move.energy);
  
  if (availableMoves.length === 0) {
    return null; // No valid moves
  }
  
  // Strategy-based selection
  const strategy = aiOpponent.strategy;
  
  // CRITICAL SITUATION: Low HP, prioritize defense or ultimate
  if (aiHP < aiOpponent.maxHP * 0.3) {
    const defensiveMoves = availableMoves.filter(m => m.type === 'defensive');
    if (defensiveMoves.length > 0 && Math.random() > 0.3) {
      return selectRandomMove(defensiveMoves);
    }
  }
  
  // FINISHING MOVE: Player low HP, use ultimate if available
  if (playerHP < 50) {
    const ultimateMoves = availableMoves.filter(m => m.type === 'ultimate');
    if (ultimateMoves.length > 0 && Math.random() < 0.7) {
      return selectRandomMove(ultimateMoves);
    }
  }
  
  // PERFECT STRATEGY: Always optimal (THE ALGORITHM)
  if (strategy === 'perfect') {
    return selectOptimalMove(availableMoves, gameState);
  }
  
  // TACTICAL STRATEGY: Smart decisions
  if (strategy === 'tactical') {
    const rand = Math.random();
    if (rand < 0.15) {
      return selectOptimalMove(availableMoves, gameState);
    }
  }
  
  // Default: Use move selection weights
  const weights = aiOpponent.moveSelection;
  const rand = Math.random();
  
  if (rand < weights.offensive) {
    const offensiveMoves = availableMoves.filter(m => m.type === 'offensive');
    return selectRandomMove(offensiveMoves.length > 0 ? offensiveMoves : availableMoves);
  } else if (rand < weights.offensive + weights.defensive) {
    const defensiveMoves = availableMoves.filter(m => m.type === 'defensive');
    return selectRandomMove(defensiveMoves.length > 0 ? defensiveMoves : availableMoves);
  } else if (rand < weights.offensive + weights.defensive + weights.ultimate) {
    const ultimateMoves = availableMoves.filter(m => m.type === 'ultimate');
    return selectRandomMove(ultimateMoves.length > 0 ? ultimateMoves : availableMoves);
  }
  
  return selectRandomMove(availableMoves);
};

/**
 * Select optimal move based on damage/energy ratio
 */
const selectOptimalMove = (moves, gameState) => {
  const scored = moves.map(move => ({
    move,
    score: (move.baseDamage || 0) / (move.energy || 1)
  }));
  
  scored.sort((a, b) => b.score - a.score);
  return scored[0].move;
};

/**
 * Select random move from array
 */
const selectRandomMove = (moves) => {
  if (!moves || moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
};

/**
 * Simulate AI timing execution
 * @param {object} aiOpponent - AI opponent
 * @param {object} move - Move being used
 * @returns {string} - Timing result
 */
export const simulateAITiming = (aiOpponent, move) => {
  const accuracy = aiOpponent.timingAccuracy;
  const rand = Math.random();
  
  // Multi-stage moves are harder
  if (move.timing.multiStage) {
    if (rand < accuracy * 0.6) return 'PERFECT';
    if (rand < accuracy * 0.85) return 'GREAT';
    if (rand < accuracy * 0.95) return 'GOOD';
    return 'MISS';
  }
  
  // Single-stage timing
  if (rand < accuracy) return 'PERFECT';
  if (rand < accuracy + 0.2) return 'GREAT';
  if (rand < accuracy + 0.35) return 'GOOD';
  return 'MISS';
};

// ==================== ENERGY MANAGEMENT ====================

/**
 * Check if player has enough energy for move
 */
export const canUseMove = (move, currentEnergy) => {
  return currentEnergy >= move.energy;
};

/**
 * Regenerate energy per turn
 */
export const regenerateEnergy = (currentEnergy, maxEnergy, baseRegen = 25) => {
  return Math.min(currentEnergy + baseRegen, maxEnergy);
};

/**
 * Consume energy for move
 */
export const consumeEnergy = (currentEnergy, move) => {
  return Math.max(0, currentEnergy - move.energy);
};

// ==================== COOLDOWN MANAGEMENT ====================

/**
 * Check if move is on cooldown
 */
export const isOnCooldown = (moveId, cooldowns) => {
  return cooldowns[moveId] && cooldowns[moveId] > 0;
};

/**
 * Reduce all cooldowns by 1
 */
export const tickCooldowns = (cooldowns) => {
  const updated = {};
  Object.keys(cooldowns).forEach(key => {
    updated[key] = Math.max(0, cooldowns[key] - 1);
  });
  return updated;
};

/**
 * Set cooldown for a move
 */
export const setCooldown = (moveId, move, cooldowns) => {
  return {
    ...cooldowns,
    [moveId]: move.cooldown
  };
};

// ==================== BATTLE STATE ====================

/**
 * Check if battle is over
 */
export const isBattleOver = (playerHP, aiHP) => {
  return playerHP <= 0 || aiHP <= 0;
};

/**
 * Calculate battle result
 */
export const calculateBattleResult = (playerHP, aiHP, opponent, totalTime, perfectHits) => {
  const victory = playerHP > 0 && aiHP <= 0;
  
  let xpGained = opponent.rewards.xp;
  let coinsGained = opponent.rewards.coins;
  
  if (victory) {
    // Perfect timing bonuses
    xpGained += perfectHits * REWARDS.xpPerPerfectTiming;
    
    // Speed bonus
    if (totalTime < 60000) { // Under 60 seconds
      xpGained = Math.round(xpGained * 1.5);
      coinsGained = Math.round(coinsGained * 1.5);
    }
    
    // No damage bonus
    if (playerHP === 100) {
      xpGained = Math.round(xpGained * 2);
      coinsGained = Math.round(coinsGained * 2);
    }
  }
  
  return {
    victory,
    xpGained: victory ? xpGained : Math.round(xpGained * 0.3),
    coinsGained: victory ? coinsGained : Math.round(coinsGained * 0.3),
    perfectHits,
    totalTime,
    unlocks: victory ? opponent.rewards.unlocks : []
  };
};

// ==================== COMBO SYSTEM ====================

/**
 * Calculate combo multiplier
 */
export const calculateComboMultiplier = (comboCount) => {
  if (comboCount >= 10) return 2.0;
  if (comboCount >= 7) return 1.7;
  if (comboCount >= 5) return 1.5;
  if (comboCount >= 3) return 1.3;
  return 1.0;
};

/**
 * Reset combo on miss
 */
export const shouldResetCombo = (timingResult) => {
  return timingResult === 'MISS';
};

// ==================== STATUS EFFECTS ====================

export const STATUS_EFFECTS = {
  BLEEDING: {
    id: 'BLEEDING',
    name: 'Bleeding',
    damagePerTurn: 5,
    duration: 3,
    description: 'Taking damage over time'
  },
  STUNNED: {
    id: 'STUNNED',
    name: 'Stunned',
    skipTurn: true,
    duration: 1,
    description: 'Cannot act next turn'
  },
  BUFFED: {
    id: 'BUFFED',
    name: 'Buffed',
    damageMultiplier: 1.5,
    duration: 2,
    description: 'Increased damage output'
  }
};

/**
 * Apply status effect damage/effects
 */
export const processStatusEffects = (statusEffects, hp) => {
  let damage = 0;
  const updated = [];
  
  statusEffects.forEach(effect => {
    if (effect.damagePerTurn) {
      damage += effect.damagePerTurn;
    }
    
    if (effect.duration > 1) {
      updated.push({ ...effect, duration: effect.duration - 1 });
    }
  });
  
  return {
    newHP: Math.max(0, hp - damage),
    statusEffects: updated,
    damageDealt: damage
  };
};

// ==================== EXPORTS ====================

export default {
  calculateTimingResult,
  calculateMultiStageResult,
  calculateDamage,
  calculateBlock,
  calculateCounter,
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
  shouldResetCombo,
  processStatusEffects
};
