import type * as React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface SectionCardProps {
  icon: React.ReactNode
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function SectionCard({ icon, title, description, children, className }: SectionCardProps) {
  return (
    <Card
      className={cn(
        'rounded-xl border border-border/70 bg-card/95 text-card-foreground shadow-md transition-all duration-200 hover:-translate-y-px hover:shadow-lg',
        className
      )}
    >
      <CardHeader className="flex flex-row items-center gap-3 pb-4">
        <div className="flex size-9 min-w-9 items-center justify-center rounded-full bg-linear-to-br from-orange-500/15 to-amber-400/15 text-orange-600 dark:text-amber-300">
          {icon}
        </div>
        <div className="space-y-0.5">
          <h2 className="font-semibold text-base tracking-tight">{title}</h2>
          {description ? <p className="text-muted-foreground text-xs">{description}</p> : null}
        </div>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}
