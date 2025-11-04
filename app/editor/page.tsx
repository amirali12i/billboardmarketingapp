'use client'

import { Suspense, lazy } from 'react'

// Lazy load the main app component for better performance
const EditorApp = lazy(() => import('@/components/EditorApp'))

export default function EditorPage() {
  return (
    <div className="w-full h-screen">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-white text-lg">در حال بارگذاری ویرایشگر...</p>
            </div>
          </div>
        }
      >
        <EditorApp />
      </Suspense>
    </div>
  )
}
