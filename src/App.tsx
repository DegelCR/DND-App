import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { HomePage } from '@/features/home/HomePage'
import { DicePage } from '@/features/dice/DicePage'
import { BestiaryPage } from '@/features/bestiary/BestiaryPage'
import { CombatPage } from '@/features/combat/CombatPage'
import { SessionPage } from '@/features/session/SessionPage'
import { CompendiumPage } from '@/features/compendium/CompendiumPage'
import { CharactersPage } from '@/features/characters/CharactersPage'
import { GeneratorsPage } from '@/features/generators/GeneratorsPage'
import { MapPage } from '@/features/map/MapPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="dice" element={<DicePage />} />
          <Route path="bestiary" element={<BestiaryPage />} />
          <Route path="bestiary/:index" element={<BestiaryPage />} />
          <Route path="combat" element={<CombatPage />} />
          <Route path="session" element={<SessionPage />} />
          <Route path="compendium" element={<Navigate to="/compendium/spells" replace />} />
          <Route path="compendium/:category" element={<CompendiumPage />} />
          <Route path="compendium/:category/:index" element={<CompendiumPage />} />
          <Route path="characters" element={<Navigate to="/characters/new" replace />} />
          <Route path="characters/new" element={<CharactersPage />} />
          <Route path="characters/:id" element={<CharactersPage />} />
          <Route path="generators" element={<GeneratorsPage />} />
          <Route path="map" element={<MapPage />} />
          {/* Legacy Spanish paths */}
          <Route path="dados" element={<Navigate to="/dice" replace />} />
          <Route path="bestiario" element={<Navigate to="/bestiary" replace />} />
          <Route path="combate" element={<Navigate to="/combat" replace />} />
          <Route path="sesion" element={<Navigate to="/session" replace />} />
          <Route path="compendio" element={<Navigate to="/compendium" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
