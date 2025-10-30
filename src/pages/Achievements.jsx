import { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, Lock, Star, Trophy, TrendingUp, Zap, Target, Award, Flame, Crown, Shield, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

const ACHIEVEMENTS = {
  firstWin: {
    id: 'firstWin',
    name: 'First Blood',
    description: 'Win your first 1v1 match',
    icon: '⚔️',
    color: '#06b6d4',
    points: 10,
  },
  tenWins: {
    id: 'tenWins',
    name: 'Rising Star',
    description: 'Achieve 10 wins',
    icon: '⭐',
    color: '#8b5cf6',
    points: 50,
  },
  fiftyWins: {
    id: 'fiftyWins',
    name: 'Legendary Warrior',
    description: 'Achieve 50 wins',
    icon: '👑',
    color: '#ec4899',
    points: 200,
  },
  speedRunner: {
    id: 'speedRunner',
    name: 'Speedrunner',
    description: 'Type 100+ WPM',
    icon: '⚡',
    color: '#fbbf24',
    points: 30,
  },
  perfectGame: {
    id: 'perfectGame',
    name: 'Perfect Game',
    description: 'Achieve 100% accuracy',
    icon: '💯',
    color: '#10b981',
    points: 75,
  },
  winStreak5: {
    id: 'winStreak5',
    name: 'On Fire',
    description: 'Win 5 matches in a row',
    icon: '🔥',
    color: '#f87171',
    points: 100,
  },
};

const ELO_THRESHOLDS = {
  bronze: { min: 1000, max: 1399, icon: '🥉', color: '#a16207', label: 'Bronze' },
  silver: { min: 1400, max: 1699, icon: '🥈', color: '#6b7280', label: 'Silver' },
  gold: { min: 1700, max: 1999, icon: '🥇', color: '#fbbf24', label: 'Gold' },
  platinum: { min: 2000, max: 2499, icon: '💎', color: '#06b6d4', label: 'Platinum' },
  diamond: { min: 2500, max: Infinity, icon: '💠', color: '#8b5cf6', label: 'Diamond' },
};

const getRankInfo = (elo) => {
  for (const [key, data] of Object.entries(ELO_THRESHOLDS)) {
    if (elo >= data.min && elo <= data.max) {
      return { ...data, key };
    }
  }
  return ELO_THRESHOLDS.bronze;
};

export default function Achievements() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [userStats, setUserStats] = useState(null);
  const [achievements, setAchievements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rankInfo, setRankInfo] = useState(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();

          if (!data.stats) {
            const defaultStats = {
              wins: 0,
              losses: 0,
              totalMatches: 0,
              winStreak: 0,
              maxWinStreak: 0,
              elo: 1200,
              totalPoints: 0,
              playtime: 0,
              algorithmsLearned: 0,
              coins: 100,
            };

            const defaultAchievements = {
              firstWin: false,
              tenWins: false,
              fiftyWins: false,
              speedRunner: false,
              perfectGame: false,
              winStreak5: false,
            };

            await updateDoc(userDocRef, {
              stats: defaultStats,
              achievements: defaultAchievements,
            });

            setUserStats(defaultStats);
            setAchievements(defaultAchievements);
            setRankInfo(getRankInfo(1200));
          } else {
            setUserStats(data.stats);
            setAchievements(data.achievements || {});
            setRankInfo(getRankInfo(data.stats.elo || 1200));
          }
        } else {
          const defaultStats = {
            wins: 0,
            losses: 0,
            totalMatches: 0,
            winStreak: 0,
            maxWinStreak: 0,
            elo: 1200,
            totalPoints: 0,
            playtime: 0,
            algorithmsLearned: 0,
            coins: 100,
          };

          const defaultAchievements = {
            firstWin: false,
            tenWins: false,
            fiftyWins: false,
            speedRunner: false,
            perfectGame: false,
            winStreak5: false,
          };

          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            username: user.displayName || 'Player',
            createdAt: new Date(),
            stats: defaultStats,
            achievements: defaultAchievements,
          });

          setUserStats(defaultStats);
          setAchievements(defaultAchievements);
          setRankInfo(getRankInfo(1200));
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading achievements:', error);
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl"
          >
            ⚙️
          </motion.div>
        </div>
      </>
    );
  }

  const winRate = userStats?.totalMatches ? Math.round((userStats.wins / userStats.totalMatches) * 100) : 0;
  const unlockedAchievements = Object.values(achievements || {}).filter((a) => a === true).length;
  const nextRankElo = Object.values(ELO_THRESHOLDS).find((r) => userStats?.elo < r.min)?.min || Infinity;

  return (
    <>
      <Navbar />
      <div className="min-h-screen text-white relative overflow-hidden">
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950">
          <motion.div
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 40% 20%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0"
          />
        </div>

        <div className="relative z-10 min-h-screen px-4 md:px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1
                className="text-6xl md:text-8xl font-black mb-4"
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                YOUR JOURNEY
              </h1>
              <p className="text-xl md:text-2xl text-gray-300" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                {user?.displayName || 'Player'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                className="lg:col-span-2 p-8 rounded-2xl bg-black/50 backdrop-blur-xl border border-purple-500/30"
              >
                <p className="text-gray-400 text-sm uppercase mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  Current Rank
                </p>

                <div className="flex items-center justify-between mb-6">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-6xl md:text-8xl"
                  >
                    {rankInfo?.icon}
                  </motion.div>

                  <div>
                    <p
                      className="text-3xl md:text-5xl font-black mb-2"
                      style={{ color: rankInfo?.color, fontFamily: 'Orbitron, sans-serif' }}
                    >
                      {rankInfo?.label}
                    </p>
                    <p className="text-gray-400 text-sm md:text-base">
                      {userStats?.elo} / {nextRankElo === Infinity ? '∞' : nextRankElo} ELO
                    </p>
                  </div>
                </div>

                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r"
                    style={{
                      backgroundImage: `linear-gradient(90deg, ${rankInfo?.color}, ${rankInfo?.color}cc)`,
                    }}
                    animate={{
                      width: `${Math.min(
                        100,
                        ((userStats?.elo || 1200 - (rankInfo?.min || 1000)) /
                          ((rankInfo?.max || 1400) - (rankInfo?.min || 1000))) *
                          100
                      )}%`,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </motion.div>

              {[
                { label: 'Wins', value: userStats?.wins || 0, icon: Trophy, color: '#fbbf24' },
                { label: 'Losses', value: userStats?.losses || 0, icon: Shield, color: '#ef4444' },
                { label: 'Win Rate', value: `${winRate}%`, icon: TrendingUp, color: '#10b981' },
                { label: 'Max Streak', value: userStats?.maxWinStreak || 0, icon: Flame, color: '#f87171' },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05, y: -10 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="p-6 rounded-xl bg-black/50 backdrop-blur-xl border border-cyan-500/30 text-center"
                  >
                    <Icon className="w-8 h-8 mx-auto mb-3" style={{ color: stat.color }} />
                    <p
                      className="text-gray-400 text-sm uppercase mb-2"
                      style={{ fontFamily: 'Orbitron, sans-serif' }}
                    >
                      {stat.label}
                    </p>
                    <p className="text-3xl md:text-4xl font-black" style={{ color: stat.color }}>
                      {stat.value}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              {[
                { label: 'Total Matches', value: userStats?.totalMatches || 0, icon: Zap },
                { label: 'Total Points', value: userStats?.totalPoints || 0, icon: Star },
                { label: 'Playtime', value: `${Math.round((userStats?.playtime || 0) / 60)} hrs`, icon: Clock },
                { label: 'Current Streak', value: userStats?.winStreak || 0, icon: Flame },
                { label: 'Algorithms Learned', value: userStats?.algorithmsLearned || 0, icon: Target },
                { label: 'Coins Earned', value: userStats?.coins || 0, icon: Award },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + 0.05 * i }}
                    className="p-6 rounded-xl bg-black/50 backdrop-blur-xl border border-pink-500/30"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="w-6 h-6 text-pink-400" />
                      <p className="text-gray-400 text-xs md:text-sm uppercase" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                        {stat.label}
                      </p>
                    </div>
                    <p className="text-2xl md:text-3xl font-black text-pink-400">{stat.value}</p>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="mb-8">
                <h2
                  className="text-3xl md:text-4xl font-black mb-2"
                  style={{
                    fontFamily: 'Orbitron, sans-serif',
                    background: 'linear-gradient(135deg, #06b6d4, #ec4899)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  ACHIEVEMENTS
                </h2>
                <p className="text-gray-400">
                  {unlockedAchievements} / {Object.keys(ACHIEVEMENTS).length} Unlocked
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.values(ACHIEVEMENTS).map((achievement, i) => {
                  const isUnlocked = achievements?.[achievement.id];
                  return (
                    <motion.div
                      key={i}
                      whileHover={{ scale: isUnlocked ? 1.05 : 1.02, y: -10 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + 0.08 * i }}
                      className={`relative p-8 rounded-2xl backdrop-blur-xl border-2 transition-all ${
                        isUnlocked
                          ? 'bg-black/50 border-yellow-500/50'
                          : 'bg-black/30 border-gray-700/50 opacity-60'
                      }`}
                    >
                      {!isUnlocked && (
                        <div className="absolute top-4 right-4">
                          <Lock className="w-5 h-5 text-gray-500" />
                        </div>
                      )}

                      <motion.div
                        animate={isUnlocked ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-5xl md:text-6xl mb-4"
                      >
                        {achievement.icon}
                      </motion.div>

                      <p
                        className="text-lg md:text-xl font-black mb-2"
                        style={{
                          color: isUnlocked ? achievement.color : '#6b7280',
                          fontFamily: 'Orbitron, sans-serif',
                        }}
                      >
                        {achievement.name}
                      </p>

                      <p className={`text-xs md:text-sm mb-4 ${isUnlocked ? 'text-gray-400' : 'text-gray-600'}`}>
                        {achievement.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                        <span className="text-gray-500 text-xs">REWARD</span>
                        <span
                          className="font-bold text-sm"
                          style={{ color: isUnlocked ? achievement.color : '#6b7280' }}
                        >
                          +{achievement.points} pts
                        </span>
                      </div>

                      {isUnlocked && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="absolute top-4 left-4 text-green-400"
                        >
                          <Star className="w-6 h-6 fill-current" />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30"
            >
              <h3 className="text-2xl md:text-3xl font-black mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                🎯 NEXT MILESTONES
              </h3>

              <div className="space-y-4">
                {[
                  {
                    label: 'Next Rank',
                    current: userStats?.elo || 1200,
                    target: nextRankElo === Infinity ? (userStats?.elo || 1200) + 500 : nextRankElo,
                    icon: Crown,
                  },
                  {
                    label: 'Next Win Milestone',
                    current: userStats?.wins || 0,
                    target: Math.ceil(((userStats?.wins || 0) + 1) / 10) * 10,
                    icon: Trophy,
                  },
                ].map((milestone, i) => {
                  const Icon = milestone.icon;
                  const progress = Math.min(100, (milestone.current / milestone.target) * 100);

                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-cyan-400" />
                          <span className="font-bold text-sm md:text-base" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                            {milestone.label}
                          </span>
                        </div>
                        <span className="text-xs md:text-sm text-gray-400">
                          {milestone.current} / {milestone.target}
                        </span>
                      </div>

                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap justify-center gap-4 md:gap-6 mt-16"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/duel')}
                className="px-8 md:px-10 py-4 md:py-5 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 hover:from-cyan-500 hover:via-purple-500 hover:to-pink-500 rounded-xl font-bold text-base md:text-xl flex items-center gap-2 md:gap-3 transition-all shadow-lg shadow-cyan-500/50"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                🎮 PLAY DUEL
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="px-8 md:px-10 py-4 md:py-5 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-xl font-bold text-base md:text-xl flex items-center gap-2 md:gap-3 transition-all"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                <Home className="w-5 h-5 md:w-6 md:h-6" />
                DASHBOARD
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
