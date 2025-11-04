/**
 * Performance monitoring and optimization utilities
 */

// Web Vitals metrics
export interface PerformanceMetrics {
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  fcp?: number // First Contentful Paint
  ttfb?: number // Time to First Byte
}

/**
 * Monitor Web Vitals
 */
export function monitorPerformance(callback: (metrics: PerformanceMetrics) => void): void {
  if (typeof window === 'undefined') return

  const metrics: PerformanceMetrics = {}

  // Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        metrics.lcp = lastEntry.renderTime || lastEntry.loadTime
        callback(metrics)
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (e) {
      // LCP not supported
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          metrics.fid = entry.processingStart - entry.startTime
          callback(metrics)
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })
    } catch (e) {
      // FID not supported
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            metrics.cls = clsValue
            callback(metrics)
          }
        })
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    } catch (e) {
      // CLS not supported
    }
  }

  // First Contentful Paint (FCP) and Time to First Byte (TTFB)
  if ('performance' in window && 'getEntriesByType' in performance) {
    const navigationEntries = performance.getEntriesByType('navigation') as any[]
    if (navigationEntries.length > 0) {
      const navEntry = navigationEntries[0]
      metrics.ttfb = navEntry.responseStart - navEntry.requestStart
    }

    const paintEntries = performance.getEntriesByType('paint') as any[]
    const fcpEntry = paintEntries.find((entry) => entry.name === 'first-contentful-paint')
    if (fcpEntry) {
      metrics.fcp = fcpEntry.startTime
    }

    callback(metrics)
  }
}

/**
 * Report performance metrics to analytics
 */
export function reportPerformanceMetrics(metrics: PerformanceMetrics): void {
  // In production, send to your analytics service
  // Examples:
  // - Google Analytics
  // - Vercel Analytics
  // - Custom analytics endpoint

  if (process.env.NODE_ENV === 'development') {
    console.log('Performance Metrics:', metrics)
  }

  // Example: Send to custom endpoint
  // fetch('/api/analytics/performance', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(metrics)
  // })
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Request Idle Callback polyfill
 */
export function requestIdleCallbackPolyfill(callback: () => void): void {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback)
  } else {
    setTimeout(callback, 1)
  }
}

/**
 * Prefetch resources
 */
export function prefetchResource(url: string, as: string = 'fetch'): void {
  if (typeof document === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.as = as
  link.href = url
  document.head.appendChild(link)
}

/**
 * Preconnect to external domains
 */
export function preconnectDomain(domain: string): void {
  if (typeof document === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preconnect'
  link.href = domain
  link.crossOrigin = 'anonymous'
  document.head.appendChild(link)
}

/**
 * Measure function execution time
 */
export function measureExecutionTime<T>(
  name: string,
  func: () => T
): T {
  const start = performance.now()
  const result = func()
  const end = performance.now()

  if (process.env.NODE_ENV === 'development') {
    console.log(`${name} took ${(end - start).toFixed(2)}ms`)
  }

  return result
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Get connection quality
 */
export function getConnectionQuality(): 'slow' | 'medium' | 'fast' {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return 'medium'
  }

  const connection = (navigator as any).connection
  const effectiveType = connection?.effectiveType

  if (effectiveType === '4g') return 'fast'
  if (effectiveType === '3g') return 'medium'
  return 'slow'
}

/**
 * Adaptive loading based on connection quality
 */
export function shouldLoadHighQuality(): boolean {
  const quality = getConnectionQuality()
  return quality === 'fast'
}
