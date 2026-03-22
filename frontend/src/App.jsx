import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Impact from './pages/Impact';
import DisposalHistory from './pages/DisposalHistory';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/impact" element={<ProtectedRoute><Impact /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><DisposalHistory /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
