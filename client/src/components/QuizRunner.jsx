import React, { useState } from 'react';

export function QuizRunner({ questions }) {
  const [activeQuestions, setActiveQuestions] = useState(questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [failedQuestions, setFailedQuestions] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = activeQuestions[currentIndex];

  const handleAnswer = (index) => {
    setSelectedOption(index);
    const isCorrect = index === currentQ.correctIndex;

    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      setFailedQuestions(prev => [...prev, currentQ]);
    }
  };

  const handleNext = React.useCallback(() => {
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  }, [currentIndex, activeQuestions.length]);

  const handleRetestFailed = () => {
    setActiveQuestions(failedQuestions);
    setFailedQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsFinished(false);
  };

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (isFinished) return;
      
      if (selectedOption !== null) {
        if (e.key === 'Enter' || e.key === ' ') {
          handleNext();
        }
        return;
      }
      
      const key = parseInt(e.key, 10);
      if (key >= 1 && key <= 4) {
        // Adjust for 0-indexed options
        const optionIndex = key - 1;
        if (optionIndex < currentQ.options.length) {
          handleAnswer(optionIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFinished, selectedOption, currentQ, handleNext]);

  if (isFinished) {
    return (
      <div className="quiz-container quiz-finished animate-fade-in">
        <h3>Evaluation Complete</h3>
        <p style={{ fontFamily: 'var(--font-mono)', marginBottom: '1.5rem' }}>
          Score: {score} / {activeQuestions.length}
        </p>

        {failedQuestions.length > 0 ? (
          <div>
            <p>Missed cards: {failedQuestions.length}</p>
            <button 
              onClick={handleRetestFailed}
              className="retest-btn"
            >
              Redraw missed cards
            </button>
          </div>
        ) : (
          <p style={{ color: 'var(--color-accent)' }}>Flawless score.</p>
        )}
      </div>
    );
  }

  return (
    <div className="quiz-container animate-fade-in">
      <div className="quiz-meta">
        <span>Q {currentIndex + 1} / {activeQuestions.length}</span>
        <span>Score: {score}</span>
      </div>

      <h4 className="quiz-question">{currentQ.question}</h4>

      <div className="quiz-options">
        {currentQ.options.map((option, idx) => {
          let optionClass = "quiz-option";
          if (selectedOption !== null) {
            if (idx === currentQ.correctIndex) {
              optionClass += " selected-correct";
            } else if (idx === selectedOption) {
              optionClass += " selected-wrong";
            } else {
              optionClass += " dimmed";
            }
          }

          return (
            <button
              key={idx}
              disabled={selectedOption !== null}
              onClick={() => handleAnswer(idx)}
              className={optionClass}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selectedOption !== null && (
        <div className="quiz-explanation animate-fade-in" style={{ marginTop: '1.5rem', padding: '1rem', borderTop: '1px dashed var(--color-lines)' }}>
          <p style={{ marginBottom: '1rem', color: selectedOption === currentQ.correctIndex ? 'var(--color-accent)' : 'var(--color-danger)', fontWeight: 'bold' }}>
            {selectedOption === currentQ.correctIndex ? 'Correct!' : 'Incorrect.'}
          </p>
          <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem', color: 'var(--color-ink)' }}>
            <strong style={{ fontFamily: 'var(--font-mono)' }}>Explanation:</strong> {currentQ.explanation}
          </p>
          <button 
            onClick={handleNext}
            className="generate-btn"
            style={{ margin: '0 auto', display: 'block', padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
          >
            [ NEXT ]
          </button>
        </div>
      )}
    </div>
  );
}
