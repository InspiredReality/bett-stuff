import { useState, useMemo } from 'react'
import { useNavigationStore } from '@/store/navigationStore'

function LedgerView() {
  const { currentFilter } = useNavigationStore()

  const [transactions] = useState([
    { id: 1, type: 'Win', date: new Date(), description: 'Bet #1234 - Lakers vs Bulls', amount: 50, user: 'me' },
    { id: 2, type: 'Loss', date: new Date(), description: 'Bet #1235 - Patriots vs Chiefs', amount: -30, user: 'me' },
    { id: 3, type: 'Win', date: new Date(), description: 'Bet #1236 - Yankees vs Red Sox', amount: 75, user: 'other' },
  ])

  const filteredTransactions = useMemo(() => {
    if (currentFilter === 'Me') {
      return transactions.filter(t => t.user === 'me')
    }
    return transactions
  }, [transactions, currentFilter])

  const totalWon = useMemo(() => {
    return filteredTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)
  }, [filteredTransactions])

  const totalLost = useMemo(() => {
    return Math.abs(filteredTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0))
  }, [filteredTransactions])

  const netAmount = useMemo(() => {
    const net = totalWon - totalLost
    return `${net >= 0 ? '+' : ''}$${Math.abs(net)}`
  }, [totalWon, totalLost])

  const netClass = totalWon - totalLost >= 0 ? 'text-green-500' : 'text-red-500'

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Betting Ledger</h2>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl text-center shadow-md">
          <span className="block text-sm text-gray-600 mb-2">Total Won</span>
          <span className="block text-2xl font-bold text-green-500">+${totalWon}</span>
        </div>
        <div className="bg-white p-6 rounded-xl text-center shadow-md">
          <span className="block text-sm text-gray-600 mb-2">Total Lost</span>
          <span className="block text-2xl font-bold text-red-500">-${totalLost}</span>
        </div>
        <div className="bg-white p-6 rounded-xl text-center shadow-md">
          <span className="block text-sm text-gray-600 mb-2">Net</span>
          <span className={`block text-2xl font-bold ${netClass}`}>{netAmount}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="mb-4 text-gray-800 font-semibold">Recent Transactions</h3>
        {filteredTransactions.map((transaction) => (
          <div key={transaction.id} className="py-4 border-b border-gray-100 last:border-b-0">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-800">{transaction.type}</span>
              <span className="text-sm text-gray-400">{formatDate(transaction.date)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{transaction.description}</span>
              <span className={`font-bold ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LedgerView
