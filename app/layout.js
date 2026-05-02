import './globals.css';

export const metadata = {
  title: 'AuraSpace | AI-First Collaboration',
  description: 'A platform that improves team coordination and communication. The system simplifies workflows and improves visibility of tasks through an embedded Gemini Coach.',
  keywords: 'team collaboration tool, team coordination, communication, simplify workflows, visibility of tasks'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link sr-only">Skip to main content</a>
        <main id="main-content" className="app-container" tabIndex="-1" aria-label="Team Collaboration Workspace">
          <header className="header">
            <h1 className="header-logo" aria-label="AuraSpace - Improves Team Coordination">AuraSpace</h1>
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
