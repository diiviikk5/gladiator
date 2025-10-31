import { db } from '../config/firebase';
import { collection, addDoc, query, where, onSnapshot, updateDoc, doc, getDocs, deleteDoc, serverTimestamp } from 'firebase/firestore';

export const duelService = {
  // Create waiting room with timeout
  async createDuel(userId, username) {
    const expiresAt = new Date(Date.now() + 60000); // 60s timeout
    const duelRef = await addDoc(collection(db, 'duels'), {
      player1: { id: userId, username, score: 0, wpm: 0, accuracy: 0 },
      player2: null,
      status: 'waiting', // waiting, active, completed
      createdAt: serverTimestamp(),
      expiresAt,
      winner: null,
      startTime: null,
      endTime: null
    });
    return duelRef.id;
  },

  // Auto-cleanup expired duels (run on server)
  async cleanupExpiredDuels() {
    const q = query(collection(db, 'duels'), where('status', '==', 'waiting'));
    const snapshot = await getDocs(q);
    const now = new Date();
    
    snapshot.forEach(async (duelDoc) => {
      const expiresAt = duelDoc.data().expiresAt?.toDate?.() || new Date(duelDoc.data().expiresAt);
      if (now > expiresAt) {
        await deleteDoc(doc(db, 'duels', duelDoc.id));
      }
    });
  },

  // Join waiting duel (with proper matching)
  async joinDuel(userId, username) {
    const q = query(collection(db, 'duels'), where('status', '==', 'waiting'));
    const snapshot = await getDocs(q);
    
    // Find first available duel
    for (const duelDoc of snapshot.docs) {
      const data = duelDoc.data();
      // Make sure it's not the same user
      if (data.player1.id !== userId) {
        await updateDoc(doc(db, 'duels', duelDoc.id), {
          player2: { id: userId, username, score: 0, wpm: 0, accuracy: 0 },
          status: 'active',
          startTime: serverTimestamp()
        });
        return duelDoc.id;
      }
    }
    
    // No match found, create new
    return await this.createDuel(userId, username);
  },

  // Listen to duel updates
  onDuelUpdate(duelId, callback) {
    return onSnapshot(doc(db, 'duels', duelId), (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      }
    });
  },

  // Update player stats during game
  async updatePlayerStats(duelId, playerNum, { score, wpm, accuracy }) {
    const field = playerNum === 1 ? 'player1' : 'player2';
    await updateDoc(doc(db, 'duels', duelId), {
      [field]: {
        ...((await doc(db, 'duels', duelId)).data()[field]),
        score,
        wpm,
        accuracy
      }
    });
  },

  // End duel with winner
  async endDuel(duelId, winnerId, stats) {
    await updateDoc(doc(db, 'duels', duelId), {
      status: 'completed',
      winner: winnerId,
      endTime: serverTimestamp(),
      ...stats
    });
  },

  // Tournament functions
  async createTournament(userId, username, maxPlayers = 4) {
    const tournamentRef = await addDoc(collection(db, 'tournaments'), {
      creator: { id: userId, username },
      players: [{ id: userId, username, eliminated: false }],
      status: 'waiting', // waiting, active, completed
      maxPlayers,
      round: 1,
      matches: [],
      createdAt: serverTimestamp()
    });
    return tournamentRef.id;
  },

  // Join tournament
  async joinTournament(tournamentId, userId, username) {
    const tourDoc = await (await getDocs(query(collection(db, 'tournaments'), where('__name__', '==', tournamentId)))).docs[0];
    const data = tourDoc.data();
    
    if (data.players.length >= data.maxPlayers || data.status !== 'waiting') {
      throw new Error('Tournament full or already started');
    }

    await updateDoc(doc(db, 'tournaments', tournamentId), {
      players: [...data.players, { id: userId, username, eliminated: false }]
    });

    // Auto-start if full
    if (data.players.length + 1 === data.maxPlayers) {
      await this.startTournamentRound(tournamentId);
    }
  },

  // Start tournament round
  async startTournamentRound(tournamentId) {
    const tourDoc = await doc(db, 'tournaments', tournamentId).get();
    const data = tourDoc.data();
    const activePlayers = data.players.filter(p => !p.eliminated);

    const matches = [];
    for (let i = 0; i < activePlayers.length; i += 2) {
      if (activePlayers[i + 1]) {
        const duelId = await this.createDuel(activePlayers[i].id, activePlayers[i].username);
        matches.push({
          duelId,
          player1: activePlayers[i],
          player2: activePlayers[i + 1],
          winner: null
        });
      }
    }

    await updateDoc(doc(db, 'tournaments', tournamentId), {
      status: 'active',
      matches
    });
  },

  // Update tournament match result
  async updateTournamentMatch(tournamentId, matchIndex, winnerId) {
    const tourDoc = await doc(db, 'tournaments', tournamentId).get();
    const data = tourDoc.data();
    
    data.matches[matchIndex].winner = winnerId;

    // Check if all matches done
    const allDone = data.matches.every(m => m.winner);
    
    if (allDone) {
      const activePlayers = data.players.map(p => ({
        ...p,
        eliminated: !data.matches.some(m => m.winner === p.id)
      }));

      const winners = activePlayers.filter(p => !p.eliminated);

      if (winners.length === 1) {
        // Tournament over
        await updateDoc(doc(db, 'tournaments', tournamentId), {
          status: 'completed',
          winner: winners[0],
          players: activePlayers
        });
      } else {
        // Next round
        await updateDoc(doc(db, 'tournaments', tournamentId), {
          round: data.round + 1,
          matches: [],
          players: activePlayers
        });
        await this.startTournamentRound(tournamentId);
      }
    } else {
      await updateDoc(doc(db, 'tournaments', tournamentId), {
        matches: data.matches
      });
    }
  },

  // Listen to tournament updates
  onTournamentUpdate(tournamentId, callback) {
    return onSnapshot(doc(db, 'tournaments', tournamentId), (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      }
    });
  }
};
