import { db } from '../config/firebase';
import { collection, addDoc, query, orderBy, limit, getDocs, where, updateDoc, doc } from 'firebase/firestore';

export const leaderboardService = {
  // Add or update player score
  async saveScore(userId, username, score, maxCombo, questionsAnswered, highestMutation) {
    try {
      const docRef = await addDoc(collection(db, 'fallingFrenzyScores'), {
        userId,
        username,
        score,
        maxCombo,
        questionsAnswered,
        highestMutation,
        timestamp: new Date(),
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving score:', error);
      throw error;
    }
  },

  // Get global leaderboard (top 100)
  async getGlobalLeaderboard() {
    try {
      const q = query(
        collection(db, 'fallingFrenzyScores'),
        orderBy('score', 'desc'),
        limit(100)
      );
      const querySnapshot = await getDocs(q);
      const scores = [];
      querySnapshot.forEach((doc) => {
        scores.push({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate?.() || new Date(doc.data().createdAt)
        });
      });
      return scores;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  },

  // Get user's personal best
  async getUserBest(userId) {
    try {
      const q = query(
        collection(db, 'fallingFrenzyScores'),
        where('userId', '==', userId),
        orderBy('score', 'desc'),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.() || new Date(doc.data().createdAt)
      };
    } catch (error) {
      console.error('Error fetching user best:', error);
      return null;
    }
  },

  // Get user's all scores
  async getUserScores(userId) {
    try {
      const q = query(
        collection(db, 'fallingFrenzyScores'),
        where('userId', '==', userId),
        orderBy('score', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const scores = [];
      querySnapshot.forEach((doc) => {
        scores.push({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate?.() || new Date(doc.data().createdAt)
        });
      });
      return scores;
    } catch (error) {
      console.error('Error fetching user scores:', error);
      return [];
    }
  }
};
