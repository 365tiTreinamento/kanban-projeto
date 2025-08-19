// App.tsx
import { Board } from './components/Board';

function App() {
  return (
    <div className="App">
      <header style={{ textAlign: 'center', padding: '20px' }}>
        <h1>📊 Quadro Kanban</h1>
      </header>
      <Board />
    </div>
  );
}

export default App;