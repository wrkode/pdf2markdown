import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { FaDownload, FaCheckCircle } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

interface ToastMessage {
  title: string;
  description: string;
  status: 'info' | 'warning' | 'success' | 'error';
}

const PdfConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [converted, setConverted] = useState(false);
  const [filename, setFilename] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: ToastMessage) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

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
        showToast({
          title: 'Conversion successful',
          description: 'Your PDF has been converted to Markdown',
          status: 'success'
        });
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

    showToast({
      title: 'Download started',
      description: 'Your Markdown file is being downloaded',
      status: 'info'
    });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {toast && (
        <div 
          style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            padding: '1rem',
            backgroundColor: toast.status === 'error' ? '#FED7D7' :
                             toast.status === 'success' ? '#C6F6D5' :
                             toast.status === 'warning' ? '#FEEBC8' : '#BEE3F8',
            borderRadius: '0.375rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            maxWidth: '24rem'
          }}
        >
          <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{toast.title}</h3>
          <p>{toast.description}</p>
        </div>
      )}

      <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>PDF to Markdown Converter</h2>
      <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#4A5568' }}>
        Upload your PDF file and convert it to Markdown format
      </p>
      
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: '2rem', 
        border: '1px solid #E2E8F0', 
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
            backgroundColor: isDragActive ? '#EBF8FF' : '#F7FAFC'
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
            <p style={{ color: '#38A169', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaCheckCircle style={{ marginRight: '0.5rem' }} /> File selected
            </p>
          )}
        </div>
        
        {error && (
          <div style={{ 
            backgroundColor: '#FED7D7', 
            color: '#C53030', 
            padding: '0.75rem', 
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
            opacity: !file || loading ? '0.7' : '1',
            fontWeight: 'bold'
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
          border: '1px solid #E2E8F0', 
          borderRadius: '0.5rem',
          backgroundColor: 'white'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Conversion Result</h3>
            <button 
              onClick={handleDownload}
              style={{
                backgroundColor: '#38A169',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <FaDownload style={{ marginRight: '0.5rem' }} />
              Download Markdown
            </button>
          </div>
          
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '1rem'
          }}>
            <div style={{
              display: 'flex',
              borderBottom: '1px solid #E2E8F0'
            }}>
              <button 
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: '2px solid #3182CE',
                  fontWeight: 'bold'
                }}
              >
                Preview
              </button>
            </div>
            
            <div style={{ 
              border: '1px solid #E2E8F0', 
              borderTop: 'none',
              borderRadius: '0 0 0.25rem 0.25rem',
              padding: '1rem',
              height: '400px',
              overflowY: 'auto',
              backgroundColor: 'white'
            }}>
              <ReactMarkdown>
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfConverter; 