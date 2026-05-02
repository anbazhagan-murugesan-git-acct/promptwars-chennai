import KanbanBoard from '../components/KanbanBoard';

export default function Home() {
  return (
    <main className="app-container">
      <header className="header">
        <h1>TeamSync</h1>
        <button className="btn" aria-label="Create new task">New Task</button>
      </header>
      
      <section aria-label="Task Management Board">
        <KanbanBoard />
      </section>
    </main>
  );
}
