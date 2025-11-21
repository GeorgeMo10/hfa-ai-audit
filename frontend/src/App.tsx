// src/App.tsx
import React, { useState, useEffect } from 'react';
import './App.css';
import type { AuditContext, AuditResult } from './types/audit';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AuditInput from './components/AuditInput';
import AuditResults from './components/AuditResults';
import HistoryAudit from './components/HistoryAudit';

const STORAGE_KEY = 'hfa-audit-history';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [auditHistory, setAuditHistory] = useState<AuditResult[]>([]);
  const [selectedAudit, setSelectedAudit] = useState<AuditResult | null>(null);
  const [currentMode, setCurrentMode] = useState<'input' | 'history'>('input');
  
  // Input state
  const [text, setText] = useState('');
  const [context, setContext] = useState<AuditContext>('manufacturing');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate mock audit result
      const mockResult: AuditResult = {
        id: `audit-${Date.now()}`,
        createdAt: new Date().toISOString(),
        context: context,
        originalText: text,
        overallScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
        dimensionScores: {
          safety: Math.floor(Math.random() * 30) + 70,
          hallucination: Math.floor(Math.random() * 30) + 70,
          bias: Math.floor(Math.random() * 30) + 70,
          reliability: Math.floor(Math.random() * 30) + 70,
          compliance: Math.floor(Math.random() * 30) + 70,
        },
        issues: [
          {
            id: 'issue-1',
            type: 'safety',
            severity: 'medium',
            description: 'Contains a potential safety concern that should be reviewed.',
            snippet: text.substring(0, 80) + (text.length > 80 ? '...' : ''),
          },
          {
            id: 'issue-2',
            type: 'bias',
            severity: 'low',
            description: 'Minor bias concern detected in the content.',
          },
        ],
      };

      setResult(mockResult);
      
      // Add to history
      const updatedHistory = [mockResult, ...auditHistory];
      setAuditHistory(updatedHistory);
      
      // Clear the input after successful audit
      setText('');
      
    } catch (err: any) {
      console.error('Audit error:', err);
      setError('An unexpected error occurred. Please try again.');
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

  const handleSelectAudit = (audit: AuditResult) => {
    setSelectedAudit(audit);
    setResult(null);
    setCurrentMode('history');
    setSidebarOpen(false);
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app">
      <Navbar onNewAudit={handleNewAudit} onToggleSidebar={handleToggleSidebar} />
      
      <div className="app-body">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          auditHistory={auditHistory}
          onSelectAudit={handleSelectAudit}
          selectedAuditId={selectedAudit?.id || null}
          onNewAudit={handleNewAudit}
        />

        <main className="main-content">
          {currentMode === 'input' ? (
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
                      <AuditResults result={result} />
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
            <HistoryAudit audit={selectedAudit} onNewAudit={handleNewAudit} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
