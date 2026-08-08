import { useNavigationStore } from '@/store/navigationStore'
import ForceGraph from '@/components/league-stuff/ForceGraph'

function MapsView() {
  const { currentFilter } = useNavigationStore()

  return (
    <div className="-mx-6 flex-1 min-h-0 flex flex-col overflow-hidden bg-neutral-900">
      {currentFilter === '2024' ? (
        <ForceGraph />
      ) : (
        <div className="flex-1 min-h-0 flex items-center justify-center text-gray-400 bg-white">
          Maps data for {currentFilter || 'this season'} is coming soon
        </div>
      )}
    </div>
  )
}

export default MapsView
