function SubButton({ subButton, sectionName, isActive, onClick }) {
  const getSectionClass = () => {
    const sectionKey = sectionName.toLowerCase().replace(' ', '-')
    switch (sectionKey) {
      case 'my-stuff':
        return isActive
          ? 'bg-white text-gray-800 border-t-[3px] border-gray-800'
          : 'bg-white/90 text-gray-800 hover:bg-white'
      case 'bet-stuff':
        return isActive
          ? 'bg-gray-500 text-white border-t-[3px] border-white'
          : 'bg-gray-500/90 text-white hover:bg-gray-500'
      case 'league-stuff':
        return isActive
          ? 'bg-black text-white border-t-[3px] border-white'
          : 'bg-black/90 text-white hover:bg-black'
      default:
        return 'bg-gray-500/90 text-white hover:bg-gray-500'
    }
  }

  return (
    <div
      className={`flex-[1_1_20%] max-w-[33.33%] min-w-[60px] transition-all duration-300 relative ${
        isActive ? 'flex-grow-[1.3]' : ''
      }`}
    >
      <button
        onClick={onClick}
        className={`border-none font-medium cursor-pointer transition-all duration-300 rounded-lg m-1 flex items-center justify-center relative flex-col text-center leading-tight whitespace-nowrap overflow-hidden text-ellipsis w-[calc(100%-8px)] h-[calc(100%-8px)] ${getSectionClass()} ${
          isActive ? 'text-xl font-semibold' : 'text-base'
        }`}
      >
        {subButton.name}
      </button>
    </div>
  )
}

export default SubButton
