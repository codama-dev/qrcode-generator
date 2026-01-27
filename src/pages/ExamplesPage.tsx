import { Code2 } from 'lucide-react'
import { ComprehensiveForm } from '@/features/example/ComprehensiveForm'

export function ExamplesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="flex items-center gap-2 font-bold text-2xl text-gray-900">
          <Code2 className="h-6 w-6" />
          Example Feature Demo
        </h1>
        <p className="text-gray-600">
          This demonstrates the recommended patterns: React Hook Form + Zod + React Query
        </p>
      </div>

      {/* Form Example */}
      <div className="mx-auto max-w-4xl">
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-900 text-lg">Comprehensive Form Example</h2>
          <div className="rounded-lg border bg-white p-8 shadow-sm">
            <ComprehensiveForm />
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div className="mx-auto mt-8 max-w-4xl rounded-lg bg-gray-50 p-6">
        <h3 className="mb-4 font-semibold text-gray-900 text-lg">What This Demonstrates</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="mb-2 font-medium text-gray-900">Form Components</h4>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>• Text Input with validation</li>
              <li>• Email Input with format validation</li>
              <li>• Date Picker with Calendar component</li>
              <li>• Select dropdown with options</li>
              <li>• Combobox with search functionality</li>
              <li>• Textarea for longer text</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-medium text-gray-900">Features</h4>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>• React Hook Form for form state</li>
              <li>• Zod schema validation with TypeScript</li>
              <li>• React Query mutations for API calls</li>
              <li>• Toast notifications for feedback</li>
              <li>• Loading states and error handling</li>
              <li>• Accessible form components</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
