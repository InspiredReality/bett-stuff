import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/bet-stuff/open'
    },
    {
      path: '/my-stuff',
      children: [
        {
          path: 'account',
          name: 'Account',
          component: () => import('@/views/MyStuff/AccountView.vue')
        },
        {
          path: 'ledger',
          name: 'Ledger',
          component: () => import('@/views/MyStuff/LedgerView.vue')
        },
        {
          path: 'history',
          name: 'History',
          component: () => import('@/views/MyStuff/HistoryView.vue')
        }
      ]
    },
    {
      path: '/bet-stuff',
      children: [
        {
          path: 'open',
          name: 'OpenBets',
          component: () => import('@/views/BetStuff/OpenBetsView.vue')
        },
        {
          path: 'live',
          name: 'LiveBets',
          component: () => import('@/views/BetStuff/LiveBetsView.vue')
        },
        {
          path: 'done',
          name: 'DoneBets',
          component: () => import('@/views/BetStuff/DoneBetsView.vue')
        }
      ]
    },
    {
      path: '/league-stuff',
      children: [
        {
          path: 'stats',
          name: 'Stats',
          component: () => import('@/views/LeagueStuff/StatsView.vue')
        },
        {
          path: 'maps',
          name: 'Maps',
          component: () => import('@/views/LeagueStuff/MapsView.vue')
        },
        {
          path: 'chats',
          name: 'Chats',
          component: () => import('@/views/LeagueStuff/ChatsView.vue')
        }
      ]
    }
  ]
})

export default router
