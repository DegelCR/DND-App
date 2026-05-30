import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  )
}
