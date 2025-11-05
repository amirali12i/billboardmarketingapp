'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Loader2, AlertCircle, Check, Box, Palette, Sparkles } from 'lucide-react'
import Button from './ui/Button'
import Card from './ui/Card'

interface ProjectCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (project: any) => void
  userPlan: 'FREE' | 'PRO' | 'ENTERPRISE'
}

const billboardSizes = [
  { name: 'استاندارد', width: 1920, height: 1080, description: 'مناسب برای اکثر بیلبوردها' },
  { name: 'بزرگ', width: 2560, height: 1440, description: 'کیفیت بالا برای بیلبوردهای بزرگ' },
  { name: '4K', width: 3840, height: 2160, description: 'کیفیت فوق‌العاده (نیاز به پلن حرفه‌ای)' },
  { name: 'سفارشی', width: 0, height: 0, description: 'ابعاد دلخواه' },
]

const templates = [
  { id: 'blank', name: 'خالی', description: 'شروع از صفحه سفید', icon: Box },
  { id: 'template', name: 'قالب آماده', description: 'انتخاب از قالب‌های طراحی شده', icon: Palette },
  { id: 'ai', name: 'AI Designer', description: 'طراحی با هوش مصنوعی', icon: Sparkles },
]

export default function ProjectCreationModal({
  isOpen,
  onClose,
  onSuccess,
  userPlan,
}: ProjectCreationModalProps) {
  const [step, setStep] = useState<'template' | 'details'>('template')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('blank')
  const [selectedSize, setSelectedSize] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    width: 1920,
    height: 1080,
  })

  const handleSizeSelect = (index: number) => {
    setSelectedSize(index)
    const size = billboardSizes[index]
    if (size.width > 0) {
      setFormData({
        ...formData,
        width: size.width,
        height: size.height,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate form
    if (!formData.name.trim()) {
      setError('نام پروژه الزامی است')
      return
    }

    if (formData.width < 100 || formData.height < 100) {
      setError('ابعاد حداقل باید 100 پیکسل باشد')
      return
    }

    // Check plan limits for 4K
    if ((formData.width > 2560 || formData.height > 1440) && userPlan === 'FREE') {
      setError('برای استفاده از کیفیت 4K باید پلن خود را ارتقا دهید')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || undefined,
          width: formData.width,
          height: formData.height,
          templateId: selectedTemplate !== 'blank' ? selectedTemplate : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to create project')
      }

      // Success!
      if (onSuccess) {
        onSuccess(data.data)
      }

      // Reset form and close
      setFormData({ name: '', description: '', width: 1920, height: 1080 })
      setStep('template')
      setSelectedTemplate('blank')
      setSelectedSize(0)
      onClose()

      // Redirect to editor
      window.location.href = `/editor?project=${data.data.id}`
    } catch (err: any) {
      console.error('Create project error:', err)
      setError(err.message || 'خطا در ایجاد پروژه')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ name: '', description: '', width: 1920, height: 1080 })
      setStep('template')
      setSelectedTemplate('blank')
      setSelectedSize(0)
      setError(null)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl"
            >
              <Card className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {step === 'template' ? 'نوع پروژه را انتخاب کنید' : 'جزئیات پروژه'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {step === 'template'
                        ? 'چگونه می‌خواهید شروع کنید؟'
                        : 'اطلاعات پروژه خود را وارد کنید'}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={isLoading}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
                  </motion.div>
                )}

                {/* Step 1: Template Selection */}
                {step === 'template' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {templates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => setSelectedTemplate(template.id)}
                          className={`p-6 border-2 rounded-xl text-center transition-all ${
                            selectedTemplate === template.id
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                          }`}
                        >
                          <div
                            className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                              selectedTemplate === template.id
                                ? 'bg-primary-500'
                                : 'bg-gray-100 dark:bg-gray-800'
                            }`}
                          >
                            <template.icon
                              className={`w-6 h-6 ${
                                selectedTemplate === template.id
                                  ? 'text-white'
                                  : 'text-gray-600 dark:text-gray-400'
                              }`}
                            />
                          </div>
                          <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                            {template.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {template.description}
                          </p>
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => setStep('details')}
                      >
                        مرحله بعد
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Project Details */}
                {step === 'details' && (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Project Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        نام پروژه *
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        placeholder="مثال: کمپین تابستانه 2025"
                        disabled={isLoading}
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        توضیحات (اختیاری)
                      </label>
                      <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                        placeholder="توضیحات کوتاه درباره پروژه..."
                        disabled={isLoading}
                      />
                    </div>

                    {/* Billboard Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        ابعاد بیلبورد
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {billboardSizes.map((size, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleSizeSelect(index)}
                            disabled={isLoading || (size.name === '4K' && userPlan === 'FREE')}
                            className={`p-4 border-2 rounded-lg text-right transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                              selectedSize === index
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                            }`}
                          >
                            <div className="font-bold text-gray-900 dark:text-white mb-1">
                              {size.name}
                              {size.name === '4K' && userPlan === 'FREE' && (
                                <span className="text-xs text-orange-600 dark:text-orange-400 mr-2">
                                  (PRO)
                                </span>
                              )}
                            </div>
                            {size.width > 0 && (
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {size.width} × {size.height}
                              </div>
                            )}
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {size.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Dimensions */}
                    {selectedSize === 3 && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="width"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          >
                            عرض (پیکسل)
                          </label>
                          <input
                            id="width"
                            type="number"
                            min="100"
                            max="10000"
                            required
                            value={formData.width}
                            onChange={(e) =>
                              setFormData({ ...formData, width: parseInt(e.target.value) || 0 })
                            }
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            disabled={isLoading}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="height"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          >
                            ارتفاع (پیکسل)
                          </label>
                          <input
                            id="height"
                            type="number"
                            min="100"
                            max="10000"
                            required
                            value={formData.height}
                            onChange={(e) =>
                              setFormData({ ...formData, height: parseInt(e.target.value) || 0 })
                            }
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-3 pt-4">
                      <Button
                        type="button"
                        variant="secondary"
                        size="lg"
                        onClick={() => setStep('template')}
                        disabled={isLoading}
                      >
                        مرحله قبل
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        loading={isLoading}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            در حال ایجاد...
                          </>
                        ) : (
                          <>
                            <Plus className="w-5 h-5" />
                            ایجاد پروژه
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
