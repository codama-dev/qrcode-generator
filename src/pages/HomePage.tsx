import { Bug, Code2, Heart, Smile, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function HomePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="flex items-center justify-center gap-3 font-bold text-4xl text-gray-900">
          <Zap className="h-8 w-8 text-blue-600" />
          Welcome to Your App
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          A modern, responsive frontend application built with React 19, TypeScript, and shadcn/ui
        </p>
      </div>

      {/* Features Grid */}
      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-blue-500" />
              Example Patterns
            </CardTitle>
            <CardDescription>
              Explore form handling, data fetching, and component patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/examples">View Examples</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5 text-red-500" />
              Error Handling
            </CardTitle>
            <CardDescription>
              Explore comprehensive error handling patterns and mechanisms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/errors">View Error Handling</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="h-5 w-5 text-yellow-500" />
              Random Jokes
            </CardTitle>
            <CardDescription>
              Enjoy a collection of random jokes from various categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/jokes">View Jokes</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Modern UI
            </CardTitle>
            <CardDescription>
              Beautiful components built with shadcn/ui and Tailwind CSS
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              Fast & Responsive
            </CardTitle>
            <CardDescription>
              Built with Vite and optimized for performance across all devices
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Tech Stack */}
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 font-semibold text-2xl text-gray-900">Built With</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            'React 19',
            'TypeScript',
            'Vite',
            'Tailwind CSS',
            'shadcn/ui',
            'React Query',
            'React Router',
            'Zod',
          ].map(tech => (
            <span
              key={tech}
              className="rounded-full bg-gray-100 px-4 py-2 font-medium text-gray-700 text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mx-auto max-w-2xl text-center">
        <h3 className="mb-4 font-semibold text-gray-900 text-xl">Ready to explore?</h3>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link to="/examples">Explore Examples</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link to="/jokes">Try the Jokes Feature</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
