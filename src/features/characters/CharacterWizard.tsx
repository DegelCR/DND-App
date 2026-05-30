import { useCallback, useEffect, useState } from "react";
import type { Character, AbilityKey } from "@/lib/character/types";
import { STEPS, ABILITIES, STANDARD_ARRAY, ALIGNMENTS, SKILL_NAMES } from '@/lib/character/constants'
import {
  defaultCharacter,
  computeFinalScores,
  mergeRaceBonuses,
  initialRaceBonuses,
  applyFlexibleAbilityPicks,
  getFlexibleAbilityPicks,
  abilityModifier,
  formatModifier,
  getProficiencyBonus,
  clampLevel,
  clampScore,
} from '@/lib/character/character'
import {
  listRaces,
  listClasses,
  getRace,
  getSubrace,
  getClass,
  getSubclass,
  getTrait,
  getBackground,
  extractSkillsFromList,
} from "@/lib/character/api";
import { listBackgrounds, mergeSubclasses, mergeSubraces, getBackground as getLocalBg, getLocalSubraceData, localSubraceToRaw } from "@/lib/character/extra-data";
import { validateStep } from '@/lib/character/validation'
import { ProficienciesPanel } from './components/ProficienciesPanel'
import { SpellsPanel } from './components/SpellsPanel'
import { OfficialCharacterSheet } from './components/OfficialCharacterSheet'
import './character-module.css'

interface CharacterWizardProps {
  initialCharacter?: Character
  onSave: (character: Character) => Promise<void>
}

