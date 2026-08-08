import { useNavigationStore } from '@/store/navigationStore'

function AppHeader() {
  const { getHeaderClass, getPageTitle } = useNavigationStore()
  const headerClass = getHeaderClass()
  const pageTitle = getPageTitle()

  const getTitleStyles = () => {
    switch (headerClass) {
      case 'my-stuff':
        return 'bg-white/90 text-gray-800'
      case 'bet-stuff':
        return 'bg-gray-500/90 text-white'
      case 'league-stuff':
        return 'bg-black/90 text-white'
      default:
        return 'bg-gray-500/90 text-white'
    }
  }

  return (
    <header className="backdrop-blur-md px-4 py-2 text-center h-[6vh] min-h-[50px] flex flex-col justify-center items-center transition-colors duration-300 bg-transparent absolute top-0 left-0 right-0 z-[1000] pointer-events-none">
      <h1
        className={`pointer-events-auto relative z-[1001] text-xl font-semibold transition-all duration-300 cursor-pointer px-6 py-1.5 rounded-xl whitespace-nowrap ${getTitleStyles()}`}
      >
        {pageTitle}
      </h1>
    </header>
  )
}

export default AppHeader
