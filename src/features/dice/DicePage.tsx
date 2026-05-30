import { PageHeader } from '@/components/ui/PageHeader'
import { DiceRoller } from './components/DiceRoller'
import { RollHistory } from './components/RollHistory'
import { useDiceRolls } from './useDiceRolls'

export function DicePage() {
  const { history, loading, saveRoll, clearHistory } = useDiceRolls()

  return (
    <>
      <PageHeader
        title="Dice"
        description="Roll with advantage/disadvantage, modifiers, and persistent history."
        icon="🎲"
      />

      <div className="grid flex-1 gap-6 p-6 lg:grid-cols-[1fr_320px]">
        <DiceRoller onRoll={saveRoll} />
        <RollHistory
          history={history}
          loading={loading}
          onClear={clearHistory}
        />
      </div>
    </>
  )
}
