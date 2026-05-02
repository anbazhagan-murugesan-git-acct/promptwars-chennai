import './globals.css';

export const metadata = {
  title: 'AuraSpace | AI-First Collaboration',
  description: 'An AI-powered workspace where an embedded Gemini Coach dynamically manages tasks and workflows.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link sr-only">Skip to main content</a>
        <main id="main-content" className="app-container" tabIndex="-1">
          <header className="header">
            <h1 className="header-logo">AuraSpace</h1>
            <nav aria-label="Main Navigation">
              <button className="btn-primary" aria-label="Invite Team Members">Invite Team</button>
            </nav>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
