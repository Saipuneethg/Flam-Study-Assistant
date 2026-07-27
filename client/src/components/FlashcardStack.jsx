import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Flashcard } from './Flashcard';

export function FlashcardStack({ flashcards }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(null); // 'next' or 'prev' for animation direction if we want, currently handled by state change

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => Math.min(flashcards.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flashcards.length]);

  const handleNext = () => setCurrentIndex(prev => Math.min(flashcards.length - 1, prev + 1));
  const handlePrev = () => setCurrentIndex(prev => Math.max(0, prev - 1));

  if (!flashcards || flashcards.length === 0) return null;

  return (
    <div className="flashcard-stack-container">
      <div className="flashcard-meta">
        <span>Stack: {currentIndex + 1} of {flashcards.length} drawn</span>
        <span>Arrows ← →</span>
      </div>
      
      <div className="flashcard-deck">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="deck-nav-btn prev"
          aria-label="Previous card"
        >
          <ChevronLeft size={20} />
        </button>
        
        <Flashcard key={flashcards[currentIndex].id || currentIndex} card={flashcards[currentIndex]} />
        
        <button
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          className="deck-nav-btn next"
          aria-label="Next card"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
