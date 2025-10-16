import { createRouter, createWebHistory } from 'vue-router'

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     {
//       path: '/',
//       redirect: '/bet-stuff/open'
//     },
//     {
//       path: '/my-stuff',
//       name: 'MyStuffMain',
//       component: () => import('@/views/MyStuff/MyStuffMain.vue'),
//       children: [
//         {
//           path: 'account',
//           name: 'Account',
//           component: () => import('@/views/MyStuff/AccountView.vue')
//         },
//         {
//           path: 'ledger',
//           name: 'Ledger',
//           component: () => import('@/views/MyStuff/LedgerView.vue')
//         },
//         {
//           path: 'history',
//           name: 'History',
//           component: () => import('@/views/MyStuff/HistoryView.vue')
//         }
//       ]
//     },
//     {
//       path: '/bet-stuff',
//       name: 'BetStuffMain',
//       component: () => import('@/views/BetStuff/BetStuffMain.vue'),
//       children: [
//         {
//           path: 'open',
//           name: 'OpenBets',
//           component: () => import('@/views/BetStuff/OpenBetsView.vue')
//         },
//         {
//           path: 'live',
//           name: 'LiveBets',
//           component: () => import('@/views/BetStuff/LiveBetsView.vue')
//         },
//         {
//           path: 'done',
//           name: 'DoneBets',
//           component: () => import('@/views/BetStuff/DoneBetsView.vue')
//         }
//       ]
//     },
//     {
//       path: '/league-stuff',
//       name: 'LeagueStuffMain',
//       component: () => import('@/views/LeagueStuff/LeagueStuffMain.vue'),
//       children: [
//         {
//           path: 'stats',
//           name: 'Stats',
//           component: () => import('@/views/LeagueStuff/StatsView.vue')
//         },
//         {
//           path: 'maps',
//           name: 'Maps',
//           component: () => import('@/views/LeagueStuff/MapsView.vue')
//         },
//         {
//           path: 'chats',
//           name: 'Chats',
//           component: () => import('@/views/LeagueStuff/ChatsView.vue')
//         }
//       ]
//     }
//   ]
// // })

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/bet-stuff'
    },
    {
      path: '/my-stuff',
      name: 'MyStuffMain',
      component: () => import('@/views/MyStuff/MyStuffMain.vue')
    },
    {
      path: '/my-stuff/account',
      name: 'Account',
      component: () => import('@/views/MyStuff/AccountView.vue')
    },
    {
      path: '/my-stuff/ledger',
      name: 'Ledger',
      component: () => import('@/views/MyStuff/LedgerView.vue')
    },
    {
      path: '/my-stuff/history',
      name: 'History',
      component: () => import('@/views/MyStuff/HistoryView.vue')
    },
    {
      path: '/bet-stuff',
      name: 'BetStuffMain',
      component: () => import('@/views/BetStuff/BetStuffMain.vue')
    },
    {
      path: '/bet-stuff/open',
      name: 'OpenBets',
      component: () => import('@/views/BetStuff/OpenBetsView.vue')
    },
    {
      path: '/bet-stuff/live',
      name: 'LiveBets',
      component: () => import('@/views/BetStuff/LiveBetsView.vue')
    },
    {
      path: '/bet-stuff/done',
      name: 'DoneBets',
      component: () => import('@/views/BetStuff/DoneBetsView.vue')
    },
    {
      path: '/league-stuff',
      name: 'LeagueStuffMain',
      component: () => import('@/views/LeagueStuff/LeagueStuffMain.vue')
    },
    {
      path: '/league-stuff/stats',
      name: 'Stats',
      component: () => import('@/views/LeagueStuff/StatsView.vue')
    },
    {
      path: '/league-stuff/maps',
      name: 'Maps',
      component: () => import('@/views/LeagueStuff/MapsView.vue')
    },
    {
      path: '/league-stuff/chats',
      name: 'Chats',
      component: () => import('@/views/LeagueStuff/ChatsView.vue')
    }
  ]
})


export default router