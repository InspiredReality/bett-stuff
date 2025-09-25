export function useSwipeGesture(element, { onSwipeLeft, onSwipeRight, threshold = 50 }) {
  let startX = 0
  let currentX = 0
  let isDragging = false
  
  const handleStart = (e) => {
    isDragging = true
    startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX
  }
  
  const handleMove = (e) => {
    if (!isDragging) return
    currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX
  }
  
  const handleEnd = () => {
    if (!isDragging) return
    isDragging = false
    
    const diff = startX - currentX
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && onSwipeLeft) {
        onSwipeLeft()
      } else if (diff < 0 && onSwipeRight) {
        onSwipeRight()
      }
    }
  }
  
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
}
