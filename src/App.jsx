import { useState } from 'react'
import HomePage from './HomePage'
import CrescendoDashboard from './CrescendoDashboard'

// page values: 'home' | 'dashboard' | 'markets' | 'portfolio' | 'news' | 'about' | 'contact' | 'profile'
// Dashboard-group pages share the CrescendoDashboard component with different initial tabs.
const DASHBOARD_TABS = { dashboard: 'Dashboard', markets: 'Markets', portfolio: 'Portfolio', news: 'News' }

function App() {
  const [page, setPage] = useState('home')

  const navigate = (target) => {
    const key = target.toLowerCase()
    setPage(key)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Dashboard-group pages
  if (DASHBOARD_TABS[page]) {
    return (
      <CrescendoDashboard
        initialTab={DASHBOARD_TABS[page]}
        navigate={navigate}
      />
    )
  }

  // Profile reuses dashboard shell with a profile flag
  if (page === 'profile') {
    return (
      <CrescendoDashboard
        initialTab="Dashboard"
        navigate={navigate}
        showProfile
      />
    )
  }

  // Home / About / Contact all render the homepage (About & Contact are sections on it)
  return (
    <HomePage
      navigate={navigate}
      scrollTo={page === 'about' ? 'about' : page === 'contact' ? 'contact' : null}
    />
  )
}

export default App
