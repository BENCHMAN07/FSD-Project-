// src/components/URLInputPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const URLInputPage = () => {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/fetch_details', { url });
      localStorage.setItem('analysisData', JSON.stringify(response.data));
      navigate('/score', { state: { analysis: response.data } });
    } catch (error) {
      console.error(error);
      alert('Error fetching details. Please try a valid URL.');
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(to right,rgb(0, 5, 91),rgb(0, 10, 194))',
    color: '#fff',
    textAlign: 'center',
    padding: '20px'
  };

  const formStyle = {
    backgroundColor: 'rgba(252, 0, 0, 0.57)',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(87, 0, 0, 0.3)'
  };

  const inputStyle = {
    padding: '12px',
    fontSize: '16px',
    width: '300px',
    borderRadius: '4px',
    border: 'none',
    marginBottom: '20px'
  };

  const buttonStyle = {
    padding: '12px 24px',
    fontSize: '16px',
    borderRadius: '4px',
    backgroundColor: '#ff5555',
    color: '#fff',
    border: 'none',
    cursor: 'pointer'
  };

  return (
    <div style={containerStyle}>
      <h1>Enter Webpage URL</h1>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          placeholder="Enter URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={inputStyle}
          required
        />
        <br />
        <button type="submit" style={buttonStyle}>Analyze</button>
      </form>
    </div>
  );
};

export default URLInputPage;