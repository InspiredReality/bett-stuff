import { useNavigate } from 'react-router-dom'
import { useNavigationStore } from '@/store/navigationStore'
import { useBetsStore } from '@/store/betsStore'

function BetStuffMain() {
  const navigate = useNavigate()
  const { navSections, selectSubButton } = useNavigationStore()
  const { getOpenBets, getLiveBets } = useBetsStore()

  const sectionName = 'Bet Stuff'
  const section = navSections.find(s => s.name === sectionName)
  const subButtons = section?.subButtons || []

  const openBetsCount = getOpenBets().length || 12
  const liveBetsCount = getLiveBets().length || 5
  const completedToday = 3

  const navigateTo = (sub) => {
    selectSubButton(sectionName, sub)
    if (section) {
      navigate(`${section.path}/${sub.path}`)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{sectionName}</h2>
      <div className="bg-white rounded-xl p-8 shadow-md">
        <p className="text-gray-600 mb-6">
          Welcome to {sectionName}. Select an option from the navigation to continue.
        </p>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Access</h3>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
            {subButtons.map((sub) => (
              <button
                key={sub.name}
                onClick={() => navigateTo(sub)}
                className="p-6 border-none rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 bg-gray-500/90 text-white hover:bg-gray-500 hover:-translate-y-0.5 hover:shadow-lg"
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Activity</h3>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4">
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <span className="block text-3xl font-bold text-gray-500">{openBetsCount}</span>
              <span className="block text-sm text-gray-600 mt-2">Open Bets</span>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <span className="block text-3xl font-bold text-gray-500">{liveBetsCount}</span>
              <span className="block text-sm text-gray-600 mt-2">Live Bets</span>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <span className="block text-3xl font-bold text-gray-500">{completedToday}</span>
              <span className="block text-sm text-gray-600 mt-2">Completed Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BetStuffMain
