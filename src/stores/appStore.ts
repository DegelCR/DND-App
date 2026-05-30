import { create } from 'zustand'

interface AppState {
  dbReady: boolean
  sidebarCollapsed: boolean
  setDbReady: (ready: boolean) => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppState>((set) => ({
  dbReady: false,
  sidebarCollapsed: false,
  setDbReady: (ready) => set({ dbReady: ready }),
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}))
