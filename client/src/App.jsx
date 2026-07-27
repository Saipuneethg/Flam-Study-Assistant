import React, { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { NoteInput } from './components/NoteInput';
import { SkeletonLoader } from './components/SkeletonLoader';
import { ErrorState } from './components/ErrorState';
import { FlashcardStack } from './components/FlashcardStack';
import { QuizRunner } from './components/QuizRunner';
import { useAI } from './hooks/useAI';

function App() {
  const { data, loading, error, generateContent, setData } = useAI();

  useEffect(() => {
    const savedData = localStorage.getItem('studyPackageData');
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse saved study package:", e);
      }
    }
  }, [setData]);

  useEffect(() => {
    if (data) {
      localStorage.setItem('studyPackageData', JSON.stringify(data));
    }
  }, [data]);

  const handleClearSession = () => {
    localStorage.removeItem('studyPackageData');
    setData(null);
  };

  return (
    <div className="app-container">
      <Navbar onClear={handleClearSession} />
      
      <main className="main-content">
        {!data && !loading && !error && (
          <div className="hero animate-fade-in">
            <h1>Field Notes Study Assistant</h1>
            <p>
              Draft your raw observations below. We will synthesize them into an interactive deck of physical study cards and a review quiz.
            </p>
          </div>
        )}

        {!data && !loading && (
          <NoteInput onSubmit={generateContent} isLoading={loading} />
        )}

        {loading && <SkeletonLoader />}

        {error && (
           <ErrorState 
             error={error} 
             onRetry={() => window.location.reload()} 
           />
        )}

        {data && !loading && !error && (
          <div className="package-view animate-fade-in">
            <div className="package-header">
              <h2>{data.title}</h2>
              <p>{data.summary}</p>
            </div>
            
            <div className="package-grid">
              <section>
                <h3 className="section-title">
                  Deck
                </h3>
                <FlashcardStack flashcards={data.flashcards} />
              </section>
              
              <section>
                <h3 className="section-title">
                  Review
                </h3>
                <QuizRunner questions={data.quiz} />
              </section>
            </div>
            
            <div className="package-actions">
              <button
                onClick={() => {
                  if (confirm('Discard current deck and draw a new one?')) {
                    handleClearSession();
                  }
                }}
                className="clear-btn"
              >
                Draft New Notes
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
