
import React, { useState } from 'react';
import { Project } from '../types';
import { LoaderIcon } from './icons';
import { exportCanvas } from '../utils/canvasRenderer';

interface ExportModalProps {
  project: Project;
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ project, onClose }) => {
  const [format, setFormat] = useState<'png' | 'jpeg' | 'pdf'>('png');
  const [quality, setQuality] = useState(2); // 1, 2, or 3
  const [transparentBg, setTransparentBg] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState(project.name.replace(/\s+/g, '-').toLowerCase());

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const canvasArea = document.getElementById('canvas-area');
      if (!canvasArea) throw new Error("Canvas area not found");

      if (format === 'png' || format === 'jpeg') {
         await exportCanvas(canvasArea, format, fileName, quality, format === 'png' && transparentBg);
      } else {
        // PDF export is a placeholder for a more complex future implementation
        alert("خروجی PDF در حال حاضر پشتیبانی نمی‌شود. این قابلیت به زودی اضافه خواهد شد.");
      }
    } catch (error) {
      console.error("Failed to export:", error);
      alert("خطا در خروجی گرفتن از طرح. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/10 dark:border-gray-700/50 rounded-lg shadow-xl p-8 w-full max-w-md text-gray-900 dark:text-white" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6">خروجی گرفتن از پروژه</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="filename" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نام فایل</label>
            <input
              type="text"
              id="filename"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">فرمت</label>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => setFormat('png')} className={`p-3 rounded-md font-semibold transition-colors ${format === 'png' ? 'bg-cyan-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>PNG</button>
              <button onClick={() => setFormat('jpeg')} className={`p-3 rounded-md font-semibold transition-colors ${format === 'jpeg' ? 'bg-cyan-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>JPEG</button>
              <button onClick={() => setFormat('pdf')} className={`p-3 rounded-md font-semibold transition-colors ${format === 'pdf' ? 'bg-cyan-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`} title="به زودی">PDF</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">کیفیت</label>
             <div className="grid grid-cols-3 gap-2">
              <button onClick={() => setQuality(1)} className={`p-3 rounded-md font-semibold transition-colors ${quality === 1 ? 'bg-cyan-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>1x</button>
              <button onClick={() => setQuality(2)} className={`p-3 rounded-md font-semibold transition-colors ${quality === 2 ? 'bg-cyan-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>2x</button>
              <button onClick={() => setQuality(3)} className={`p-3 rounded-md font-semibold transition-colors ${quality === 3 ? 'bg-cyan-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>3x</button>
            </div>
          </div>
          
          {format === 'png' && (
             <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <input type="checkbox" checked={transparentBg} onChange={(e) => setTransparentBg(e.target.checked)} className="rounded text-cyan-600 focus:ring-cyan-500" />
                  پس‌زمینه شفاف
                </label>
             </div>
          )}

        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button onClick={onClose} className="py-2 px-4 bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-500 text-white rounded-lg transition-colors">انصراف</button>
          <button
            onClick={handleExport}
            disabled={isLoading}
            className="py-2 px-6 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 dark:disabled:bg-gray-500 text-white font-bold rounded-lg transition-colors flex items-center"
          >
            {isLoading ? <><LoaderIcon className="w-5 h-5 me-2" /><span>در حال پردازش...</span></> : 'خروجی'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
