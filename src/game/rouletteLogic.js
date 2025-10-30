import { ROUND_TYPES, CHAMBER_CONFIGS, ITEMS } from './rouletteData';

// ==================== CHAMBER GENERATION ====================
export const generateChamber = (difficulty) => {
  const config = CHAMBER_CONFIGS[difficulty];
  const chamber = [];
  
  // Add rounds
  for (let i = 0; i < config.fail; i++) chamber.push(ROUND_TYPES.LIVE);
  for (let i = 0; i < config.critical; i++) chamber.push(ROUND_TYPES.CRITICAL);
  const blanks = config.total - config.fail - config.critical;
  for (let i = 0; i < blanks; i++) chamber.push(ROUND_TYPES.BLANK);
  
  // Fisher-Yates shuffle
  for (let i = chamber.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chamber[i], chamber[j]] = [chamber[j], chamber[i]];
  }
  
  return chamber;
};

// ==================== ITEM GENERATION ====================
export const generateItems = (round, difficulty) => {
  const itemPool = Object.values(ITEMS);
  const count = Math.min(round + 1, 4); // More items each round
  
  const selected = [];
  const availableItems = [...itemPool];
  
  // Higher rounds = better items
  const tierWeights = {
    1: round === 1 ? 0.6 : 0.3,
    2: round === 1 ? 0.3 : 0.4,
    3: round === 1 ? 0.1 : 0.2,
    4: round === 1 ? 0 : 0.1
  };
  
  for (let i = 0; i < count; i++) {
    if (availableItems.length === 0) break;
    
    // Weighted random selection
    const rand = Math.random();
    let sum = 0;
    let selectedTier = 1;
    
    for (const [tier, weight] of Object.entries(tierWeights)) {
      sum += weight;
      if (rand <= sum) {
        selectedTier = parseInt(tier);
        break;
      }
    }
    
    const tierItems = availableItems.filter(item => item.tier === selectedTier);
    if (tierItems.length > 0) {
      const item = tierItems[Math.floor(Math.random() * tierItems.length)];
      selected.push(item);
      const index = availableItems.findIndex(i => i.id === item.id);
      availableItems.splice(index, 1);
    }
  }
  
  return selected;
};

// ==================== AI DECISION MAKING ====================
export const calculateAIMove = (gameState, aiLevel) => {
  const { chamber, currentIndex, playerHP, aiHP, knownInfo, aiItems } = gameState;
  const remaining = chamber.slice(currentIndex);
  
  if (remaining.length === 0) return { action: 'reload' };
  
  // Count remaining rounds
  const blanks = remaining.filter(r => r.id === 'blank').length;
  const lives = remaining.filter(r => r.id === 'live').length;
  const criticals = remaining.filter(r => r.id === 'critical').length;
  const total = remaining.length;
  
  // Calculate probabilities
  const blankProb = blanks / total;
  const liveProb = (lives + criticals) / total;
  
  // Check if next is known
  const nextKnown = knownInfo.find(k => k.index === currentIndex);
  
  // Strategic item use
  if (Math.random() < aiLevel.itemUseChance && aiItems.length > 0) {
    // Use information items when uncertain
    if (liveProb > 0.4 && !nextKnown) {
      const infoItems = aiItems.filter(i => 
        ['binarySearch', 'magnifyingGlass', 'hashTable'].includes(i.id)
      );
      if (infoItems.length > 0) {
        return { action: 'useItem', item: infoItems[0] };
      }
    }
    
    // Use manipulation items strategically
    if (liveProb > 0.6) {
      const manipItems = aiItems.filter(i => 
        ['bubbleSort', 'quickSort', 'quantumState'].includes(i.id)
      );
      if (manipItems.length > 0) {
        return { action: 'useItem', item: manipItems[0] };
      }
    }
  }
  
  // Shoot self if confident it's blank
  const threshold = 0.5 + (aiLevel.deductionAccuracy * 0.3);
  
  if (nextKnown) {
    if (nextKnown.type === 'blank') {
      return { action: 'shootSelf' };
    } else {
      return { action: 'shootOpponent' };
    }
  }
  
  if (blankProb > threshold) {
    return { action: 'shootSelf' };
  } else {
    return { action: 'shootOpponent' };
  }
};

// ==================== ITEM EFFECTS ====================
export const applyItemEffect = (item, gameState) => {
  const { chamber, currentIndex } = gameState;
  let newState = { ...gameState };
  let message = '';
  
  switch (item.id) {
    case 'magnifyingGlass':
      if (currentIndex < chamber.length) {
        const next = chamber[currentIndex];
        newState.knownInfo = [...newState.knownInfo, { index: currentIndex, type: next.id }];
        newState.revealedNext = true;
        message = `🔍 Next: ${next.name} test case`;
      }
      break;
      
    case 'healthKit':
      newState.playerHP = Math.min(4, newState.playerHP + 1);
      message = `💊 Restored 1 HP`;
      break;
      
    case 'binarySearch':
      const remaining = chamber.slice(currentIndex);
      const half = Math.floor(remaining.length / 2);
      const firstHalf = remaining.slice(0, half);
      const secondHalf = remaining.slice(half);
      const firstFails = firstHalf.filter(r => r.id !== 'blank').length;
      const secondFails = secondHalf.filter(r => r.id !== 'blank').length;
      
      if (firstFails > secondFails) {
        message = `🔎 Binary Search: More FAILs in FIRST half`;
      } else if (secondFails > firstFails) {
        message = `🔎 Binary Search: More FAILs in SECOND half`;
      } else {
        message = `🔎 Binary Search: FAILs evenly distributed`;
      }
      break;
      
    case 'bubbleSort':
      if (currentIndex + 1 < chamber.length) {
        const newChamber = [...chamber];
        [newChamber[currentIndex], newChamber[currentIndex + 1]] = 
        [newChamber[currentIndex + 1], newChamber[currentIndex]];
        newState.chamber = newChamber;
        message = `🔄 Bubble Sort: Swapped next two test cases`;
      }
      break;
      
    case 'quickSort':
      const remainingForSort = chamber.slice(currentIndex);
      const blanksFirst = remainingForSort.filter(r => r.id === 'blank');
      const failsFirst = remainingForSort.filter(r => r.id !== 'blank');
      const sorted = [...blanksFirst, ...failsFirst];
      newState.chamber = [...chamber.slice(0, currentIndex), ...sorted];
      message = `⚡ QuickSort: All PASSes moved to front`;
      break;
      
    case 'hashTable':
      const allKnown = chamber.map((round, idx) => ({ index: idx, type: round.id }));
      newState.knownInfo = allKnown;
      message = `🧠 Hash Table: All test cases revealed`;
      break;
      
    case 'quantumState':
      if (currentIndex < chamber.length) {
        const newChamberQuantum = [...chamber];
        newChamberQuantum[currentIndex] = ROUND_TYPES.BLANK;
        newState.chamber = newChamberQuantum;
        message = `✨ Quantum Flip: Next test forced to PASS`;
      }
      break;
      
    case 'skipTurn':
      newState.forceAISelfShoot = true;
      message = `🎯 Force Shoot: AI must shoot itself`;
      break;
  }
  
  return { newState, message };
};
