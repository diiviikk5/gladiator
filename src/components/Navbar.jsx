import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Target, BookOpen, GraduationCap, Trophy, Home, Code, Swords, LogOut, Menu, X, LogIn, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Duel', path: '/duel', icon: Swords },
    { name: 'Play', path: '/play', icon: Target },
    { name: 'Roulette', path: '/roulette', icon: Trophy },
    { name: 'Rules', path: '/rules', icon: BookOpen },
    { name: 'Learn', path: '/learn', icon: GraduationCap },
    { name: 'Achievements', path: '/achievements', icon: Trophy },
  ];

  const handleLogout = async () => {
    await logout();
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full z-50 border-b border-cyan-500/20 bg-black/95 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/">
              <motion.div 
                className="flex items-center gap-3 cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ 
                    fontFamily: 'Orbitron, sans-serif',
                    background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }} className="text-lg font-black tracking-tight">
                    ALGO DUEL
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                
                return (
                  <Link key={link.path} to={link.path}>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                        isActive 
                          ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20' 
                          : 'border-2 border-gray-800 hover:border-cyan-500/30 hover:bg-cyan-500/5'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-gray-400'}`} />
                      <span style={{ fontFamily: 'Orbitron, sans-serif' }} className={`text-xs font-bold ${
                        isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                      }`}>
                        {link.name}
                      </span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Right Section: User Info + Logout */}
            <div className="flex items-center gap-4">
              {loading ? (
                <div className="w-10 h-10 bg-gray-800 rounded-lg animate-pulse" />
              ) : user ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 hover:border-cyan-500 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user.username?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="text-right">
                      <p style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-xs font-bold text-cyan-400">
                        {user.username?.substring(0, 12)}
                      </p>
                      <p className="text-xs text-gray-400">Level 1</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                  </motion.button>

                  {/* Profile Dropdown Menu */}
                  <AnimatePresence>
                    {profileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-gray-900 border border-cyan-500/30 rounded-xl shadow-xl z-50"
                      >
                        <div className="p-4 border-b border-gray-800">
                          <p style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-sm font-bold text-cyan-400">
                            {user.username}
                          </p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02, x: 5 }}
                          onClick={handleLogout}
                          className="w-full px-4 py-3 text-left flex items-center gap-3 text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="font-bold">
                            LOGOUT
                          </span>
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Mobile Profile Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="md:hidden p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-bold text-xs">
                        {user.username?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  </motion.button>
                </div>
              ) : (
                <Link to="/">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 text-black font-bold hover:bg-cyan-600 transition-all"
                    style={{ fontFamily: 'Orbitron, sans-serif' }}
                  >
                    <LogIn className="w-4 h-4" />
                    LOGIN
                  </motion.button>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-cyan-400" />
                ) : (
                  <Menu className="w-6 h-6 text-cyan-400" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-gray-800 bg-black/80 backdrop-blur"
              >
                <div className="px-6 py-4 space-y-2">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    
                    return (
                      <Link 
                        key={link.path} 
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <motion.div
                          whileHover={{ scale: 1.02, x: 5 }}
                          className={`px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                            isActive 
                              ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-l-2 border-cyan-500' 
                              : 'hover:bg-gray-900/50'
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-gray-400'}`} />
                          <span style={{ fontFamily: 'Orbitron, sans-serif' }} className={`font-bold ${
                            isActive ? 'text-cyan-400' : 'text-gray-400'
                          }`}>
                            {link.name}
                          </span>
                        </motion.div>
                      </Link>
                    );
                  })}
                  
                  {user && (
                    <>
                      <div className="my-4 h-px bg-gray-800" />
                      <motion.button
                        whileHover={{ scale: 1.02, x: 5 }}
                        onClick={handleLogout}
                        className="w-full px-4 py-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-all flex items-center gap-3 font-bold"
                      >
                        <LogOut className="w-5 h-5" />
                        <span style={{ fontFamily: 'Orbitron, sans-serif' }}>LOGOUT</span>
                      </motion.button>
                    </>
                  )}

                  {!user && (
                    <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                      <motion.button
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="w-full px-4 py-3 rounded-lg bg-cyan-500 text-black hover:bg-cyan-600 transition-all flex items-center justify-center gap-3 font-bold"
                        style={{ fontFamily: 'Orbitron, sans-serif' }}
                      >
                        <LogIn className="w-5 h-5" />
                        LOGIN
                      </motion.button>
                    </Link>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      <div className="h-16" />
    </>
  );
}
