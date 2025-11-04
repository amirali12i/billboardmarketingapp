import React, { useState } from 'react';
import { generateCopywritingSuggestions } from '../services/geminiService';
import { CopywritingSuggestions, ElementType } from '../types';
import { LoaderIcon, PlusIcon, QuillIcon, WandIcon } from './icons';

interface CopywritingAssistantProps {
  onAddElement: (type: ElementType, options: any) => void;
}

const CopywritingAssistant: React.FC<CopywritingAssistantProps> = ({ onAddElement }) => {
  const [productName, setProductName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [keyMessage, setKeyMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<CopywritingSuggestions | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!productName.trim() || !targetAudience.trim() || !keyMessage.trim()) {
      setError('لطفاً تمام فیلدها را پر کنید.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuggestions(null);
    try {
      const result = await generateCopywritingSuggestions(productName, targetAudience, keyMessage);
      setSuggestions(result);
    } catch (err) {
      setError('خطا در تولید متن. لطفاً دوباره تلاش کنید.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddTextToCanvas = (text: string, isHeadline: boolean) => {
    const options = isHeadline 
      ? { text, fontSize: 72, fontWeight: 'bold' as const, fontFamily: 'Lalezar' as const, width: 600, height: 100 }
      : { text, fontSize: 36, fontWeight: 'normal' as const, fontFamily: 'Vazirmatn' as const, width: 500, height: 60 };
    onAddElement(ElementType.Text, options);
  };

  return (
    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-4">
        <QuillIcon className="w-6 h-6 me-3 text-yellow-400" />
        <h2 className="text-xl font-bold">دستیار نویسنده هوش مصنوعی</h2>
      </div>
      <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg space-y-3">
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">نام محصول/خدمت</label>
          <input type="text" id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="مثال: نوشابه انرژی‌زا" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm" disabled={isLoading} />
        </div>
        <div>
          <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">مخاطب هدف</label>
          <input type="text" id="targetAudience" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="مثال: جوانان ورزشکار" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm" disabled={isLoading} />
        </div>
        <div>
          <label htmlFor="keyMessage" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">پیام کلیدی / ویژگی اصلی</label>
          <input type="text" id="keyMessage" value={keyMessage} onChange={(e) => setKeyMessage(e.target.value)} placeholder="مثال: افزایش تمرکز و انرژی" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm" disabled={isLoading} />
        </div>
        {error && <p className="text-red-500 dark:text-red-400 text-xs">{error}</p>}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full mt-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 dark:disabled:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
        >
          {isLoading ? <><LoaderIcon className="w-5 h-5 me-2" /><span>در حال تولید...</span></> : <><WandIcon className="w-5 h-5 me-2" /><span>تولید متن</span></>}
        </button>
      </div>

      {suggestions && (
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">تیترهای پیشنهادی:</h3>
            <div className="space-y-2">
              {suggestions.headlines.map((text, i) => (
                <div key={`h-${i}`} className="flex items-center justify-between bg-gray-200 dark:bg-gray-700 p-2 rounded-md">
                  <p className="text-sm flex-1">{text}</p>
                  <button onClick={() => handleAddTextToCanvas(text, true)} className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-cyan-500 hover:text-white rounded-md transition-colors" title="افزودن به بوم">
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">شعارهای پیشنهادی:</h3>
            <div className="space-y-2">
              {suggestions.slogans.map((text, i) => (
                <div key={`s-${i}`} className="flex items-center justify-between bg-gray-200 dark:bg-gray-700 p-2 rounded-md">
                  <p className="text-sm flex-1">{text}</p>
                   <button onClick={() => handleAddTextToCanvas(text, false)} className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-cyan-500 hover:text-white rounded-md transition-colors" title="افزودن به بوم">
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CopywritingAssistant;