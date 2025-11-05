'use client'

import React from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { motion } from 'framer-motion'

export default function ThemeSwitcher() {
  const { theme, setTheme, actualTheme } = useTheme()
  const [showMenu, setShowMenu] = React.useState(false)

  const themes = [
    { value: 'light', label: 'روشن', labelEn: 'Light', icon: Sun },
    { value: 'dark', label: 'تاریک', labelEn: 'Dark', icon: Moon },
    { value: 'system', label: 'سیستم', labelEn: 'System', icon: Monitor },
  ]

  const currentTheme = themes.find((t) => t.value === theme) || themes[0]
  const Icon = actualTheme === 'dark' ? Moon : Sun

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2.5 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
        title={`Theme: ${currentTheme.labelEn}`}
      >
        <Icon className="w-5 h-5" />
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          >
            {themes.map((t) => {
              const ThemeIcon = t.icon
              const isActive = theme === t.value
              return (
                <button
                  key={t.value}
                  onClick={() => {
                    setTheme(t.value as any)
                    setShowMenu(false)
                  }}
                  className={`w-full px-4 py-2.5 flex items-center gap-3 transition-colors ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <ThemeIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{t.labelEn}</span>
                  {isActive && (
                    <span className="mr-auto w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full" />
                  )}
                </button>
              )
            })}
          </motion.div>
        </>
      )}
    </div>
  )
}
