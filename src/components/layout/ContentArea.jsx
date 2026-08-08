import { useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import AppRoutes from '@/router'

// Routes that manage their own full-bleed layout and opt out of the
// shared white card/padding this shell otherwise wraps every view in.
const FULL_BLEED_ROUTES = ['/league-stuff/maps']

function ContentArea() {
  const contentRef = useRef(null)
  const location = useLocation()
  const isFullBleed = FULL_BLEED_ROUTES.includes(location.pathname)

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }, [])

  return (
    <main
      ref={contentRef}
      className={`flex-1 overflow-y-auto overflow-x-hidden relative w-full min-h-0 ${
        isFullBleed ? 'p-0' : 'p-4 pt-0'
      }`}
      style={{
        background: 'linear-gradient(135deg, #2c2c2c 0%, #f0f0f0 100%)',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <div
        className={`min-h-full relative overflow-hidden flex flex-col ${
          isFullBleed ? '' : 'bg-white rounded-xl p-6 shadow-lg'
        }`}
        style={{ paddingTop: isFullBleed ? 'max(6vh, 50px)' : 'calc(6vh + 1.5rem)' }}
      >
        <AppRoutes />
      </div>
    </main>
  )
}

export default ContentArea
