// src/components/IssuesList.tsx
import React from 'react';
import type { AuditIssue } from '../types/audit';

interface IssuesListProps {
  issues: AuditIssue[];
}

const severityColor = (severity: string): string => {
  switch (severity) {
    case 'high':
      return '#f97373'; // red-ish
    case 'medium':
      return '#facc6b'; // yellow-ish
    case 'low':
    default:
      return '#6ee7b7'; // green-ish
  }
};

const IssuesList: React.FC<IssuesListProps> = ({ issues }) => {
  if (!issues || issues.length === 0) {
    return (
      <div className="issues">
        <h3>Flagged Issues</h3>
        <p>No critical issues detected in this output.</p>
      </div>
    );
  }

  return (
    <div className="issues">
      <h3>Flagged Issues</h3>
      <ul className="issues-list">
        {issues.map((issue) => (
          <li key={issue.id} className="issue-item">
            <div className="issue-header">
              <span
                className="severity-dot"
                style={{ backgroundColor: severityColor(issue.severity) }}
              />
              <span className="issue-type">
                {issue.type.toUpperCase()} – {issue.severity.toUpperCase()}
              </span>
            </div>
            <p className="issue-description">{issue.description}</p>
            {issue.snippet && (
              <pre className="issue-snippet">
                {issue.snippet}
                {issue.snippet.length >= 120 ? '…' : ''}
              </pre>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IssuesList;

