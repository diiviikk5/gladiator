import { create } from 'zustand';

export const useBattleStore = create((set, get) => ({
  // Game State
  gamePhase: 'draft', // draft, action-select, resolve, result
  turn: 1,
  timeLeft: 0,
  
  // Draft
  draftPool: [],
  playerTeam: [],
  opponentTeam: [],
  draftTurn: 'player',
  
  // Battle
  playerActive: null,
  opponentActive: null,
  playerAction: null,
  opponentAction: null,
  battleLog: [],
  
  // Actions
  setGamePhase: (phase) => set({ gamePhase: phase }),
  
  initDraft: (algorithms) => {
    const shuffled = algorithms.sort(() => Math.random() - 0.5);
    set({ 
      draftPool: shuffled.slice(0, 9),
      playerTeam: [],
      opponentTeam: [],
      draftTurn: 'player'
    });
  },
  
  draftAlgorithm: (algo) => {
    const state = get();
    if (state.draftTurn !== 'player') return;
    
    const newPlayerTeam = [...state.playerTeam, {
      ...algo,
      currentHp: algo.stats.hp,
      maxHp: algo.stats.hp,
      boosts: { attack: 0, defense: 0, speed: 0 }
    }];
    
    const newPool = state.draftPool.filter(a => a.id !== algo.id);
    
    set({ 
      playerTeam: newPlayerTeam,
      draftPool: newPool,
      draftTurn: 'opponent'
    });
    
    // AI draft
    setTimeout(() => {
      const state = get();
      const aiPick = newPool[Math.floor(Math.random() * newPool.length)];
      const newOpponentTeam = [...state.opponentTeam, {
        ...aiPick,
        currentHp: aiPick.stats.hp,
        maxHp: aiPick.stats.hp,
        boosts: { attack: 0, defense: 0, speed: 0 }
      }];
      
      set({
        opponentTeam: newOpponentTeam,
        draftPool: newPool.filter(a => a.id !== aiPick.id),
        draftTurn: 'player'
      });
      
      // Check if draft complete
      if (newPlayerTeam.length === 3 && newOpponentTeam.length === 3) {
        setTimeout(() => get().startBattle(), 1000);
      }
    }, 1000);
  },
  
  startBattle: () => {
    const state = get();
    set({
      gamePhase: 'action-select',
      playerActive: state.playerTeam[0],
      opponentActive: state.opponentTeam[0],
      turn: 1,
      timeLeft: 15,
      battleLog: ['Battle Start!']
    });
  },
  
  selectAction: (action, target = null) => {
    set({ playerAction: { type: action, target } });
    
    // AI selects action
    const state = get();
    const aiAction = get().getAIAction();
    set({ opponentAction: aiAction });
    
    // Resolve turn
    setTimeout(() => get().resolveTurn(), 1000);
  },
  
  getAIAction: () => {
    // Simple AI logic
    const state = get();
    const random = Math.random();
    
    if (state.opponentActive.currentHp < state.opponentActive.maxHp * 0.3) {
      // Low HP - consider switching
      const alive = state.opponentTeam.filter(a => 
        a.id !== state.opponentActive.id && a.currentHp > 0
      );
      if (alive.length > 0 && random < 0.5) {
        return { type: 'switch', target: alive[0] };
      }
    }
    
    if (random < 0.1) {
      return { type: 'boost' };
    }
    
    if (random < 0.2) {
      return { type: 'defend' };
    }
    
    return { type: 'attack' };
  },
  
  resolveTurn: () => {
    const state = get();
    const { playerAction, opponentAction, playerActive, opponentActive } = state;
    
    // Priority: Switch > Boost/Defend > Attack
    const actions = [
      { player: 'player', action: playerAction, pokemon: playerActive },
      { player: 'opponent', action: opponentAction, pokemon: opponentActive }
    ].sort((a, b) => {
      const priority = { switch: 3, boost: 2, defend: 2, attack: 1 };
      if (priority[a.action.type] !== priority[b.action.type]) {
        return priority[b.action.type] - priority[a.action.type];
      }
      // Same priority - check speed
      return b.pokemon.stats.speed - a.pokemon.stats.speed;
    });
    
    // Execute actions in order
    actions.forEach(({ player, action }) => {
      get().executeAction(player, action);
    });
    
    // Check for KO
    setTimeout(() => {
      const state = get();
      if (state.playerActive.currentHp <= 0 || state.opponentActive.currentHp <= 0) {
        get().handleKO();
      } else {
        set({ 
          gamePhase: 'action-select',
          playerAction: null,
          opponentAction: null,
          turn: state.turn + 1
        });
      }
    }, 2000);
  },
  
  executeAction: (player, action) => {
    const state = get();
    const isPlayer = player === 'player';
    const attacker = isPlayer ? state.playerActive : state.opponentActive;
    const defender = isPlayer ? state.opponentActive : state.playerActive;
    
    switch (action.type) {
      case 'attack':
        // Trigger code challenge
        if (isPlayer) {
          set({ gamePhase: 'code-challenge' });
        } else {
          // AI auto-completes with 85-95% accuracy
          const accuracy = 85 + Math.random() * 10;
          get().applyDamage('opponent', accuracy);
        }
        break;
        
      case 'switch':
        if (isPlayer) {
          set({ playerActive: action.target });
        } else {
          set({ opponentActive: action.target });
        }
        get().addLog(`${isPlayer ? 'You' : 'Opponent'} switched to ${action.target.name}!`);
        break;
        
      case 'boost':
        const newBoosts = {
          attack: Math.min(6, attacker.boosts.attack + 1),
          defense: Math.min(6, attacker.boosts.defense + 1),
          speed: Math.min(6, attacker.boosts.speed + 1)
        };
        if (isPlayer) {
          set({ playerActive: { ...attacker, boosts: newBoosts } });
        } else {
          set({ opponentActive: { ...attacker, boosts: newBoosts } });
        }
        get().addLog(`${attacker.name} boosted its stats!`);
        break;
        
      case 'defend':
        // Mark defending for damage reduction
        if (isPlayer) {
          set({ playerActive: { ...attacker, defending: true } });
        } else {
          set({ opponentActive: { ...attacker, defending: true } });
        }
        get().addLog(`${attacker.name} is defending!`);
        break;
    }
  },
  
  applyDamage: (attacker, accuracy) => {
    const state = get();
    const isPlayerAttacking = attacker === 'player';
    const attackerPokemon = isPlayerAttacking ? state.playerActive : state.opponentActive;
    const defenderPokemon = isPlayerAttacking ? state.opponentActive : state.playerActive;
    
    // Calculate damage using your formula
    const TYPE_CHART = {
      SORTING: { SORTING: 1.0, SEARCHING: 0.5, GRAPH: 2.0 },
      SEARCHING: { SORTING: 2.0, SEARCHING: 1.0, GRAPH: 0.5 },
      GRAPH: { SORTING: 0.5, SEARCHING: 2.0, GRAPH: 1.0 }
    };
    
    const baseDamage = attackerPokemon.stats.attack + (attackerPokemon.boosts.attack * 10);
    const typeMultiplier = TYPE_CHART[attackerPokemon.type][defenderPokemon.type];
    const timePenalty = 1.0; // Would be calculated from solve time
    const accuracyFactor = (2 - (accuracy / 100));
    
    let finalDamage = Math.floor(baseDamage * typeMultiplier * timePenalty * accuracyFactor);
    
    // Apply defense reduction
    if (defenderPokemon.defending) {
      finalDamage = Math.floor(finalDamage * 0.5);
    }
    
    const newHp = Math.max(0, defenderPokemon.currentHp - finalDamage);
    
    if (isPlayerAttacking) {
      set({ opponentActive: { ...defenderPokemon, currentHp: newHp, defending: false } });
    } else {
      set({ playerActive: { ...defenderPokemon, currentHp: newHp, defending: false } });
    }
    
    get().addLog(`${attackerPokemon.name} dealt ${finalDamage} damage!`);
    if (typeMultiplier > 1.5) get().addLog('Super effective!');
    if (typeMultiplier < 0.75) get().addLog('Not very effective...');
  },
  
  handleKO: () => {
    // Check for game over
    // Force switch if needed
    // Implement full KO logic
  },
  
  addLog: (message) => {
    set(state => ({ battleLog: [...state.battleLog.slice(-5), message] }));
  }
}));
