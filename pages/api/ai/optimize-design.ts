import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * API endpoint for AI-powered design optimization
 * Analyzes billboard designs and provides suggestions for improvement
 */

interface OptimizeDesignRequest {
  elements: any[]
  dimensions: { width: number; height: number }
  target?: string
}

interface OptimizeDesignResponse {
  success: boolean
  suggestions?: {
    layout: string[]
    colors: string[]
    typography: string[]
    contrast: string[]
    readability: number
    visualImpact: number
  }
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OptimizeDesignResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { elements, dimensions } = req.body as OptimizeDesignRequest

    if (!elements || !dimensions) {
      return res.status(400).json({ success: false, error: 'Elements and dimensions are required' })
    }

    // Analyze the design
    const analysis = analyzeDesign(elements, dimensions)

    return res.status(200).json({
      success: true,
      suggestions: analysis,
    })
  } catch (error) {
    console.error('Error optimizing design:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to optimize design',
    })
  }
}

function analyzeDesign(elements: any[], dimensions: { width: number; height: number }) {
  const layoutSuggestions: string[] = []
  const colorSuggestions: string[] = []
  const typographySuggestions: string[] = []
  const contrastSuggestions: string[] = []

  // Layout analysis
  const textElements = elements.filter(el => el.type === 'TEXT')
  const imageElements = elements.filter(el => el.type === 'IMAGE')

  if (textElements.length > 5) {
    layoutSuggestions.push('متن زیاد است. سعی کنید پیام را ساده‌تر کنید')
  }

  if (imageElements.length === 0) {
    layoutSuggestions.push('افزودن تصویر می‌تواند جذابیت بیلبورد را افزایش دهد')
  }

  // Typography analysis
  const largeFonts = textElements.filter(el => el.fontSize && el.fontSize > 100)
  if (largeFonts.length === 0 && textElements.length > 0) {
    typographySuggestions.push('استفاده از یک عنوان بزرگ و برجسته پیشنهاد می‌شود')
  }

  const smallFonts = textElements.filter(el => el.fontSize && el.fontSize < 30)
  if (smallFonts.length > 0) {
    typographySuggestions.push('برخی متن‌ها ممکن است از دور خوانا نباشند. اندازه فونت را افزایش دهید')
  }

  // Color analysis
  const hasLightColors = elements.some(el => {
    if (el.fill?.type === 'SOLID') {
      const color = el.fill.color
      return isLightColor(color)
    }
    return false
  })

  const hasDarkColors = elements.some(el => {
    if (el.fill?.type === 'SOLID') {
      const color = el.fill.color
      return isDarkColor(color)
    }
    return false
  })

  if (!hasLightColors || !hasDarkColors) {
    contrastSuggestions.push('استفاده از تضاد رنگی بیشتر برای خوانایی بهتر')
  }

  // Calculate scores
  const readabilityScore = calculateReadabilityScore(elements)
  const visualImpactScore = calculateVisualImpactScore(elements, dimensions)

  return {
    layout: layoutSuggestions.length > 0 ? layoutSuggestions : ['چیدمان عناصر مناسب است'],
    colors: colorSuggestions.length > 0 ? colorSuggestions : ['انتخاب رنگ‌ها مناسب است'],
    typography: typographySuggestions.length > 0 ? typographySuggestions : ['تایپوگرافی مناسب است'],
    contrast: contrastSuggestions.length > 0 ? contrastSuggestions : ['تضاد رنگی مناسب است'],
    readability: readabilityScore,
    visualImpact: visualImpactScore,
  }
}

function isLightColor(color: string): boolean {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 155
}

function isDarkColor(color: string): boolean {
  return !isLightColor(color)
}

function calculateReadabilityScore(elements: any[]): number {
  let score = 100
  const textElements = elements.filter(el => el.type === 'TEXT')

  if (textElements.length === 0) score -= 20
  if (textElements.length > 5) score -= 15

  textElements.forEach(el => {
    if (el.fontSize < 30) score -= 5
    if (el.fontSize > 150) score += 5
  })

  return Math.max(0, Math.min(100, score))
}

function calculateVisualImpactScore(elements: any[], dimensions: { width: number; height: number }): number {
  let score = 50

  const textElements = elements.filter(el => el.type === 'TEXT')
  const imageElements = elements.filter(el => el.type === 'IMAGE')

  if (imageElements.length > 0) score += 20
  if (textElements.length > 0) score += 20

  const totalArea = dimensions.width * dimensions.height
  const occupiedArea = elements.reduce((sum, el) => sum + (el.width * el.height), 0)
  const coverageRatio = occupiedArea / totalArea

  if (coverageRatio > 0.3 && coverageRatio < 0.7) score += 10

  return Math.max(0, Math.min(100, score))
}
