// src/components/ScorePage.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ScorePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  let analysis;
  try {
    analysis = location.state?.analysis || JSON.parse(localStorage.getItem('analysisData'));
  } catch (err) {
    console.error("Error parsing analysis data:", err);
    analysis = null;
  }

  if (!analysis || !analysis.scores) {
    navigate('/');
    return null;
  }

  let overallScore = analysis.scores.overallScore;
  if (overallScore === undefined || overallScore === null) {
    overallScore = "N/A";
  } else if (typeof overallScore !== 'string') {
    overallScore = overallScore.toString();
  }

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(to right, #11998e, #38ef7d)',
    color: '#fff',
    textAlign: 'center',
    padding: '20px'
  };

  const buttonStyle = {
    padding: '12px 24px',
    fontSize: '16px',
    borderRadius: '4px',
    backgroundColor: '#ff5555',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    marginTop: '20px'
  };

  return (
    <div style={containerStyle}>
      <h1>Webpage Score</h1>
      <h2>Overall Score: {overallScore}</h2>
      <button style={buttonStyle} onClick={() => navigate('/auth')}>
        Sign Up / Log In for More Details
      </button>
    </div>
  );
};

export default ScorePage;