import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { db } from '@/db'
import type { Campaign, Session } from '@/types'
import {
  DEFAULT_PREP_CHECKLIST,
  emptySecrets,
  normalizePrepChecklist,
  type CampaignSecret,
  type PrepChecklist,
  type SessionQuickNote,
} from '@/types/session'

const ACTIVE_CAMPAIGN_KEY = 'active_campaign_id'
const ACTIVE_SESSION_KEY = 'active_session_id'

async function deleteSetting(key: string) {
  const row = await db.settings.get({ key })
  if (row?.id != null) await db.settings.delete(row.id)
}

async function putSetting(key: string, value: string) {
  const existing = await db.settings.get({ key })
  if (existing?.id != null) {
    await db.settings.update(existing.id, { value })
  } else {
    await db.settings.add({ key, value })
  }
}

async function ensureCampaignSecrets(campaignId: number): Promise<CampaignSecret[]> {
  const existing = await db.campaignSecrets
    .where('campaignId')
    .equals(campaignId)
    .sortBy('slot')

  if (existing.length >= 10) return existing

  const slots = new Set(existing.map((s) => s.slot))
  for (const seed of emptySecrets(campaignId)) {
    if (!slots.has(seed.slot)) {
      await db.campaignSecrets.add(seed)
    }
  }

  return db.campaignSecrets.where('campaignId').equals(campaignId).sortBy('slot')
}

