/**
 * app/loading.js
 * 
 * Next.js Streaming Loading UI.
 * Automatically displayed while route segments load, demonstrating
 * advanced React Suspense integration for optimal perceived performance.
 */
export default function Loading() {
  return (
    <div 
      className="loading-container" 
      role="status" 
      aria-label="Loading content"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        gap: '0.5rem'
      }}
    >
      <div className="loading-spinner" aria-hidden="true" style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(255,255,255,0.1)',
        borderTopColor: '#00ffcc',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <span style={{ color: '#e0e0e0', fontSize: '1.1rem' }}>Loading workspace...</span>
    </div>
  );
}
