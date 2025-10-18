import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNavigationStore = defineStore('navigation', () => {
  // State
  const activeMainButton = ref(null)
  const currentSubButton = ref(null)
  const currentFilter = ref(null)
  const currentFilterIndex = ref(0)
  const availableFilters = ref([])
  const isPortrait = ref(true)
  const showMainButton = ref(true) // NEW: Control main button visibility

  // Navigation structure
  const navSections = ref([
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
  ])

  // Memory systems
  const lastViewedFilters = ref({})
  const lastViewedState = ref({})

  // Computed
  const headerClass = computed(() => {
    if (activeMainButton.value) {
      const section = navSections.value.find(s => s.name === activeMainButton.value)
      return section ? section.colorClass : 'default'
    }
    return 'default'
  })

  const pageTitle = computed(() => {
    if (currentSubButton.value && currentFilter.value) {
      return `${currentSubButton.value} (${currentFilter.value})`
    } else if (currentSubButton.value) {
      return currentSubButton.value
    }
    return activeMainButton.value || 'Bet Stuff'
  })

  // Actions
  function initializeApp() {
    initializeMemory()
    // Set default to Bet Stuff
    const betStuffSection = navSections.value.find(s => s.name === 'Bet Stuff')
    if (betStuffSection) {
      selectMainButton(betStuffSection)
      const openSub = betStuffSection.subButtons.find(sub => sub.name === 'Open')
      if (openSub) {
        selectSubButton('Bet Stuff', openSub, 1) // Index 1 is "All"
      }
    }
  }

  function initializeMemory() {
    navSections.value.forEach(section => {
      lastViewedState.value[section.name] = {
        subButton: null,
        filterIndex: null
      }
      
      lastViewedFilters.value[section.name] = {}
      section.subButtons.forEach(sub => {
        const defaultIndex = (section.name === 'Bet Stuff' && sub.name === 'Open') ? 1 : 0
        lastViewedFilters.value[section.name][sub.name] = defaultIndex
      })
    })
  }

  function selectMainButton(section) {
    // Only collapse if clicking the active button AND sub-buttons are currently visible
    if (activeMainButton.value === section.name && !showMainButton.value) {
      // Collapse if clicking active button while sub-buttons are showing
      activeMainButton.value = null
      currentSubButton.value = null
      currentFilter.value = null
      availableFilters.value = []
      showMainButton.value = true
      return false
    }

    // Set the active section
    activeMainButton.value = section.name

    // Restore last viewed state or show sub-buttons
    const lastState = lastViewedState.value[section.name]
    if (lastState.subButton) {
      const subData = section.subButtons.find(sub => sub.name === lastState.subButton)
      if (subData) {
        selectSubButton(section.name, subData, lastState.filterIndex)
      }
    } else {
      // If no previous state, show sub-buttons (not main button)
      showMainButton.value = false
    }

    return true
  }

  function selectSubButton(mainName, subButton, savedFilterIndex = null) {
    currentSubButton.value = subButton.name
    availableFilters.value = subButton.filters
    showMainButton.value = false // Hide main button when sub is selected
    
    const filterIndex = savedFilterIndex !== null 
      ? savedFilterIndex 
      : lastViewedFilters.value[mainName][subButton.name]
    
    currentFilterIndex.value = filterIndex
    currentFilter.value = availableFilters.value[filterIndex]
    
    // Update memory
    lastViewedState.value[mainName] = {
      subButton: subButton.name,
      filterIndex: filterIndex
    }
  }

  function selectFilter(filterName, index) {
    currentFilter.value = filterName
    currentFilterIndex.value = index
    
    if (activeMainButton.value && currentSubButton.value) {
      lastViewedFilters.value[activeMainButton.value][currentSubButton.value] = index
      lastViewedState.value[activeMainButton.value].filterIndex = index
    }
  }

  function updateOrientation() {
    isPortrait.value = window.innerHeight > window.innerWidth
  }

  function returnToMainView() {
    // Return to main button view - keep activeMainButton to maintain header state
    currentSubButton.value = null
    currentFilter.value = null
    availableFilters.value = []
    showMainButton.value = true
  }

  function syncWithRoute(path) {
    // Sync navigation state based on current route path
    const section = navSections.value.find(s => path.startsWith(s.path))
    if (!section) return

    activeMainButton.value = section.name

    // Check if we're on a sub-route
    const subPath = path.replace(section.path + '/', '')
    const subButton = section.subButtons.find(sub => sub.path === subPath)

    if (subButton) {
      // We're on a sub-route, so hide main buttons and show sub buttons
      showMainButton.value = false
      selectSubButton(section.name, subButton)
    } else {
      // We're on the main section route, show main buttons
      showMainButton.value = true
      currentSubButton.value = null
      currentFilter.value = null
      availableFilters.value = []
    }
  }

  return {
    // State
    activeMainButton,
    currentSubButton,
    currentFilter,
    currentFilterIndex,
    availableFilters,
    navSections,
    isPortrait,
    showMainButton,

    // Computed
    headerClass,
    pageTitle,

    // Actions
    initializeApp,
    selectMainButton,
    selectSubButton,
    selectFilter,
    updateOrientation,
    returnToMainView,
    syncWithRoute
  }
})