export function CharacterWizard({ initialCharacter, onSave }: CharacterWizardProps) {
  const [character, setCharacter] = useState<Character>(
    () => initialCharacter ?? defaultCharacter(),
  )
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState("");
  const [races, setRaces] = useState<{ index: string; name: string }[]>([]);
  const [classes, setClasses] = useState<{ index: string; name: string }[]>([]);
  const [backgrounds, setBackgrounds] = useState<{ index: string; name: string; source?: string }[]>([]);
  const [raceDetail, setRaceDetail] = useState("");
  const [classDetail, setClassDetail] = useState("");
  const [bgDetail, setBgDetail] = useState("");
  const [ready, setReady] = useState(false);

  const persist = useCallback(
    (c: Character) => {
      setCharacter(c)
      void onSave(c)
    },
    [onSave],
  )

  useEffect(() => {
    if (initialCharacter) setCharacter(initialCharacter)
    setReady(true)
    listRaces().then(setRaces).catch(console.error)
    listClasses().then(setClasses).catch(console.error)
    setBackgrounds(listBackgrounds())
  }, [initialCharacter])

  useEffect(() => {
    if (!character.race?.raw || character.race.subraces?.length) return
    const apiSubs = (character.race.raw.subraces as { index: string; name: string }[]) || []
    const merged = mergeSubraces(apiSubs, character.race.index)
    if (merged.length === 0) return
    setCharacter((prev) =>
      prev.race
        ? { ...prev, race: { ...prev.race, subraces: merged } }
        : prev,
    )
  }, [character.race?.index, character.race?.raw, character.race?.subraces?.length])

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  const go = (n: number) => setStep(n);

  const next = () => {
    const v = validateStep(character, step);
    if (!v.ok) {
      showToast(v.message || 'Complete this step.')
      return
    }
    void onSave(character)
    if (step < STEPS.length) go(step + 1)
    else showToast('Character ready!')
  };

  const selectRace = async (index: string) => {
    const data = await getRace(index);
    const apiSubs = (data.subraces as { index: string; name: string }[]) || [];
    const mergedSubs = mergeSubraces(apiSubs, index);
    const raceBonuses = initialRaceBonuses(index, data);
    const nextC: Character = {
      ...character,
      race: {
        index: String(data.index),
        name: String(data.name),
        subraces: mergedSubs,
        raw: data,
      },
      subrace: null,
      raceBonuses,
      variantHumanSkill: undefined,
      variantHumanFeat: undefined,
      halfElfVersatilitySkills: undefined,
    };
    persist(nextC);
    await renderRaceDetail(data, null, nextC.raceBonuses);
  };

  const selectSubrace = async (index: string) => {
    const meta = character.race?.subraces?.find((s) => s.index === index);
    let sub: Record<string, unknown>;

    if (meta?.source === "srd" && getLocalSubraceData(index) === null) {
      try {
        sub = await getSubrace(index);
      } catch {
        const local = getLocalSubraceData(index);
        if (!local) return;
        sub = localSubraceToRaw(local);
      }
    } else {
      const local = getLocalSubraceData(index);
      if (local) {
        sub = localSubraceToRaw(local);
      } else {
        try {
          sub = await getSubrace(index);
        } catch {
          return;
        }
      }
    }

    const raceIndex = character.race?.index;
    let bonuses: Character["raceBonuses"];
    let variantHumanSkill = character.variantHumanSkill;
    let variantHumanFeat = character.variantHumanFeat;
    let halfElfVersatilitySkills = character.halfElfVersatilitySkills;

    if (index === "standard-human") {
      bonuses = mergeRaceBonuses(
        character.race?.raw as Parameters<typeof mergeRaceBonuses>[0],
        undefined,
      );
      variantHumanSkill = undefined;
      variantHumanFeat = undefined;
    } else if (index === "variant-human") {
      bonuses = applyFlexibleAbilityPicks(
        raceIndex,
        index,
        character.race?.raw,
        sub,
        getFlexibleAbilityPicks(character.raceBonuses),
      );
      halfElfVersatilitySkills = undefined;
    } else if (raceIndex === "half-elf") {
      if (index !== "half-elf-skills") halfElfVersatilitySkills = undefined;
      else halfElfVersatilitySkills = ["", ""];
      variantHumanSkill = undefined;
      variantHumanFeat = undefined;
      bonuses = applyFlexibleAbilityPicks(
        raceIndex,
        index,
        character.race?.raw,
        sub,
        getFlexibleAbilityPicks(character.raceBonuses, { cha: 2 }),
      );
    } else {
      variantHumanSkill = undefined;
      variantHumanFeat = undefined;
      halfElfVersatilitySkills = undefined;
      bonuses = mergeRaceBonuses(
        character.race?.raw as Parameters<typeof mergeRaceBonuses>[0],
        sub as Parameters<typeof mergeRaceBonuses>[1],
      );
    }

    const nextC = {
      ...character,
      subrace: { index: String(sub.index), name: String(sub.name), raw: sub },
      raceBonuses: bonuses,
      variantHumanSkill,
      variantHumanFeat,
      halfElfVersatilitySkills,
    };
    persist(nextC);
    await renderRaceDetail(character.race?.raw ?? {}, sub, bonuses);
  };

  const setFlexibleAbilityPick = (slot: 0 | 1, key: AbilityKey | "") => {
    const raceIndex = character.race?.index;
    const subIndex = character.subrace?.index;
    const fixed = raceIndex === "half-elf" ? { cha: 2 as const } : {};
    const current = getFlexibleAbilityPicks(character.raceBonuses, fixed);
    const next: (AbilityKey | "")[] = [current[0] || "", current[1] || ""];
    next[slot] = key;
    const filtered = next.filter((k): k is AbilityKey => Boolean(k)).slice(0, 2);
    const bonuses = applyFlexibleAbilityPicks(
      raceIndex,
      subIndex,
      character.race?.raw,
      character.subrace?.raw,
      filtered,
    );
    persist({ ...character, raceBonuses: bonuses });
  };

  const setHalfElfSkill = (slot: 0 | 1, skill: string) => {
    const skills = [...(character.halfElfVersatilitySkills || ["", ""])];
    while (skills.length < 2) skills.push("");
    skills[slot] = skill;
    persist({ ...character, halfElfVersatilitySkills: skills.slice(0, 2) });
  };

  const renderRaceDetail = async (
    race: Record<string, unknown>,
    subrace: Record<string, unknown> | null,
    bonuses: Character["raceBonuses"],
  ) => {
    const raceTraits = (race.traits as { index: string; name: string }[]) || [];
    const subTraits = (subrace?.racial_traits as { index: string; name: string }[]) || [];
    const localTraits = (subrace?.localTraits as { name: string; desc: string }[]) || [];
    const traitTexts: string[] = [];

    for (const t of [...raceTraits, ...subTraits].slice(0, 6)) {
      try {
        const tr = await getTrait(t.index);
        traitTexts.push(
          `<li><strong>${tr.name}</strong>: ${(tr.desc?.[0] || "").slice(0, 180)}…</li>`,
        );
      } catch {
        traitTexts.push(`<li>${t.name}</li>`);
      }
    }
    for (const t of localTraits) {
      traitTexts.push(`<li><strong>${t.name}</strong>: ${t.desc.slice(0, 180)}…</li>`);
    }

    const bonusLine = Object.entries(bonuses)
      .map(([k, v]) => `${k.toUpperCase()} +${v}`)
      .join(", ");
    const subDesc = subrace?.desc ? `<p>${String(subrace.desc).slice(0, 220)}…</p>` : "";
    setRaceDetail(`
      <h3>${race.name}${subrace ? ` — ${subrace.name}` : ""}</h3>
      <p><strong>Speed:</strong> ${race.speed} · <strong>Size:</strong> ${race.size}</p>
      <p><strong>Bonuses:</strong> ${bonusLine || "None"}</p>
      ${subDesc}
      <ul>${traitTexts.join("")}</ul>
    `);
  };

  const selectClass = async (index: string) => {
    const data = await getClass(index);
    const apiSubs = (data.subclasses as { index: string; name: string }[]) || [];
    const merged = mergeSubclasses(apiSubs, index);
    persist({
      ...character,
      class: {
        index,
        name: String(data.name),
        hitDie: data.hit_die as number,
        proficiencies: data.proficiencies as Character["class"] extends null ? never : NonNullable<Character["class"]>["proficiencies"],
        subclasses: merged,
        raw: data,
      },
      subclass: null,
      _levelCache: null,
      classSpellList: null,
      skillChoices: {},
      selectedSpells: { cantrips: [], known: [], prepared: [] },
    });
    setClassDetail(`
      <h3>${data.name}</h3>
      <p><strong>Hit die:</strong> d${data.hit_die}</p>
    `);
  };

  const selectSubclass = async (index: string) => {
    const meta = character.class?.subclasses?.find((s) => s.index === index);
    if (meta?.source === "srd") {
      try {
        const sub = await getSubclass(index);
        persist({
          ...character,
          subclass: { index, name: String(sub.name), source: "srd", raw: sub },
        });
        return;
      } catch {
        /* local fallback */
      }
    }
    persist({
      ...character,
      subclass: { index, name: meta?.name || index, source: meta?.source || "phb", local: true },
    });
  };

  const selectBackground = async (index: string) => {
    const local = getLocalBg(index);
    let bg: Character["background"] = {
      index,
      name: local?.name || index,
      source: local?.source,
      feature: local?.feature,
      skills: local?.skills,
      local: true,
    };
    let featureDesc = "";
    if (index === "acolyte") {
      try {
        const data = await getBackground(index);
        const apiSkills = extractSkillsFromList(
          data.starting_proficiencies as { index: string; name: string }[]
        ).map((s) => s.name);
        bg = {
          index,
          name: String(data.name),
          source: "srd",
          skills: apiSkills.length ? apiSkills : local?.skills,
          raw: data,
        };
        featureDesc = ((data.feature as { desc?: string[] })?.desc?.[0] || "").slice(0, 250);
      } catch {
        /* keep local */
      }
    }
    persist({ ...character, background: bg });
    setBgDetail(`
      <h3>${bg?.name}</h3>
      ${bg?.feature ? `<p><strong>${bg.feature}</strong>${featureDesc ? `: ${featureDesc}…` : ""}</p>` : ""}
    `);
  };

  const setScore = (key: (typeof ABILITIES)[number]["key"], value: number) => {
    const next = { ...character, abilityScores: { ...character.abilityScores, [key]: clampScore(value) } };
    persist(next);
  };

  const applyStandardArray = () => {
    const order = ABILITIES.map((a) => a.key);
    const next = { ...character, abilityScores: { ...character.abilityScores } };
    STANDARD_ARRAY.forEach((v, i) => {
      next.abilityScores[order[i]] = v;
    });
    persist(next);
    showToast('Standard array applied.')
  };

  if (!ready) {
    return <p className="loading" style={{ padding: '2rem', textAlign: 'center' }}>Loading…</p>
  }

  const final = computeFinalScores(character);
  const prof = getProficiencyBonus(character.level);
  const hp =
    character.class?.hitDie && final.con
      ? character.class.hitDie + abilityModifier(final.con)
      : "—";

  const raceIndex = character.race?.index;
  const subraceIndex = character.subrace?.index;
  const halfElfFixed = raceIndex === "half-elf" ? { cha: 2 as const } : {};
  const flexiblePicks = getFlexibleAbilityPicks(character.raceBonuses, halfElfFixed);
  const needsFlexibleAbilities =
    raceIndex === "half-elf" ||
    (raceIndex === "human" && subraceIndex === "variant-human");
  const halfElfSkillSlots =
    raceIndex === "half-elf" && subraceIndex === "half-elf-skills"
      ? (character.halfElfVersatilitySkills || ["", ""])
      : null;
  const isVariantHuman = raceIndex === "human" && subraceIndex === "variant-human";

  return (
    <>
      <div className="character-module">
      <div className="char-app">
        <nav className="steps" aria-label="Steps">
          <ol className="steps__list">
            {STEPS.map((s) => (
              <li key={s.id} className="steps__item">
                <button
                  type="button"
                  className={`steps__btn${s.id < step ? " is-done" : ""}`}
                  aria-current={s.id === step ? "step" : undefined}
                  onClick={() => {
                    if (s.id <= step) go(s.id);
                  }}
                >
                  {s.id}. {s.label}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="layout">
          <main className="main">
            {step === 1 && (
              <section className="panel panel--active">
                <h2>Datos básicos</h2>
                <div className="field-grid">
                  <label className="field">
                    <span>Name del personaje</span>
                    <input
                      value={character.name}
                      onChange={(e) => persist({ ...character, name: e.target.value })}
                      placeholder="e.g. Lyra Shadowwind"
                    />
                  </label>
                  <label className="field">
                    <span>Level</span>
                    <input
                      type="number"
                      id="char-level"
                      min={1}
                      max={20}
                      value={character.level}
                      onChange={(e) =>
                        persist({
                          ...character,
                          level: clampLevel(e.target.value),
                          _levelCache: null,
                        })
                      }
                    />
                  </label>
                  <label className="field">
                    <span>Player</span>
                    <input
                      value={character.playerName}
                      onChange={(e) => persist({ ...character, playerName: e.target.value })}
                    />
                  </label>
                  <label className="field">
                    <span>Alignment</span>
                    <select
                      value={character.alignment}
                      onChange={(e) => persist({ ...character, alignment: e.target.value })}
                    >
                      <option value="">— Choose —</option>
                      {ALIGNMENTS.map((a) => (
                        <option key={a.value} value={a.value}>
                          {a.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field field--full">
                    <span>Concept</span>
                    <textarea
                      rows={3}
                      value={character.concept}
                      onChange={(e) => persist({ ...character, concept: e.target.value })}
                    />
                  </label>
                </div>
              </section>
            )}

            {step === 2 && (
              <section className="panel panel--active">
                <h2>Race</h2>
                <div className="card-grid">
                  {races.map((r) => (
                    <button
                      key={r.index}
                      type="button"
                      className={`option-card${character.race?.index === r.index ? " is-selected" : ""}`}
                      onClick={() => selectRace(r.index)}
                    >
                      {r.name}
                    </button>
                  ))}
                </div>
                {(character.race?.subraces?.length ?? 0) > 0 && (
                  <div className="sub-block">
                    <h3>Subrace</h3>
                    <p className="sub-block-hint">Required for this race — SRD and PHB options</p>
                    <div className="chip-list">
                      {character.race!.subraces!.map((sr) => (
                        <button
                          key={sr.index}
                          type="button"
                          className={`chip${character.subrace?.index === sr.index ? " is-selected" : ""}`}
                          onClick={() => selectSubrace(sr.index)}
                        >
                          {sr.name}
                          <span className="chip-source">{(sr.source || "srd").toUpperCase()}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {needsFlexibleAbilities && (
                  <div className="sub-block">
                    <h3>Ability score increases</h3>
                    <p className="sub-block-hint">
                      Choose two different abilities to increase by 1
                      {raceIndex === "half-elf" ? " (in addition to Charisma +2)" : ""}.
                    </p>
                    <div className="field-grid">
                      {[0, 1].map((slot) => (
                        <label key={slot} className="field">
                          <span>+1 ability {slot + 1}</span>
                          <select
                            value={flexiblePicks[slot] || ""}
                            onChange={(e) =>
                              setFlexibleAbilityPick(slot as 0 | 1, e.target.value as AbilityKey | "")
                            }
                          >
                            <option value="">— Choose —</option>
                            {ABILITIES.map((a) => (
                              <option
                                key={a.key}
                                value={a.key}
                                disabled={
                                  flexiblePicks.includes(a.key) &&
                                  flexiblePicks[slot] !== a.key
                                }
                              >
                                {a.name}
                              </option>
                            ))}
                          </select>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                {isVariantHuman && (
                  <div className="sub-block">
                    <h3>Variant Human options</h3>
                    <div className="field-grid">
                      <label className="field">
                        <span>Skill proficiency</span>
                        <select
                          value={character.variantHumanSkill || ""}
                          onChange={(e) =>
                            persist({ ...character, variantHumanSkill: e.target.value || undefined })
                          }
                        >
                          <option value="">— Choose —</option>
                          {SKILL_NAMES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="field">
                        <span>Feat</span>
                        <input
                          value={character.variantHumanFeat || ""}
                          onChange={(e) =>
                            persist({ ...character, variantHumanFeat: e.target.value })
                          }
                          placeholder="e.g. Alert, Lucky, Sharpshooter"
                        />
                      </label>
                    </div>
                  </div>
                )}
                {halfElfSkillSlots && (
                  <div className="sub-block">
                    <h3>Skill Versatility</h3>
                    <p className="sub-block-hint">Choose two skill proficiencies.</p>
                    <div className="field-grid">
                      {[0, 1].map((slot) => (
                        <label key={slot} className="field">
                          <span>Skill {slot + 1}</span>
                          <select
                            value={halfElfSkillSlots[slot] || ""}
                            onChange={(e) => setHalfElfSkill(slot as 0 | 1, e.target.value)}
                          >
                            <option value="">— Choose —</option>
                            {SKILL_NAMES.map((s) => (
                              <option
                                key={s}
                                value={s}
                                disabled={
                                  halfElfSkillSlots.includes(s) &&
                                  halfElfSkillSlots[slot] !== s
                                }
                              >
                                {s}
                              </option>
                            ))}
                          </select>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                {raceDetail && (
                  <article className="detail-card" dangerouslySetInnerHTML={{ __html: raceDetail }} />
                )}
              </section>
            )}

            {step === 3 && (
              <section className="panel panel--active">
                <h2>Class</h2>
                <div className="card-grid">
                  {classes.map((c) => (
                    <button
                      key={c.index}
                      type="button"
                      className={`option-card${character.class?.index === c.index ? " is-selected" : ""}`}
                      onClick={() => selectClass(c.index)}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
                {character.class?.subclasses?.length ? (
                  <div className="sub-block">
                    <h3>Subclass</h3>
                    <div className="chip-list">
                      {character.class.subclasses.map((sc) => (
                        <button
                          key={sc.index}
                          type="button"
                          className={`chip${character.subclass?.index === sc.index ? " is-selected" : ""}`}
                          onClick={() => selectSubclass(sc.index)}
                        >
                          {sc.name}
                          <span className="chip-source">{(sc.source || "srd").toUpperCase()}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
                {classDetail && (
                  <article className="detail-card" dangerouslySetInnerHTML={{ __html: classDetail }} />
                )}
              </section>
            )}

            {step === 4 && (
              <section className="panel panel--active">
                <h2>Background</h2>
                <div className="card-grid">
                  {backgrounds.map((b) => (
                    <button
                      key={b.index}
                      type="button"
                      className={`option-card${character.background?.index === b.index ? " is-selected" : ""}`}
                      onClick={() => selectBackground(b.index)}
                    >
                      {b.name}
                      <span className="chip-source">{(b.source || "phb").toUpperCase()}</span>
                    </button>
                  ))}
                </div>
                {bgDetail && <article className="detail-card" dangerouslySetInnerHTML={{ __html: bgDetail }} />}
              </section>
            )}

            {step === 5 && (
              <section className="panel panel--sheet panel--active">
                <h2>Características</h2>
                <div className="ability-toolbar">
                  <button type="button" className="btn btn--sheet-sm" onClick={applyStandardArray}>
                    Array estándar
                  </button>
                </div>
                <div className="ability-sheet-row">
                  {ABILITIES.map(({ key, label, name, color, bg }) => {
                    const base = character.abilityScores[key];
                    const bonus = character.raceBonuses[key] ?? 0;
                    const total = base + bonus;
                    return (
                      <div
                        key={key}
                        className="ability-stat"
                        style={{ "--ab-color": color, "--ab-bg": bg } as React.CSSProperties}
                      >
                        <div className="ability-stat__head">{label}</div>
                        <div className="ability-stat__name">{name}</div>
                        <div className="ability-stat__score-wrap">
                          <button
                            type="button"
                            className="ability-stat__spin"
                            onClick={() => setScore(key, base - 1)}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            className="ability-stat__input"
                            min={3}
                            max={20}
                            value={base}
                            onChange={(e) => setScore(key, Number(e.target.value))}
                          />
                          <button
                            type="button"
                            className="ability-stat__spin"
                            onClick={() => setScore(key, base + 1)}
                          >
                            +
                          </button>
                        </div>
                        <div className="ability-stat__mod">{formatModifier(abilityModifier(total))}</div>
                        <div className="ability-stat__final">
                          Total {total}
                          {bonus ? ` (+${bonus})` : ""}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {step === 6 && (
              <section className="panel panel--active">
                <h2>Proficiencies</h2>
                <ProficienciesPanel character={character} onChange={persist} />
              </section>
            )}

            {step === 7 && (
              <section className="panel panel--active">
                <h2>Spells & features</h2>
                <SpellsPanel character={character} onChange={persist} />
              </section>
            )}

            {step === 8 && (
              <section className="panel panel--active">
                <h2>Gear & notes</h2>
                <label className="field field--full">
                  <span>Equipment</span>
                  <textarea
                    rows={5}
                    value={character.equipment}
                    onChange={(e) => persist({ ...character, equipment: e.target.value })}
                  />
                </label>
                <label className="field field--full">
                  <span>Personality</span>
                  <textarea
                    rows={4}
                    value={character.personality}
                    onChange={(e) => persist({ ...character, personality: e.target.value })}
                  />
                </label>
              </section>
            )}

            {step === 9 && (
              <section className="panel panel--active panel--sheet-final">
                <h2>Character sheet</h2>
                <OfficialCharacterSheet character={character} />
                <div className="sheet-final-actions">
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => window.print()}
                  >
                    Print / Save PDF
                  </button>
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(character, null, 2));
                      showToast("JSON copied.");
                    }}
                  >
                    Copy JSON
                  </button>
                </div>
              </section>
            )}

            <footer className="wizard-footer">
              <button type="button" className="btn btn--ghost" disabled={step === 1} onClick={() => go(step - 1)}>
                Back
              </button>
              <button type="button" className="btn btn--primary" onClick={next}>
                {step === STEPS.length ? "Finish" : "Next"}
              </button>
            </footer>
          </main>

          <aside className="sidebar">
            <h2 className="sidebar__title">Summary</h2>
            <dl className="live-summary">
              <dt>Name</dt>
              <dd>{character.name || "—"}</dd>
              <dt>Level</dt>
              <dd>
                {character.level} (+{prof})
              </dd>
              <dt>Class</dt>
              <dd>
                {character.class?.name || "—"}
                {character.subclass ? ` · ${character.subclass.name}` : ""}
              </dd>
              <dt>HP</dt>
              <dd>{hp}</dd>
            </dl>
          </aside>
        </div>
      </div>
      </div>

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </>
  );
}
