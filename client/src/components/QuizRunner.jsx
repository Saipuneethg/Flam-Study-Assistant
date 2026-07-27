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

    setTimeout(() => {
      if (currentIndex + 1 < activeQuestions.length) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
      } else {
        setIsFinished(true);
      }
    }, 1200);
  };

  const handleRetestFailed = () => {
    setActiveQuestions(failedQuestions);
    setFailedQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsFinished(false);
  };

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
    </div>
  );
}
