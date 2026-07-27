import React from 'react';

export function SkeletonLoader() {
  return (
    <div className="skeleton-container animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>[ PROCESSING NOTES... ]</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <div style={{ width: '100%', height: '20px', background: 'var(--color-lines)', borderRadius: '2px', opacity: 0.5 }}></div>
        <div style={{ width: '80%', height: '20px', background: 'var(--color-lines)', borderRadius: '2px', opacity: 0.5 }}></div>
        <div style={{ width: '60%', height: '20px', background: 'var(--color-lines)', borderRadius: '2px', opacity: 0.5 }}></div>
      </div>
    </div>
  );
}
