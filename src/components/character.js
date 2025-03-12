import { useState } from 'react';
// import './App.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST, SKILL_PTS_MODIFIER, ATTR_DEFAULT } from '../consts.js';

const initializeAttributes = () => ATTRIBUTE_LIST.reduce((acc, attr) => ({...acc, [attr]: ATTR_DEFAULT}), {})
const initializeSkills = () => SKILL_LIST.reduce((acc, skill) => ({...acc, [skill.name]: 0}), {})

function Character() {
  const [attributeValues, setAttributeValues] = useState(initializeAttributes());
  const [skillValues, setSkillValues] = useState(initializeSkills());
  const [openClass, setOpenClass] = useState(null);

  const editAttribute = (attr, delta) => {
    const newVal = Math.max(attributeValues[attr] + delta, 0)
    const newAttrs = Object.assign({}, attributeValues, {[attr]: newVal})
    setAttributeValues(newAttrs)
  }

  const editSkill = (skill, delta) => {
    const newVal = Math.max(skillValues[skill] + delta, 0)
    const newSkills = Object.assign({}, skillValues, {[skill]: newVal})
    setSkillValues(newSkills)
  }

  const eligibleClasses = Object.entries(CLASS_LIST)
    .filter(([_, minimums]) => Object.entries(minimums).every(([attr, min]) => attributeValues[attr] >= min))
    .map(([characterClass]) => characterClass)

  const modifiers = ATTRIBUTE_LIST.reduce((acc, attr) => {
    const attr_val = attributeValues[attr]
    const attr_mod = Math.floor((attr_val - ATTR_DEFAULT) / 2)
    return {...acc, [attr]: attr_mod}
  }, {})

  const maxSkillPoints = Math.max(ATTR_DEFAULT + modifiers[SKILL_PTS_MODIFIER] * 4, 0)
  const skillPointsUsed = Object.values(skillValues).reduce((sum, val) => sum+val, 0)
  const skillPointsLeft = maxSkillPoints - skillPointsUsed

  const getSkills = () => SKILL_LIST.map(({name, attributeModifier}) => {
    const skillVal = skillValues[name]
    const modifierVal = modifiers[attributeModifier]
    const total = Math.max(skillVal + modifierVal, 0)
    return <div>
      {name}: {skillVal} (Modifier [{attributeModifier}]: {modifierVal})
      <button disabled={skillPointsLeft == 0} onClick={() => editSkill(name, 1)}>+</button>
      <button disabled={skillVal == 0} onClick={() => editSkill(name, -1)}>-</button>
      Total: {total}
    </div>
  })
    
  return (
    <div>
      <section className="App-section">
        {ATTRIBUTE_LIST.map(attr => (
          <div>
            {attr}: {attributeValues[attr]} (Modifier: {modifiers[attr]})
            <button onClick={() => editAttribute(attr, 1)}>+</button>
            <button onClick={() => editAttribute(attr, -1)}>-</button>
          </div>
        ))}
      </section>
      <section className="App-section">
        <div> Eligible classes: </div>
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
      <section className="App-section">
        <div> Maximum skill points: {maxSkillPoints} (Left: {skillPointsLeft})</div>
        {getSkills()}
      </section>
    </div>
  );
}

export default Character;