import { RefreshCw, Smile } from 'lucide-react'
import { ErrorDisplay } from '@/components/errors/ErrorDisplay'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useQueryErrorHandler } from '@/hooks/useErrorHandler'
import { useRandomTenJokes } from '@/hooks/useJokes'
import type { Joke } from '@/lib/types'

export function JokesPage() {
  const { data: jokes, isLoading, error, refetch } = useRandomTenJokes()
  const { getErrorInfo } = useQueryErrorHandler()

  const handleRefresh = () => {
    refetch()
  }

  const errorInfo = getErrorInfo(error)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-bold text-2xl text-gray-900">
            <Smile className="h-6 w-6" />
            Jokes
          </h1>
          <p className="text-gray-600">Random jokes from the Official Joke API</p>
        </div>
        <Button onClick={handleRefresh} disabled={isLoading} size="sm" variant="outline">
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Get New Jokes
        </Button>
      </div>

      {/* Error State */}
      {errorInfo && (
        <ErrorDisplay error={errorInfo} onRetry={handleRefresh} className="max-w-2xl" />
      )}

      {/* Jokes Table */}
      {!errorInfo && (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">ID</TableHead>
                <TableHead className="w-24">Type</TableHead>
                <TableHead>Setup</TableHead>
                <TableHead>Punchline</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : jokes && jokes.length > 0 ? (
                jokes.map((joke: Joke) => (
                  <TableRow key={joke.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm">{joke.id}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {joke.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{joke.setup}</TableCell>
                    <TableCell className="text-gray-700 italic">{joke.punchline}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-gray-500">
                    No jokes available. Try refreshing the page.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Summary */}
      {jokes && jokes.length > 0 && !isLoading && (
        <div className="text-center text-gray-500 text-sm">Showing {jokes.length} random jokes</div>
      )}
    </div>
  )
}
