import { useEffect, useRef, useCallback } from 'react'

export function useSwipeGesture(ref, { onSwipeLeft, onSwipeRight, threshold = 50 }) {
  const startX = useRef(0)
  const currentX = useRef(0)
  const isDragging = useRef(false)

  const handleStart = useCallback((e) => {
    isDragging.current = true
    startX.current = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX
  }, [])

  const handleMove = useCallback((e) => {
    if (!isDragging.current) return
    currentX.current = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX
  }, [])

  const handleEnd = useCallback(() => {
    if (!isDragging.current) return
    isDragging.current = false

    const diff = startX.current - currentX.current

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && onSwipeLeft) {
        onSwipeLeft()
      } else if (diff < 0 && onSwipeRight) {
        onSwipeRight()
      }
    }
  }, [threshold, onSwipeLeft, onSwipeRight])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Touch events
    element.addEventListener('touchstart', handleStart)
    element.addEventListener('touchmove', handleMove)
    element.addEventListener('touchend', handleEnd)

    // Mouse events for testing
    element.addEventListener('mousedown', handleStart)
    element.addEventListener('mousemove', handleMove)
    element.addEventListener('mouseup', handleEnd)
    element.addEventListener('mouseleave', handleEnd)

    // Cleanup function
    return () => {
      element.removeEventListener('touchstart', handleStart)
      element.removeEventListener('touchmove', handleMove)
      element.removeEventListener('touchend', handleEnd)
      element.removeEventListener('mousedown', handleStart)
      element.removeEventListener('mousemove', handleMove)
      element.removeEventListener('mouseup', handleEnd)
      element.removeEventListener('mouseleave', handleEnd)
    }
  }, [ref, handleStart, handleMove, handleEnd])
}

export default useSwipeGesture
