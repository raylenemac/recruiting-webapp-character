import { useState } from 'react';
import './App.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from './consts.js';

const initializeAttributes = () => ATTRIBUTE_LIST.reduce((acc, attr) => ({...acc, [attr]: 10}), {})

function App() {
  const [attributeValues, setAttributeValues] = useState(initializeAttributes());
  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>
      <section className="App-section">
        <div>
          Value test:
          {attributeValues.Strength}
          <button>+</button>
          <button>-</button>
        </div>
      </section>
    </div>
  );
}

export default App;