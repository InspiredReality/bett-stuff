import { useRef, useEffect } from 'react'
import AppRoutes from '@/router'

function ContentArea() {
  const contentRef = useRef(null)

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }, [])

  return (
    <main
      ref={contentRef}
      className="flex-1 p-4 pt-0 overflow-y-auto overflow-x-hidden relative w-full min-h-0"
      style={{
        background: 'linear-gradient(135deg, #2c2c2c 0%, #f0f0f0 100%)',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <div
        className="bg-white rounded-xl p-6 shadow-lg min-h-full relative overflow-hidden"
        style={{ paddingTop: 'calc(6vh + 1.5rem)' }}
      >
        <AppRoutes />
      </div>
    </main>
  )
}

export default ContentArea
