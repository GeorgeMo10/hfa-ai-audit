// src/components/SideBySideComparison.tsx
import React from 'react';

interface SideBySideComparisonProps {
  originalText: string;
  improvedText: string;
  title?: string;
}

const SideBySideComparison: React.FC<SideBySideComparisonProps> = ({
  originalText,
  improvedText,
  title = 'Original vs Improved',
}) => {
  return (
    <div className="side-by-side-comparison">
      <h3>{title}</h3>
      <div className="comparison-container">
        <div className="comparison-panel original">
          <div className="comparison-panel-header">
            <h4>Original</h4>
          </div>
          <div className="comparison-panel-content">
            <pre>{originalText}</pre>
          </div>
        </div>
        
        <div className="comparison-panel improved">
          <div className="comparison-panel-header">
            <h4>Improved</h4>
            <span className="improved-badge">✓ Fixed</span>
          </div>
          <div className="comparison-panel-content">
            <pre>{improvedText}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBySideComparison;

