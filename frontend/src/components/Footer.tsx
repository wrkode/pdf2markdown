import React from 'react';
import { FaGithub } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer style={{ 
      backgroundColor: '#f1f1f1', 
      padding: '1rem', 
      marginTop: 'auto' 
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <p style={{ fontSize: '0.875rem', color: '#4A5568' }}>
          &copy; {new Date().getFullYear()} PDF2Markdown
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a 
            href="https://github.com/pdf2markdown" 
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#4A5568',
              textDecoration: 'none'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#3182CE'}
            onMouseOut={(e) => e.currentTarget.style.color = '#4A5568'}
          >
            <FaGithub style={{ marginRight: '5px' }} />
            <span style={{ fontSize: '0.875rem' }}>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 