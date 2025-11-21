// src/components/AuditInput.tsx
import React from 'react';
import type { AuditContext } from '../types/audit';

interface AuditInputProps {
  text: string;
  context: AuditContext;
  onTextChange: (value: string) => void;
  onContextChange: (value: AuditContext) => void;
  onSubmit: () => void;
  loading: boolean;
}

const AuditInput: React.FC<AuditInputProps> = ({
  text,
  context,
  onTextChange,
  onContextChange,
  onSubmit,
  loading,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading && text.trim().length > 0) {
      onSubmit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading && text.trim().length > 0) {
        onSubmit();
      }
    }
  };

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(e.target.value);
    // Auto-resize
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <form className="audit-input" onSubmit={handleSubmit}>
      <div className="audit-input-header">
        <label htmlFor="context">Context:</label>
        <select
          id="context"
          value={context}
          onChange={(e) => onContextChange(e.target.value as AuditContext)}
        >
          <option value="manufacturing">Manufacturing / Industrial</option>
          <option value="hr">HR / Policy / People</option>
          <option value="general">General Business</option>
        </select>
      </div>

      <div className="textarea-wrapper">
        <textarea
          className="audit-textarea"
          placeholder="Paste AI-generated output here..."
          value={text}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button
          type="submit"
          className="audit-submit-button"
          disabled={loading || text.trim().length === 0}
          aria-label="Submit audit"
        >
          {loading ? (
            <div className="button-spinner"></div>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          )}
        </button>
      </div>

      <div className="audit-input-footer">
        <small className="hint">
          Press <kbd>Enter</kbd> to submit, <kbd>Shift+Enter</kbd> for new line
        </small>
      </div>
    </form>
  );
};

export default AuditInput;
