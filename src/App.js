import { useState } from 'react';
import './App.css';
import Character from './components/character.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Character Sheets</h1>
      </header>
      <Character/>
    </div>
  );
}

export default App;