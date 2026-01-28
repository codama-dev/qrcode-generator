import { ModeToggle } from '@/components/mode-toggle'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-border border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            {/* Keep a single <h1> on the page for proper document outline */}
            <p className="font-semibold text-foreground text-xl">QR Code Generator</p>
            <p className="mt-0.5 text-muted-foreground text-sm">
              Create QR codes for URLs and text.
            </p>
          </div>
          <ModeToggle />
        </div>
      </header>

      <main className="flex-1 bg-background p-6">{children}</main>
    </div>
  )
}
