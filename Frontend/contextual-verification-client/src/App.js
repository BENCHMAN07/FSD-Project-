// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import URLInputPage from './components/URLInputPage';
import ScorePage from './components/ScorePage';
import AuthPage from './components/AuthPage';
import ReportPage from './components/ReportPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<URLInputPage />} />
        <Route path="/score" element={<ScorePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </Router>
  );
}

export default App;