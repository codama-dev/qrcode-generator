import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { AppProvider } from '@/contexts/AppContext'
import { AppLayout } from '@/layout/AppLayout'
import { QRGeneratorPage } from '@/pages/QRGeneratorPage'

function App() {
  return (
    <AppProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<QRGeneratorPage />} />
            <Route path="/generator" element={<QRGeneratorPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
        <Toaster />
      </Router>
    </AppProvider>
  )
}

export default App
