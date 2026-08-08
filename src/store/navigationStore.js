import { create } from 'zustand'

const navSections = [
  {
    id: 'my-stuff',
    name: 'My Stuff',
    path: '/my-stuff',
    colorClass: 'my-stuff',
    subButtons: [
      { name: 'Account', path: 'account', filters: ['Profile', 'Settings'] },
      { name: 'Ledger', path: 'ledger', filters: ['Me', 'All'] },
      { name: 'History', path: 'history', filters: ['Me', 'All'] }
    ]
  },
  {
    id: 'bet-stuff',
    name: 'Bet Stuff',
    path: '/bet-stuff',
    colorClass: 'bet-stuff',
    subButtons: [
      { name: 'Open', path: 'open', filters: ['Mine', 'All'] },
      { name: 'LIVE', path: 'live', filters: ['Mine', 'All'] },
      { name: 'Done', path: 'done', filters: ['Mine', 'All'] }
    ]
  },
  {
    id: 'league-stuff',
    name: 'League Stuff',
    path: '/league-stuff',
    colorClass: 'league-stuff',
    subButtons: [
      { name: 'Stats', path: 'stats', filters: ['Week', 'Season', 'All Time'] },
      { name: 'Maps', path: 'maps', filters: ['2025', '2024', '2023', '2022', '2021'] },
      { name: 'Chats', path: 'chats', filters: ['Group Text', 'Parlays', 'Dues'] }
    ]
  }
]

// Initialize memory objects
const initializeMemory = () => {
  const lastViewedFilters = {}
  const lastViewedState = {}

  navSections.forEach(section => {
    lastViewedState[section.name] = {
      subButton: null,
      filterIndex: null
    }

    lastViewedFilters[section.name] = {}
    section.subButtons.forEach(sub => {
      const defaultIndex = (section.name === 'Bet Stuff' && sub.name === 'Open') ? 1 : 0
      lastViewedFilters[section.name][sub.name] = defaultIndex
    })
  })

  return { lastViewedFilters, lastViewedState }
}

const { lastViewedFilters: initialFilters, lastViewedState: initialState } = initializeMemory()

export const useNavigationStore = create((set, get) => ({
  // State
  activeMainButton: null,
  currentSubButton: null,
  currentFilter: null,
  currentFilterIndex: 0,
  availableFilters: [],
  isPortrait: true,
  showMainButton: true,
  navSections,
  lastViewedFilters: initialFilters,
  lastViewedState: initialState,

  // Computed getters
  getHeaderClass: () => {
    const { activeMainButton } = get()
    if (activeMainButton) {
      const section = navSections.find(s => s.name === activeMainButton)
      return section ? section.colorClass : 'default'
    }
    return 'default'
  },

  getPageTitle: () => {
    const { currentSubButton, currentFilter, activeMainButton } = get()
    if (currentSubButton && currentFilter) {
      return `${currentSubButton} (${currentFilter})`
    } else if (currentSubButton) {
      return currentSubButton
    }
    return activeMainButton || 'Bet Stuff'
  },

  // Actions
  initializeApp: () => {
    const betStuffSection = navSections.find(s => s.name === 'Bet Stuff')
    if (betStuffSection) {
      get().selectMainButton(betStuffSection)
      const openSub = betStuffSection.subButtons.find(sub => sub.name === 'Open')
      if (openSub) {
        get().selectSubButton('Bet Stuff', openSub, 1) // Index 1 is "All"
      }
    }
  },

  selectMainButton: (section) => {
    const { activeMainButton, showMainButton, lastViewedState } = get()

    // Only collapse if clicking the active button AND sub-buttons are currently visible
    if (activeMainButton === section.name && !showMainButton) {
      set({
        activeMainButton: null,
        currentSubButton: null,
        currentFilter: null,
        availableFilters: [],
        showMainButton: true
      })
      return false
    }

    // Set the active section
    set({ activeMainButton: section.name })

    // Restore last viewed state or show sub-buttons
    const lastState = lastViewedState[section.name]
    if (lastState?.subButton) {
      const subData = section.subButtons.find(sub => sub.name === lastState.subButton)
      if (subData) {
        get().selectSubButton(section.name, subData, lastState.filterIndex)
      }
    } else {
      // If no previous state, show sub-buttons (not main button)
      set({ showMainButton: false })
    }

    return true
  },

  selectSubButton: (mainName, subButton, savedFilterIndex = null) => {
    const { lastViewedFilters, lastViewedState } = get()

    const filterIndex = savedFilterIndex !== null
      ? savedFilterIndex
      : lastViewedFilters[mainName]?.[subButton.name] ?? 0

    set({
      currentSubButton: subButton.name,
      availableFilters: subButton.filters,
      showMainButton: false,
      currentFilterIndex: filterIndex,
      currentFilter: subButton.filters[filterIndex],
      lastViewedState: {
        ...lastViewedState,
        [mainName]: {
          subButton: subButton.name,
          filterIndex: filterIndex
        }
      }
    })
  },

  selectFilter: (filterName, index) => {
    const { activeMainButton, currentSubButton, lastViewedFilters, lastViewedState } = get()

    const updates = {
      currentFilter: filterName,
      currentFilterIndex: index
    }

    if (activeMainButton && currentSubButton) {
      updates.lastViewedFilters = {
        ...lastViewedFilters,
        [activeMainButton]: {
          ...lastViewedFilters[activeMainButton],
          [currentSubButton]: index
        }
      }
      updates.lastViewedState = {
        ...lastViewedState,
        [activeMainButton]: {
          ...lastViewedState[activeMainButton],
          filterIndex: index
        }
      }
    }

    set(updates)
  },

  updateOrientation: () => {
    set({ isPortrait: window.innerHeight > window.innerWidth })
  },

  returnToMainView: () => {
    set({
      currentSubButton: null,
      currentFilter: null,
      availableFilters: [],
      showMainButton: true
    })
  },

  syncWithRoute: (path) => {
    const section = navSections.find(s => path.startsWith(s.path))
    if (!section) return

    set({ activeMainButton: section.name })

    // Check if we're on a sub-route
    const subPath = path.replace(section.path + '/', '')
    const subButton = section.subButtons.find(sub => sub.path === subPath)

    if (subButton) {
      // We're on a sub-route, so hide main buttons and show sub buttons
      set({ showMainButton: false })
      get().selectSubButton(section.name, subButton)
    } else {
      // We're on the main section route, show main buttons
      set({
        showMainButton: true,
        currentSubButton: null,
        currentFilter: null,
        availableFilters: []
      })
    }
  }
}))
