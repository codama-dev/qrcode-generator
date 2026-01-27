import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { AppProvider } from '@/contexts/AppContext'
import { AppLayout } from '@/layout/AppLayout'
import { ErrorHandlingPage } from '@/pages/ErrorHandlingPage'
import { ExamplesPage } from '@/pages/ExamplesPage'
import { HomePage } from '@/pages/HomePage'
import { JokesPage } from '@/pages/JokesPage'

function App() {
  return (
    <AppProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/examples" element={<ExamplesPage />} />
            <Route path="/errors" element={<ErrorHandlingPage />} />
            <Route path="/jokes" element={<JokesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
        <Toaster />
      </Router>
    </AppProvider>
  )
}

export default App
