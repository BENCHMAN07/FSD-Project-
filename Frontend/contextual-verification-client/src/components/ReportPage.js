// src/components/ReportPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReportPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const downloadReport = async () => {
    setLoading(true);
    try {
      const analysis = JSON.parse(localStorage.getItem('analysisData'));
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/report/generate',
        analysis,
        {
          responseType: 'blob',
          headers: { 'Authorization': token }
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'report.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error generating report", error);
      alert("Error generating report.");
    }
    setLoading(false);
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
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
      <h1>Detailed Analysis Report</h1>
      <button
        onClick={downloadReport}
        style={buttonStyle}
        disabled={loading}
      >
        {loading ? 'Generating Report...' : 'Download PDF Report'}
      </button>
      <button
        onClick={() => navigate('/')}
        style={{ ...buttonStyle, backgroundColor: 'transparent', border: '1px solid #fff', marginTop: '20px' }}
      >
        Back to Home
      </button>
    </div>
  );
};

export default ReportPage;