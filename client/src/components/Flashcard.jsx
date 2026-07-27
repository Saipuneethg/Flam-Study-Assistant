import React, { useState } from 'react';

export function Flashcard({ card }) {
  const [isPinned, setIsPinned] = useState(false);

  return (
    <div 
      className={`flashcard-container ${isPinned ? 'pinned' : ''}`}
      onClick={() => setIsPinned(!isPinned)}
      tabIndex={0}
      onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && setIsPinned(!isPinned)}
      role="button"
      aria-label="Flashcard - Hover to flip, click to pin"
    >
      <div className="flashcard-wrapper">
        {/* Front Side */}
        <div className="flashcard-face flashcard-front">
          <span className="flashcard-label">Q</span>
          <p className="flashcard-content">{card.question}</p>
        </div>

        {/* Back Side */}
        <div className="flashcard-face flashcard-back">
          <span className="flashcard-label">A</span>
          <p className="flashcard-content">{card.answer}</p>
        </div>
      </div>
    </div>
  );
}
