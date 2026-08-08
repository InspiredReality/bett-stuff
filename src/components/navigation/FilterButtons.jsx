import { useRef, useEffect, useCallback } from 'react'
import { useNavigationStore } from '@/store/navigationStore'

function FilterButtons({ className = '' }) {
  const { availableFilters, currentFilter, currentFilterIndex, selectFilter } = useNavigationStore()
  const containerRef = useRef(null)
  const buttonRefs = useRef([])
  const isScrolling = useRef(false)
  const scrollTimeout = useRef(null)

  const handleScroll = useCallback(() => {
    if (isScrolling.current || !containerRef.current || buttonRefs.current.length === 0) return

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current)
    }

    scrollTimeout.current = setTimeout(() => {
      const container = containerRef.current
      if (!container) return

      const containerRect = container.getBoundingClientRect()
      const containerCenter = containerRect.left + containerRect.width / 2

      let closestIndex = 0
      let closestDistance = Infinity

      buttonRefs.current.forEach((button, index) => {
        if (button) {
          const buttonRect = button.getBoundingClientRect()
          const buttonCenter = buttonRect.left + buttonRect.width / 2
          const distance = Math.abs(buttonCenter - containerCenter)

          if (distance < closestDistance) {
            closestDistance = distance
            closestIndex = index
          }
        }
      })

      if (closestIndex !== currentFilterIndex) {
        selectFilter(availableFilters[closestIndex], closestIndex)
      }
    }, 50)
  }, [availableFilters, currentFilterIndex, selectFilter])

  const handleFilterClick = (filter, index) => {
    isScrolling.current = true
    selectFilter(filter, index)

    if (buttonRefs.current[index]) {
      buttonRefs.current[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
    }

    setTimeout(() => {
      isScrolling.current = false
    }, 500)
  }

  useEffect(() => {
    if (!isScrolling.current && buttonRefs.current[currentFilterIndex]) {
      buttonRefs.current[currentFilterIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
    }
  }, [currentFilterIndex])

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`flex justify-start items-center h-12 min-h-[48px] overflow-x-auto overflow-y-visible hide-scrollbar relative px-4 py-2 w-full touch-pan-x select-none bg-black/5 scroll-smooth ${className}`}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div className="flex gap-3 items-center h-full w-max px-[50vw]">
        {availableFilters.map((filter, index) => (
          <button
            key={filter}
            ref={(el) => (buttonRefs.current[index] = el)}
            onClick={() => handleFilterClick(filter, index)}
            className={`border-2 border-transparent rounded-2xl px-8 py-1.5 text-sm font-medium cursor-pointer transition-all duration-300 flex-shrink-0 min-w-[160px] whitespace-nowrap overflow-hidden text-ellipsis text-white ${
              currentFilter === filter
                ? 'bg-gradient-to-br from-gray-300 via-gray-500 to-gray-600 border-[3px] border-black scale-110 font-black shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_4px_8px_rgba(0,0,0,0.3)] z-[2] relative'
                : 'bg-gray-500/90 hover:bg-gray-500'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  )
}

export default FilterButtons
