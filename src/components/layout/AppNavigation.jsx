import { useNavigate } from 'react-router-dom'
import { useNavigationStore } from '@/store/navigationStore'
import MainButton from '@/components/navigation/MainButton'
import SubButton from '@/components/navigation/SubButton'
import FilterButtons from '@/components/navigation/FilterButtons'

function AppNavigation() {
  const navigate = useNavigate()
  const {
    isPortrait,
    navSections,
    activeMainButton,
    currentSubButton,
    showMainButton,
    availableFilters,
    selectMainButton,
    selectSubButton,
    returnToMainView
  } = useNavigationStore()

  const handleMainClick = (section) => {
    const expanded = selectMainButton(section)
    const state = useNavigationStore.getState()
    if (expanded && state.currentSubButton) {
      const sub = section.subButtons.find(s => s.name === state.currentSubButton)
      if (sub) {
        navigate(`${section.path}/${sub.path}`)
      }
    }
  }

  const handleSubClick = (sectionName, subButton) => {
    if (currentSubButton === subButton.name) {
      returnToMainView()
      const section = navSections.find(s => s.name === sectionName)
      if (section) {
        navigate(section.path)
      }
    } else {
      selectSubButton(sectionName, subButton)
      const section = navSections.find(s => s.name === sectionName)
      if (section) {
        navigate(`${section.path}/${subButton.path}`)
      }
    }
  }

  return (
    <nav
      className={`backdrop-blur-md relative z-[100] flex-shrink-0 overflow-hidden flex flex-col ${
        isPortrait
          ? 'h-auto min-h-[70px] w-full border-t border-white/20 pb-safe-bottom'
          : 'h-full w-[15vw] min-w-[150px] max-w-[200px] border-l border-white/20'
      }`}
      style={{ paddingBottom: isPortrait ? 'max(8px, env(safe-area-inset-bottom))' : 0 }}
    >
      {availableFilters.length > 0 && (
        <FilterButtons className="flex-shrink-0 border-b border-white/20" />
      )}

      <div
        className={`flex w-full flex-1 min-h-0 ${
          isPortrait
            ? 'flex-row justify-between items-stretch min-h-[70px] max-h-[70px]'
            : 'flex-col justify-start'
        }`}
      >
        {navSections.map((section) => (
          <div key={section.id} className="contents">
            {(showMainButton || activeMainButton !== section.name) && (
              <MainButton
                section={section}
                isActive={activeMainButton === section.name}
                isCollapsed={activeMainButton && activeMainButton !== section.name && !showMainButton}
                onClick={() => handleMainClick(section)}
              />
            )}

            {activeMainButton === section.name && !showMainButton && (
              section.subButtons.map((subButton) => (
                <SubButton
                  key={subButton.name}
                  subButton={subButton}
                  sectionName={section.name}
                  isActive={currentSubButton === subButton.name}
                  onClick={() => handleSubClick(section.name, subButton)}
                />
              ))
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}

export default AppNavigation
