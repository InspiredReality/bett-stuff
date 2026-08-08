function MainButton({ section, isActive, isCollapsed, onClick }) {
  const getButtonStyles = () => {
    switch (section.id) {
      case 'my-stuff':
        return 'bg-white/90 text-gray-800 hover:bg-white'
      case 'bet-stuff':
        return 'bg-gray-500/90 text-white hover:bg-gray-500'
      case 'league-stuff':
        return 'bg-black/90 text-white hover:bg-black'
      default:
        return 'bg-gray-500/90 text-white hover:bg-gray-500'
    }
  }

  const getContainerClass = () => {
    if (isCollapsed) return 'flex-[0_0_15%]'
    if (isActive) return 'flex-[1_1_33.33%]'
    return 'flex-[1_1_33.33%]'
  }

  const words = section.name.split(' ')

  return (
    <div
      id={`${section.id}-section`}
      className={`transition-all duration-300 flex flex-shrink min-w-0 ${getContainerClass()}`}
    >
      <button
        onClick={onClick}
        className={`border-none text-base font-medium cursor-pointer transition-all duration-300 rounded-lg m-1 flex items-center justify-center relative flex-col text-center leading-tight whitespace-nowrap overflow-hidden text-ellipsis w-[calc(100%-8px)] h-[calc(100%-8px)] ${getButtonStyles()} ${
          isCollapsed ? 'text-xs p-1 whitespace-normal break-words' : ''
        }`}
      >
        {isCollapsed ? (
          <span className="text-center leading-tight">
            {words[0]}<br />{words[1]}
          </span>
        ) : (
          <span>{section.name}</span>
        )}
      </button>
    </div>
  )
}

export default MainButton
