import React from 'react';
import { FaFilePdf } from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <header style={{ 
      backgroundColor: '#3182CE', 
      color: 'white', 
      padding: '1rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaFilePdf size={30} style={{ marginRight: '10px' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>PDF2Markdown</h1>
        </div>
        <p style={{ fontSize: '0.875rem' }}>Convert PDF documents to Markdown with ease</p>
      </div>
    </header>
  );
};

export default Header; 