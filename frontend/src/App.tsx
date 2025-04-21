import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './App.css';

const Header = () => (
  <header style={{ backgroundColor: '#3182CE', color: 'white', padding: '1rem' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1>PDF2Markdown</h1>
      </div>
      <p>Convert PDF documents to Markdown with ease</p>
    </div>
  </header>
);

const Footer = () => (
  <footer style={{ backgroundColor: '#f1f1f1', padding: '1rem', marginTop: 'auto' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between' }}>
      <p>&copy; {new Date().getFullYear()} PDF2Markdown</p>
      <a href="https://github.com/pdf2markdown" target="_blank" rel="noopener noreferrer">GitHub</a>
    </div>
  </footer>
);

const PdfConverter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [converted, setConverted] = useState(false);
  const [filename, setFilename] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setConverted(false);
      setMarkdown('');
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const handleConvert = async () => {
    if (!file) {
      setError('Please upload a PDF file first');
      return;
    }

    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('pdfFile', file);

    try {
      const response = await axios.post('/api/convert', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setMarkdown(response.data.markdown);
        setFilename(response.data.filename);
        setConverted(true);
      } else {
        setError('Failed to convert PDF');
      }
    } catch (error) {
      console.error('Conversion error:', error);
      setError('An error occurred while converting the PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!markdown) return;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename || 'document'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>PDF to Markdown Converter</h2>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Upload your PDF file and convert it to Markdown format
      </p>
      
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: '2rem', 
        border: '1px solid #e2e8f0', 
        borderRadius: '0.5rem',
        backgroundColor: 'white'
      }}>
        <div 
          {...getRootProps()} 
          style={{ 
            border: '2px dashed #CBD5E0',
            borderRadius: '0.5rem',
            padding: '3rem',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '1rem',
            backgroundColor: isDragActive ? '#ebf8ff' : '#f8f9fa'
          }}
        >
          <input {...getInputProps()} />
          <p>{isDragActive
            ? "Drop your PDF here..."
            : file
            ? `Selected: ${file.name}`
            : "Drag & drop your PDF here, or click to select"}
          </p>
          {file && (
            <p style={{ color: 'green', marginTop: '0.5rem' }}>
              File selected
            </p>
          )}
        </div>
        
        {error && (
          <div style={{ 
            backgroundColor: '#FEE2E2', 
            color: '#B91C1C', 
            padding: '0.5rem', 
            borderRadius: '0.25rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}
        
        <button 
          onClick={handleConvert}
          disabled={!file || loading}
          style={{
            backgroundColor: '#3182CE',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            border: 'none',
            cursor: !file || loading ? 'not-allowed' : 'pointer',
            width: '100%',
            opacity: !file || loading ? '0.7' : '1'
          }}
        >
          {loading ? 'Converting...' : 'Convert to Markdown'}
        </button>
      </div>

      {converted && (
        <div style={{ 
          maxWidth: '800px', 
          margin: '2rem auto', 
          padding: '2rem', 
          border: '1px solid #e2e8f0', 
          borderRadius: '0.5rem',
          backgroundColor: 'white'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h3>Conversion Result</h3>
            <button 
              onClick={handleDownload}
              style={{
                backgroundColor: '#38A169',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                border: 'none'
              }}
            >
              Download Markdown
            </button>
          </div>
          
          <div style={{ 
            border: '1px solid #e2e8f0', 
            borderRadius: '0.25rem',
            padding: '1rem',
            height: '400px',
            overflowY: 'auto',
            backgroundColor: '#f8f9fa',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            textAlign: 'left'
          }}>
            <ReactMarkdown>
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: '#f7fafc'
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
