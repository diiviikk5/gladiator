import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext, Suspense } from 'react';
import { lazy } from 'react';
import LH from './pages/Lh';

// ==================== LAZY LOAD PAGES ====================
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Play = lazy(() => import('./pages/Play'));
const Colony = lazy(() => import('./pages/Colony'));
const Roulette = lazy(() => import('./pages/Roulette')); // ✅ FIXED: Just 'Roulette' not 'Roulette/Roulette'
const Rules = lazy(() => import('./pages/Rules'));
const Learn = lazy(() => import('./pages/Learn'));
const Arena = lazy(() => import('./pages/Arena'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Duel = lazy(() => import('./pages/Duel'));


// ==================== LOADING SCREEN ====================
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900/20 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-500 border-r-red-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-yellow-500 border-l-yellow-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
        
        <p style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
          LOADING...
        </p>
        <p className="text-gray-400 text-sm mt-2">Initializing Gladiator Arena</p>
      </div>
    </div>
  );
}


// ==================== ERROR BOUNDARY ====================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-500 mb-4">⚠️ SYSTEM ERROR</h1>
            <p className="text-gray-300 mb-6">Something went wrong. Please refresh the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors"
            >
              RELOAD PAGE
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


// ==================== PROTECTED ROUTE ====================
function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}


// ==================== MAIN APP ====================
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/" element={<Landing />} />

              {/* PROTECTED ROUTES - GAME MODES */}
              <Route path="/lh" element={<ProtectedRoute><LH /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/play" element={<ProtectedRoute><Play /></ProtectedRoute>} />
              <Route path="/duel" element={<ProtectedRoute><Duel /></ProtectedRoute>} />
              <Route path="/roulette" element={<ProtectedRoute><Roulette /></ProtectedRoute>} />
              <Route path="/arena" element={<ProtectedRoute><Arena /></ProtectedRoute>} />
              <Route path="/colony" element={<ProtectedRoute><Colony /></ProtectedRoute>} />

              {/* PROTECTED ROUTES - UTILITY */}
              <Route path="/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
              <Route path="/rules" element={<ProtectedRoute><Rules /></ProtectedRoute>} />
              <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />

              {/* CATCH ALL */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
