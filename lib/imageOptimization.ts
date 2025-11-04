/**
 * Image optimization utilities for CDN delivery and performance
 */

export interface ImageOptimizationOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'avif' | 'jpeg' | 'png'
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
}

/**
 * Generate optimized image URL using CDN
 * This can be configured to work with various CDN providers:
 * - Cloudinary
 * - imgix
 * - Cloudflare Images
 * - AWS CloudFront
 */
export function getOptimizedImageUrl(
  src: string,
  options: ImageOptimizationOptions = {}
): string {
  // If it's a local development image or already optimized, return as-is
  if (src.startsWith('data:') || src.startsWith('blob:')) {
    return src
  }

  // Default options
  const {
    width,
    height,
    quality = 85,
    format = 'webp',
    fit = 'cover',
  } = options

  // Example: Cloudinary transformation
  // const baseUrl = process.env.NEXT_PUBLIC_CDN_URL
  // if (baseUrl && src.includes(baseUrl)) {
  //   const transformations = []
  //   if (width) transformations.push(`w_${width}`)
  //   if (height) transformations.push(`h_${height}`)
  //   transformations.push(`q_${quality}`)
  //   transformations.push(`f_${format}`)
  //   return src.replace('/upload/', `/upload/${transformations.join(',')}/`)
  // }

  // For now, return the original URL
  // In production, you would implement CDN-specific transformations
  return src
}

/**
 * Preload critical images for better performance
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

/**
 * Lazy load images with Intersection Observer
 */
export function lazyLoadImage(
  element: HTMLImageElement,
  src: string,
  options: ImageOptimizationOptions = {}
): void {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = getOptimizedImageUrl(src, options)
          observer.unobserve(img)
        }
      })
    })

    observer.observe(element)
  } else {
    // Fallback for older browsers
    element.src = getOptimizedImageUrl(src, options)
  }
}

/**
 * Generate responsive image srcset
 */
export function generateSrcSet(
  src: string,
  widths: number[] = [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
): string {
  return widths
    .map((width) => {
      const optimizedUrl = getOptimizedImageUrl(src, { width, quality: 85 })
      return `${optimizedUrl} ${width}w`
    })
    .join(', ')
}

/**
 * Calculate optimal image dimensions maintaining aspect ratio
 */
export function calculateOptimalDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight

  let width = originalWidth
  let height = originalHeight

  if (width > maxWidth) {
    width = maxWidth
    height = width / aspectRatio
  }

  if (height > maxHeight) {
    height = maxHeight
    width = height * aspectRatio
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
  }
}

/**
 * Convert data URL to blob for efficient handling
 */
export function dataURLtoBlob(dataURL: string): Blob {
  const arr = dataURL.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png'
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new Blob([u8arr], { type: mime })
}

/**
 * Compress image before upload
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }

        const { width, height } = calculateOptimalDimensions(
          img.width,
          img.height,
          maxWidth,
          maxHeight
        )

        canvas.width = width
        canvas.height = height

        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to compress image'))
            }
          },
          'image/jpeg',
          quality
        )
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = e.target?.result as string
    }

    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}
