import { useState } from 'react'
import HomePage from './HomePage'
import CrescendoDashboard from './CrescendoDashboard'

function App() {
  const [page, setPage] = useState('home')

  if (page === 'dashboard') {
    return <CrescendoDashboard onBack={() => setPage('home')} />
  }

  return <HomePage onEnterDashboard={() => setPage('dashboard')} />
}

export default App
