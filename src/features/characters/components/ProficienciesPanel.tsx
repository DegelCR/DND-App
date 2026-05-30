import type { Character } from '@/lib/character/types'
import { extractSkillsFromList } from '@/lib/character/api'
import {
  buildProficiencyChoices,
  getFixedBackgroundSkills,
  syncSkillProficiencies,
} from '@/lib/character/validation'

type Props = {
  character: Character
  onChange: (c: Character) => void
}

export function ProficienciesPanel({ character, onChange }: Props) {
  const classRaw = character.class?.raw
  const choices = buildProficiencyChoices(classRaw)
  const fixedClass = extractSkillsFromList(
    (classRaw?.proficiencies as { index: string; name: string }[]) || [],
  )
  const fixedBg = getFixedBackgroundSkills(character)

  const toggleSkill = (groupId: string, skillIndex: string, max: number) => {
    const next = { ...character, skillChoices: { ...character.skillChoices } }
    let selected = [...(next.skillChoices[groupId] || [])]
    if (selected.includes(skillIndex)) {
      selected = selected.filter((x) => x !== skillIndex)
    } else {
      if (selected.length >= max) return
      selected.push(skillIndex)
    }
    next.skillChoices[groupId] = selected
    syncSkillProficiencies(next, choices, fixedClass, fixedBg)
    onChange(next)
  }

  return (
    <>
      <p className="panel__hint">
        Choose your class skill proficiencies. Background and fixed class skills are already assigned.
      </p>

      {(fixedClass.length > 0 || fixedBg.length > 0) && (
        <div className="prof-block">
          <h3>Automatic proficiencies</h3>
          <ul className="prof-fixed">
            {fixedClass.map((s) => (
              <li key={s.index}>
                <span className="tag tag--class">Class</span> {s.name}
              </li>
            ))}
            {fixedBg.map((name) => (
              <li key={name}>
                <span className="tag tag--bg">Background</span> {name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {choices.map((group) => {
        const selected = character.skillChoices[group.id] || []
        return (
          <div key={group.id} className="prof-block">
            <h3>Choose {group.choose}</h3>
            <p className="prof-desc">{group.desc}</p>
            <div className="prof-counter">
              Selected: <strong>{selected.length}</strong> / {group.choose}
            </div>
            <div className="skill-check-grid">
              {group.options.map((skill) => (
                <label key={skill.index} className="skill-check">
                  <input
                    type="checkbox"
                    checked={selected.includes(skill.index)}
                    onChange={() => toggleSkill(group.id, skill.index, group.choose)}
                  />
                  <span>{skill.name}</span>
                </label>
              ))}
            </div>
          </div>
        )
      })}

      <label className="field field--full">
        <span>Other proficiencies or tools (notes)</span>
        <textarea
          rows={2}
          value={character.proficiencyNotes}
          onChange={(e) => onChange({ ...character, proficiencyNotes: e.target.value })}
          placeholder="Background languages, tools…"
        />
      </label>
    </>
  )
}
