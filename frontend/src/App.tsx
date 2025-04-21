import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import PdfConverter from './components/PdfConverter';

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: '#F7FAFC'
      }}>
        <Header />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<PdfConverter />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
