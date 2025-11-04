import type { NextApiRequest, NextApiResponse } from 'next'
import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * API endpoint for AI text generation
 * Uses Google Gemini for generating headlines and ad copy
 */

interface GenerateTextRequest {
  type: 'headline' | 'slogan' | 'description'
  context?: string
  brand?: string
  style?: string
  language?: 'fa' | 'en'
}

interface GenerateTextResponse {
  success: boolean
  text?: string
  suggestions?: string[]
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenerateTextResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { type, context, brand, style, language = 'fa' } = req.body as GenerateTextRequest

    if (!type) {
      return res.status(400).json({ success: false, error: 'Type is required' })
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY

    if (!apiKey) {
      console.warn('Google AI API key not found, returning mock data')
      return res.status(200).json({
        success: true,
        suggestions: getMockSuggestions(type, language),
      })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    let prompt = ''

    if (language === 'fa') {
      prompt = `تو یک کپی‌رایتر حرفه‌ای هستی. یک ${getTypeName(type)} جذاب و موثر برای یک بیلبورد تبلیغاتی به زبان فارسی بنویس.`
      if (context) prompt += `\n\nموضوع: ${context}`
      if (brand) prompt += `\nبرند: ${brand}`
      if (style) prompt += `\nسبک: ${style}`
      prompt += `\n\n5 گزینه مختلف بنویس. هر گزینه در یک خط جداگانه.`
    } else {
      prompt = `You are a professional copywriter. Write an engaging and effective ${type} for a billboard advertisement.`
      if (context) prompt += `\n\nContext: ${context}`
      if (brand) prompt += `\nBrand: ${brand}`
      if (style) prompt += `\nStyle: ${style}`
      prompt += `\n\nProvide 5 different options. Each option on a separate line.`
    }

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Split the response into individual suggestions
    const suggestions = text
      .split('\n')
      .filter(line => line.trim())
      .filter(line => !line.match(/^\d+\./)) // Remove numbered prefixes
      .map(line => line.replace(/^[-•*]\s*/, '').trim()) // Remove bullet points
      .filter(line => line.length > 0)
      .slice(0, 5)

    return res.status(200).json({
      success: true,
      suggestions,
    })
  } catch (error) {
    console.error('Error generating text:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to generate text',
    })
  }
}

function getTypeName(type: string): string {
  const names: Record<string, string> = {
    headline: 'عنوان اصلی',
    slogan: 'شعار',
    description: 'توضیحات',
  }
  return names[type] || 'متن'
}

function getMockSuggestions(type: string, language: string): string[] {
  if (language === 'fa') {
    const mockData: Record<string, string[]> = {
      headline: [
        'آینده را با ما بسازید',
        'نوآوری در هر قدم',
        'کیفیت بی‌نظیر، قیمت باورنکردنی',
        'تجربه‌ای متفاوت از خرید',
        'پیشرو در صنعت',
      ],
      slogan: [
        'همیشه در کنار شما',
        'اعتماد، کیفیت، تعهد',
        'بهترین انتخاب برای زندگی بهتر',
        'نوآوری برای آینده',
        'کیفیت که می‌توانید ببینید',
      ],
      description: [
        'با بیش از 10 سال تجربه در خدمت شما',
        'محصولات با کیفیت و قیمت مناسب',
        'ارائه دهنده بهترین خدمات',
        'تضمین کیفیت و رضایت شما',
        'پیشرفته‌ترین تکنولوژی روز',
      ],
    }
    return mockData[type] || mockData.headline
  } else {
    const mockData: Record<string, string[]> = {
      headline: [
        'Build the Future with Us',
        'Innovation at Every Step',
        'Unmatched Quality, Incredible Price',
        'A Different Shopping Experience',
        'Industry Leader',
      ],
      slogan: [
        'Always by Your Side',
        'Trust, Quality, Commitment',
        'Best Choice for a Better Life',
        'Innovation for the Future',
        'Quality You Can See',
      ],
      description: [
        'Serving you with over 10 years of experience',
        'Quality products at affordable prices',
        'Provider of the best services',
        'Quality and satisfaction guaranteed',
        'Most advanced technology',
      ],
    }
    return mockData[type] || mockData.headline
  }
}
