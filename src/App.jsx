import { AppProvider, useApp } from "./context/AppContext"
import { useState, useEffect } from "react"
import Home      from "./pages/Home"
import Signal    from "./pages/Signal"
import Chart     from "./pages/Chart"
import Watchlist from "./pages/Watchlist"
import Admin     from "./pages/Admin"
import LoginScreen from "./pages/LoginScreen"

function Router() {
  const { currentPage } = useApp()
  const [isServerLive, setIsServerLive] = useState(true)
  const session = localStorage.getItem('trinetr_session')

  // This will handle your Master Kill Switch logic later
  useEffect(() => {
    // Placeholder for Firebase Master Status
    setIsServerLive(true) 
  }, [])

  if (!isServerLive) {
    return (
      <div style={{background: '#000', color: '#f39c12', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', flexDirection: 'column', fontFamily: 'sans-serif'}}>
        <h1>SYSTEM OFFLINE</h1>
        <p>The server is currently closed by the Administrator.</p>
      </div>
    )
  }

  if (!session) {
    return <LoginScreen onLogin={() => window.location.reload()} />
  }

  switch (currentPage) {
    case "home":      return <Home />
    case "signal":    return <Signal />
    case "chart":     return <Chart />
    case "watchlist": return <Watchlist />
    case "admin":     return <Admin />
    default:          return <Home />
  }
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  )
}
