import { useState, useEffect } from 'react';
import './App.css';
import {CHARACTER_URL} from './consts.js'
import Character from './components/character.js';

function App() {

  const [characters, setCharacters] = useState([]);

  const init = async () => {
    const resp = await fetch(CHARACTER_URL)
    const data = await resp.json() // todo: add error handling, validate response schema 
    setCharacters(data.body?.characters || [])
  }

  useEffect(() => {
    init()
  }, [])

  const saveCharacters = (idxToUpdate) => async (newCharacter) => {
    // todo: add ability to delete a character
    const newData = idxToUpdate == characters.length ? 
      [...characters, newCharacter] : // if we're adding a new character
      characters.map((character, idx) => idxToUpdate === idx ? newCharacter : character) // updating an existing character
    const resp = await fetch(CHARACTER_URL, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({characters: newData}),
    })
    await resp.json() // todo: add error handling
    await init()
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Character Sheets</h1>
      </header>
      {characters.map((character, idx) => <Character data={character} onSave={saveCharacters(idx)}/>)}
      <Character data={{}} onSave={saveCharacters(characters.length)}/>
    </div>
  );
}

export default App;