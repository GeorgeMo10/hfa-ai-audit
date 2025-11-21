// src/components/AuditResults.tsx
import React from 'react';
import type { AuditResult } from '../types/audit';
import ScoreCards from './ScoreCards';
import IssuesList from './IssuesList';

interface AuditResultsProps {
  result: AuditResult;
}

const AuditResults: React.FC<AuditResultsProps> = ({ result }) => {
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

      <section className="original-output">
        <h3>Original Output</h3>
        <pre>{result.originalText}</pre>
      </section>
    </section>
  );
};

export default AuditResults;

