import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import {
  Target, BookOpen, Zap, Brain, Shield, Sparkles, 
  TrendingUp, CheckCircle, AlertTriangle, Skull,
  Eye, Search, Shuffle, Heart, Home, Play,
  ChevronRight, Code, Activity, Info
} from 'lucide-react';

// Load Orbitron font
const loadOrbitronFont = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
};

const RevealOnScroll = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  
  return (
    <div ref={ref}>
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : { y: 60, opacity: 0 }}
        transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const GlassCard = ({ children, className = "", gradient = false }) => (
  <div className={`relative bg-black/50 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 ${className} ${
    gradient ? 'bg-gradient-to-br from-red-900/20 to-purple-900/20' : ''
  }`}>
    {children}
    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-red-400/40 rounded-tl-2xl" />
    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-400/40 rounded-br-2xl" />
  </div>
);

const RuleSection = ({ icon: Icon, title, description, color, children }) => (
  <GlassCard className="mb-6">
    <div className="flex items-start gap-4 mb-4">
      <div 
        className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}20`, border: `2px solid ${color}40` }}
      >
        <Icon className="w-8 h-8" style={{ color }} />
      </div>
      <div className="flex-1">
        <h3 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-2xl font-black text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
    {children && (
      <div className="mt-4 pt-4 border-t border-white/10">
        {children}
      </div>
    )}
  </GlassCard>
);

const ItemCard = ({ icon: Icon, name, tier, color, description, educational }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -5 }}
    className="p-4 rounded-xl border-2 transition-all relative overflow-hidden"
    style={{ 
      borderColor: `${color}40`,
      background: `linear-gradient(135deg, ${color}10, transparent)`
    }}
  >
    <motion.div
      className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
      style={{
        background: `radial-gradient(circle at center, ${color}20, transparent)`
      }}
    />
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ background: `${color}30`, border: `1px solid ${color}` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <div>
          <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-white font-bold">
            {name}
          </div>
          <div className="text-xs text-gray-500">Tier {tier}</div>
        </div>
      </div>
      <p className="text-sm text-gray-400 mb-3">{description}</p>
      <div className="p-3 rounded-lg bg-black/30 border border-emerald-500/20">
        <div className="text-xs text-emerald-400 font-bold mb-1">
          📚 {educational.concept}
        </div>
        <div className="text-xs text-gray-500">
          {educational.explanation}
        </div>
        <div className="text-xs text-amber-400 mt-2">
          ⚡ {educational.complexity}
        </div>
      </div>
    </div>
  </motion.div>
);

export default function Rules() {
  loadOrbitronFont();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'gameplay', label: 'Gameplay', icon: Target },
    { id: 'items', label: 'Items', icon: Sparkles },
    { id: 'strategy', label: 'Strategy', icon: Brain },
  ];

  const items = [
    {
      icon: Eye,
      name: 'Direct Access',
      tier: 1,
      color: '#3b82f6',
      description: 'Peek at next test case',
      educational: {
        concept: 'Array Indexing',
        complexity: 'O(1)',
        explanation: 'Direct memory access - instant lookup like array[i]'
      }
    },
    {
      icon: Search,
      name: 'Binary Search',
      tier: 2,
      color: '#10b981',
      description: 'Check which half contains more FAIL cases',
      educational: {
        concept: 'Binary Search Algorithm',
        complexity: 'O(log n)',
        explanation: 'Divide chamber in half - eliminate half of possibilities instantly'
      }
    },
    {
      icon: Shuffle,
      name: 'Bubble Sort',
      tier: 2,
      color: '#8b5cf6',
      description: 'Swap next two adjacent test cases',
      educational: {
        concept: 'Bubble Sort - Adjacent Swapping',
        complexity: 'O(1) for single swap',
        explanation: 'Swap adjacent elements like bubble sort'
      }
    },
    {
      icon: Zap,
      name: 'QuickSort Partition',
      tier: 3,
      color: '#f59e0b',
      description: 'Partition chamber - move all PASS to front',
      educational: {
        concept: 'QuickSort Partitioning',
        complexity: 'O(n)',
        explanation: 'Choose PASS as pivot - partition remaining tests'
      }
    },
    {
      icon: Brain,
      name: 'Hash Table',
      tier: 3,
      color: '#06b6d4',
      description: 'Instantly reveal ALL remaining test cases',
      educational: {
        concept: 'Hash Table - Perfect Information',
        complexity: 'O(1) lookups',
        explanation: 'Hash table stores every test case with O(1) access'
      }
    },
    {
      icon: Sparkles,
      name: 'State Mutation',
      tier: 4,
      color: '#a855f7',
      description: 'Force next test case to PASS',
      educational: {
        concept: 'State Manipulation',
        complexity: 'O(1)',
        explanation: 'Direct memory write - mutate internal state'
      }
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-red-900/20 -z-10" />
      <div 
        className="fixed inset-0 opacity-[0.02] -z-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, #ef444422 0 2px, transparent 2px 40px), repeating-linear-gradient(0deg, #f59e0b22 0 2px, transparent 2px 40px)',
        }}
      />

      {/* Floating Particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="fixed w-1 h-1 rounded-full -z-10"
          style={{ 
            left: `${Math.random() * 100}%`, 
            top: `${Math.random() * 100}%`,
            background: ['#ef4444', '#f59e0b', '#10b981'][Math.floor(Math.random() * 3)]
          }}
          animate={{ y: [0, -120, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 5 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 5 }}
        />
      ))}

      <div className="relative z-10 p-8 max-w-[1400px] mx-auto">
        
        {/* Hero Section */}
        <RevealOnScroll>
          <div className="text-center mb-16 pt-12">
            <motion.div
              className="inline-block mb-6"
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                scale: { duration: 3, repeat: Infinity }
              }}
            >
              <div className="w-24 h-24 rounded-full border-4 border-red-500/30 bg-gradient-to-br from-red-500/20 to-transparent flex items-center justify-center">
                <Target className="w-12 h-12 text-red-400" style={{ filter: 'drop-shadow(0 0 20px #ef4444)' }} />
              </div>
            </motion.div>
            
            <h1 
              style={{ fontFamily: 'Orbitron, sans-serif' }}
              className="text-6xl md:text-8xl font-black mb-6"
            >
              <span style={{
                background: 'linear-gradient(90deg, #ef4444, #f59e0b, #ef4444)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                GAME RULES
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Master the mechanics of Algorithm Roulette. Every decision counts. Every algorithm matters.
            </p>
          </div>
        </RevealOnScroll>

        {/* Tab Navigation */}
        <RevealOnScroll delay={0.2}>
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-red-500 to-amber-500 text-white shadow-lg shadow-red-500/30'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                }`}
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </RevealOnScroll>

        {/* Content Sections */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <div>
                <RevealOnScroll delay={0.3}>
                  <RuleSection
                    icon={Target}
                    title="The Objective"
                    description="Survive against the AI by using probability, deduction, and algorithm knowledge. Reduce your opponent's HP to zero before they reduce yours."
                    color="#ef4444"
                  >
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                        <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                        <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-emerald-400 font-bold mb-1">
                          PASS
                        </div>
                        <div className="text-xs text-gray-500">0 Damage</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                        <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                        <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-amber-400 font-bold mb-1">
                          FAIL
                        </div>
                        <div className="text-xs text-gray-500">1 Damage</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                        <Skull className="w-8 h-8 text-red-400 mx-auto mb-2" />
                        <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-red-400 font-bold mb-1">
                          CRITICAL
                        </div>
                        <div className="text-xs text-gray-500">2 Damage</div>
                      </div>
                    </div>
                  </RuleSection>
                </RevealOnScroll>

                <RevealOnScroll delay={0.4}>
                  <RuleSection
                    icon={Activity}
                    title="Turn Structure"
                    description="Each turn, you must decide: shoot yourself (risky but can give extra turns) or shoot your opponent (deal damage)."
                    color="#f59e0b"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center flex-shrink-0 mt-1">
                          <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-xs font-bold text-emerald-400">1</span>
                        </div>
                        <div>
                          <div className="text-white font-bold mb-1">Use Items (Optional)</div>
                          <div className="text-sm text-gray-400">Gather information or manipulate the chamber</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center flex-shrink-0 mt-1">
                          <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-xs font-bold text-emerald-400">2</span>
                        </div>
                        <div>
                          <div className="text-white font-bold mb-1">Make Your Shot</div>
                          <div className="text-sm text-gray-400">Shoot yourself or shoot opponent</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center flex-shrink-0 mt-1">
                          <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-xs font-bold text-emerald-400">3</span>
                        </div>
                        <div>
                          <div className="text-white font-bold mb-1">Outcome</div>
                          <div className="text-sm text-gray-400">PASS = possible extra turn, FAIL/CRIT = damage dealt</div>
                        </div>
                      </div>
                    </div>
                  </RuleSection>
                </RevealOnScroll>

                <RevealOnScroll delay={0.5}>
                  <RuleSection
                    icon={TrendingUp}
                    title="Difficulty Levels"
                    description="Face AI opponents of increasing intelligence and aggression. Each difficulty changes AI behavior and HP."
                    color="#10b981"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {['Junior Dev', 'Senior Dev', 'Principal Engineer', 'The Algorithm'].map((name, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-black/30 border border-white/10">
                          <div className="text-white font-bold mb-1">{name}</div>
                          <div className="text-xs text-gray-500">HP: {idx + 3}</div>
                        </div>
                      ))}
                    </div>
                  </RuleSection>
                </RevealOnScroll>
              </div>
            )}

            {/* GAMEPLAY */}
            {activeTab === 'gameplay' && (
              <div>
                <RevealOnScroll delay={0.3}>
                  <RuleSection
                    icon={Shield}
                    title="Shooting Yourself"
                    description="The high-risk, high-reward strategy. If you shoot yourself and it's a PASS, you get an extra turn."
                    color="#10b981"
                  >
                    <div className="space-y-3">
                      <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">If PASS:</span>
                        </div>
                        <div className="text-sm text-gray-400">
                          You take no damage and immediately get another turn. Chain multiple PASSes for devastating combos.
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                          <span className="text-red-400 font-bold">If FAIL/CRITICAL:</span>
                        </div>
                        <div className="text-sm text-gray-400">
                          You take damage and your turn ends. Calculate risk vs reward carefully.
                        </div>
                      </div>
                    </div>
                  </RuleSection>
                </RevealOnScroll>

                <RevealOnScroll delay={0.4}>
                  <RuleSection
                    icon={Target}
                    title="Shooting Opponent"
                    description="The safer option. Deal damage if the test case is FAIL or CRITICAL. No risk to yourself."
                    color="#ef4444"
                  >
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                      <div className="text-sm text-gray-400 space-y-2">
                        <div>• If PASS: No damage dealt, turn ends</div>
                        <div>• If FAIL: 1 damage to opponent, turn ends</div>
                        <div>• If CRITICAL: 2 damage to opponent, turn ends</div>
                      </div>
                    </div>
                  </RuleSection>
                </RevealOnScroll>

                <RevealOnScroll delay={0.5}>
                  <RuleSection
                    icon={Brain}
                    title="The Chamber"
                    description="Each round, a new chamber is loaded with a mix of PASS, FAIL, and CRITICAL test cases. Use deduction to predict contents."
                    color="#8b5cf6"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-black/30 border border-white/10">
                        <div className="text-white font-bold mb-2">Easy Mode</div>
                        <div className="text-sm text-gray-400">6 tests: 4 PASS, 2 FAIL</div>
                      </div>
                      <div className="p-4 rounded-lg bg-black/30 border border-white/10">
                        <div className="text-white font-bold mb-2">Medium Mode</div>
                        <div className="text-sm text-gray-400">8 tests: 4 PASS, 3 FAIL, 1 CRIT</div>
                      </div>
                      <div className="p-4 rounded-lg bg-black/30 border border-white/10">
                        <div className="text-white font-bold mb-2">Hard Mode</div>
                        <div className="text-sm text-gray-400">8 tests: 2 PASS, 4 FAIL, 2 CRIT</div>
                      </div>
                      <div className="p-4 rounded-lg bg-black/30 border border-white/10">
                        <div className="text-white font-bold mb-2">Insane Mode</div>
                        <div className="text-sm text-gray-400">10 tests: 3 PASS, 5 FAIL, 2 CRIT</div>
                      </div>
                    </div>
                  </RuleSection>
                </RevealOnScroll>
              </div>
            )}

            {/* ITEMS */}
            {activeTab === 'items' && (
              <div>
                <RevealOnScroll delay={0.3}>
                  <div className="mb-6">
                    <h2 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-3xl font-black text-white mb-4">
                      Algorithm Items
                    </h2>
                    <p className="text-gray-400 leading-relaxed">
                      Each item represents a real computer science concept. Use them strategically to gather information or manipulate the chamber state.
                    </p>
                  </div>
                </RevealOnScroll>

                <div className="grid md:grid-cols-2 gap-4">
                  {items.map((item, idx) => (
                    <RevealOnScroll key={idx} delay={0.3 + idx * 0.1}>
                      <ItemCard {...item} />
                    </RevealOnScroll>
                  ))}
                </div>
              </div>
            )}

            {/* STRATEGY */}
            {activeTab === 'strategy' && (
              <div>
                <RevealOnScroll delay={0.3}>
                  <RuleSection
                    icon={Brain}
                    title="Early Game Strategy"
                    description="Use information-gathering items first. Build your knowledge of the chamber before making risky plays."
                    color="#3b82f6"
                  >
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                        <div className="text-blue-400 font-bold mb-1">1. Use Binary Search</div>
                        <div className="text-sm text-gray-400">Eliminate half the possibilities instantly</div>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                        <div className="text-blue-400 font-bold mb-1">2. Peek Next Test</div>
                        <div className="text-sm text-gray-400">Know exactly what's coming</div>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                        <div className="text-blue-400 font-bold mb-1">3. Calculate Probabilities</div>
                        <div className="text-sm text-gray-400">Use known information to make optimal decisions</div>
                      </div>
                    </div>
                  </RuleSection>
                </RevealOnScroll>

                <RevealOnScroll delay={0.4}>
                  <RuleSection
                    icon={Zap}
                    title="Mid Game Tactics"
                    description="Manipulate the chamber to your advantage. Use sorting and swapping items when you know what's coming."
                    color="#f59e0b"
                  >
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                        <div className="text-amber-400 font-bold mb-1">QuickSort Partition</div>
                        <div className="text-sm text-gray-400">Move all PASSes to front when you have information</div>
                      </div>
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                        <div className="text-amber-400 font-bold mb-1">Bubble Sort Swap</div>
                        <div className="text-sm text-gray-400">Fix bad positioning with adjacent swaps</div>
                      </div>
                    </div>
                  </RuleSection>
                </RevealOnScroll>

                <RevealOnScroll delay={0.5}>
                  <RuleSection
                    icon={Sparkles}
                    title="End Game Power Moves"
                    description="Use legendary items to guarantee wins. State mutation and perfect information can seal victory."
                    color="#a855f7"
                  >
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                        <div className="text-purple-400 font-bold mb-1">State Mutation</div>
                        <div className="text-sm text-gray-400">Force next test to PASS - guaranteed safe shot</div>
                      </div>
                      <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                        <div className="text-purple-400 font-bold mb-1">Hash Table</div>
                        <div className="text-sm text-gray-400">See everything - eliminate all uncertainty</div>
                      </div>
                    </div>
                  </RuleSection>
                </RevealOnScroll>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Stats */}
            <RevealOnScroll delay={0.5}>
              <GlassCard gradient>
                <h3 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Info className="w-6 h-6 text-red-400" />
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-black/30">
                    <span className="text-gray-400">Max HP</span>
                    <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-white font-bold">4</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-black/30">
                    <span className="text-gray-400">Items per Round</span>
                    <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-white font-bold">2-4</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-black/30">
                    <span className="text-gray-400">Chamber Size</span>
                    <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-white font-bold">6-10</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-black/30">
                    <span className="text-gray-400">Difficulty Levels</span>
                    <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-white font-bold">4</span>
                  </div>
                </div>
              </GlassCard>
            </RevealOnScroll>

            {/* Ready to Play */}
            <RevealOnScroll delay={0.6}>
              <GlassCard className="bg-gradient-to-br from-red-900/20 to-amber-900/20">
                <h3 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-xl font-bold text-white mb-4">
                  Ready to Play?
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Now that you know the rules, test your skills against the AI. Use probability, deduction, and algorithm knowledge to survive!
                </p>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(239, 68, 68, 0.5)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/roulette')}
                    className="w-full p-4 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 font-bold flex items-center justify-center gap-2"
                    style={{ fontFamily: 'Orbitron, sans-serif' }}
                  >
                    <Play className="w-5 h-5" fill="currentColor" />
                    Start Playing
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/dashboard')}
                    className="w-full p-4 rounded-xl border-2 border-gray-700 text-gray-300 font-bold flex items-center justify-center gap-2 hover:bg-gray-700/20"
                    style={{ fontFamily: 'Orbitron, sans-serif' }}
                  >
                    <Home className="w-5 h-5" />
                    Back to Dashboard
                  </motion.button>
                </div>
              </GlassCard>
            </RevealOnScroll>

            {/* Pro Tip */}
            <RevealOnScroll delay={0.7}>
              <GlassCard>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-yellow-400 font-bold mb-2">
                      💡 Pro Tip
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Always calculate probabilities. If 60% of remaining tests are PASS, shooting yourself is statistically favorable. Use math to win!
                    </p>
                  </div>
                </div>
              </GlassCard>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </div>
  );
}
