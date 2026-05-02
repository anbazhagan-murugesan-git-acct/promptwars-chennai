import './globals.css';

export const metadata = {
  title: 'TeamSync - Team Collaboration Tool',
  description: 'Improve team coordination and simplify workflows with high visibility.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
