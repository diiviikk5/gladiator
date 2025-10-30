import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

export const useSocket = (user) => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [opponentConnected, setOpponentConnected] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const [error, setError] = useState(null);
  const [gameMode, setGameMode] = useState(null); // '1v1' or 'tournament'
  const [tournamentData, setTournamentData] = useState(null);
  const [currentRound, setCurrentRound] = useState(null); // 'semifinal1', 'semifinal2', 'final'
  const [tournamentPlayers, setTournamentPlayers] = useState([]);
  const gameIdRef = useRef(null);
  const tournamentIdRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    socketRef.current = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
    });

    // ============ CONNECTION EVENTS ============
    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected:', socketRef.current.id);
      setConnected(true);
      setError(null);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('❌ Socket error:', error);
      setError(error.message);
    });

    socketRef.current.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setConnected(false);
      setOpponentConnected(false);
    });

    // ============ 1v1 MATCH EVENTS ============
    socketRef.current.on('matchFound', (data) => {
      console.log('🎮 Match found:', data);
      gameIdRef.current = data.gameId;
      tournamentIdRef.current = data.tournamentId || null;
      
      setMatchData(data);
      setGameMode(data.gameMode || '1v1');
      setCurrentRound(data.round || null);
      setOpponentConnected(true);
    });

    socketRef.current.on('waiting', (data) => {
      console.log('⏳ Waiting for 1v1:', data);
    });

    // ============ TOURNAMENT EVENTS ============
    socketRef.current.on('waitingTournament', (data) => {
      console.log('🏆 Tournament waiting:', data);
    });

    socketRef.current.on('tournamentStarted', (data) => {
      console.log('🏆 Tournament started:', data);
      tournamentIdRef.current = data.tournamentId;
      setGameMode('tournament');
      setTournamentData(data);
      setTournamentPlayers(data.allPlayers || []);
      setCurrentRound('semifinal');
    });

    socketRef.current.on('tournamentFinalStarting', (data) => {
      console.log('🏆 Final starting:', data);
      setCurrentRound('final');
      setTournamentData((prev) => ({
        ...prev,
        finalPlayers: { player1: data.player1, player2: data.player2 },
      }));
    });

    // ============ GAME START/PROGRESS EVENTS ============
    socketRef.current.on('gameStarted', (data) => {
      console.log('▶️ Game started:', data);
      setGameStarted(true);
    });

    socketRef.current.on('countdownUpdate', (num) => {
      console.log('⏱️ Countdown:', num);
    });

    socketRef.current.on('opponentStats', (stats) => {
      console.log('📊 Opponent stats:', stats);
    });

    socketRef.current.on('opponentDisconnected', () => {
      console.log('❌ Opponent disconnected');
      setOpponentConnected(false);
    });

    // ============ GAME END EVENT ============
    socketRef.current.on('gameEnded', (data) => {
      console.log('🏁 Game ended:', data);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  // ============ EMIT FUNCTIONS ============

  /**
   * Find 1v1 match
   */
  const findMatch1v1 = (userData) => {
    console.log('🔍 Finding 1v1 match...');
    if (socketRef.current?.connected) {
      socketRef.current.emit('findMatch1v1', userData);
    } else {
      console.warn('⚠️ Socket not connected');
    }
  };

  /**
   * Find tournament match
   */
  const findMatchTournament = (userData) => {
    console.log('🏆 Joining tournament queue...');
    if (socketRef.current?.connected) {
      socketRef.current.emit('findMatchTournament', userData);
    } else {
      console.warn('⚠️ Socket not connected');
    }
  };

  /**
   * Update player stats during game
   */
  const updateStats = (stats) => {
    if (socketRef.current?.connected && gameIdRef.current) {
      socketRef.current.emit('updateStats', { ...stats, gameId: gameIdRef.current });
    }
  };

  /**
   * Send MCQ answer
   */
  const answerMCQ = (mcqData) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('mcqAnswered', mcqData);
    }
  };

  /**
   * End game (when timer reaches 0)
   */
  const endGame = (gameData) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('gameEnd', gameData);
    }
  };

  /**
   * Listen to socket event
   */
  const onEvent = (eventName, callback) => {
    if (socketRef.current) {
      socketRef.current.on(eventName, callback);
    }
  };

  /**
   * Stop listening to socket event
   */
  const offEvent = (eventName) => {
    if (socketRef.current) {
      socketRef.current.off(eventName);
    }
  };

  return {
    socket: socketRef.current,
    connected,
    gameStarted,
    opponentConnected,
    matchData,
    error,
    gameMode,
    tournamentData,
    currentRound,
    tournamentPlayers,
    findMatch1v1,
    findMatchTournament,
    updateStats,
    answerMCQ,
    endGame,
    onEvent,
    offEvent,
  };
};

export default useSocket;
