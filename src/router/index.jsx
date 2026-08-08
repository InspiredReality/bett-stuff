import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import LoadingSpinner from '@/components/common/LoadingSpinner'

// Lazy load views
const BetStuffMain = lazy(() => import('@/views/BetStuff/BetStuffMain'))
const OpenBetsView = lazy(() => import('@/views/BetStuff/OpenBetsView'))
const LiveBetsView = lazy(() => import('@/views/BetStuff/LiveBetsView'))
const DoneBetsView = lazy(() => import('@/views/BetStuff/DoneBetsView'))

const MyStuffMain = lazy(() => import('@/views/MyStuff/MyStuffMain'))
const AccountView = lazy(() => import('@/views/MyStuff/AccountView'))
const LedgerView = lazy(() => import('@/views/MyStuff/LedgerView'))
const HistoryView = lazy(() => import('@/views/MyStuff/HistoryView'))

const LeagueStuffMain = lazy(() => import('@/views/LeagueStuff/LeagueStuffMain'))
const StatsView = lazy(() => import('@/views/LeagueStuff/StatsView'))
const MapsView = lazy(() => import('@/views/LeagueStuff/MapsView'))
const ChatsView = lazy(() => import('@/views/LeagueStuff/ChatsView'))

function AppRoutes() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full"><LoadingSpinner /></div>}>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/bet-stuff" replace />} />

        {/* Bet Stuff routes */}
        <Route path="/bet-stuff" element={<BetStuffMain />} />
        <Route path="/bet-stuff/open" element={<OpenBetsView />} />
        <Route path="/bet-stuff/live" element={<LiveBetsView />} />
        <Route path="/bet-stuff/done" element={<DoneBetsView />} />

        {/* My Stuff routes */}
        <Route path="/my-stuff" element={<MyStuffMain />} />
        <Route path="/my-stuff/account" element={<AccountView />} />
        <Route path="/my-stuff/ledger" element={<LedgerView />} />
        <Route path="/my-stuff/history" element={<HistoryView />} />

        {/* League Stuff routes */}
        <Route path="/league-stuff" element={<LeagueStuffMain />} />
        <Route path="/league-stuff/stats" element={<StatsView />} />
        <Route path="/league-stuff/maps" element={<MapsView />} />
        <Route path="/league-stuff/chats" element={<ChatsView />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/bet-stuff" replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
