// src/App.tsx
import React, { useState, useEffect } from 'react';
import './App.css';
import type { AuditContext, AuditResult } from './types/audit';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AuditInput from './components/AuditInput';
import AuditResults from './components/AuditResults';
import HistoryAudit from './components/HistoryAudit';
import PublicAudits from './components/PublicAudits';

const STORAGE_KEY = 'hfa-audit-history';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [auditHistory, setAuditHistory] = useState<AuditResult[]>([]);
  const [selectedAudit, setSelectedAudit] = useState<AuditResult | null>(null);
  const [currentMode, setCurrentMode] = useState<'input' | 'history' | 'public'>('input');
  
  // Input state
  const [text, setText] = useState('');
  const [context, setContext] = useState<AuditContext>('manufacturing');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Debug sidebar state changes
  useEffect(() => {
    console.log('App: Sidebar state changed to:', sidebarOpen);
  }, [sidebarOpen]);

  // Handle window resize to ensure responsive behavior works
  useEffect(() => {
    const handleResize = () => {
      console.log('Window resized, current sidebar state:', sidebarOpen);
      // Force a re-render check when window is resized
      // This helps with responsive CSS issues
      if (window.innerWidth >= 1024 && !sidebarOpen) {
        // On desktop, sidebar should be open by default
        console.log('Desktop detected, ensuring sidebar state is correct');
      }
    };

    window.addEventListener('resize', handleResize);
    // Trigger once on mount to check initial state
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sidebarOpen]);

  // Load audit history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const history = JSON.parse(stored) as AuditResult[];
        setAuditHistory(history);
      } catch (e) {
        console.error('Failed to load audit history:', e);
      }
    }
  }, []);

  // Save audit history to localStorage whenever it changes
  useEffect(() => {
    if (auditHistory.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auditHistory));
    }
  }, [auditHistory]);

  const handleAudit = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      setCurrentMode('input');
      setSelectedAudit(null); // Clear any selected audit

      const response = await fetch('http://localhost:4000/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, context }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Server error: ${response.status}`);
      }

      const data: AuditResult = await response.json();
      setResult(data);
      
      // Add to history
      const updatedHistory = [data, ...auditHistory];
      setAuditHistory(updatedHistory);
      
      // Clear the input after successful audit
      setText('');
      
    } catch (err: any) {
      console.error('Audit error:', err);
      
      // Check for network/connection errors
      let errorMessage = 'Unable to connect to the server.';
      
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to the server. Please make sure the backend server is running on port 4000.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleNewAudit = () => {
    setSelectedAudit(null);
    setResult(null);
    setText('');
    setCurrentMode('input');
    setSidebarOpen(false);
  };

  const handleImproveText = (improvedText: string) => {
    if (result) {
      const updatedResult = { ...result, improvedText };
      setResult(updatedResult);
      
      // Update in history
      const updatedHistory = auditHistory.map(audit =>
        audit.id === result.id ? updatedResult : audit
      );
      setAuditHistory(updatedHistory);
    }
  };

  const handleSelectAudit = (audit: AuditResult) => {
    setSelectedAudit(audit);
    setResult(null);
    setCurrentMode('history');
    setSidebarOpen(false);
  };

  const handleToggleSidebar = () => {
    console.log('App: Toggle sidebar, current state:', sidebarOpen);
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    console.log('App: Close sidebar called, current state:', sidebarOpen);
    setSidebarOpen(false);
  };

  return (
    <div className="app">
      <Navbar 
        onNewAudit={handleNewAudit} 
        onToggleSidebar={handleToggleSidebar}
        currentMode={currentMode}
        onModeChange={(mode) => {
          setCurrentMode(mode);
          if (mode === 'input') {
            setSelectedAudit(null);
            setResult(null);
          }
        }}
      />
      
      <div className="app-body">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={handleCloseSidebar}
          auditHistory={auditHistory}
          onSelectAudit={handleSelectAudit}
          selectedAuditId={selectedAudit?.id || null}
          onNewAudit={handleNewAudit}
        />

        <main className="main-content">
          {currentMode === 'public' ? (
            <div className="public-audits-container">
              <PublicAudits />
            </div>
          ) : currentMode === 'input' ? (
            <div className="chat-container">
              <div className="chat-messages-area">
                {!result && !loading && !error && (
                  <div className="welcome-message">
                    <h2>AI Audit Guard</h2>
                    <p>
                      Audit AI-generated outputs for safety, hallucinations, bias, reliability, and compliance.
                    </p>
                  </div>
                )}

                {loading && (
                  <div className="loading-message">
                    <div className="loading-spinner"></div>
                    <p>Auditing output…</p>
                  </div>
                )}

                {error && (
                  <div className="error-message">
                    <p className="error-text">{error}</p>
                  </div>
                )}

                {result && (
                  <div className="chat-message assistant">
                    <div className="message-content">
                      <AuditResults result={result} onImprove={handleImproveText} />
                    </div>
                  </div>
                )}
              </div>

              <div className="chat-input-container">
                <AuditInput
                  text={text}
                  context={context}
                  onTextChange={setText}
                  onContextChange={setContext}
                  onSubmit={handleAudit}
                  loading={loading}
                />
              </div>
            </div>
          ) : (
            <HistoryAudit 
              audit={selectedAudit} 
              onNewAudit={handleNewAudit}
              onImprove={(improvedText) => {
                if (selectedAudit) {
                  const updatedAudit = { ...selectedAudit, improvedText };
                  setSelectedAudit(updatedAudit);
                  const updatedHistory = auditHistory.map(audit =>
                    audit.id === selectedAudit.id ? updatedAudit : audit
                  );
                  setAuditHistory(updatedHistory);
                }
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
