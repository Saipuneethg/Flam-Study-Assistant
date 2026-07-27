import React, { useState } from 'react';

export function NoteInput({ onSubmit, isLoading }) {
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (notes.trim().length > 0 && !isLoading) {
      onSubmit(notes);
    }
  };

  const wordCount = notes.trim().split(/\s+/).filter((word) => word.length > 0).length;

  return (
    <div className="note-input-container">
      <form onSubmit={handleSubmit}>
        <div className="note-input-header">
          Subject Notes // Paste text to synthesize
        </div>
        <div className="note-textarea-wrapper">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Start typing..."
            className="note-textarea"
            disabled={isLoading}
          />
          <div className="note-meta">
            [{wordCount} words]
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || wordCount === 0}
          className="generate-btn"
        >
          {isLoading ? "[ PROCESSING... ]" : "[ GENERATE ]"}
        </button>
      </form>
    </div>
  );
}
