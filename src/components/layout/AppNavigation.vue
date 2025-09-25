<template>
  <nav class="navigation">
    <MainButton 
      v-for="section in navigationStore.navSections"
      :key="section.id"
      :section="section"
      :is-active="navigationStore.activeMainButton === section.name"
      @click="handleMainClick(section)"
    >
      <template v-if="navigationStore.activeMainButton === section.name">
        <SubButton
          v-for="subButton in section.subButtons"
          :key="subButton.name"
          :sub-button="subButton"
          :section-name="section.name"
          :is-active="navigationStore.currentSubButton === subButton.name"
          @click="handleSubClick(section.name, subButton)"
        />
      </template>
    </MainButton>
  </nav>
</template>

<script setup>
import { useNavigationStore } from '@/stores/navigation'
import { useRouter } from 'vue-router'
import MainButton from '@/components/navigation/MainButton.vue'
import SubButton from '@/components/navigation/SubButton.vue'

const navigationStore = useNavigationStore()
const router = useRouter()

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
  navigationStore.selectSubButton(sectionName, subButton)
  const section = navigationStore.navSections.find(s => s.name === sectionName)
  if (section) {
    router.push(`${section.path}/${subButton.path}`)
  }
}
</script>

<style scoped>
.navigation {
  height: 15vh;
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 10;
  flex-direction: row;
}

@media (orientation: portrait) {
  .navigation {
    height: 15vh;
    flex-direction: row;
  }
}

@media (orientation: landscape) {
  .navigation {
    height: 100%;
    width: 15vw;
    flex-direction: column;
    order: 2;
  }
}

@media (orientation: landscape) and (max-device-width: 926px) {
  .navigation {
    order: 0;
  }
}
</style>
