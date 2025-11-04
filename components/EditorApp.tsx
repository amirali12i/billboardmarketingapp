'use client'

// This is a wrapper for the existing App.tsx to work with Next.js
import dynamic from 'next/dynamic'

// Import the existing App component without SSR
const App = dynamic(() => import('../App'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">در حال بارگذاری ویرایشگر...</p>
      </div>
    </div>
  )
})

export default App
