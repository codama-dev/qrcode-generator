import { useQuery } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'
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

// Example data type
interface ExampleItem {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive'
  createdAt: string
}

// Example API call function
async function fetchExampleData(): Promise<ExampleItem[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800))

  // Simulate random failure for demo
  if (Math.random() > 0.8) {
    throw new Error('Failed to fetch data')
  }

  // Return mock data
  return [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'inactive',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
  ]
}

export function ExampleList() {
  const {
    data: items,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['example-items'],
    queryFn: fetchExampleData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const { getErrorInfo } = useQueryErrorHandler()
  const errorInfo = getErrorInfo(error)

  const handleRefresh = () => {
    refetch()
  }

  if (errorInfo) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl">Example Items</h2>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
        <ErrorDisplay error={errorInfo} onRetry={handleRefresh} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-xl">Example Items</h2>
        <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                </TableRow>
              ))
            ) : items && items.length > 0 ? (
              items.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-gray-500">
                  No items found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {items && items.length > 0 && (
        <p className="text-center text-gray-500 text-sm">Showing {items.length} items</p>
      )}
    </div>
  )
}
