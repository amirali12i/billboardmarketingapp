import React from 'react';
import { ZoomInIcon, ZoomOutIcon, ExpandIcon } from './icons';

interface CanvasControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomToFit: () => void;
}

const CanvasControls: React.FC<CanvasControlsProps> = ({ scale, onZoomIn, onZoomOut, onZoomToFit }) => {
  return (
    <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center gap-1 p-1 z-10 text-sm text-gray-800 dark:text-white">
      <button onClick={onZoomOut} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="بزرگنمایی کمتر">
        <ZoomOutIcon className="w-5 h-5" />
      </button>
      <div className="w-16 text-center font-semibold cursor-default select-none">
        {Math.round(scale * 100)}%
      </div>
      <button onClick={onZoomIn} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="بزرگنمایی بیشتر">
        <ZoomInIcon className="w-5 h-5" />
      </button>
      <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>
      <button onClick={onZoomToFit} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="اندازه کردن در صفحه">
        <ExpandIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CanvasControls;