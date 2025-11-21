// src/components/Sidebar.tsx
import React from 'react';
import type { AuditResult } from '../types/audit';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  auditHistory: AuditResult[];
  onSelectAudit: (audit: AuditResult) => void;
  selectedAuditId: string | null;
  onNewAudit: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  auditHistory,
  onSelectAudit,
  selectedAuditId,
  onNewAudit,
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const truncateText = (text: string, maxLength: number = 50): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button className="new-chat-button" onClick={onNewAudit}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Audit
          </button>
        </div>
        <div className="sidebar-content">
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Recent Audits</h3>
            {auditHistory.length === 0 ? (
              <p className="sidebar-empty">No audit history yet</p>
            ) : (
              <div className="audit-history-list">
                {auditHistory.map((audit) => (
                  <button
                    key={audit.id}
                    className={`audit-history-item ${
                      selectedAuditId === audit.id ? 'active' : ''
                    }`}
                    onClick={() => onSelectAudit(audit)}
                  >
                    <div className="audit-history-item-header">
                      <span className="audit-history-context">{audit.context}</span>
                      <span className="audit-history-date">
                        {formatDate(audit.createdAt)}
                      </span>
                    </div>
                    <div className="audit-history-preview">
                      {truncateText(audit.originalText)}
                    </div>
                    <div className="audit-history-score">
                      Score: {audit.overallScore}/100
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

