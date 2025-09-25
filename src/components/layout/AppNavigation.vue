<template>
  <nav class="navigation" :class="{ 'navigation-portrait': isPortrait, 'navigation-landscape': !isPortrait }">
    <div class="navigation-container">
      <template v-for="section in navigationStore.navSections" :key="section.id">
        <!-- Main button - only visible when showMainButton is true or when this section is not active -->
        <MainButton 
          v-if="navigationStore.showMainButton || navigationStore.activeMainButton !== section.name"
          :section="section"
          :is-active="navigationStore.activeMainButton === section.name"
          :is-collapsed="navigationStore.activeMainButton && navigationStore.activeMainButton !== section.name && !navigationStore.showMainButton"
          @click="handleMainClick(section)"
        />
        
        <!-- Sub buttons - visible when this section is active and main button is hidden -->
        <template v-if="navigationStore.activeMainButton === section.name && !navigationStore.showMainButton">
          <SubButton
            v-for="subButton in section.subButtons"
            :key="subButton.name"
            :sub-button="subButton"
            :section-name="section.name"
            :is-active="navigationStore.currentSubButton === subButton.name"
            @click="handleSubClick(section.name, subButton)"
          />
        </template>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useNavigationStore } from '@/stores/navigation'
import { useRouter } from 'vue-router'
import MainButton from '@/components/navigation/MainButton.vue'
import SubButton from '@/components/navigation/SubButton.vue'

const navigationStore = useNavigationStore()
const router = useRouter()

const isPortrait = computed(() => navigationStore.isPortrait)

function handleMainClick(section) {
  const expanded = navigationStore.selectMainButton(section)
  if (expanded && navigationStore.currentSubButton) {
    const sub = section.subButtons.find(s => s.name === navigationStore.currentSubButton)
    if (sub) {
      router.push(`${section.path}/${sub.path}`)
    }
  }
}

function handleSubClick(sectionName, subButton) {
  // If clicking the already active sub button, return to main view
  if (navigationStore.currentSubButton === subButton.name) {
    navigationStore.returnToMainView()
    const section = navigationStore.navSections.find(s => s.name === sectionName)
    if (section) {
      router.push(section.path) // Navigate to main section page
    }
  } else {
    // Select the sub button normally
    navigationStore.selectSubButton(sectionName, subButton)
    const section = navigationStore.navSections.find(s => s.name === sectionName)
    if (section) {
      router.push(`${section.path}/${subButton.path}`)
    }
  }
}
</script>

<style scoped>
.navigation {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 100;
  flex-shrink: 0;
  overflow: hidden;
}

.navigation-container {
  display: flex;
  width: 100%;
  height: 100%;
}

/* Portrait mode - bottom navigation */
.navigation-portrait {
  height: 15vh;
  min-height: 100px;
  max-height: 120px;
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.navigation-portrait .navigation-container {
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
}

/* Landscape mode - side navigation */
.navigation-landscape {
  height: 100%;
  width: 15vw;
  min-width: 150px;
  max-width: 200px;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.navigation-landscape .navigation-container {
  flex-direction: column;
  justify-content: flex-start;
}

@media (orientation: portrait) {
  .navigation {
    position: relative;
    bottom: 0;
    left: 0;
    right: 0;
  }
}

@media (orientation: landscape) {
  .navigation {
    position: relative;
    top: 0;
    right: 0;
    bottom: 0;
    order: 2;
  }
  
  @media (max-device-width: 926px) {
    .navigation {
      order: 0;
      border-left: none;
      border-right: 1px solid rgba(255, 255, 255, 0.2);
    }
  }
}

.navigation {
  visibility: visible !important;
  display: flex !important;
}
</style>