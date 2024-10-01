import logo from './logo.svg';
import './App.css';
import useInstallPrompt from './useInstallPrompt';

function App() {
  const installPrompt = useInstallPrompt();
  
  return (
    <div className="App">
      <button onClick={() => installPrompt && installPrompt.prompt()}>install</button>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
