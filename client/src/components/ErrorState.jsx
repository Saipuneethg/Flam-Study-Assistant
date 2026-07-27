import React from 'react';

export function ErrorState({ error, onRetry }) {
  return (
    <div className="error-container animate-fade-in">
      <div style={{ marginBottom: '1rem', fontWeight: 'bold' }}>[ ERROR ENCOUNTERED ]</div>
      <p style={{ marginBottom: '2rem' }}>{error}</p>
      <button 
        onClick={onRetry}
        style={{
          fontFamily: 'var(--font-mono)',
          textDecoration: 'underline',
          color: 'var(--color-ink)'
        }}
      >
        Retry Process
      </button>
    </div>
  );
}
