import type { Metadata } from 'next'
import { Vazirmatn, Lalezar } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  variable: '--font-vazirmatn',
  display: 'swap',
})

const lalezar = Lalezar({
  weight: '400',
  subsets: ['arabic', 'latin'],
  variable: '--font-lalezar',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'بیلبورد مارکتینگ | ابزار هوش مصنوعی طراحی بیلبورد با قابلیت 3D',
  description: 'پلتفرم پیشرفته طراحی بیلبورد با هوش مصنوعی و نمایش سه‌بعدی. ایجاد کمپین‌های تبلیغاتی حرفه‌ای با قالب‌های آماده و ابزارهای AI-Powered',
  keywords: 'بیلبورد, طراحی تبلیغات, هوش مصنوعی, 3D, مارکتینگ, تبلیغات محیطی',
  authors: [{ name: 'Billboard Marketing Team' }],
  openGraph: {
    title: 'بیلبورد مارکتینگ - ابزار هوش مصنوعی طراحی بیلبورد',
    description: 'طراحی بیلبوردهای حرفه‌ای با هوش مصنوعی و نمایش 3D',
    type: 'website',
    locale: 'fa_IR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'بیلبورد مارکتینگ',
    description: 'طراحی بیلبوردهای حرفه‌ای با هوش مصنوعی',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${vazirmatn.variable} ${lalezar.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
