import type { Character } from "@/lib/character/types";
import { ABILITIES } from "@/lib/character/constants";
import {
  abilityModifier,
  computeFinalScores,
  formatModifier,
  getProficiencyBonus,
} from "@/lib/character/character";
import { getSlotSummary, isSpellcaster, getSpellAbility } from "@/lib/character/class-rules";
import { getSpellNamesFromCharacter } from "@/lib/character/sheet-helpers";

const SKILLS = [
  { name: "Acrobatics", ability: "dex" },
  { name: "Animal Handling", ability: "wis" },
  { name: "Arcana", ability: "int" },
  { name: "Athletics", ability: "str" },
  { name: "Deception", ability: "cha" },
  { name: "History", ability: "int" },
  { name: "Insight", ability: "wis" },
  { name: "Intimidation", ability: "cha" },
  { name: "Investigation", ability: "int" },
  { name: "Medicine", ability: "wis" },
  { name: "Nature", ability: "int" },
  { name: "Perception", ability: "wis" },
  { name: "Performance", ability: "cha" },
  { name: "Persuasion", ability: "cha" },
  { name: "Religion", ability: "int" },
  { name: "Sleight of Hand", ability: "dex" },
  { name: "Stealth", ability: "dex" },
  { name: "Survival", ability: "wis" },
] as const;

const SAVES = [
  { label: "Strength", key: "str" },
  { label: "Dexterity", key: "dex" },
  { label: "Constitution", key: "con" },
  { label: "Intelligence", key: "int" },
  { label: "Wisdom", key: "wis" },
  { label: "Charisma", key: "cha" },
] as const;

const ALIGNMENT_LABELS: Record<string, string> = {
  LG: "Lawful Good",
  NG: "Neutral Good",
  CG: "Chaotic Good",
  LN: "Legal Neutral",
  N: "Neutral",
  CN: "Chaotic Neutral",
  LE: "Lawful Evil",
  NE: "Neutral Evil",
  CE: "Chaotic Evil",
};

type Props = {
  character: Character;
};

