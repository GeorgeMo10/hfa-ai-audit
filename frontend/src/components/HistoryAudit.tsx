// src/components/HistoryAudit.tsx
import React from 'react';
import type { AuditResult } from '../types/audit';
import AuditResults from './AuditResults';

interface HistoryAuditProps {
  audit: AuditResult | null;
  onNewAudit: () => void;
  onImprove?: (improvedText: string) => void;
}

const HistoryAudit: React.FC<HistoryAuditProps> = ({ audit, onNewAudit, onImprove }) => {
  if (!audit) {
    return (
      <div className="history-audit-empty">
        <div className="empty-state">
          <h2>Select an audit from history</h2>
          <p>Choose an audit from the sidebar to view its details, or start a new audit.</p>
          <button className="empty-state-button" onClick={onNewAudit}>
            Start New Audit
          </button>
        </div>
      </div>
    );
  }

  const handleImprove = (improvedText: string) => {
    if (onImprove) {
      onImprove(improvedText);
    }
  };

  return (
    <div className="history-audit">
      <AuditResults result={audit} onImprove={handleImprove} />
    </div>
  );
};

export default HistoryAudit;

