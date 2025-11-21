// src/components/AuditResults.tsx
import React, { useState } from 'react';
import type { AuditResult } from '../types/audit';
import ScoreCards from './ScoreCards';
import IssuesList from './IssuesList';
import SideBySideComparison from './SideBySideComparison';

interface AuditResultsProps {
  result: AuditResult;
  onImprove?: (improvedText: string) => void;
}

const AuditResults: React.FC<AuditResultsProps> = ({ result, onImprove }) => {
  const [improving, setImproving] = useState(false);
  const [improvedText, setImprovedText] = useState<string | null>(result.improvedText || null);
  const [showComparison, setShowComparison] = useState(!!result.improvedText);

  const handleFixIt = async () => {
    if (result.issues.length === 0) {
      alert('No issues to fix!');
      return;
    }

    try {
      setImproving(true);
      const response = await fetch('http://localhost:4000/api/improve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalText: result.originalText,
          issues: result.issues,
          context: result.context,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to improve text');
      }

      const data = await response.json();
      setImprovedText(data.improvedText);
      setShowComparison(true);
      
      // Call callback to update the result in parent
      if (onImprove) {
        onImprove(data.improvedText);
      }
    } catch (error: any) {
      console.error('Improve error:', error);
      alert('Failed to improve text: ' + (error.message || 'Unknown error'));
    } finally {
      setImproving(false);
    }
  };

  return (
    <section className="audit-results">
      <header className="audit-results-header">
        <h2>Audit Results</h2>
        <p className="meta">
          Context: <strong>{result.context}</strong> · Audited at:{' '}
          {new Date(result.createdAt).toLocaleString()}
        </p>
      </header>

      <ScoreCards
        overallScore={result.overallScore}
        scores={result.dimensionScores}
      />

      <IssuesList issues={result.issues} />

      {result.issues.length > 0 && (
        <div className="fix-it-section">
          {!showComparison && (
            <button
              className="fix-it-button"
              onClick={handleFixIt}
              disabled={improving}
            >
              {improving ? (
                <>
                  <div className="button-spinner-small"></div>
                  Fixing issues...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Fix It
                </>
              )}
            </button>
          )}
        </div>
      )}

      {showComparison && improvedText && (
        <SideBySideComparison
          originalText={result.originalText}
          improvedText={improvedText}
          title="Original vs Improved Output"
        />
      )}

      {!showComparison && (
        <section className="original-output">
          <h3>Original Output</h3>
          <pre>{result.originalText}</pre>
        </section>
      )}

      <section className="how-judged">
        <h3>How this was judged</h3>
        <div className="how-judged-content">
          <p>
            This audit evaluates AI-generated content across five key dimensions:
          </p>
          <ul>
            <li><strong>Safety:</strong> Identifies potential harm, dangerous instructions, or unsafe recommendations.</li>
            <li><strong>Hallucination:</strong> Detects false information, made-up facts, or unsupported claims.</li>
            <li><strong>Bias:</strong> Checks for discriminatory language, unfair treatment, or prejudiced content.</li>
            <li><strong>Reliability:</strong> Assesses accuracy, consistency, and factual correctness of the content.</li>
            <li><strong>Compliance:</strong> Evaluates adherence to relevant regulations, standards, and industry guidelines.</li>
          </ul>
          <p className="context-note">
            This evaluation was performed using context-specific criteria for <strong>{result.context}</strong> domains.
          </p>
        </div>
      </section>
    </section>
  );
};

export default AuditResults;

