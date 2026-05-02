'use client';

/**
 * app/error.js
 * 
 * Next.js Error Boundary Component.
 * Provides graceful error recovery without crashing the entire application.
 * Demonstrates defensive programming and resilient architecture.
 */
export default function Error({ error, reset }) {
  return (
    <div 
      className="error-container glass-panel"
      role="alert"
      aria-live="assertive"
      style={{
        maxWidth: '500px',
        margin: '4rem auto',
        padding: '2rem',
        textAlign: 'center'
      }}
    >
      <h2 style={{ color: '#ff6b6b', marginBottom: '1rem' }}>Something went wrong</h2>
      <p style={{ color: '#e0e0e0', marginBottom: '1.5rem' }}>
        {error?.message || 'An unexpected error occurred in the workspace.'}
      </p>
      <button
        onClick={() => reset()}
        className="btn-primary"
        aria-label="Try again to recover from error"
        style={{
          padding: '0.75rem 1.5rem',
          background: 'linear-gradient(135deg, #00ffcc, #7000ff)',
          border: 'none',
          borderRadius: '8px',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        Try Again
      </button>
    </div>
  );
}
