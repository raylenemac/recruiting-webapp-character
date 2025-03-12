import { useState } from 'react';
import './Character.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST, SKILL_PTS_MODIFIER, ATTR_DEFAULT, MAX_ATTR_SUM } from '../consts.js';

const initializeAttributes = () => ATTRIBUTE_LIST.reduce((acc, attr) => ({...acc, [attr]: ATTR_DEFAULT}), {})
const initializeSkills = () => SKILL_LIST.reduce((acc, skill) => ({...acc, [skill.name]: 0}), {})

function Character({data, onSave}) {
  const [attributeValues, setAttributeValues] = useState(data?.attributeValues || initializeAttributes());
  const [skillValues, setSkillValues] = useState(data?.skillValues || initializeSkills());
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

  const modifiers = ATTRIBUTE_LIST.reduce((acc, attr) => {
    const attr_val = attributeValues[attr]
    const attr_mod = Math.floor((attr_val - ATTR_DEFAULT) / 2)
    return {...acc, [attr]: attr_mod}
  }, {})

  const maxSkillPoints = Math.max(ATTR_DEFAULT + modifiers[SKILL_PTS_MODIFIER] * 4, 0)
  const skillPointsUsed = Object.values(skillValues).reduce((sum, val) => sum+val, 0)
  const skillPointsLeft = maxSkillPoints - skillPointsUsed

  const attrSum = Object.values(attributeValues).reduce((sum, val) => sum+val, 0)
  const isBelowAttrLimit = attrSum < MAX_ATTR_SUM

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
    <div className='Character-content'>
      <div className="Character-section">
        <div> Attributes: </div>
        {ATTRIBUTE_LIST.map(attr => (
          <div>
            {attr}: {attributeValues[attr]} (Modifier: {modifiers[attr]})
            <button disabled={!isBelowAttrLimit} onClick={() => editAttribute(attr, 1)}>+</button>
            <button onClick={() => editAttribute(attr, -1)}>-</button>
          </div>
        ))}
      </div>
      <div className="Character-section">
        <div> Classes: </div>
        {Object.entries(CLASS_LIST).map(([characterClass, minimums]) => {
            const isEligible = Object.entries(minimums).every(([attr, min]) => attributeValues[attr] >= min)
            return <div>
                <label onClick={() => setOpenClass(characterClass)} className={isEligible ? 'class-eligible' : ''}>
                    {characterClass}
                </label>
            </div>
            })}
      </div>
      {openClass && <div className="Character-section">
        <div> Requirements for {openClass}: </div>
        {Object.entries(CLASS_LIST[openClass]).map(([attr, min]) => (
          <div>
            {attr}: {min}
          </div>
        ))}
        <button onClick={() => setOpenClass(null)}>Close Requirements</button>
      </div>}
      <div className="Character-section">
        <div> Maximum skill points: {maxSkillPoints} (Left: {skillPointsLeft})</div>
        {getSkills()}
      </div>
      <button onClick={() => onSave({attributeValues, skillValues})}>Save</button>
    </div>
  );
}

export default Character;