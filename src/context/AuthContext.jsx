import { createContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState(null);

  // Check if user is logged in on app load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Fetch user stats from Firestore
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          
          if (userDoc.exists()) {
            setUserStats(userDoc.data());
          } else {
            // Create user doc if doesn't exist
            const defaultStats = {
              uid: currentUser.uid,
              email: currentUser.email,
              username: currentUser.displayName || currentUser.email.split('@')[0],
              stats: {
                wins: 0,
                losses: 0,
                totalMatches: 0,
                winStreak: 0,
                maxWinStreak: 0,
                totalPoints: 0,
                coins: 100,
                elo: 1200,
                algorithmsLearned: 0,
                playtime: 0
              },
              achievements: {
                firstWin: false,
                tenWins: false,
                fiftyWins: false,
                winStreak5: false,
                perfectGame: false,
                speedRunner: false
              },
              createdAt: new Date(),
              lastLogin: new Date()
            };
            await setDoc(doc(db, 'users', currentUser.uid), defaultStats);
            setUserStats(defaultStats);
          }

          setUser({
            id: currentUser.uid,
            email: currentUser.email,
            username: currentUser.displayName || currentUser.email.split('@')[0]
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser({
            id: currentUser.uid,
            email: currentUser.email,
            username: currentUser.displayName || currentUser.email.split('@')[0]
          });
        }
      } else {
        setUser(null);
        setUserStats(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (email, password, username) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = result.user;

      // Update profile with username
      await updateProfile(newUser, {
        displayName: username
      });

      // Create user document in Firestore
      const userDocData = {
        uid: newUser.uid,
        email: email,
        username: username,
        stats: {
          wins: 0,
          losses: 0,
          totalMatches: 0,
          winStreak: 0,
          maxWinStreak: 0,
          totalPoints: 0,
          coins: 100,
          elo: 1200,
          algorithmsLearned: 0,
          playtime: 0
        },
        achievements: {
          firstWin: false,
          tenWins: false,
          fiftyWins: false,
          winStreak5: false,
          perfectGame: false,
          speedRunner: false
        },
        createdAt: new Date(),
        lastLogin: new Date()
      };

      await setDoc(doc(db, 'users', newUser.uid), userDocData);

      setUser({
        id: newUser.uid,
        email: newUser.email,
        username: username
      });

      setUserStats(userDocData);

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const loginUser = result.user;

      // Update last login
      try {
        await updateDoc(doc(db, 'users', loginUser.uid), {
          lastLogin: new Date()
        });
      } catch (error) {
        console.error('Error updating last login:', error);
      }

      setUser({
        id: loginUser.uid,
        email: loginUser.email,
        username: loginUser.displayName || loginUser.email.split('@')[0]
      });

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserStats(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  // Update player stats after a match
  const updatePlayerStats = async (matchResult) => {
    if (!user) {
      console.error('No user logged in');
      return { success: false, error: 'User not logged in' };
    }

    try {
      const userRef = doc(db, 'users', user.id);
      const currentStats = userStats?.stats || {
        wins: 0,
        losses: 0,
        totalMatches: 0,
        winStreak: 0,
        maxWinStreak: 0,
        totalPoints: 0,
        coins: 100,
        elo: 1200,
        algorithmsLearned: 0,
        playtime: 0
      };

      const updatedStats = {
        wins: currentStats.wins + (matchResult.won ? 1 : 0),
        losses: currentStats.losses + (matchResult.won ? 0 : 1),
        totalMatches: (currentStats.totalMatches || 0) + 1,
        winStreak: matchResult.won ? (currentStats.winStreak || 0) + 1 : 0,
        maxWinStreak: matchResult.won 
          ? Math.max((currentStats.maxWinStreak || 0), (currentStats.winStreak || 0) + 1)
          : (currentStats.maxWinStreak || 0),
        totalPoints: (currentStats.totalPoints || 0) + (matchResult.points || 0),
        coins: (currentStats.coins || 100) + (matchResult.coins || 0),
        elo: Math.max(800, (currentStats.elo || 1200) + (matchResult.eloChange || 0)),
        algorithmsLearned: currentStats.algorithmsLearned || 0,
        playtime: currentStats.playtime || 0
      };

      await updateDoc(userRef, { stats: updatedStats });
      
      setUserStats({
        ...userStats,
        stats: updatedStats
      });

      return { success: true, stats: updatedStats };
    } catch (error) {
      console.error('Error updating stats:', error);
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        userStats,
        register, 
        login, 
        logout,
        updatePlayerStats
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
