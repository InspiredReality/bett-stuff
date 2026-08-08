import { useNavigate } from 'react-router-dom'
import { useNavigationStore } from '@/store/navigationStore'

function MyStuffMain() {
  const navigate = useNavigate()
  const { navSections, selectSubButton } = useNavigationStore()

  const sectionName = 'My Stuff'
  const section = navSections.find(s => s.name === sectionName)
  const subButtons = section?.subButtons || []

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
                className="p-6 rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 bg-white/90 text-gray-800 border-2 border-gray-200 hover:bg-white hover:-translate-y-0.5 hover:shadow-lg hover:border-gray-800"
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyStuffMain
