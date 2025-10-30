// src/hooks/useGameLogic.js

import { useState, useCallback, useRef } from 'react';
import {
  calculateWPM,
  calculateAccuracy,
  calculateFinalScore,
  countWords,
} from '../data/duelProblems';

/**
 * Custom hook for managing game logic and calculations
 * @param {string} originalText - The paragraph text to type
 * @param {number} gameTime - Total game time in seconds
 * @returns {Object} Game logic state and handlers
 */
export const useGameLogic = (originalText, gameTime = 60) => {
  const [typedText, setTypedText] = useState('');
  const [timeLeft, setTimeLeft] = useState(gameTime);
  const [gameActive, setGameActive] = useState(true);
  const [stats, setStats] = useState({
    wordsTyped: 0,
    correctChars: 0,
    totalChars: 0,
    correctMCQs: 0,
    totalMCQs: 0,
    wpm: 0,
    accuracy: 0,
    finalScore: 0,
  });

  const gameTimerRef = useRef(null);
  const statsUpdateRef = useRef(null);

  // ============ CALCULATE STATS IN REAL TIME ============
  const updateStats = useCallback(() => {
    const words = countWords(typedText);
    const totalChars = typedText.length;

    let correctChars = 0;
    for (let i = 0; i < typedText.length && i < originalText.length; i++) {
      if (typedText[i] === originalText[i]) correctChars++;
    }

    const elapsedTime = gameTime - timeLeft;
    const wpm = calculateWPM(words, elapsedTime || 1);
    const accuracy = calculateAccuracy(typedText, originalText);

    setStats((prevStats) => {
      const newStats = {
        ...prevStats,
        wordsTyped: words,
        correctChars,
        totalChars,
        wpm,
        accuracy,
        finalScore: calculateFinalScore(
          wpm,
          accuracy,
          prevStats.correctMCQs
        ),
      };
      return newStats;
    });
  }, [typedText, originalText, gameTime, timeLeft]);

  // ============ TYPING HANDLER ============
  const handleTyping = useCallback(
    (text) => {
      if (!gameActive) return;

      if (text.length > originalText.length) {
        setTypedText(originalText);
      } else {
        setTypedText(text);
      }

      // Debounce stats calculation
      clearTimeout(statsUpdateRef.current);
      statsUpdateRef.current = setTimeout(() => {
        updateStats();
      }, 100);
    },
    [originalText, gameActive, updateStats]
  );

  // ============ ADD MCQ SCORE ============
  const addMCQScore = useCallback(
    (isCorrect) => {
      setStats((prevStats) => {
        const newCorrectMCQs = isCorrect
          ? prevStats.correctMCQs + 1
          : prevStats.correctMCQs;
        const newStats = {
          ...prevStats,
          totalMCQs: prevStats.totalMCQs + 1,
          correctMCQs: newCorrectMCQs,
          finalScore: calculateFinalScore(
            prevStats.wpm,
            prevStats.accuracy,
            newCorrectMCQs
          ),
        };
        return newStats;
      });
    },
    []
  );

  // ============ END GAME ============
  const endGame = useCallback(() => {
    setGameActive(false);
    clearInterval(gameTimerRef.current);
    clearTimeout(statsUpdateRef.current);
    updateStats();
  }, [updateStats]);

  // ============ RESET GAME ============
  const resetGame = useCallback(() => {
    setTypedText('');
    setTimeLeft(gameTime);
    setGameActive(true);
    setStats({
      wordsTyped: 0,
      correctChars: 0,
      totalChars: 0,
      correctMCQs: 0,
      totalMCQs: 0,
      wpm: 0,
      accuracy: 0,
      finalScore: 0,
    });
  }, [gameTime]);

  // ============ GET ERROR POSITIONS ============
  const getErrorPositions = useCallback(() => {
    const errors = [];
    for (let i = 0; i < typedText.length; i++) {
      if (typedText[i] !== originalText[i]) {
        errors.push(i);
      }
    }
    return errors;
  }, [typedText, originalText]);

  // ============ GET PROGRESS ============
  const getProgress = useCallback(() => {
    return Math.round((typedText.length / originalText.length) * 100);
  }, [typedText.length, originalText.length]);

  return {
    typedText,
    timeLeft,
    setTimeLeft,
    gameActive,
    stats,
    handleTyping,
    addMCQScore,
    endGame,
    resetGame,
    getErrorPositions,
    getProgress,
    updateStats,
    gameTimerRef,
  };
};

export default useGameLogic;