export function useSessions() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [secrets, setSecrets] = useState<CampaignSecret[]>([])
  const [quickNotes, setQuickNotes] = useState<SessionQuickNote[]>([])
  const [activeCampaignId, setActiveCampaignId] = useState<number | null>(null)
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const activeCampaign = useMemo(
    () => campaigns.find((c) => c.id === activeCampaignId) ?? null,
    [campaigns, activeCampaignId],
  )

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) ?? null,
    [sessions, activeSessionId],
  )

  const refreshCampaigns = useCallback(async () => {
    const rows = await db.campaigns.orderBy('updatedAt').reverse().toArray()
    setCampaigns(rows)
    return rows
  }, [])

  const refreshSessions = useCallback(async (campaignId: number) => {
    const rows = await db.sessions
      .where('campaignId')
      .equals(campaignId)
      .sortBy('number')
    setSessions(rows)
    return rows
  }, [])

  const refreshSecrets = useCallback(async (campaignId: number) => {
    const rows = await ensureCampaignSecrets(campaignId)
    setSecrets(rows)
    return rows
  }, [])

  const refreshQuickNotes = useCallback(async (sessionId: number) => {
    const rows = await db.sessionQuickNotes
      .where('sessionId')
      .equals(sessionId)
      .reverse()
      .sortBy('createdAt')
    setQuickNotes(rows)
  }, [])

  const selectCampaign = useCallback(
    async (campaignId: number | null) => {
      setActiveCampaignId(campaignId)
      setActiveSessionId(null)
      setQuickNotes([])

      if (campaignId == null) {
        setSessions([])
        setSecrets([])
        await deleteSetting(ACTIVE_CAMPAIGN_KEY)
        await deleteSetting(ACTIVE_SESSION_KEY)
        return
      }

      await putSetting(ACTIVE_CAMPAIGN_KEY, String(campaignId))

      const rows = await refreshSessions(campaignId)
      await refreshSecrets(campaignId)

      const savedSession = await db.settings.get({ key: ACTIVE_SESSION_KEY })
      let sessionId = savedSession?.value ? Number(savedSession.value) : null
      if (sessionId != null) {
        const sess = await db.sessions.get(sessionId)
        if (!sess || sess.campaignId !== campaignId) sessionId = null
      }
      if (sessionId != null && !rows.some((s) => s.id === sessionId)) {
        sessionId = rows[rows.length - 1]?.id ?? null
      }
      if (sessionId == null && rows.length > 0) {
        sessionId = rows[rows.length - 1].id!
      }

      setActiveSessionId(sessionId)
      if (sessionId != null) {
        await putSetting(ACTIVE_SESSION_KEY, String(sessionId))
        await refreshQuickNotes(sessionId)
      }
    },
    [refreshSessions, refreshSecrets, refreshQuickNotes],
  )

  const selectSession = useCallback(
    async (sessionId: number | null) => {
      setActiveSessionId(sessionId)
      if (sessionId == null) {
        setQuickNotes([])
        await deleteSetting(ACTIVE_SESSION_KEY)
        return
      }
      await putSetting(ACTIVE_SESSION_KEY, String(sessionId))
      await refreshQuickNotes(sessionId)
    },
    [refreshQuickNotes],
  )

  useEffect(() => {
    let cancelled = false

    async function init() {
      const rows = await db.campaigns.orderBy('updatedAt').reverse().toArray()
      if (cancelled) return
      setCampaigns(rows)

      const savedCampaign = await db.settings.get({ key: ACTIVE_CAMPAIGN_KEY })
      let campaignId = savedCampaign?.value ? Number(savedCampaign.value) : null
      if (campaignId != null && !rows.some((c) => c.id === campaignId)) {
        campaignId = rows[0]?.id ?? null
      }
      if (campaignId == null && rows.length > 0) {
        campaignId = rows[0].id!
      }

      setActiveCampaignId(campaignId)

      if (campaignId != null) {
        const sessionRows = await db.sessions
          .where('campaignId')
          .equals(campaignId)
          .sortBy('number')
        if (cancelled) return
        setSessions(sessionRows)

        const secretRows = await ensureCampaignSecrets(campaignId)
        if (cancelled) return
        setSecrets(secretRows)

        const savedSession = await db.settings.get({ key: ACTIVE_SESSION_KEY })
        let sessionId = savedSession?.value ? Number(savedSession.value) : null
        if (sessionId != null) {
          const sess = await db.sessions.get(sessionId)
          if (!sess || sess.campaignId !== campaignId) sessionId = null
        }
        if (sessionId != null && !sessionRows.some((s) => s.id === sessionId)) {
          sessionId = sessionRows[sessionRows.length - 1]?.id ?? null
        }
        if (sessionId == null && sessionRows.length > 0) {
          sessionId = sessionRows[sessionRows.length - 1].id!
        }

        setActiveSessionId(sessionId)

        if (sessionId != null) {
          const notes = await db.sessionQuickNotes
            .where('sessionId')
            .equals(sessionId)
            .reverse()
            .sortBy('createdAt')
          if (!cancelled) setQuickNotes(notes)
        }
      }

      if (!cancelled) setLoading(false)
    }

    init()
    return () => {
      cancelled = true
    }
  }, [])

  const createCampaign = useCallback(
    async (name: string) => {
      const now = new Date()
      const rawId = await db.campaigns.add({
        name: name.trim() || 'New Campaign',
        createdAt: now,
        updatedAt: now,
      })
      const id = Number(rawId)
      await ensureCampaignSecrets(id)
      await refreshCampaigns()
      await selectCampaign(id)
      return id
    },
    [refreshCampaigns, selectCampaign],
  )

  const renameCampaign = useCallback(
    async (id: number, name: string) => {
      await db.campaigns.update(id, {
        name: name.trim() || 'Untitled Campaign',
        updatedAt: new Date(),
      })
      await refreshCampaigns()
    },
    [refreshCampaigns],
  )

  const deleteCampaign = useCallback(
    async (id: number) => {
      const sessionIds = (
        await db.sessions.where('campaignId').equals(id).primaryKeys()
      ) as number[]
      await db.sessionQuickNotes
        .where('sessionId')
        .anyOf(sessionIds)
        .delete()
      await db.sessions.where('campaignId').equals(id).delete()
      await db.campaignSecrets.where('campaignId').equals(id).delete()
      await db.campaigns.delete(id)

      const rows = await refreshCampaigns()
      if (activeCampaignId === id) {
        await selectCampaign(rows[0]?.id ?? null)
      }
    },
    [activeCampaignId, refreshCampaigns, selectCampaign],
  )

  const createSession = useCallback(
    async (campaignId: number) => {
      const existing = await db.sessions.where('campaignId').equals(campaignId).toArray()
      const nextNumber =
        existing.length > 0 ? Math.max(...existing.map((s) => s.number)) + 1 : 1
      const now = new Date()
      const rawId = await db.sessions.add({
        campaignId,
        number: nextNumber,
        title: `Session ${nextNumber}`,
        date: now.toISOString().slice(0, 10),
        notes: '',
        recap: '',
        strongStart: '',
        prepChecklist: { ...DEFAULT_PREP_CHECKLIST },
        createdAt: now,
        updatedAt: now,
      })
      const id = Number(rawId)
      await refreshSessions(campaignId)
      await selectSession(id)
      return id
    },
    [refreshSessions, selectSession],
  )

  const deleteSession = useCallback(
    async (sessionId: number) => {
      const session = await db.sessions.get(sessionId)
      if (!session) return

      await db.sessionQuickNotes.where('sessionId').equals(sessionId).delete()
      await db.sessions.delete(sessionId)

      const rows = await refreshSessions(session.campaignId)
      if (activeSessionId === sessionId) {
        await selectSession(rows[rows.length - 1]?.id ?? null)
      }
    },
    [activeSessionId, refreshSessions, selectSession],
  )

  const persistSession = useCallback(
    async (sessionId: number, patch: Partial<Session>) => {
      setSaveState('saving')
      await db.sessions.update(sessionId, {
        ...patch,
        updatedAt: new Date(),
      })
      if (activeCampaignId != null) {
        await refreshSessions(activeCampaignId)
      }
      setSaveState('saved')
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => setSaveState('idle'), 2000)
    },
    [activeCampaignId, refreshSessions],
  )

  const updateSessionField = useCallback(
    (field: keyof Session, value: string | PrepChecklist) => {
      if (activeSessionId == null || activeSession == null) return

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId ? { ...s, [field]: value } : s,
        ),
      )

      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        void persistSession(activeSessionId, { [field]: value })
      }, 500)
    },
    [activeSession, activeSessionId, persistSession],
  )

  const updateSecret = useCallback(
    async (secretId: number, patch: Partial<CampaignSecret>) => {
      await db.campaignSecrets.update(secretId, patch)
      if (activeCampaignId != null) {
        await refreshSecrets(activeCampaignId)
      }
    },
    [activeCampaignId, refreshSecrets],
  )

  const addQuickNote = useCallback(
    async (text: string) => {
      if (activeSessionId == null || !text.trim()) return
      await db.sessionQuickNotes.add({
        sessionId: activeSessionId,
        text: text.trim(),
        createdAt: new Date(),
      })
      await refreshQuickNotes(activeSessionId)
    },
    [activeSessionId, refreshQuickNotes],
  )

  const deleteQuickNote = useCallback(
    async (noteId: number) => {
      await db.sessionQuickNotes.delete(noteId)
      if (activeSessionId != null) {
        await refreshQuickNotes(activeSessionId)
      }
    },
    [activeSessionId, refreshQuickNotes],
  )

  return {
    loading,
    saveState,
    campaigns,
    sessions,
    secrets,
    quickNotes,
    activeCampaign,
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
  }
}
