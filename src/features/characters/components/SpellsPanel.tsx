import { useEffect, useState } from 'react'
import type { Character, LevelData, SpellRef } from '@/lib/character/types'
import { getClassLevel, getClassSpells } from '@/lib/character/api'
import {
  isSpellcaster,
  usesSpellsKnown,
  usesPreparedSpells,
  getSpellAbility,
  getPreparedLimit,
  maxSpellLevelFromSlots,
  getSlotSummary,
} from '@/lib/character/class-rules'

type Props = {
  character: Character
  onChange: (c: Character) => void
}

export function SpellsPanel({ character, onChange }: Props) {
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [levelData, setLevelData] = useState<LevelData | null>(null)
  const [spells, setSpells] = useState<SpellRef[]>([])

  const classIndex = character.class?.index

  useEffect(() => {
    if (!classIndex) return
    let cancelled = false

    ;(async () => {
      setLoading(true)
      try {
        const level = character.level || 1
        const [lvl, spellList] = await Promise.all([
          getClassLevel(classIndex, level),
          character.classSpellList?.length
            ? Promise.resolve(character.classSpellList)
            : getClassSpells(classIndex),
        ])
        if (cancelled) return
        const cache = { key: `${classIndex}-${level}`, data: lvl as unknown as LevelData }
        onChange({
          ...character,
          _levelCache: cache,
          classSpellList: spellList,
        })
        setLevelData(lvl as unknown as LevelData)
        setSpells(spellList)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classIndex, character.level])

  if (!classIndex) return null

  if (!isSpellcaster(classIndex)) {
    return (
      <>
        <p className="panel__hint">
          <strong>{character.class?.name}</strong> does not cast spells at this level by default. Some
          subclasses grant magic — note them below.
        </p>
        <label className="field field--full">
          <span>Magical features (free text)</span>
          <textarea
            rows={5}
            value={character.spellNotes}
            onChange={(e) => onChange({ ...character, spellNotes: e.target.value })}
          />
        </label>
      </>
    )
  }

  if (loading) return <p className="loading">Loading spells…</p>

  const spellcasting = levelData?.spellcasting
  const maxSpellLevel = maxSpellLevelFromSlots(spellcasting)
  const cantripMax = spellcasting?.cantrips_known || 0
  const knownMax = spellcasting?.spells_known || 0
  const isKnown = usesSpellsKnown(classIndex)
  const isPrepared = usesPreparedSpells(classIndex)
  const abilityKey = getSpellAbility(classIndex)
  const preparedMax = abilityKey ? getPreparedLimit(character, abilityKey) : 0
  const slots = getSlotSummary(spellcasting)

  if (maxSpellLevel === 0 && !cantripMax) {
    return (
      <>
        <p className="panel__hint">
          At level <strong>{character.level}</strong> your class has no spell slots yet (common for paladin/ranger
          until level 2).
        </p>
        {levelData?.features?.length ? (
          <div className="spell-slots">
            <h3>Features at this level</h3>
            <ul className="prof-fixed">
              {levelData.features.map((f) => (
                <li key={f.index}>{f.name}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <label className="field field--full">
          <span>Spell notes</span>
          <textarea
            rows={4}
            value={character.spellNotes}
            onChange={(e) => onChange({ ...character, spellNotes: e.target.value })}
          />
        </label>
      </>
    )
  }

  const available = spells.filter((s) => s.level <= maxSpellLevel || s.level === 0)
  const listKeyForLevel = (lv: number): 'cantrips' | 'known' | 'prepared' =>
    lv === 0 ? 'cantrips' : isPrepared ? 'prepared' : 'known'

  const toggleSpell = (idx: string, lv: number, listKey: 'cantrips' | 'known' | 'prepared') => {
    const sel = { ...character.selectedSpells }
    const arr = [...sel[listKey]]
    const i = arr.indexOf(idx)
    if (i >= 0) {
      arr.splice(i, 1)
    } else {
      if (lv === 0 && sel.cantrips.length >= cantripMax) return
      if (lv > 0 && isKnown && sel.known.length >= knownMax) return
      if (lv > 0 && isPrepared && sel.prepared.length >= preparedMax) return
      arr.push(idx)
    }
    sel[listKey] = arr
    onChange({ ...character, selectedSpells: sel })
  }

  const levels = [...new Set(available.map((s) => s.level))].sort((a, b) => a - b)
  const q = filter.trim().toLowerCase()

  return (
    <>
      <p className="panel__hint">
        SRD spells for <strong>{character.class?.name}</strong> (level {character.level}).
      </p>

      <div className="spell-slots">
        <h3>Spell slots</h3>
        {slots.length
          ? slots.map((s) => (
              <span key={s.level} className="slot-pill">
                Lv {s.level}: {s.slots}
              </span>
            ))
          : 'No slots at this level.'}
      </div>

      <div className="spell-limits">
        {cantripMax > 0 && (
          <p>
            <strong>Cantrips:</strong> up to {cantripMax}
          </p>
        )}
        {isKnown && knownMax > 0 && (
          <p>
            <strong>Known:</strong> {knownMax}
          </p>
        )}
        {isPrepared && (
          <p>
            <strong>Prepared:</strong> up to {preparedMax}
          </p>
        )}
      </div>

      <label className="field field--full spell-search-wrap">
        <span>Search spells</span>
        <input
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter…"
        />
      </label>

      <div className="spell-picker">
        {levels.map((lv) => {
          const listKey = listKeyForLevel(lv)
          const list = character.selectedSpells[listKey]
          return (
            <details key={lv} className="spell-level-group" open>
              <summary>
                {lv === 0 ? 'Cantrips' : `Level ${lv}`} ({list.length})
              </summary>
              <div className="spell-check-grid">
                {available
                  .filter((s) => s.level === lv && (!q || s.name.toLowerCase().includes(q)))
                  .map((spell) => (
                    <label key={spell.index} className="spell-check">
                      <input
                        type="checkbox"
                        checked={list.includes(spell.index)}
                        onChange={() => toggleSpell(spell.index, lv, listKey)}
                      />
                      <span>{spell.name}</span>
                    </label>
                  ))}
              </div>
            </details>
          )
        })}
      </div>

      <label className="field field--full">
        <span>Notes (subclass, domains…)</span>
        <textarea
          rows={3}
          value={character.spellNotes}
          onChange={(e) => onChange({ ...character, spellNotes: e.target.value })}
        />
      </label>
    </>
  )
}