export function OfficialCharacterSheet({ character }: Props) {
  const final = computeFinalScores(character);
  const prof = getProficiencyBonus(character.level);
  const proficientSkills = new Set(
    (character.skillProficiencies || []).map((s) => s.toLowerCase())
  );

  const classIndex = character.class?.index;
  const saveProficient = new Set<string>();
  const classProfs = (character.class?.raw?.proficiencies as { name?: string }[]) || [];
  classProfs.forEach((p) => {
    const n = (p.name || "").toLowerCase();
    if (n.includes("saving throw")) {
      if (n.includes("str")) saveProficient.add("str");
      if (n.includes("dex")) saveProficient.add("dex");
      if (n.includes("con")) saveProficient.add("con");
      if (n.includes("int")) saveProficient.add("int");
      if (n.includes("wis")) saveProficient.add("wis");
      if (n.includes("cha")) saveProficient.add("cha");
    }
  });

  const hpMax =
    character.class?.hitDie && final.con
      ? character.class.hitDie + abilityModifier(final.con)
      : null;

  const speed = (character.race?.raw?.speed as number) || 30;
  const passivePerception =
    10 + abilityModifier(final.wis) + (proficientSkills.has("perception") ? prof : 0);

  const spellcasting = character._levelCache?.data?.spellcasting;
  const slots = getSlotSummary(spellcasting);
  const spellAbility = classIndex ? getSpellAbility(classIndex) : null;
  const spellMod = spellAbility ? abilityModifier(final[spellAbility]) : 0;
  const spellSaveDC = spellAbility ? 8 + prof + spellMod : null;
  const spellAttack = spellAbility ? prof + spellMod : null;

  const spells = getSpellNamesFromCharacter(character);
  const cantrips = spells.filter((s) => s.level === 0);
  const leveledSpells = spells.filter((s) => s.level > 0);

  const classLevelLine = [
    character.class?.name,
    character.subclass?.name ? `(${character.subclass.name})` : null,
    character.level ? `Level ${character.level}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const features: string[] = [];
  const levelFeatures = character._levelCache?.data?.features || [];
  levelFeatures.forEach((f) => features.push(f.name));
  if (character.background?.feature) features.push(`Background: ${character.background.feature}`);
  if (character.race?.name) features.push(`Race: ${character.race.name}`);
  if (character.subrace?.name) features.push(`Subrace: ${character.subrace.name}`);

  return (
    <div className="pdf-sheet" id="character-sheet-print">
      {/* PÁGINA 1 — Estilo ficha oficial 5e */}
      <div className="pdf-sheet__page pdf-sheet__page--1">
        <header className="pdf-header">
          <div className="pdf-header__cell pdf-header__cell--name">
            <label>Character Name</label>
            <div className="pdf-header__value">{character.name || "—"}</div>
          </div>
          <div className="pdf-header__row2">
            <div className="pdf-header__cell">
              <label>Class &amp; Level</label>
              <div className="pdf-header__value pdf-header__value--sm">{classLevelLine || "—"}</div>
            </div>
            <div className="pdf-header__cell">
              <label>Background</label>
              <div className="pdf-header__value pdf-header__value--sm">
                {character.background?.name || "—"}
              </div>
            </div>
            <div className="pdf-header__cell">
              <label>Player Name</label>
              <div className="pdf-header__value pdf-header__value--sm">
                {character.playerName || "—"}
              </div>
            </div>
          </div>
          <div className="pdf-header__row2">
            <div className="pdf-header__cell">
              <label>Race</label>
              <div className="pdf-header__value pdf-header__value--sm">
                {character.race?.name || "—"}
                {character.subrace ? ` (${character.subrace.name})` : ""}
              </div>
            </div>
            <div className="pdf-header__cell">
              <label>Alignment</label>
              <div className="pdf-header__value pdf-header__value--sm">
                {ALIGNMENT_LABELS[character.alignment] || character.alignment || "—"}
              </div>
            </div>
            <div className="pdf-header__cell">
              <label>Experience Points</label>
              <div className="pdf-header__value pdf-header__value--sm">—</div>
            </div>
          </div>
        </header>

        <div className="pdf-body">
          {/* Columna izquierda: stats + saves + skills */}
          <div className="pdf-col pdf-col--left">
            <div className="pdf-abilities">
              {ABILITIES.map(({ key, label }) => {
                const score = final[key];
                const mod = abilityModifier(score);
                return (
                  <div key={key} className="pdf-ability">
                    <div className="pdf-ability__name">{label}</div>
                    <div className="pdf-ability__score">{score}</div>
                    <div className="pdf-ability__mod">{formatModifier(mod)}</div>
                  </div>
                );
              })}
            </div>

            <div className="pdf-insp-prof">
              <div className="pdf-box-mini">
                <span className="pdf-dot" />
                <label>Inspiration</label>
              </div>
              <div className="pdf-box-mini pdf-box-mini--prof">
                <div className="pdf-prof-val">+{prof}</div>
                <label>Proficiency Bonus</label>
              </div>
            </div>

            <div className="pdf-list-block">
              <div className="pdf-list-title">Saving Throws</div>
              {SAVES.map(({ label, key }) => {
                const mod = abilityModifier(final[key]);
                const total = mod + (saveProficient.has(key) ? prof : 0);
                return (
                  <div key={key} className="pdf-list-row">
                    <span className={`pdf-dot${saveProficient.has(key) ? " pdf-dot--on" : ""}`} />
                    <span className="pdf-list-mod">{formatModifier(total)}</span>
                    <span className="pdf-list-label">{label}</span>
                  </div>
                );
              })}
            </div>

            <div className="pdf-list-block pdf-list-block--skills">
              <div className="pdf-list-title">Skills</div>
              {SKILLS.map(({ name, ability }) => {
                const isProf = proficientSkills.has(name.toLowerCase());
                const mod = abilityModifier(final[ability]);
                const total = mod + (isProf ? prof : 0);
                return (
                  <div key={name} className="pdf-list-row">
                    <span className={`pdf-dot${isProf ? " pdf-dot--on" : ""}`} />
                    <span className="pdf-list-mod">{formatModifier(total)}</span>
                    <span className="pdf-list-label">{name}</span>
                    <span className="pdf-list-ability">({ability.toUpperCase()})</span>
                  </div>
                );
              })}
            </div>

            <div className="pdf-passive">
              <strong>Passive Wisdom (Perception)</strong> {passivePerception}
            </div>
          </div>

          {/* Columna central: combate */}
          <div className="pdf-col pdf-col--mid">
            <div className="pdf-combat-top">
              <div className="pdf-combat-box">
                <div className="pdf-combat-box__big">—</div>
                <label>Armor Class</label>
              </div>
              <div className="pdf-combat-box">
                <div className="pdf-combat-box__big">
                  {formatModifier(abilityModifier(final.dex))}
                </div>
                <label>Initiative</label>
              </div>
              <div className="pdf-combat-box">
                <div className="pdf-combat-box__big">{speed}</div>
                <label>Speed</label>
              </div>
            </div>

            <div className="pdf-hp">
              <div className="pdf-hp__max">
                <label>Hit Point Maximum</label>
                <div>{hpMax ?? "—"}</div>
              </div>
              <div className="pdf-hp__current">
                <label>Current Hit Points</label>
                <div className="pdf-hp__blank" />
              </div>
              <div className="pdf-hp__temp">
                <label>Temporary Hit Points</label>
                <div className="pdf-hp__blank" />
              </div>
            </div>

            <div className="pdf-hit-dice">
              <label>Hit Dice</label>
              <div>
                {character.class?.hitDie ? `${character.level || 1}d${character.class.hitDie}` : "—"}
              </div>
            </div>

            <div className="pdf-death-saves">
              <div className="pdf-death-saves__title">Death Saves</div>
              <div className="pdf-death-row">
                <span>Successes</span>
                <span className="pdf-dot" />
                <span className="pdf-dot" />
                <span className="pdf-dot" />
              </div>
              <div className="pdf-death-row">
                <span>Failures</span>
                <span className="pdf-dot" />
                <span className="pdf-dot" />
                <span className="pdf-dot" />
              </div>
            </div>

            <div className="pdf-attacks">
              <div className="pdf-attacks__title">Attacks &amp; Spellcasting</div>
              <table className="pdf-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Atk Bonus</th>
                    <th>Damage / Type</th>
                  </tr>
                </thead>
                <tbody>
                  {[0, 1, 2].map((i) => (
                    <tr key={i}>
                      <td />
                      <td />
                      <td />
                    </tr>
                  ))}
                </tbody>
              </table>
              {character.equipment && (
                <p className="pdf-equipment-inline">
                  <strong>Equipo anotado:</strong> {character.equipment}
                </p>
              )}
            </div>
          </div>

          {/* Columna derecha: personalidad + equipo */}
          <div className="pdf-col pdf-col--right">
            <div className="pdf-trait-box">
              <label>Personality Traits</label>
              <div className="pdf-trait-box__area">{character.personality || ""}</div>
            </div>
            <div className="pdf-trait-box">
              <label>Ideals</label>
              <div className="pdf-trait-box__area">{character.concept || ""}</div>
            </div>
            <div className="pdf-trait-box">
              <label>Bonds</label>
              <div className="pdf-trait-box__area" />
            </div>
            <div className="pdf-trait-box">
              <label>Flaws</label>
              <div className="pdf-trait-box__area" />
            </div>

            <div className="pdf-features-box">
              <label>Features &amp; Traits</label>
              <div className="pdf-features-box__area">
                {features.length ? (
                  <ul>
                    {features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                ) : (
                  character.spellNotes
                )}
                {character.proficiencyNotes && (
                  <p>
                    <em>{character.proficiencyNotes}</em>
                  </p>
                )}
              </div>
            </div>

            <div className="pdf-coins">
              <div>
                <label>CP</label>
                <span />
              </div>
              <div>
                <label>SP</label>
                <span />
              </div>
              <div>
                <label>EP</label>
                <span />
              </div>
              <div>
                <label>GP</label>
                <span />
              </div>
              <div>
                <label>PP</label>
                <span />
              </div>
            </div>

            <div className="pdf-equipment-box">
              <label>Equipment</label>
              <div className="pdf-equipment-box__area">{character.equipment || ""}</div>
            </div>
          </div>
        </div>
      </div>

      {/* PÁGINA 2 — Conjuros (si aplica) */}
      {classIndex && isSpellcaster(classIndex) && (
        <div className="pdf-sheet__page pdf-sheet__page--2">
          <header className="pdf-spell-header">
            <div className="pdf-spell-header__name">
              <label>Spellcaster Name</label>
              <div>{character.name}</div>
            </div>
            <div className="pdf-spell-stats">
              <div>
                <label>Spellcasting Ability</label>
                <div>{spellAbility?.toUpperCase() || "—"}</div>
              </div>
              <div>
                <label>Spell Save DC</label>
                <div>{spellSaveDC ?? "—"}</div>
              </div>
              <div>
                <label>Spell Attack Bonus</label>
                <div>{spellAttack != null ? formatModifier(spellAttack) : "—"}</div>
              </div>
            </div>
          </header>

          <div className="pdf-spell-slots-row">
            {[
              { label: "Cantrips", key: "cantrips" },
              { label: "1st", key: "1" },
              { label: "2nd", key: "2" },
              { label: "3rd", key: "3" },
              { label: "4th", key: "4" },
              { label: "5th", key: "5" },
              { label: "6th", key: "6" },
              { label: "7th", key: "7" },
              { label: "8th", key: "8" },
              { label: "9th", key: "9" },
            ].map(({ label, key }) => {
              const slot = slots.find((s) => String(s.level) === key);
              const cantripCount = spellcasting?.cantrips_known;
              return (
                <div key={key} className="pdf-spell-slot-cell">
                  <div className="pdf-spell-slot-cell__label">{label}</div>
                  <div className="pdf-spell-slot-cell__total">
                    {key === "cantrips" ? cantripCount ?? "—" : slot?.slots ?? "—"}
                  </div>
                  <div className="pdf-spell-slot-dots">
                    {Array.from({ length: key === "cantrips" ? 0 : slot?.slots || 0 }).map(
                      (_, i) => (
                        <span key={i} className="pdf-dot pdf-dot--on" />
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pdf-spell-columns">
            <div className="pdf-spell-col">
              <h4>Cantrips</h4>
              <ol>
                {cantrips.map((s) => (
                  <li key={s.index}>{s.name}</li>
                ))}
              </ol>
            </div>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lv) => {
              const atLevel = leveledSpells.filter((s) => s.level === lv);
              if (!atLevel.length) return null;
              return (
                <div key={lv} className="pdf-spell-col">
                  <h4>
                    Level {lv}
                    {slots.find((s) => s.level === lv)
                      ? ` (${slots.find((s) => s.level === lv)!.slots} slots)`
                      : ""}
                  </h4>
                  <ol>
                    {atLevel.map((s) => (
                      <li key={s.index}>{s.name}</li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>

          {character.spellNotes && (
            <div className="pdf-spell-notes">
              <label>Spell Notes</label>
              <p>{character.spellNotes}</p>
            </div>
          )}
        </div>
      )}

      <p className="pdf-sheet__footer">
        DND App · SRD / PHB reference · Not affiliated with Wizards of the Coast
      </p>
    </div>
  );
}
