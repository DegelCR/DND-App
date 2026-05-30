import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { db } from '@/db'
import { CampaignSidebar } from './components/CampaignSidebar'
import { SessionListPanel } from './components/SessionListPanel'
import { SessionWorkspace } from './components/SessionWorkspace'
import { useSessions } from './useSessions'

export function SessionPage() {
  const {
    loading,
    saveState,
    campaigns,
    sessions,
    secrets,
    quickNotes,
    activeCampaignId,
    activeSession,
    activeSessionId,
    selectCampaign,
    selectSession,
    createCampaign,
    renameCampaign,
    deleteCampaign,
    createSession,
    deleteSession,
    updateSessionField,
    updateSecret,
    addQuickNote,
    deleteQuickNote,
    normalizePrepChecklist,
  } = useSessions()

  const [sessionCounts, setSessionCounts] = useState<Record<number, number>>({})

  useEffect(() => {
    async function loadCounts() {
      const counts: Record<number, number> = {}
      for (const campaign of campaigns) {
        if (campaign.id == null) continue
        counts[campaign.id] = await db.sessions
          .where('campaignId')
          .equals(campaign.id)
          .count()
      }
      setSessionCounts(counts)
    }
    if (!loading) loadCounts()
  }, [campaigns, loading, sessions.length])

  const displaySession = useMemo(() => {
    if (!activeSession) return null
    return {
      ...activeSession,
      recap: activeSession.recap ?? '',
      strongStart: activeSession.strongStart ?? '',
      prepChecklist: normalizePrepChecklist(activeSession.prepChecklist),
    }
  }, [activeSession, normalizePrepChecklist])

  return (
    <>
      <PageHeader
        title="Session"
        description="Campaign notes, Lazy DM prep, recaps, and live quick notes."
        icon="📜"
      />

      {loading ? (
        <div className="p-6">
          <div className="h-96 animate-pulse rounded-xl bg-table-900/60" />
        </div>
      ) : (
        <div className="grid flex-1 gap-6 p-6 lg:grid-cols-[220px_200px_1fr]">
          <CampaignSidebar
            campaigns={campaigns}
            activeId={activeCampaignId}
            sessionCounts={sessionCounts}
            onSelect={(id) => void selectCampaign(id)}
            onCreate={(name) => void createCampaign(name)}
            onRename={(id, name) => void renameCampaign(id, name)}
            onDelete={(id) => void deleteCampaign(id)}
          />

          <SessionListPanel
            sessions={sessions}
            activeId={activeSessionId}
            campaignSelected={activeCampaignId != null}
            onSelect={(id) => void selectSession(id)}
            onCreate={() => {
              if (activeCampaignId != null) void createSession(activeCampaignId)
            }}
            onDelete={(id) => void deleteSession(id)}
          />

          <SessionWorkspace
            session={displaySession}
            secrets={secrets}
            quickNotes={quickNotes}
            saveState={saveState}
            onUpdateField={updateSessionField}
            onUpdateSecret={(id, patch) => void updateSecret(id, patch)}
            onAddQuickNote={(text) => void addQuickNote(text)}
            onDeleteQuickNote={(id) => void deleteQuickNote(id)}
            normalizePrepChecklist={normalizePrepChecklist}
          />
        </div>
      )}
    </>
  )
}
