import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { typingChallenges } from './src/data/duelProblems.js';
import { globalMCQBank } from './src/data/mcqBank.js';


dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5713', 'http://localhost:5714', 'https://gladiator.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());

// ============ GAME STATE ============
const waiting1v1 = [];
const waitingTournament = [];
const activeGames = new Map();
const activeTournaments = new Map();
const playerSockets = new Map();
const gamePlayerStats = new Map();

// ============ SOCKET EVENTS ============
io.on('connection', (socket) => {
  console.log('✅ Player connected:', socket.id);

  // ============ FIND 1v1 MATCH ============
  socket.on('findMatch1v1', async (playerData) => {
    console.log('🔍 1v1 Search:', playerData.displayName, 'Socket:', socket.id);

    playerSockets.set(socket.id, {
      userId: playerData.userId,
      username: playerData.displayName || playerData.username,
      socketId: socket.id,
      gameMode: '1v1',
      stats: {
        wpm: 0,
        accuracy: 0,
        wordsTyped: 0,
        correctChars: 0,
        totalChars: 0,
        correctMCQs: 0,
        totalMCQs: 0,
        finalScore: 0,
      },
    });

    if (waiting1v1.length > 0) {
      // ============ 1v1 MATCH FOUND ============
      const opponent = waiting1v1.shift();
      const gameId = `game_1v1_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      console.log('🎮 1v1 Match created:');
      console.log('  Player 1:', opponent.username, '(Socket:', opponent.socketId, ')');
      console.log('  Player 2:', playerData.displayName, '(Socket:', socket.id, ')');

      activeGames.set(gameId, {
        gameId,
        gameMode: '1v1',
        player1SocketId: opponent.socketId,
        player2SocketId: socket.id,
        player1UserId: opponent.userId,
        player2UserId: playerData.userId,
        player1Name: opponent.username,
        player2Name: playerData.displayName || playerData.username,
        status: 'matching',
        startTime: Date.now(),
        tournamentId: null,
      });

      gamePlayerStats.set(gameId, {
        [opponent.socketId]: { ...opponent.stats },
        [socket.id]: { ...playerSockets.get(socket.id).stats },
      });

      socket.emit('matchFound', { gameId, opponent: { userId: opponent.userId, username: opponent.username } });
      io.to(opponent.socketId).emit('matchFound', { gameId, opponent: { userId: playerData.userId, username: playerData.displayName } });

      socket.join(gameId);
      io.sockets.sockets.get(opponent.socketId)?.join(gameId);

      setTimeout(() => startCountdown(gameId), 1500);
    } else {
      waiting1v1.push({
        userId: playerData.userId,
        username: playerData.displayName || playerData.username,
        socketId: socket.id,
        gameMode: '1v1',
        stats: playerSockets.get(socket.id).stats,
      });

      socket.emit('waiting', { message: 'Waiting for 1v1 opponent...', waitingCount: waiting1v1.length });
      console.log('⏳ Waiting 1v1:', waiting1v1.length);
    }
  });

  // ============ FIND TOURNAMENT MATCH ============
  socket.on('findMatchTournament', async (playerData) => {
    console.log('🏆 Tournament Search:', playerData.displayName, 'Socket:', socket.id);

    playerSockets.set(socket.id, {
      userId: playerData.userId,
      username: playerData.displayName || playerData.username,
      socketId: socket.id,
      gameMode: 'tournament',
      stats: {
        wpm: 0,
        accuracy: 0,
        wordsTyped: 0,
        correctChars: 0,
        totalChars: 0,
        correctMCQs: 0,
        totalMCQs: 0,
        finalScore: 0,
      },
    });

    waitingTournament.push({
      userId: playerData.userId,
      username: playerData.displayName || playerData.username,
      socketId: socket.id,
      gameMode: 'tournament',
      stats: playerSockets.get(socket.id).stats,
    });

    socket.emit('waitingTournament', {
      message: 'Waiting for tournament players...',
      playersNeeded: 4 - waitingTournament.length,
      currentPlayers: waitingTournament.length,
    });

    console.log('⏳ Tournament waiting:', waitingTournament.length);

    if (waitingTournament.length === 4) {
      console.log('🏆 TOURNAMENT STARTING WITH 4 PLAYERS!');
      const players = [...waitingTournament];
      waitingTournament.length = 0;

      createTournament(players);
    }
  });

  // ============ CREATE TOURNAMENT ============
  function createTournament(players) {
    const tournamentId = `tournament_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log('🏆 Creating tournament:', tournamentId);
    console.log('  Players:', players.map((p) => p.username).join(', '));

    const tournament = {
      tournamentId,
      status: 'semifinals',
      players: players.map((p) => ({ socketId: p.socketId, username: p.username, userId: p.userId })),
      semifinals: [
        { gameId: null, player1SocketId: players[0].socketId, player2SocketId: players[1].socketId },
        { gameId: null, player1SocketId: players[2].socketId, player2SocketId: players[3].socketId },
      ],
      final: { gameId: null, player1SocketId: null, player2SocketId: null },
      results: {},
    };

    activeTournaments.set(tournamentId, tournament);

    for (const player of players) {
      io.to(player.socketId).emit('tournamentStarted', {
        tournamentId,
        currentRound: 'semifinals',
        allPlayers: players.map((p) => ({ username: p.username, socketId: p.socketId })),
      });
    }

    setTimeout(() => {
      startSemifinal1(tournamentId);
      startSemifinal2(tournamentId);
    }, 2000);
  }

  // ============ START SEMIFINAL 1 ============
  function startSemifinal1(tournamentId) {
    const tournament = activeTournaments.get(tournamentId);
    if (!tournament) return;

    const semifinal = tournament.semifinals[0];
    const gameId = `game_tournament_sf1_${tournamentId}`;

    semifinal.gameId = gameId;

    console.log('🎮 Semifinal 1 starting:', gameId);
    console.log(
      '  ',
      playerSockets.get(semifinal.player1SocketId).username,
      'vs',
      playerSockets.get(semifinal.player2SocketId).username
    );

    activeGames.set(gameId, {
      gameId,
      gameMode: 'tournament',
      tournamentId,
      round: 'semifinal1',
      player1SocketId: semifinal.player1SocketId,
      player2SocketId: semifinal.player2SocketId,
      player1Name: playerSockets.get(semifinal.player1SocketId).username,
      player2Name: playerSockets.get(semifinal.player2SocketId).username,
      status: 'matching',
    });

    gamePlayerStats.set(gameId, {
      [semifinal.player1SocketId]: { ...playerSockets.get(semifinal.player1SocketId).stats },
      [semifinal.player2SocketId]: { ...playerSockets.get(semifinal.player2SocketId).stats },
    });

    const p1Socket = io.sockets.sockets.get(semifinal.player1SocketId);
    const p2Socket = io.sockets.sockets.get(semifinal.player2SocketId);

    p1Socket?.emit('matchFound', {
      gameId,
      opponent: { username: playerSockets.get(semifinal.player2SocketId).username },
      tournamentId,
      round: 'semifinal1',
    });

    p2Socket?.emit('matchFound', {
      gameId,
      opponent: { username: playerSockets.get(semifinal.player1SocketId).username },
      tournamentId,
      round: 'semifinal1',
    });

    p1Socket?.join(gameId);
    p2Socket?.join(gameId);

    setTimeout(() => startCountdown(gameId), 1500);
  }

  // ============ START SEMIFINAL 2 ============
  function startSemifinal2(tournamentId) {
    const tournament = activeTournaments.get(tournamentId);
    if (!tournament) return;

    const semifinal = tournament.semifinals[1];
    const gameId = `game_tournament_sf2_${tournamentId}`;

    semifinal.gameId = gameId;

    console.log('🎮 Semifinal 2 starting:', gameId);
    console.log(
      '  ',
      playerSockets.get(semifinal.player1SocketId).username,
      'vs',
      playerSockets.get(semifinal.player2SocketId).username
    );

    activeGames.set(gameId, {
      gameId,
      gameMode: 'tournament',
      tournamentId,
      round: 'semifinal2',
      player1SocketId: semifinal.player1SocketId,
      player2SocketId: semifinal.player2SocketId,
      player1Name: playerSockets.get(semifinal.player1SocketId).username,
      player2Name: playerSockets.get(semifinal.player2SocketId).username,
      status: 'matching',
    });

    gamePlayerStats.set(gameId, {
      [semifinal.player1SocketId]: { ...playerSockets.get(semifinal.player1SocketId).stats },
      [semifinal.player2SocketId]: { ...playerSockets.get(semifinal.player2SocketId).stats },
    });

    const p1Socket = io.sockets.sockets.get(semifinal.player1SocketId);
    const p2Socket = io.sockets.sockets.get(semifinal.player2SocketId);

    p1Socket?.emit('matchFound', {
      gameId,
      opponent: { username: playerSockets.get(semifinal.player2SocketId).username },
      tournamentId,
      round: 'semifinal2',
    });

    p2Socket?.emit('matchFound', {
      gameId,
      opponent: { username: playerSockets.get(semifinal.player1SocketId).username },
      tournamentId,
      round: 'semifinal2',
    });

    p1Socket?.join(gameId);
    p2Socket?.join(gameId);

    setTimeout(() => startCountdown(gameId), 1500);
  }

  // ============ COUNTDOWN ============
  function startCountdown(gameId) {
    const game = activeGames.get(gameId);
    if (!game) return;

    game.status = 'countdown';
    let count = 3;

    const countdownInterval = setInterval(() => {
      io.to(gameId).emit('countdownUpdate', count);
      console.log('⏱️ Countdown:', count, 'for game:', gameId);
      count--;

      if (count < 0) {
        clearInterval(countdownInterval);

        // ✅ PICK PARAGRAPH ONCE ON SERVER (BOTH GET SAME)
        const selectedChallenge = typingChallenges[Math.floor(Math.random() * typingChallenges.length)];

        // ✅ PICK MCQ POOL ONCE ON SERVER (SAME FOR BOTH)
        const mcqPool = globalMCQBank.slice(0, Math.min(20, globalMCQBank.length));

        io.to(gameId).emit('gameStarted', {
          gameId,
          paragraph: selectedChallenge.paragraph,
          mcqPool: mcqPool,
        });

        game.status = 'playing';
        game.gameStartTime = Date.now();
        game.sharedParagraph = selectedChallenge.paragraph;
        game.sharedMCQs = mcqPool;

        console.log('▶️ Game started with shared paragraph for:', gameId);

        setTimeout(() => endGame(gameId), 61000);
      }
    }, 1000);
  }

  // ============ UPDATE STATS ============
  socket.on('updateStats', (data) => {
    let gameId = null;
    let playerPosition = null;

    for (const [id, game] of activeGames.entries()) {
      if (game.player1SocketId === socket.id) {
        gameId = id;
        playerPosition = 'player1';
        break;
      } else if (game.player2SocketId === socket.id) {
        gameId = id;
        playerPosition = 'player2';
        break;
      }
    }

    if (!gameId) return;

    const gameStats = gamePlayerStats.get(gameId);
    if (gameStats) {
      gameStats[socket.id] = {
        wpm: data.wpm || 0,
        accuracy: data.accuracy || 0,
        wordsTyped: data.wordsTyped || 0,
        correctChars: data.correctChars || 0,
        totalChars: data.totalChars || 0,
        correctMCQs: data.correctMCQs || 0,
        totalMCQs: data.totalMCQs || 0,
        finalScore: data.finalScore || 0,
      };

      const game = activeGames.get(gameId);
      const opponentSocketId = playerPosition === 'player1' ? game.player2SocketId : game.player1SocketId;
      io.to(opponentSocketId).emit('opponentStats', gameStats[socket.id]);
    }
  });

  // ============ MCQ ANSWERED ============
  socket.on('mcqAnswered', (data) => {
    let gameId = null;

    for (const [id, game] of activeGames.entries()) {
      if (game.player1SocketId === socket.id || game.player2SocketId === socket.id) {
        gameId = id;
        break;
      }
    }

    if (!gameId) return;

    const gameStats = gamePlayerStats.get(gameId);
    if (gameStats) {
      gameStats[socket.id] = { ...gameStats[socket.id], ...data.newStats };

      const game = activeGames.get(gameId);
      const opponentSocketId = game.player1SocketId === socket.id ? game.player2SocketId : game.player1SocketId;
      io.to(opponentSocketId).emit('opponentStats', gameStats[socket.id]);
    }
  });

  // ============ END GAME ============
   function endGame(gameId) {
    const game = activeGames.get(gameId);
    if (!game || game.status === 'ended') return;

    game.status = 'ended';

    const gameStats = gamePlayerStats.get(gameId);
    if (!gameStats) return;

    const player1SocketId = game.player1SocketId;
    const player2SocketId = game.player2SocketId;

    // ✅ GET THE LATEST STATS FROM MAP (NOT CALCULATED LOCALLY)
    const player1Stats = gameStats[player1SocketId] || {
      wpm: 0,
      accuracy: 0,
      wordsTyped: 0,
      correctChars: 0,
      totalChars: 0,
      correctMCQs: 0,
      totalMCQs: 0,
      finalScore: 0,
    };

    const player2Stats = gameStats[player2SocketId] || {
      wpm: 0,
      accuracy: 0,
      wordsTyped: 0,
      correctChars: 0,
      totalChars: 0,
      correctMCQs: 0,
      totalMCQs: 0,
      finalScore: 0,
    };

    // ✅ DETERMINE WINNER USING SERVER STATS (SOURCE OF TRUTH)
    let winner = 'tie';
    if (player1Stats.finalScore > player2Stats.finalScore) {
      winner = 'player1';
    } else if (player2Stats.finalScore > player1Stats.finalScore) {
      winner = 'player2';
    }

    console.log('🏁 Game ended:', gameId);
    console.log('  P1 Final Score:', player1Stats.finalScore);
    console.log('  P2 Final Score:', player2Stats.finalScore);
    console.log('  Winner:', winner);

    // ✅ SEND THE SAME STATS TO BOTH PLAYERS (NO RECALCULATION)
    io.to(player1SocketId).emit('gameEnded', {
      winner,
      player1Stats: player1Stats,
      player2Stats: player2Stats,
      gameMode: game.gameMode,
      tournamentId: game.tournamentId,
      round: game.round,
    });

    io.to(player2SocketId).emit('gameEnded', {
      winner: winner === 'player1' ? 'player2' : winner === 'player2' ? 'player1' : 'tie',
      player1Stats: player2Stats,
      player2Stats: player1Stats,
      gameMode: game.gameMode,
      tournamentId: game.tournamentId,
      round: game.round,
    });

    if (game.gameMode === 'tournament' && game.tournamentId) {
      handleTournamentProgression(gameId, game.tournamentId, winner, player1Stats, player2Stats);
    }

    setTimeout(() => {
      activeGames.delete(gameId);
      gamePlayerStats.delete(gameId);
      io.sockets.adapter.rooms.delete(gameId);
    }, 3000);
  }


  // ============ TOURNAMENT PROGRESSION ============
  function handleTournamentProgression(gameId, tournamentId, winner, p1Stats, p2Stats) {
    const tournament = activeTournaments.get(tournamentId);
    if (!tournament) return;

    const game = activeGames.get(gameId);
    console.log('🏆 Tournament progression - Round:', game.round);

    if (game.round === 'semifinal1') {
      const semifinal = tournament.semifinals[0];
      const winnerSocketId = winner === 'player1' ? semifinal.player1SocketId : semifinal.player2SocketId;

      tournament.results.semifinal1Winner = {
        socketId: winnerSocketId,
        username: playerSockets.get(winnerSocketId).username,
        stats: winner === 'player1' ? p1Stats : p2Stats,
      };

      console.log('✅ SF1 Winner:', tournament.results.semifinal1Winner.username);

      if (tournament.results.semifinal1Winner && tournament.results.semifinal2Winner) {
        startFinal(tournamentId);
      }
    } else if (game.round === 'semifinal2') {
      const semifinal = tournament.semifinals[1];
      const winnerSocketId = winner === 'player1' ? semifinal.player1SocketId : semifinal.player2SocketId;

      tournament.results.semifinal2Winner = {
        socketId: winnerSocketId,
        username: playerSockets.get(winnerSocketId).username,
        stats: winner === 'player1' ? p1Stats : p2Stats,
      };

      console.log('✅ SF2 Winner:', tournament.results.semifinal2Winner.username);

      if (tournament.results.semifinal1Winner && tournament.results.semifinal2Winner) {
        startFinal(tournamentId);
      }
    }
  }

  // ============ START FINAL ============
  function startFinal(tournamentId) {
    const tournament = activeTournaments.get(tournamentId);
    if (!tournament) return;

    const finalGameId = `game_tournament_final_${tournamentId}`;
    const sf1Winner = tournament.results.semifinal1Winner;
    const sf2Winner = tournament.results.semifinal2Winner;

    console.log('🏆 FINAL STARTING!');
    console.log('  Player 1:', sf1Winner.username);
    console.log('  Player 2:', sf2Winner.username);

    tournament.final.gameId = finalGameId;
    tournament.final.player1SocketId = sf1Winner.socketId;
    tournament.final.player2SocketId = sf2Winner.socketId;
    tournament.status = 'final';

    activeGames.set(finalGameId, {
      gameId: finalGameId,
      gameMode: 'tournament',
      tournamentId,
      round: 'final',
      player1SocketId: sf1Winner.socketId,
      player2SocketId: sf2Winner.socketId,
      player1Name: sf1Winner.username,
      player2Name: sf2Winner.username,
      status: 'matching',
    });

    gamePlayerStats.set(finalGameId, {
      [sf1Winner.socketId]: { ...sf1Winner.stats },
      [sf2Winner.socketId]: { ...sf2Winner.stats },
    });

    for (const player of tournament.players) {
      io.to(player.socketId).emit('tournamentFinalStarting', {
        tournamentId,
        player1: sf1Winner.username,
        player2: sf2Winner.username,
      });
    }

    setTimeout(() => {
      io.to(sf1Winner.socketId).emit('matchFound', {
        gameId: finalGameId,
        opponent: { username: sf2Winner.username },
        tournamentId,
        round: 'final',
      });

      io.to(sf2Winner.socketId).emit('matchFound', {
        gameId: finalGameId,
        opponent: { username: sf1Winner.username },
        tournamentId,
        round: 'final',
      });

      io.sockets.sockets.get(sf1Winner.socketId)?.join(finalGameId);
      io.sockets.sockets.get(sf2Winner.socketId)?.join(finalGameId);

      setTimeout(() => startCountdown(finalGameId), 1500);
    }, 2000);
  }

  // ============ GAME END ============
  socket.on('gameEnd', (data) => {
    let gameId = null;

    for (const [id, game] of activeGames.entries()) {
      if (game.player1SocketId === socket.id || game.player2SocketId === socket.id) {
        gameId = id;
        break;
      }
    }

    if (gameId) {
      endGame(gameId);
    }
  });

  // ============ DISCONNECT ============
  socket.on('disconnect', () => {
    console.log('❌ Disconnected:', socket.id);

    playerSockets.delete(socket.id);

    const idx1v1 = waiting1v1.findIndex((p) => p.socketId === socket.id);
    if (idx1v1 !== -1) waiting1v1.splice(idx1v1, 1);

    const idxTournament = waitingTournament.findIndex((p) => p.socketId === socket.id);
    if (idxTournament !== -1) waitingTournament.splice(idxTournament, 1);

    for (const [gameId, game] of activeGames.entries()) {
      if (game.player1SocketId === socket.id || game.player2SocketId === socket.id) {
        const opponentSocketId = game.player1SocketId === socket.id ? game.player2SocketId : game.player1SocketId;
        io.to(opponentSocketId).emit('opponentDisconnected', { message: 'Opponent disconnected' });
        endGame(gameId);
        break;
      }
    }
  });
});

// ============ REST ENDPOINTS ============
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server running',
    activeGames: activeGames.size,
    activeTournaments: activeTournaments.size,
    waiting1v1: waiting1v1.length,
    waitingTournament: waitingTournament.length,
  });
});

// ============ ERROR HANDLING ============
io.on('error', (error) => {
  console.error('❌ Socket.io error:', error);
});

app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: err.message });
});

// ============ START SERVER ============
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 DSA Typing Duel Tournament Server');
  console.log('='.repeat(60));
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Supports 1v1 and 4-player tournaments`);
  console.log(`✅ CORS enabled for 5173, 5174, 5713, 5714`);
  console.log(`✅ Shared paragraph & MCQ system active`);
  console.log('='.repeat(60) + '\n');
});

export default { app, io };
