import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNavigationStore } from '@/store/navigationStore'
import { useUserStore } from '@/store/userStore'
import { useBetsStore } from '@/store/betsStore'

function AccountView() {
  const navigate = useNavigate()
  const { currentFilter } = useNavigationStore()
  const { user, getDisplayName, changePassword, logout } = useUserStore()
  const { bets, getOpenBets, getLiveBets } = useBetsStore()

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  const totalBets = bets.length
  const activeBets = getOpenBets().length + getLiveBets().length
  const winRate = 65

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    const success = await changePassword(currentPassword, newPassword)
    if (success) {
      setShowPasswordModal(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      alert('Password changed successfully')
    }
  }

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout()
      navigate('/login')
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Account Settings</h2>

      {currentFilter === 'Profile' && (
        <div>
          <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-md mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border-[3px] border-gray-200">
              <img
                src={user?.display_icon_path || '/default-avatar.png'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{getDisplayName() || 'User'}</h3>
              <p className="text-gray-600">{user?.login_email}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg text-center shadow-sm">
              <span className="block text-2xl font-bold text-gray-800">{totalBets}</span>
              <span className="block text-sm text-gray-600 mt-1">Total Bets</span>
            </div>
            <div className="bg-white p-4 rounded-lg text-center shadow-sm">
              <span className="block text-2xl font-bold text-gray-800">{winRate}%</span>
              <span className="block text-sm text-gray-600 mt-1">Win Rate</span>
            </div>
            <div className="bg-white p-4 rounded-lg text-center shadow-sm">
              <span className="block text-2xl font-bold text-gray-800">{activeBets}</span>
              <span className="block text-sm text-gray-600 mt-1">Active</span>
            </div>
          </div>
        </div>
      )}

      {currentFilter === 'Settings' && (
        <div>
          <div className="bg-white p-6 rounded-lg mb-4 shadow-sm">
            <h3 className="mb-4 text-gray-800 font-semibold">Security</h3>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg border-none cursor-pointer transition-all hover:opacity-90 hover:-translate-y-px"
            >
              Change Password
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg mb-4 shadow-sm">
            <h3 className="mb-4 text-gray-800 font-semibold">Preferences</h3>
            <div className="py-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
                Enable Notifications
              </label>
            </div>
            <div className="py-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
                Dark Mode
              </label>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-500 text-white rounded-lg border-none cursor-pointer transition-all hover:opacity-90 hover:-translate-y-px"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
          onClick={(e) => e.target === e.currentTarget && setShowPasswordModal(false)}
        >
          <div className="bg-white p-8 rounded-xl w-[90%] max-w-[400px]">
            <h3 className="mb-6 text-xl font-semibold">Change Password</h3>
            <form onSubmit={handlePasswordChange}>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current Password"
                required
                className="w-full p-3 mb-4 border border-gray-200 rounded-lg text-base"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                required
                className="w-full p-3 mb-4 border border-gray-200 rounded-lg text-base"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                required
                className="w-full p-3 mb-4 border border-gray-200 rounded-lg text-base"
              />
              <div className="flex gap-4 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg border-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg border-none cursor-pointer"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountView
