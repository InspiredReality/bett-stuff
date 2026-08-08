import { useState } from 'react'
import { useNavigationStore } from '@/store/navigationStore'
import { useUserStore } from '@/store/userStore'

function ChatsView() {
  const { currentFilter } = useNavigationStore()
  const { getDisplayName } = useUserStore()

  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, user: 'Player123', content: "Anyone want to bet on tonight's game?", timestamp: new Date() },
    { id: 2, user: 'BetMaster', content: "I'm in! What's the spread?", timestamp: new Date() },
    { id: 3, user: 'LuckyOne', content: 'Count me in too', timestamp: new Date() }
  ])

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          user: getDisplayName() || 'You',
          content: newMessage,
          timestamp: new Date()
        }
      ])
      setNewMessage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  const formatTime = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(timestamp)
  }

  return (
    <div className="p-4 h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">League Chats</h2>
      {currentFilter && (
        <div className="p-2 bg-black/5 rounded-lg mb-4">
          Channel: {currentFilter}
        </div>
      )}

      <div className="flex-1 bg-white rounded-xl shadow-md flex flex-col overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
          {messages.map((message) => (
            <div key={message.id} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-800">{message.user}</span>
                <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
              </div>
              <div className="text-gray-600">{message.content}</div>
            </div>
          ))}
        </div>

        <div className="flex p-4 border-t border-gray-100 gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 p-3 border border-gray-200 rounded-lg text-base"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg border-none cursor-pointer transition-colors hover:bg-gray-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatsView
