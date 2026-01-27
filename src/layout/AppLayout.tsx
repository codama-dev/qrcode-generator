import { SidebarProvider, SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'

interface AppLayoutProps {
  children: React.ReactNode
}

function AppLayoutContent({ children }: AppLayoutProps) {
  const { open, openMobile, isMobile } = useSidebar()

  // Show title when sidebar is closed (on desktop) or when mobile sidebar is closed
  const showTitle = isMobile ? !openMobile : !open

  return (
    <>
      <AppSidebar />
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Header with Sidebar Trigger */}
        <header className="flex min-h-16 flex-wrap items-center justify-between gap-2 border-gray-200 border-b bg-white px-6 py-2">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            {showTitle && <h1 className="font-semibold text-gray-900 text-lg">Your App</h1>}
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 p-6">{children}</div>
      </main>
    </>
  )
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  )
}
