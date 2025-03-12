import { useState } from 'react';
import './App.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from './consts.js';

const initializeAttributes = () => ATTRIBUTE_LIST.reduce((acc, attr) => ({...acc, [attr]: 10}), {})

function App() {
  const [attributeValues, setAttributeValues] = useState(initializeAttributes());
  const [openClass, setOpenClass] = useState(null);

  const editAttribute = (attr, delta) => {
    const newVal = Math.max(attributeValues[attr] + delta, 0)
    const newAttrs = Object.assign({}, attributeValues, {[attr]: newVal})
    setAttributeValues(newAttrs)
  }

  const eligibleClasses = Object.entries(CLASS_LIST)
    .filter(([_, minimums]) => Object.entries(minimums).every(([attr, min]) => attributeValues[attr] >= min))
    .map(([characterClass]) => characterClass)
    
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
      <section className="App-section">
        {eligibleClasses.map(characterClass => (
          <div>
            <label onClick={() => setOpenClass(characterClass)}>{characterClass}</label>
          </div>
        ))}
      </section>
      {openClass && <section className="App-section">
        <div> Requirements for {openClass}: </div>
        {Object.entries(CLASS_LIST[openClass]).map(([attr, min]) => (
          <div>
            {attr}: {min}
          </div>
        ))}
        <button onClick={() => setOpenClass(null)}>Close Requirements</button>
      </section>}
    </div>
  );
}

export default App;