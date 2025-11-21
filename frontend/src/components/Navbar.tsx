// src/components/Navbar.tsx
import React from 'react';

interface NavbarProps {
  onNewAudit: () => void;
  onToggleSidebar: () => void;
  currentMode: 'input' | 'history' | 'public';
  onModeChange: (mode: 'input' | 'history' | 'public') => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNewAudit, onToggleSidebar, currentMode, onModeChange }) => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <button className="menu-button" onClick={onToggleSidebar} aria-label="Menu">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <h1 className="navbar-title">HFA AI Audit Guard</h1>
          
          <div className="navbar-tabs">
            <button
              className={`navbar-tab ${currentMode === 'input' || currentMode === 'history' ? 'active' : ''}`}
              onClick={() => onModeChange('input')}
            >
              Audit
            </button>
            <button
              className={`navbar-tab ${currentMode === 'public' ? 'active' : ''}`}
              onClick={() => onModeChange('public')}
            >
              Public Audits
            </button>
          </div>
        </div>
        <div className="navbar-right">
          {currentMode !== 'public' && (
            <button className="new-audit-button" onClick={onNewAudit}>
              <svg
                width="20"
                height="20"
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
          )}
          <span className="powered-by">Powered by IBM watsonx.ai</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

