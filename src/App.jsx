import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigationStore } from '@/store/navigationStore'
import AppHeader from '@/components/layout/AppHeader'
import AppNavigation from '@/components/layout/AppNavigation'
import ContentArea from '@/components/layout/ContentArea'

function App() {
  const location = useLocation()
  const { isPortrait, updateOrientation, syncWithRoute, initializeApp } = useNavigationStore()

  // Initialize app and handle orientation
  useEffect(() => {
    initializeApp()
    updateOrientation()

    const handleResize = () => updateOrientation()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [initializeApp, updateOrientation])

  // Sync navigation state with route changes
  useEffect(() => {
    syncWithRoute(location.pathname)
  }, [location.pathname, syncWithRoute])

  return (
    <div className={`app-container ${isPortrait ? 'portrait' : 'landscape'}`}>
      <AppHeader />
      <div className={`content-wrapper ${isPortrait ? 'flex-col' : 'flex-row'}`}>
        <ContentArea />
        <AppNavigation />
      </div>
    </div>
  )
}

export default App
