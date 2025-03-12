import { useState } from 'react';
import './App.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from './consts.js';

const initializeAttributes = () => ATTRIBUTE_LIST.reduce((acc, attr) => ({...acc, [attr]: 10}), {})

function App() {
  const [attributeValues, setAttributeValues] = useState(initializeAttributes());

  const editAttribute = (attr, delta) => {
    const newVal = Math.max(attributeValues[attr] + delta, 0)
    const newAttrs = Object.assign({}, attributeValues, {[attr]: newVal})
    setAttributeValues(newAttrs)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Character Sheets</h1>
      </header>
      <section className="App-section">
        {ATTRIBUTE_LIST.map(attr => (
          <div>
            {attr}: {attributeValues[attr]}
            <button onClick={() => editAttribute(attr, 1)}>+</button>
            <button onClick={() => editAttribute(attr, -1)}>-</button>
          </div>
        ))}
      </section>
    </div>
  );
}

export default App;