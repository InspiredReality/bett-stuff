function ErrorMessage({ message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-700">
      <span className="text-2xl block mb-2">⚠️</span>
      <p>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
